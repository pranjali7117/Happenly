import { useParams } from "react-router-dom";
import EventDetails from "../components/EventDetails.jsx";
import { useEventContext } from "../context/useEventContext.js";

export default function EventDetailsPage() {
    const { id } = useParams();
    const { state } = useEventContext();
    const event = state.events.find((event) => event.id === id);

    if (!event) {
        return (
            <section className="flex flex-col gap-6 sm:gap-8 px-2 sm:px-8">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-secondary my-4">Event Not Found</h2>
                <p className="text-white text-base sm:text-lg">The event you're looking for doesn't exist.</p>
            </section>
        );
    }

    return (
        <section className="flex flex-col gap-6 sm:gap-8 px-2 sm:px-8">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-secondary my-4">Event Details</h2>
            <EventDetails event={event} />
        </section>
    );
} 