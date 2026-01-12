"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface User {
    id: number;
    username: string;
    email: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            // Optimistically load from localStorage first
            const storedUser = localStorage.getItem("sage_user");
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Failed to parse user from local storage", error);
                }
            }

            // Verify with backend
            try {
                const response = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    const userData: User = {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        role: data.role
                    };
                    setUser(userData);
                    localStorage.setItem("sage_user", JSON.stringify(userData));
                } else {
                    // Session invalid or expired
                    if (storedUser) {
                        // Only clear and redirect if we thought we were logged in
                        // logic: if !response.ok, backend says "not logged in".
                        setUser(null);
                        localStorage.removeItem("sage_user");
                    }
                }
            } catch (error) {
                console.error("Session check failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Important for sessions
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                const userData: User = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    role: data.role
                };
                setUser(userData);
                localStorage.setItem("sage_user", JSON.stringify(userData));
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("sage_user");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
