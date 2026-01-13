"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import NavButton from './NavButton';
import ThemeToggle from '../general/themeToggle';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
    };

    return (
        <nav className="relative w-full flex items-center justify-between px-8 py-4 z-50">
            <Link href="/" className="text-2xl font-bold text-[var(--accent-color)]">
                SAGE
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                <div className="flex space-x-2 bg-[var(--secondary-color)] rounded-lg px-4 py-2">
                    <NavButton text="About" route="/" />
                    <NavButton text="Research & Commentary" route="/research" />
                    <NavButton text="Team" route="/team" />
                    {/* <NavButton text="Contact" route="/" /> */}
                    <NavButton text="Apply" route="/apply" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--secondary-color)] hover:bg-[var(--accent-color)]/10 transition-colors border border-[var(--text2-color)]/20 text-[var(--foreground)]"
                        aria-label="User menu"
                    >
                        {user ? (
                            <span className="font-bold text-lg">{user.username.charAt(0).toUpperCase()}</span>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        )}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[var(--secondary-color)] rounded-xl shadow-lg border border-[var(--text2-color)]/10 overflow-hidden py-1 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                            {user ? (
                                <>
                                    <div className="px-4 py-3 border-b border-[var(--text2-color)]/10">
                                        <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.username}</p>
                                        <p className="text-xs text-[var(--text2-color)] truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--text2-color)]/10 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/manage-account"
                                        className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--text2-color)]/10 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    className="block px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--text2-color)]/10 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;