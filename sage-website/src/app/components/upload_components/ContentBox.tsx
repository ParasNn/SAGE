"use client";

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';

interface ContentBoxProps {
    content: string;
    onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const buttonClass = (isActive: boolean) =>
        `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
            ? 'bg-[var(--accent-color)] text-[var(--background)]'
            : 'hover:bg-[var(--foreground)]/10 text-[var(--foreground)]'
        }`;

    return (
        <div className="flex flex-wrap gap-2 p-3 border-b border-[var(--foreground)]/10 bg-[var(--background)]/30 backdrop-blur-sm rounded-t-xl mb-2">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive('bold'))}
            >
                Bold
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive('italic'))}
            >
                Italic
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={buttonClass(editor.isActive('strike'))}
            >
                Strike
            </button>
            <div className="w-px h-6 bg-[var(--foreground)]/20 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive('bulletList'))}
            >
                Bullet List
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive('orderedList'))}
            >
                Ordered List
            </button>
            <div className="w-px h-6 bg-[var(--foreground)]/20 mx-1 self-center" />
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={buttonClass(editor.isActive('blockquote'))}
            >
                Blockquote
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className={buttonClass(false)}
            >
                Undo
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className={buttonClass(false)}
            >
                Redo
            </button>
        </div>
    );
};

export default function ContentBox({ content, onChange }: ContentBoxProps) {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] px-4 py-2 text-[var(--foreground)]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onTransaction: () => {
            forceUpdate();
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && content === '' && !editor.isEmpty) {
            editor.commands.setContent('');
        }
    }, [content, editor]);

    return (
        <div className="w-full bg-[var(--background)]/50 border border-[var(--foreground)]/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--accent-color)]/50 focus-within:border-transparent transition-all duration-200">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
