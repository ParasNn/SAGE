import React from 'react'
import Navbar from '../components/navbar/Navbar'
import TeamCard from '../components/team_components/TeamInfoCard'

const page = () => {
    return (
        <div>
            <Navbar />
            <div>
                <TeamCard image="thing" name="gurt" major="ece" />
            </div>
        </div>
    )
}

export default page