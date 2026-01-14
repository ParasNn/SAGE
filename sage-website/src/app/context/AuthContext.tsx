"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
    id: string; // Changed from number to string for Supabase UUID
    username: string;
    email: string;
    role?: string;
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
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const initAuth = async () => {
            setIsLoading(true);
            const { data: { user: sbUser } } = await supabase.auth.getUser();

            if (sbUser) {
                // Map Supabase user to our User interface
                // Note: You might need a 'profiles' table to store username and role if they aren't in user_metadata
                const userData: User = {
                    id: sbUser.id,
                    username: sbUser.user_metadata?.username || sbUser.email?.split('@')[0] || "User",
                    email: sbUser.email || "",
                    role: sbUser.user_metadata?.role || "user" // Default to user if not found
                };
                setUser(userData);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const userData: User = {
                    id: session.user.id,
                    username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || "User",
                    email: session.user.email || "",
                    role: session.user.user_metadata?.role || "user"
                };
                setUser(userData);
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login failed:", error.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Login unexpected error:", error);
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
