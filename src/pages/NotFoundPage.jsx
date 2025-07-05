import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="flex flex-col gap-4 items-center mt-12">
            <h2 className="text-white font-bold">404 - Page Not Found</h2>
            <Link
                to="/"
                className="px-4 py-2 text-secondary border border-secondary rounded-sm"
            >
                Home Page
            </Link>
        </div>
    );
} 