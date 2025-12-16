"use client"

import Navbar from "./components/navbar/Navbar";
import SAGE from "./components/about_components/SAGE";
import Blurb from "./components/general/blurb";

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="animate-page-load-1">
                <SAGE />
            </div>
            <div className="animate-page-load-2">
                <Blurb title="thing1" text="thing1's information that goes on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on"></Blurb>
                <Blurb title="thing2" text="thing2's information that goes on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on"></Blurb>
                <Blurb title="thing3" text="thing3's information that goes on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on and on and on and on and on and on
                and on and on and on and on and on and on and on"></Blurb>
            </div>
        </div>
    );
}
