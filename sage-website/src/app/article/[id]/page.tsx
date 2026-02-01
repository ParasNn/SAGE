"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ArticlePage from '../../components/ArticlePage';
import { useAuth } from '../../context/AuthContext';
import { createClient } from '@/utils/supabase/client';

interface Article {
    id: number;
    title: string;
    author: string;
    content: string;
    publishedDate?: string;
    status?: string;
}

export default function Page() {
    const params = useParams();
    const id = params?.id;
    const { user, isLoading } = useAuth();
    const supabase = createClient();

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchArticle = async () => {
            try {
                setLoading(true);
                const articleId = Array.isArray(id) ? id[0] : id;

                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', articleId)
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') { // code for no rows returned/0 results
                        throw new Error('Article not found');
                    }
                    throw error;
                }

                // Map Supabase data to Article interface
                const mappedArticle: Article = {
                    id: data.id,
                    title: data.title,
                    author: data.authors, // Map authors -> author
                    content: data.content,
                    publishedDate: data.created_at, // Map created_at -> publishedDate
                    status: data.status,
                };

                setArticle(mappedArticle);
            } catch (err: unknown) {
                console.error(err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unexpected error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    // Check access for non-published articles (Draft, Pending, In Review, Rejected, etc.)
    if (!loading && article && article.status?.toLowerCase() !== 'published' && !user) {
        return (
            <div className="flex-1 container mx-auto px-4 py-8 animate-page-load-1 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="bg-[var(--secondary-color)]/50 backdrop-blur-xl border border-[var(--text2-color)]/20 text-center px-8 py-8 rounded-xl max-w-lg shadow-xl">
                    <h3 className="text-2xl font-bold mb-4 text-[var(--accent-color)]">Restricted Access</h3>
                    <p className="text-[var(--text2-color)] mb-6">This article is not yet published. You must be logged in to view it.</p>
                    <Link href="/login" className="inline-block px-6 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold hover:bg-[#b05555] transition-colors">
                        Sign In to View
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 container mx-auto px-4 py-8">
            {loading && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-[var(--text2-color)]">
                    <div className="w-12 h-12 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="animate-pulse">Loading article...</p>
                </div>
            )}

            {error && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl max-w-md">
                        <h3 className="text-xl font-bold mb-2">Error</h3>
                        <p>{error}</p>
                        <Link href="/" className="inline-block mt-4 text-[var(--accent-color)] hover:underline">
                            Return to Home
                        </Link>
                    </div>
                </div>
            )}

            {!loading && !error && article && (
                <div className="animate-page-load-1">
                    <ArticlePage article={article} />
                </div>
            )}
        </div>
    );
}
