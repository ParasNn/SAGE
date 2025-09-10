import React from 'react';

const InterestForm = () => {
    return (
        <div className="flex justify-center items-center w-full">
            <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSc2WXn8amuc_HxTa_1k9vk_9ylMR702zqmVdSiL3M_gkTpX-A/viewform?embedded=true"
                width="100%"
                height="800"
                style={{ border: "none" }}
                allowFullScreen
                title="Interest Form"
            >
                Loading…
            </iframe>
        </div>
    );
};

export default InterestForm;
