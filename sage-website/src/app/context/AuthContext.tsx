"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
    id: string; // Changed from number to string for Supabase UUID
    username: string;
    email: string;
    role?: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (userData: User) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isLoginFlow = useRef(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            const { data: { user: sbUser } } = await supabase.auth.getUser();

            if (sbUser) {
                // Map Supabase user to our User interface
                // Initial user state with default/metadata role
                const initialUser: User = {
                    id: sbUser.id,
                    username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0] || "User",
                    email: sbUser.email || "",
                    role: sbUser.app_metadata?.role || "user",
                    name: sbUser.app_metadata?.full_name || ""
                };
                setUser(initialUser);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const userData: User = {
                    id: session.user.id,
                    username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || "User",
                    email: session.user.email || "",
                    role: session.user.app_metadata?.role || "user",
                    name: session.user.app_metadata?.full_name || ""
                };
                setUser(userData);

                if (!isLoginFlow.current) {
                    setIsLoading(false);
                }
            } else {
                setUser(null);
                if (!isLoginFlow.current) {
                    setIsLoading(false);
                }
            }
        });

        initAuth();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            isLoginFlow.current = true;
            setIsLoading(true);

            const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error || !authUser) {
                console.error("Login failed:", error?.message);
                isLoginFlow.current = false;
                setIsLoading(false);
                return false;
            }

            // Trust that Supabase/Triggers handle the role/name in metadata now

            isLoginFlow.current = false;
            setIsLoading(false);
            return true;
        } catch (error) {
            console.error("Login unexpected error:", error);
            isLoginFlow.current = false;
            setIsLoading(false);
            return false;
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
    };

    const updateUser = (userData: User) => {
        setUser(userData);
        // logic to update user in Supabase (e.g. profiles table) would go here
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
