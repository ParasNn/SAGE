import React from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

const ResearchPage = async () => {
    const supabase = await createClient();

    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published') // Ensure we only show published articles
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching articles:', error);
    }

    return (
        <div className="flex-1">
            <div className="flex justify-center animate-page-load-1">
                <h1 className="font-bold text-9xl p-9">Research</h1>
            </div>

            <div className="container mx-auto px-4 py-12 animate-page-load-2">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-semibold text-[var(--accent-color)] mb-6">Recent Articles</h2>

                    {(!articles || articles.length === 0) ? (
                        <p className="text-[var(--text2-color)]">No published articles found.</p>
                    ) : (
                        <div className="grid gap-4">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/article/${article.id}`}
                                    className="block p-6 rounded-xl bg-[var(--secondary-color)]/30 border border-[var(--text2-color)]/10 hover:border-[var(--accent-color)]/50 transition-all hover:bg-[var(--secondary-color)]/50 group"
                                >
                                    <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--accent-color)] transition-colors mb-2">
                                        {article.title}
                                    </h3>
                                    <div className="flex justify-between items-center text-sm text-[var(--text2-color)]">
                                        <span>By {article.authors || 'Unknown'}</span>
                                        <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResearchPage;