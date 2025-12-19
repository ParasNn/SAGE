"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../components/navbar/Navbar';
import ArticlePage from '../../components/ArticlePage';

interface Article {
    id: number;
    title: string;
    author: string;
    content: string;
    publishedDate?: string;
}

export default function Page() {
    const params = useParams();
    const id = params?.id;

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchArticle = async () => {
            try {
                setLoading(true);
                const articleId = Array.isArray(id) ? id[0] : id;

                const response = await fetch(`http://localhost:8080/api/articles/${articleId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Article not found');
                    }
                    throw new Error('Failed to fetch article');
                }

                const data = await response.json();
                setArticle(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    return (
        <main className="min-h-screen bg-[var(--background)] relative overflow-hidden font-sans text-[var(--foreground)] p-4">
            { }
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent-color)] opacity-5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--text2-color)] opacity-5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <div className="flex-1 container mx-auto px-4 py-8 animate-page-load-1">
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
                                <a href="/" className="inline-block mt-4 text-[var(--accent-color)] hover:underline">
                                    Return to Home
                                </a>
                            </div>
                        </div>
                    )}

                    {!loading && !error && article && (
                        <ArticlePage article={article} />
                    )}
                </div>
            </div>
        </main>
    );
}
