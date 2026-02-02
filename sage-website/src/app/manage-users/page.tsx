"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface UserData {
    id: string; // Changed to string (uuid)
    full_name: string;
    role: string;
    grad_year: number;
    created_at: string;
}

export default function ManageUsersPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Role Update Confirmation State
    const [userToUpdate, setUserToUpdate] = useState<UserData | null>(null);
    const [pendingRole, setPendingRole] = useState<string | null>(null);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
                return;
            }

            const role = user.role?.toLowerCase() || '';
            if (role !== 'admin') {
                return;
            }

            fetchUsers();
        }
    }, [user, isLoading, router]);

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setUsers(data as UserData[]);
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleRoleClick = (userData: UserData, newRole: string) => {
        setUserToUpdate(userData);
        setPendingRole(newRole);
    };

    const confirmRoleUpdate = async () => {
        if (!userToUpdate || !pendingRole) return;

        setIsUpdatingRole(true);
        try {
            // Optimistic update
            setUsers(users.map(u => u.id === userToUpdate.id ? { ...u, role: pendingRole } : u));

            const { error } = await supabase
                .from('profiles')
                .update({ role: pendingRole })
                .eq('id', userToUpdate.id);

            if (error) {
                throw error;
            }

            // Close modal after success
            setUserToUpdate(null);
            setPendingRole(null);
        } catch (error) {
            console.error("Error updating role:", error);
            setError("Failed to update user role");
            fetchUsers(); // Revert changes
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const cancelRoleUpdate = () => {
        setUserToUpdate(null);
        setPendingRole(null);
    };

    if (isLoading) {
        return null;
    }

    if (!user) {
        return null;
    }

    const role = user.role?.toLowerCase() || '';
    if (role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h1>
                <p className="text-[var(--text2-color)]">You do not have permission to view this page.</p>
                <Link href="/dashboard" className="inline-block mt-8 px-6 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold hover:bg-[#b05555] transition-colors">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-page-load-1">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--accent-color)] mb-2">Manage Users</h1>
                    <p className="text-[var(--text2-color)]">View and manage registered users.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-2 rounded-full hover:bg-[var(--secondary-color)] text-[var(--foreground)] transition-colors"
                    title="Refresh"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                        <path d="M3 3v5h5"></path>
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
                        <path d="M16 21h5v-5"></path>
                    </svg>
                </button>
            </div>

            {loadingUsers ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
                    <p>{error}</p>
                    <button onClick={fetchUsers} className="mt-4 underline">Try Again</button>
                </div>
            ) : (
                <div className="bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl border border-[var(--text2-color)]/10 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--secondary-color)] border-b border-[var(--text2-color)]/10 text-[var(--text2-color)] uppercase text-xs tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Full Name</th>
                                    <th className="px-6 py-4 font-semibold">Role</th>
                                    <th className="px-6 py-4 font-semibold">Grad Year</th>
                                    <th className="px-6 py-4 font-semibold">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--text2-color)]/10">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-[var(--text2-color)]">
                                            No users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((userData) => (
                                        <tr key={userData.id} className="hover:bg-[var(--secondary-color)]/50 transition-colors duration-150">
                                            <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--accent-color)]/20 text-[var(--accent-color)] flex items-center justify-center text-xs font-bold">
                                                        {(userData.full_name || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    {userData.full_name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={userData.role?.toLowerCase() || 'user'}
                                                    onChange={(e) => handleRoleClick(userData, e.target.value)}
                                                    className={`text-xs font-medium border rounded-full px-2 py-1 outline-none cursor-pointer appearance-none text-center min-w-[100px]
                                                                ${userData.role?.toLowerCase() === 'admin'
                                                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                            : userData.role?.toLowerCase() === 'officer'
                                                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        }`}
                                                    style={{ textAlignLast: 'center' }}
                                                >
                                                    <option value="user" className="bg-[var(--secondary-color)] text-[var(--foreground)]">User</option>
                                                    <option value="officer" className="bg-[var(--secondary-color)] text-[var(--foreground)]">Officer</option>
                                                    <option value="admin" className="bg-[var(--secondary-color)] text-[var(--foreground)]">Admin</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--text2-color)]">
                                                {userData.grad_year || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-[var(--text2-color)]">
                                                {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Role Change Confirmation Modal */}
            {userToUpdate && pendingRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--secondary-color)] border border-[var(--text2-color)]/20 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Update User Role?</h3>
                        <p className="text-[var(--text2-color)] mb-6">
                            Are you sure you want to change the role of <span className="text-[var(--accent-color)] font-semibold">&quot;{userToUpdate.full_name}&quot;</span> to <span className="font-bold underline capitalize">{pendingRole}</span>?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelRoleUpdate}
                                className="px-4 py-2 rounded-lg border border-[var(--text2-color)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-colors font-medium"
                                disabled={isUpdatingRole}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRoleUpdate}
                                className="px-4 py-2 rounded-lg bg-[var(--accent-color)] text-[var(--background)] hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
                                disabled={isUpdatingRole}
                            >
                                {isUpdatingRole ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        Updating...
                                    </>
                                ) : (
                                    'Confirm Update'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
