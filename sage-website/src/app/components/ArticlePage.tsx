import React from 'react';

interface Article {
    id: number;
    title: string;
    author: string;
    content: string;
    publishedDate?: string;
}

interface ArticlePageProps {
    article: Article;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
    return (
        <div className="w-full max-w-3xl mx-auto bg-[var(--secondary-color)]/30 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-sm">
            <header className="mb-8 border-b border-[var(--foreground)]/10 pb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--accent-color)] mb-4 tracking-tight leading-tight">
                    {article.title}
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[var(--text2-color)] text-sm font-medium uppercase tracking-wider">
                    <div className="flex items-center gap-2 mb-2 sm:mb-0">
                        <span className="bg-[var(--accent-color)]/10 px-3 py-1 rounded-full text-[var(--accent-color)]">
                            By {article.author}
                        </span>
                    </div>
                    {article.publishedDate && (
                        <div className="flex items-center gap-2 opacity-80">
                            {new Date(article.publishedDate).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>
                    )}
                </div>
            </header>

            <article className="prose prose-lg max-w-none px-4 py-2 text-[var(--foreground)]">
                {/* 
                   We use the same class names that the Tiptap editor generates/expects 
                   so that the styles in globals.css (which target .ProseMirror) apply here too 
                   if we wrap it, OR we just allow the global styles to cascade if they are generic.
                   The globals.css targets .ProseMirror ul, etc. 
                   So we wrap this in a div with formatting classes.
                 */}
                <div
                    className="ProseMirror"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />
            </article>
        </div>
    );
};

export default ArticlePage;
