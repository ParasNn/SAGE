"use client"

import Navbar from "./components/navbar/Navbar";
import SAGE from "./components/about_components/SAGE";

export default function Home() {
    return (
        <main>
            <Navbar />
            <div className="animate-page-load-1">
                <SAGE />
            </div>
            <div className="animate-page-load-2">
                <h1>Hello Gurt</h1>
            </div>
        </main>
    );
}
