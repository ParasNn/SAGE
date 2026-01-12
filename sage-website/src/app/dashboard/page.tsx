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
        return null; // Or a loading spinner
    }

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

                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/upload"
                                className="flex-1 text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                            >
                                Upload New Article
                            </Link>
                            <Link
                                href="/my-articles"
                                className="flex-1 text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                            >
                                My Articles
                            </Link>
                            {(user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'officer') && (
                                <Link
                                    href="/articles"
                                    className="flex-1 text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                                >
                                    Manage Articles
                                </Link>
                            )}
                        </div>
                    </div>

                    {user.role?.toLowerCase() === 'admin' && (
                        <div className="bg-[var(--secondary-color)] rounded-xl p-6 border border-[var(--text2-color)]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">Admin Controls</h2>
                            <p className="text-[var(--text2-color)] mb-6">Manage users and system settings.</p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/invite"
                                    className="flex-1 text-center px-6 py-3 rounded-lg border-2 border-[var(--accent-color)] text-[var(--accent-color)] font-bold hover:bg-[var(--accent-color)] hover:text-[var(--background)] transition-colors whitespace-nowrap"
                                >
                                    Invite New User
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Placeholder for future features */}
                    {user.role?.toLowerCase() !== 'admin' && (
                        <div className="bg-[var(--secondary-color)]/50 rounded-xl p-6 border border-[var(--text2-color)]/10">
                            <h2 className="text-2xl font-bold text-[var(--foreground)]/70 mb-4">Analytics</h2>
                            <p className="text-[var(--text2-color)]/70 mb-6">View views and engagement (Coming Soon)</p>
                            <button disabled className="px-6 py-3 rounded-lg bg-[var(--text2-color)]/20 text-[var(--foreground)]/50 cursor-not-allowed">
                                View Stats
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
