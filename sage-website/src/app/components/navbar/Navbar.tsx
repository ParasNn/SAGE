import React from 'react';
import Link from 'next/link';
import NavButton from './NavButton';
import ThemeToggle from '../general/themeToggle';

const Navbar = () => {
    return (
        <nav className="relative w-full flex items-center px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-[var(--accent-color)]">
                SAGE
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className="flex space-x-2 bg-[var(--secondary-color)] rounded-lg px-4 py-2">
                    <NavButton text="About" route="/" />
                    <NavButton text="Research & Commentary" route="/research" />
                    <NavButton text="Team" route="/team" />
                    {/* <NavButton text="Contact" route="/" /> */}
                    <NavButton text="Apply" route="/apply" />
                </div>
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;