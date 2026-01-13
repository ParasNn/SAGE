"use client";

import React, { useEffect, useState } from 'react';
import { useAuth, User } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Article {
    id: number;
    title: string;
    author: string;
    content: string;
    publishedDate: string;
    status: string;
    username?: string;
}

export default function ArticlesPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/login');
                return;
            }

            const role = user.role?.toLowerCase() || '';
            if (role !== 'admin' && role !== 'officer') {
                // Determine if we should redirect or just show accessed denied
                // For now, let's just show access denied in the render
                return;
            }

            fetchArticles();
        }
    }, [user, isLoading, router]);

    const fetchArticles = async () => {
        try {
            setLoadingArticles(true);
            const response = await fetch('http://localhost:8080/api/articles');
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setArticles(data);
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

    const handleStatusChange = async (articleId: number, newStatus: string) => {
        try {
            // Optimistic update
            setArticles(articles.map(a =>
                a.id === articleId ? { ...a, status: newStatus } : a
            ));

            const response = await fetch(`http://localhost:8080/api/articles/${articleId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            // Revert on error
            fetchArticles();
            alert("Failed to update status");
        }
    };

    const handleDeleteClick = (article: Article) => {
        setArticleToDelete(article);
    };

    const confirmDelete = async () => {
        if (!articleToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:8080/api/articles/${articleToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to delete article');
            }

            // Remove from state
            setArticles(articles.filter(a => a.id !== articleToDelete.id));
            setArticleToDelete(null);
        } catch (error) {
            console.error('Error deleting article:', error);
            alert('Failed to delete article. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const cancelDelete = () => {
        setArticleToDelete(null);
    };

    if (isLoading) {
        return null;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    const role = user.role?.toLowerCase() || '';
    if (role !== 'admin' && role !== 'officer') {
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
        <>
            <div className="container mx-auto px-4 py-12 animate-page-load-1">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-[var(--accent-color)] mb-2">All Articles</h1>
                        <p className="text-[var(--text2-color)]">Manage and review article submissions.</p>
                    </div>
                    <button
                        onClick={fetchArticles}
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
                        <button onClick={fetchArticles} className="mt-4 underline">Try Again</button>
                    </div>
                ) : (
                    <div className="bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl border border-[var(--text2-color)]/10 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--secondary-color)] border-b border-[var(--text2-color)]/10 text-[var(--text2-color)] uppercase text-xs tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Title</th>
                                        <th className="px-6 py-4 font-semibold">Author (Field)</th>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Uploaded By</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--text2-color)]/10">
                                    {articles.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-[var(--text2-color)]">
                                                No articles found.
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
                                                <td className="px-6 py-4 text-[var(--foreground)]">
                                                    {article.username ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-[var(--background)] text-xs font-bold">
                                                                {article.username.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span>{article.username}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[var(--text2-color)] italic">Unknown</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={article.status || 'draft'}
                                                        onChange={(e) => handleStatusChange(article.id, e.target.value)}
                                                        className={`text-xs font-medium border rounded-full px-2 py-1 outline-none cursor-pointer appearance-none text-center min-w-[100px]
                                                            ${(article.status?.toLowerCase() === 'published' || article.status?.toLowerCase() === 'approved')
                                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                                : article.status?.toLowerCase() === 'rejected'
                                                                    ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                                    : article.status?.toLowerCase() === 'draft'
                                                                        ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                                                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                            }
                                                        `}
                                                        style={{ textAlignLast: 'center' }}
                                                    >
                                                        <option value="draft" className="bg-[var(--secondary-color)] text-[var(--foreground)]">Draft</option>
                                                        <option value="in_review" className="bg-[var(--secondary-color)] text-[var(--foreground)]">In Review</option>
                                                        <option value="published" className="bg-[var(--secondary-color)] text-[var(--foreground)]">Published</option>
                                                        <option value="rejected" className="bg-[var(--secondary-color)] text-[var(--foreground)]">Rejected</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 text-right flex items-center justify-end gap-3">
                                                    <Link href={`/article/${article.id}`} className="text-[var(--accent-color)] hover:underline text-sm font-medium">
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(article)}
                                                        className="text-red-400 hover:text-red-300 hover:underline text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
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

            {/* Delete Confirmation Modal */}
            {articleToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-[var(--secondary-color)] border border-[var(--text2-color)]/20 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Delete Article?</h3>
                        <p className="text-[var(--text2-color)] mb-6">
                            Are you sure you want to delete <span className="text-[var(--accent-color)] font-semibold">"{articleToDelete.title}"</span>? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded-lg border border-[var(--text2-color)]/20 text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-colors font-medium"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium flex items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete Article'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
