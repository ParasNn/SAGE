import React from 'react'
import TeamCard from '../components/team_components/TeamInfoCard'

const page = () => {
    return (
        <div className="flex-1">
            <div>
                <TeamCard image="thing" name="gurt" major="ece" />
            </div>
        </div>
    )
}

export default page