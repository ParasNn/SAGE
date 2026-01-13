"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ManageAccountPage() {
    const { user, isLoading, updateUser } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [isLoading, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);

        if (password && password !== confirmPassword) {
            setError("Passwords do not match");
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/auth/update", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username !== user?.username ? username : undefined,
                    email: email !== user?.email ? email : undefined,
                    password: password || undefined
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                setSuccess("Account updated successfully!");
                setPassword('');
                setConfirmPassword('');
                router.refresh();
            } else {
                const errorMsg = await response.text();
                setError(errorMsg || "Failed to update account");
            }
        } catch (err) {
            console.error(err);
            setError("An unexpected error occurred");
        } finally {
            setIsSaving(false);
        }
    };

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

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        {success}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
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

                    {password && (
                        <div className="space-y-2 animate-fade-in-down">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full bg-[var(--background)]/50 border rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200 ${password !== confirmPassword && confirmPassword ? 'border-red-500/50' : 'border-[var(--foreground)]/10'
                                    }`}
                                placeholder="Confirm your new password"
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 rounded-xl border border-[var(--text2-color)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-colors font-bold"
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-8 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform flex items-center justify-center min-w-[140px] ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-[var(--background)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
