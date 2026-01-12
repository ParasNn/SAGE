import React from 'react'
import Blurb from '../components/general/blurb'
import InterestForm from '../components/application_components/interestForm'

const page = () => {
    return (
        <div className="flex-1">
            <div className="animate-page-load-1 mt-10">
                <Blurb title="Current Application Info: " text="Please fill out the interest form below"></Blurb>
            </div>
            <div className="animate-page-load-2">
                <InterestForm></InterestForm>
            </div>
        </div>
    )
}

export default page
