import Link from "next/link";
import AddToCart from "./components/AddToCart";
import Navbar from "./components/navbar/Navbar";

export default function Home() {
    return (
        <main>
            <Navbar></Navbar>
            <h1>Hello Gurt</h1>
        </main>
    );
}
