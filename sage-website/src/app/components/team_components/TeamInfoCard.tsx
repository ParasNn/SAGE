import React from 'react'

interface TeamCardProps {
    image: string;
    name: string;
    major: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ image, name, major }) => {
    return (
        <div className="bg-[var(--secondary-color)] rounded-2xl">
            <img src={image} alt={name} />
            <div className="p-4">
                <h2 className="text-xl font-bold ">{name}</h2>
                <p>{major}</p>
            </div>
        </div>
    )
}

export default TeamCard
