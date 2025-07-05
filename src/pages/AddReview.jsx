import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function AddReview() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", review: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h2 className="text-2xl font-bold text-indigo-600">Thank you for your review!</h2>
                <p className="text-gray-700 dark:text-gray-200">We appreciate your feedback.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Add Your Review</h1>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border shadow rounded-xl p-8 flex flex-col gap-6 w-full max-w-md">
                <div>
                    <label htmlFor="name" className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Your Name</label>
                    <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
                </div>
                <div>
                    <label htmlFor="review" className="block text-gray-700 dark:text-gray-200 font-semibold mb-1">Your Review</label>
                    <textarea id="review" name="review" value={form.review} onChange={handleChange} placeholder="Share your experience..." required rows={4} className="w-full rounded-md border border-gray-300 dark:border-gray-700 p-2 bg-transparent text-gray-900 dark:text-gray-100" />
                </div>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">Submit Review</Button>
            </form>
        </div>
    );
} 