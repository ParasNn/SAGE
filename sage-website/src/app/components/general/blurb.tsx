import React from 'react';

interface BlurbProps {
    title: string;
    text: string;
}

const Blurb: React.FC<BlurbProps> = ({ title, text }) => {
    return (
        <div className="w-[85vw] mx-auto rounded-2xl p-6 text-l font-bold m-5 border-3"
            style={{ borderColor: "var(--secondary-color)" }}>
            <h2 className="text-3xl mb-3">{title}</h2>
            <p>{text}</p>
        </div>
    );
};

export default Blurb;