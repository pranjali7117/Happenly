import { Calendar, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export default function Nagivation() {
    const location = useLocation();
    return (
        <nav className="fixed top-0 left-0 w-full z-40 px-4 py-3 flex items-center justify-between bg-white/60 backdrop-blur-md shadow-lg border-none">
            <div className="flex items-center gap-2">
                <Button asChild variant={location.pathname === '/' ? 'default' : 'outline'} size="sm" className={location.pathname === '/' ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow' : ''}>
                    <Link to="/">
                        <Calendar className="size-5" />
                        Home
                    </Link>
                </Button>
                <Button asChild variant={location.pathname.startsWith('/events') ? 'default' : 'outline'} size="sm" className={location.pathname.startsWith('/events') ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow' : ''}>
                    <Link to="/events">
                        Events
                    </Link>
                </Button>
            </div>
            <Button asChild className="gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow font-semibold">
                <Link to="/create">
                    <Plus className="size-5" />
                    Create an Event
                </Link>
            </Button>
        </nav>
    );
} 