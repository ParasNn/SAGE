"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InvitePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    // Form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
                return;
            }

            const userRole = user.role?.toLowerCase() || '';
            if (userRole !== 'admin') {
                // Determine if we should redirect or just show accessed denied
                // For now, let's just show access denied in the render
                return;
            }
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role
                }),
            });

            if (response.ok) {
                setMessage({ text: 'User invited/created successfully!', type: 'success' });
                // Reset form
                setUsername('');
                setEmail('');
                setPassword('');
                setRole('User');
            } else {
                const errorText = await response.text();
                setMessage({ text: errorText || 'Failed to create user.', type: 'error' });
            }
        } catch (error) {
            console.error('Error inviting user:', error);
            setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return null; // Or loading spinner
    }

    if (!user) {
        return null;
    }

    const userRole = user.role?.toLowerCase() || '';
    if (userRole !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h1>
                    <p className="text-[var(--text2-color)]">Only administrators can access this page.</p>
                    <Link href="/dashboard" className="inline-block mt-8 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold hover:bg-[#b05555] transition-colors">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-page-load-1 flex-1 flex items-center justify-center">
            <div className="w-full max-w-lg bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-[var(--text2-color)]/10 shadow-2xl">
                <h1 className="text-3xl font-bold text-[var(--accent-color)] mb-2">Invite New User</h1>
                <p className="text-[var(--text2-color)] mb-8">Create an account for a new member.</p>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${message.type === 'success'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                            placeholder="jdoe"
                            required
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
                            placeholder="jdoe@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="text" // Visible text as requested "plain english" for admin to see what they set
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                            placeholder="Set a temporary password"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="role" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Role
                        </label>
                        <div className="relative">
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                            >
                                <option value="User" className="bg-[var(--background)]">User</option>
                                <option value="Officer" className="bg-[var(--background)]">Officer</option>
                                <option value="Admin" className="bg-[var(--background)]">Admin</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text2-color)]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full relative overflow-hidden group px-8 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
