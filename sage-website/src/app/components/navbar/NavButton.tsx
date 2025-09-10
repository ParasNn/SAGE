import React from 'react';
import Link from 'next/link';

interface NavButtonProps {
    text: string;
    route: string;
}

const NavButton: React.FC<NavButtonProps> = ({ text, route }) => {
    return (
        <div className="p-0 flex justify-center">
            <Link
                href={route}
                className="inline-block bg-transparent transition-colors text-xl 
                font-bold px-8 py-0 rounded-lg text-center text-[var(--text2-color)] 
                hover:text-[var(--accent-color)] whitespace-nowrap">
                {text}
            </Link>
        </div>
    );
};

export default NavButton;