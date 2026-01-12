"use client";

import React, { useState } from 'react';
import Navbar from '../components/navbar/Navbar';
import ContentBox from '../components/upload_components/ContentBox';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UploadPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('http://localhost:8080/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    author,
                    content,
                    // userId removed as auth is not required
                }),
            });

            if (response.ok) {
                setMessage({ text: 'Article published successfully!', type: 'success' });
                setTitle('');
                setAuthor('');
                setContent('');
            } else {
                const errorText = await response.text();
                console.error('Upload failed. Status:', response.status, 'Body:', errorText);
                setMessage({ text: `Failed to publish: ${errorText || 'Unknown error'}`, type: 'error' });
            }
        } catch (error) {
            console.error('Error submitting article:', error);
            setMessage({ text: 'An error occurred. Is the backend running?', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !user) {
        return null;
    }

    return (
        <main className="min-h-screen bg-[var(--background)] relative overflow-hidden font-sans text-[var(--foreground)] p-4">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--accent-color)] opacity-5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--text2-color)] opacity-5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />

                <div className="flex-1 flex items-center justify-center p-6 animate-page-load-1">
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
            </div>
        </main>
    );
}
