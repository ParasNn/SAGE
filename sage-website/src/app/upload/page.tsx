"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentBox from '../components/upload_components/ContentBox';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@/utils/supabase/client';

export default function UploadPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const supabase = createClient();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user && !author) {
            setAuthor(user.username);
        }
    }, [isLoading, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('articles')
                .insert({
                    title,
                    authors: author,
                    content,
                    username: user.username,
                    user: user.id,
                    status: 'draft'
                });

            if (!error) {
                setMessage({ text: 'Article published successfully!', type: 'success' });
                setTitle('');
                setAuthor(user.username); // Reset to username
                setContent('');
            } else {
                console.error('Upload failed:', error);
                setMessage({ text: `Failed to publish: ${error.message}`, type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting article:', error);
            setMessage({ text: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !user) {
        return null;
    }

    return (
        <div className="flex items-center justify-center p-6 animate-page-load-1 h-full min-h-[80vh]">
            <div className="w-full max-w-2xl bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 transition-all duration-300">
                <h1 className="text-4xl font-bold mb-2 text-[var(--accent-color)] tracking-tight">
                    Upload Article:
                </h1>


                {message && (
                    <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success'
                            ? 'bg-[var(--text2-color)]/10 text-[var(--accent-color)] border border-[var(--text2-color)]/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}

                            required
                            className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="author" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Author
                        </label>
                        <input
                            id="author"
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}

                            required
                            className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="content" className="block text-sm font-medium text-[var(--text2-color)] uppercase tracking-wider ml-1">
                            Content
                        </label>
                        <ContentBox
                            content={content}
                            onChange={(html) => setContent(html)}
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
            relative overflow-hidden group px-8 py-3 rounded-xl bg-[var(--accent-color)] text-[var(--background)] font-bold shadow-lg 
            hover:shadow-xl hover:scale-105 transition-all duration-300 transform
            disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
            `}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-[var(--background)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : (
                                    'Publish Article'
                                )}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
