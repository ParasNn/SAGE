import React from 'react';
import Link from 'next/link';
import NavButton from './NavButton';

const Navbar = () => {
    return (
        <nav className="relative w-full flex items-center px-8 py-4">
            <Link href="/" className="text-2xl font-bold text-[#d26b6b]">
                SAGE
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2 bg-[#254d3f] rounded-lg px-4 py-2">
                <NavButton text="About" route="/" />
                <NavButton text="Research & Commentary" route="/research" />
                <NavButton text="Team" route="/" />
                {/* <NavButton text="Contact" route="/" /> */}
                <NavButton text="Apply" route="/" />
            </div>
        </nav>
    );
};

export default Navbar;