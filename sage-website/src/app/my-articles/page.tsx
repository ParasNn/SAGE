"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

interface Article {
    id: number;
    title: string;
    author: string;
    content: string;
    publishedDate: string;
    status: string;
}

export default function MyArticlesPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
                return;
            }
            fetchMyArticles();
        }
    }, [user, isLoading, router]);

    const fetchMyArticles = async () => {
        try {
            setLoadingArticles(true);

            // Supabase query to get articles for the current user
            // We can trust RLS if enabled, but adding .eq('user', user?.id) makes it explicit and safe
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map Supabase fields to Article interface
            const mappedArticles: Article[] = (data || []).map((item: {
                id: number;
                title: string;
                authors: string;
                content: string;
                created_at: string;
                status: string;
            }) => ({
                id: item.id,
                title: item.title,
                author: item.authors, // Map authors -> author
                content: item.content,
                publishedDate: item.created_at, // Map created_at -> publishedDate
                status: item.status
            }));

            setArticles(mappedArticles);
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoadingArticles(false);
        }
    };

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="container mx-auto px-4 py-12 animate-page-load-1">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--accent-color)] mb-2">My Articles</h1>
                    <p className="text-[var(--text2-color)]">View your submitted articles and their status.</p>
                </div>
                <button
                    onClick={fetchMyArticles}
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

            {loadingArticles ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center">
                    <p>{error}</p>
                    <button onClick={fetchMyArticles} className="mt-4 underline">Try Again</button>
                </div>
            ) : (
                <div className="bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl border border-[var(--text2-color)]/10 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[var(--secondary-color)] border-b border-[var(--text2-color)]/10 text-[var(--text2-color)] uppercase text-xs tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-semibold">Author (Field)</th>
                                    <th className="px-6 py-4 font-semibold">Published Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--text2-color)]/10">
                                {articles.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[var(--text2-color)]">
                                            You haven&apos;t uploaded any articles yet.
                                        </td>
                                    </tr>
                                ) : (
                                    articles.map((article) => (
                                        <tr key={article.id} className="hover:bg-[var(--secondary-color)]/50 transition-colors duration-150">
                                            <td className="px-6 py-4 font-medium text-[var(--foreground)]">
                                                <Link href={`/article/${article.id}`} className="hover:text-[var(--accent-color)] transition-colors">
                                                    {article.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-[var(--text2-color)]">
                                                {article.author}
                                            </td>
                                            <td className="px-6 py-4 text-[var(--text2-color)]">
                                                {new Date(article.publishedDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`text-xs font-medium px-3 py-1 rounded-full
                                                        ${(article.status?.toLowerCase() === 'published' || article.status?.toLowerCase() === 'approved')
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : article.status?.toLowerCase() === 'rejected'
                                                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                : article.status?.toLowerCase() === 'draft'
                                                                    ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                                    : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                        }
                                                    `}
                                                >
                                                    {article.status ? (article.status.charAt(0).toUpperCase() + article.status.slice(1).replace('_', ' ')) : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                                <Link href={`/article/${article.id}`} className="text-[var(--accent-color)] hover:underline text-sm font-medium">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
