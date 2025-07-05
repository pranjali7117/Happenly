import EventForm from "../components/EventForm.jsx";

export default function EventEditPage() {
    return (
        <section className="flex flex-col gap-6 sm:gap-8 px-2 sm:px-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-secondary my-4">Edit Event</h1>
            <EventForm isEditing />
        </section>
    );
} 