import { Outlet } from "react-router-dom";
import Nagivation from "../components/Nagivation.jsx";

export default function Layout() {
    return (
        <>
            <Nagivation />
            <main className="p-4 sm:p-6">
                <Outlet />
            </main>
        </>
    );
} 