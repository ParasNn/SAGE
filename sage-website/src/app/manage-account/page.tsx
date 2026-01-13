"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ManageAccountPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return null;
    }

    return (
        <div className="flex items-center justify-center p-6 animate-page-load-1 h-full min-h-[80vh]">
            <div className="w-full max-w-xl bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-[var(--text2-color)]/10 shadow-2xl">
                <h1 className="text-3xl font-bold mb-2 text-[var(--accent-color)] tracking-tight">
                    Manage Account
                </h1>
                <p className="text-[var(--text2-color)] mb-8">Update your personal preferences and settings.</p>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                        <label htmlFor="username" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                            placeholder="Leave blank to keep current password"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-xl border border-[var(--text2-color)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-colors font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
