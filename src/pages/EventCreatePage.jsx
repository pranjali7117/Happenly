import EventForm from "../components/EventForm.jsx";

export default function EventCreatePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 sm:gap-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg leading-tight">
                            Create New Event
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-4 max-w-2xl mx-auto">
                            Plan your perfect event with all the details that matter
                        </p>
                    </div>
                    <EventForm />
                </div>
            </div>
        </div>
    );
} 