"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    if (!isMounted || isLoading || !user) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="relative flex items-center justify-center">
                    {/* Smooth gradient spinner matching reference */}
                    <div
                        className="h-24 w-24 rounded-full animate-spin shadow-[0_0_10px_var(--accent-color)/10]"
                        style={{
                            background: `conic-gradient(from 0deg, transparent, var(--accent-color) 70%, transparent 70%)`,
                            maskImage: 'radial-gradient(closest-side, transparent 82%, black 83%)',
                            WebkitMaskImage: 'radial-gradient(closest-side, transparent 82%, black 83%)',
                        }}
                    ></div>

                    <div className="absolute font-bold text-[var(--accent-color)] tracking-widest text-sm select-none">
                        SAGE
                    </div>
                </div>
            </div>
        );
    }

    console.log("Dashboard Debug - User:", user);
    console.log("Dashboard Debug - Role:", user.role);
    console.log("Dashboard Debug - Normalized Role:", user.role?.toLowerCase());

    return (
        <div className="container mx-auto px-4 py-12 animate-page-load-1">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-[var(--accent-color)] mb-4">Dashboard</h1>
                        <p className="text-[var(--text2-color)] text-lg">
                            Welcome back, <span className="font-semibold">{user.username}</span>
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg border border-[var(--accent-color)] text-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors font-medium"
                    >
                        Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[var(--secondary-color)] rounded-xl p-6 border border-[var(--text2-color)]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Manage Articles</h2>
                        <p className="text-[var(--text2-color)] mb-6">Create, edit, or delete articles.</p>

                        <div className="flex flex-col gap-4">
                            <Link
                                href="/upload"
                                className="w-full text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                            >
                                Upload New Article
                            </Link>
                            <Link
                                href="/my-articles"
                                className="w-full text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                            >
                                My Articles
                            </Link>
                        </div>
                    </div>

                    {(user.role?.trim().toLowerCase() === 'admin' || user.role?.trim().toLowerCase() === 'officer') && (
                        <div className="bg-[var(--secondary-color)] rounded-xl p-6 border border-[var(--text2-color)]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Management Controls</h2>
                            <p className="text-[var(--text2-color)] mb-6">Manage users and system settings.</p>

                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/manage-articles"
                                    className="w-full text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                                >
                                    Manage Articles
                                </Link>
                                {user.role?.trim().toLowerCase() === 'admin' && (
                                    <Link
                                        href="/invite"
                                        className="w-full text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                                    >
                                        Invite New User
                                    </Link>
                                )}
                                {user.role?.trim().toLowerCase() === 'admin' && (
                                    <Link
                                        href="/manage-users"
                                        className="w-full text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                                    >
                                        Manage Users
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-[var(--secondary-color)] rounded-xl p-6 border border-[var(--text2-color)]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Account Settings</h2>
                        <p className="text-[var(--text2-color)] mb-6">Manage your profile and security preferences.</p>

                        <div className="flex flex-col gap-4">
                            <Link
                                href="/manage-account"
                                className="w-full text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                            >
                                Manage Account
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
