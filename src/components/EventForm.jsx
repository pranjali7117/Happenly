import { Plus, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEventContext } from "../context/useEventContext.js";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function EventForm({ isEditing = false, isDark }) {
    const { state, addEvent, updateEvent } = useEventContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        venue: "",
        location: "",
        isOnline: false,
        onlineLink: "",
        attendeeEmail: "",
        type: "Conference",
        privacy: "public",
        color: "indigo",
        isRecurring: false,
        recurrence: "none",
        timezone: "UTC",
        capacity: "",
        waitlist: false,
    });

    const [attendees, setAttendees] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef();
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [cohosts, setCohosts] = useState([]);
    const [cohostEmail, setCohostEmail] = useState("");

    useEffect(() => {
        if (isEditing && id) {
            const eventToEdit = state.events.find((event) => event.id === id);

            if (eventToEdit) {
                setFormData({
                    title: eventToEdit.title,
                    description: eventToEdit.description,
                    date: eventToEdit.date.split(" ")[0],
                    startTime: eventToEdit.startTime,
                    endTime: eventToEdit.endTime,
                    venue: eventToEdit.venue,
                    location: eventToEdit.location,
                    isOnline: eventToEdit.isOnline,
                    onlineLink: eventToEdit.onlineLink,
                    attendeeEmail: "",
                    type: eventToEdit.type,
                    privacy: eventToEdit.privacy,
                    color: eventToEdit.color,
                    isRecurring: eventToEdit.isRecurring,
                    recurrence: eventToEdit.recurrence,
                    timezone: eventToEdit.timezone,
                    capacity: eventToEdit.capacity,
                    waitlist: eventToEdit.waitlist,
                });

                setAttendees([...eventToEdit.attendees]);
            }
        }
    }, [isEditing, id, state.events]);

    function handleInputChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }

    function handleRemoveImage() {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
            alert("End time must be after start time.");
            return;
        }
        const eventData = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            venue: formData.venue,
            location: formData.location,
            isOnline: formData.isOnline,
            onlineLink: formData.onlineLink,
            attendees: attendees,
            cohosts,
            image: imagePreview || null,
            type: formData.type,
            privacy: formData.privacy,
            color: formData.color,
            isRecurring: formData.isRecurring,
            recurrence: formData.isRecurring ? formData.recurrence : "none",
            timezone: formData.timezone,
            questions,
            capacity: formData.capacity,
            waitlist: formData.waitlist,
        };
        if (isEditing && id) {
            updateEvent({ id, ...eventData });
            navigate("/");
        } else {
            addEvent(eventData);
            // Show success popup with options
            const userChoice = window.confirm(
                `Event "${formData.title}" created successfully!\n\n` +
                "Click OK to create another event, or Cancel to view all events."
            );

            if (userChoice) {
                // User wants to create another event - stay on create page
                // Reset form
                setFormData({
                    title: "",
                    description: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                    venue: "",
                    location: "",
                    isOnline: false,
                    onlineLink: "",
                    attendeeEmail: "",
                    type: "Conference",
                    privacy: "public",
                    color: "indigo",
                    isRecurring: false,
                    recurrence: "none",
                    timezone: "UTC",
                    capacity: "",
                    waitlist: false,
                });
                setAttendees([]);
                setImage(null);
                setImagePreview(null);
                setQuestions([]);
                setCohosts([]);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                // User wants to view events - go to events list
                navigate("/events");
            }
        }
    }

    function handleAddAttendee() {
        const email = formData.attendeeEmail;

        if (attendees.some((a) => a.email === email)) return;

        setAttendees((prev) => [...prev, { email, status: "Yes" }]);
        setFormData((prev) => ({ ...prev, attendeeEmail: "" }));
    }

    function handleRemoveAttendee(email) {
        setAttendees((prev) => prev.filter((attendee) => attendee.email !== email));
    }

    function handleCancel() {
        navigate("/");
    }

    function handleAddQuestion() {
        if (newQuestion.trim() && !questions.includes(newQuestion.trim())) {
            setQuestions((prev) => [...prev, newQuestion.trim()]);
            setNewQuestion("");
        }
    }

    function handleRemoveQuestion(q) {
        setQuestions((prev) => prev.filter((question) => question !== q));
    }

    function handleAddCohost() {
        const email = cohostEmail.trim();
        if (email && !cohosts.includes(email)) {
            setCohosts((prev) => [...prev, email]);
            setCohostEmail("");
        }
    }

    function handleRemoveCohost(email) {
        setCohosts((prev) => prev.filter((c) => c !== email));
    }

    return (
        <Card className={`w-full max-w-2xl transition-all duration-300 ${isDark ? 'bg-white/10 border-white/10 shadow-xl rounded-3xl backdrop-blur-md' : 'bg-white border-gray-200 shadow-xl rounded-3xl'}`}>
            <CardContent className="p-8">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="title">
                            Event Title
                        </label>
                        <Input
                            type="text"
                            id="title"
                            name="title"
                            onChange={handleInputChange}
                            value={formData.title}
                            placeholder="Summer BBQ Party"
                            required
                        />
                    </div>

                    {/* Description (Simple Textarea) */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={handleInputChange}
                            value={formData.description}
                            className={`placeholder:text-gray-400 p-2 outline-none rounded-md w-full min-h-[80px] ${isDark ? 'text-gray-100 bg-white/5 border-white/10' : 'text-gray-700 border'}`}
                            rows={4}
                            placeholder="Join us for a fun summer BBQ..."
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="date">
                                Date
                            </label>
                            <Input
                                type="date"
                                id="date"
                                name="date"
                                onChange={handleInputChange}
                                value={formData.date}
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="startTime">
                                    Start Time
                                </label>
                                <Input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    onChange={handleInputChange}
                                    value={formData.startTime}
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="endTime">
                                    End Time
                                </label>
                                <Input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    onChange={handleInputChange}
                                    value={formData.endTime}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Venue Name Field */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="venue">
                            Venue Name (optional)
                        </label>
                        <Input
                            type="text"
                            id="venue"
                            name="venue"
                            onChange={handleInputChange}
                            value={formData.venue}
                            placeholder="e.g. Grand Hall, City Center"
                        />
                    </div>

                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="location">
                            Location / Address
                        </label>
                        <div className="flex gap-2 items-center">
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                onChange={handleInputChange}
                                value={formData.location}
                                placeholder="123 Main St, City"
                                required
                            />
                            {formData.location && (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 underline text-sm font-semibold hover:text-indigo-800"
                                >
                                    Get Directions
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="attendeeEmail">
                            Attendees
                        </label>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                id="attendeeEmail"
                                name="attendeeEmail"
                                onChange={handleInputChange}
                                value={formData.attendeeEmail}
                                placeholder="email@example.com"
                            />
                            <Button type="button" onClick={handleAddAttendee}>
                                <Plus className="size-5" /> Add
                            </Button>
                        </div>
                        {attendees.length > 0 && (
                            <div className="space-y-2 mt-4">
                                <p className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Added attendees:</p>
                                <ul className="space-y-1">
                                    {attendees.map((attendee, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-center justify-between gap-x-2 border p-2 rounded-md ${isDark ? 'bg-white/5 border-white/10 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                                        >
                                            <span className="break-all">
                                                {attendee.email}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => handleRemoveAttendee(attendee.email)}
                                            >
                                                <X className="size-4" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Event Type/Category Dropdown */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="type">
                            Event Type/Category
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className={`w-full rounded-md border p-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-100' : 'bg-white border-gray-300 text-gray-700'}`}
                        >
                            <option value="Conference">Conference</option>
                            <option value="Meetup">Meetup</option>
                            <option value="Party">Party</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Webinar">Webinar</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Event Privacy Toggle */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Event Privacy</label>
                        <div className="flex gap-4 mt-2">
                            <label className={`flex items-center gap-2 cursor-pointer ${formData.privacy === 'public' ? 'font-bold text-indigo-600' : isDark ? 'text-white' : 'text-gray-700'}`}>
                                <input
                                    type="radio"
                                    name="privacy"
                                    value="public"
                                    checked={formData.privacy === 'public'}
                                    onChange={handleInputChange}
                                    className="accent-indigo-600"
                                />
                                Public
                            </label>
                            <label className={`flex items-center gap-2 cursor-pointer ${formData.privacy === 'private' ? 'font-bold text-indigo-600' : isDark ? 'text-white' : 'text-gray-700'}`}>
                                <input
                                    type="radio"
                                    name="privacy"
                                    value="private"
                                    checked={formData.privacy === 'private'}
                                    onChange={handleInputChange}
                                    className="accent-indigo-600"
                                />
                                Private
                            </label>
                        </div>
                    </div>

                    {/* Event Color/Theme Picker */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Event Color/Theme</label>
                        <div className="flex gap-3 mt-2">
                            {[
                                { name: "indigo", color: "bg-indigo-500" },
                                { name: "purple", color: "bg-purple-500" },
                                { name: "blue", color: "bg-blue-500" },
                                { name: "green", color: "bg-green-500" },
                                { name: "orange", color: "bg-orange-500" },
                                { name: "pink", color: "bg-pink-500" },
                                { name: "gray", color: "bg-gray-500" },
                            ].map((swatch) => (
                                <button
                                    key={swatch.name}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, color: swatch.name }))}
                                    className={`w-8 h-8 rounded-full border-2 transition-all duration-150 focus:outline-none ${swatch.color} ${formData.color === swatch.name ? 'ring-2 ring-indigo-400 border-white scale-110' : 'border-gray-300 opacity-80 hover:opacity-100'}`}
                                    aria-label={swatch.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Event Image/Banner Upload */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Event Image/Banner</label>
                        <div className="flex flex-col gap-2">
                            {imagePreview && (
                                <div className="relative w-full max-w-xs">
                                    <img src={imagePreview} alt="Event Banner Preview" className="rounded-xl w-full object-cover h-40 border border-gray-200 shadow" />
                                    <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-white">✕</button>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Recurring Event Option */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Recurring Event</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="isRecurring"
                                name="isRecurring"
                                checked={formData.isRecurring}
                                onChange={handleInputChange}
                                className="accent-indigo-600 w-5 h-5"
                            />
                            <label htmlFor="isRecurring" className={`cursor-pointer ${isDark ? 'text-white' : 'text-gray-700'}`}>This event repeats</label>
                            {formData.isRecurring && (
                                <select
                                    id="recurrence"
                                    name="recurrence"
                                    value={formData.recurrence}
                                    onChange={handleInputChange}
                                    className={`ml-4 rounded-md border p-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-100' : 'bg-white border-gray-300 text-gray-700'}`}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="custom">Custom</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Event Timezone Dropdown */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="timezone">
                            Event Timezone
                        </label>
                        <select
                            id="timezone"
                            name="timezone"
                            value={formData.timezone}
                            onChange={handleInputChange}
                            className={`w-full rounded-md border p-2 ${isDark ? 'bg-white/5 border-white/10 text-gray-100' : 'bg-white border-gray-300 text-gray-700'}`}
                        >
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                            <option value="IST">IST (India Standard Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                            <option value="CST">CST (Central Standard Time)</option>
                            <option value="MST">MST (Mountain Standard Time)</option>
                            <option value="CET">CET (Central European Time)</option>
                            <option value="EET">EET (Eastern European Time)</option>
                            <option value="JST">JST (Japan Standard Time)</option>
                            <option value="AEST">AEST (Australian Eastern Standard Time)</option>
                        </select>
                    </div>

                    {/* Online/Virtual Event Option */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Online/Virtual Event</label>
                        <div className="flex items-center gap-3 mt-2">
                            <input
                                type="checkbox"
                                id="isOnline"
                                name="isOnline"
                                checked={formData.isOnline}
                                onChange={handleInputChange}
                                className="accent-indigo-600 w-5 h-5"
                            />
                            <label htmlFor="isOnline" className={`cursor-pointer ${isDark ? 'text-white' : 'text-gray-700'}`}>This is an online/virtual event</label>
                        </div>
                        {formData.isOnline && (
                            <div className="mt-2">
                                <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`} htmlFor="onlineLink">
                                    Virtual Event Link
                                </label>
                                <Input
                                    type="url"
                                    id="onlineLink"
                                    name="onlineLink"
                                    onChange={handleInputChange}
                                    value={formData.onlineLink}
                                    placeholder="https://zoom.us/..., https://meet.google.com/..."
                                    required={formData.isOnline}
                                />
                            </div>
                        )}
                    </div>

                    {/* Custom RSVP Questions */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Custom RSVP Questions</label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                type="text"
                                value={newQuestion}
                                onChange={e => setNewQuestion(e.target.value)}
                                placeholder="e.g. Meal preference, T-shirt size"
                            />
                            <Button type="button" onClick={handleAddQuestion} disabled={!newQuestion.trim()}>
                                Add Question
                            </Button>
                        </div>
                        {questions.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {questions.map((q, i) => (
                                    <li key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-md px-3 py-2">
                                        <span className="flex-1 text-gray-800 dark:text-gray-100">{q}</span>
                                        <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveQuestion(q)}>
                                            <X className="size-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Event Capacity & Waitlist */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Maximum Attendees</label>
                        <div className="flex gap-2 items-center mt-2">
                            <Input
                                type="number"
                                min="1"
                                id="capacity"
                                name="capacity"
                                onChange={handleInputChange}
                                value={formData.capacity}
                                placeholder="Leave blank for unlimited"
                                className="w-32"
                            />
                            <label className={`flex items-center gap-2 cursor-pointer ml-4 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                                <input
                                    type="checkbox"
                                    id="waitlist"
                                    name="waitlist"
                                    checked={formData.waitlist}
                                    onChange={handleInputChange}
                                    className="accent-indigo-600 w-5 h-5"
                                />
                                Enable Waitlist
                            </label>
                        </div>
                        {formData.waitlist && (
                            <p className="text-xs text-indigo-600 mt-1">If the event is full, new signups will be added to a waitlist.</p>
                        )}
                    </div>

                    {/* Co-hosts/Collaborators */}
                    <div>
                        <label className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>Co-hosts / Collaborators</label>
                        <div className="flex gap-2 mt-2">
                            <Input
                                type="email"
                                value={cohostEmail}
                                onChange={e => setCohostEmail(e.target.value)}
                                placeholder="Add co-host by email"
                            />
                            <Button type="button" onClick={handleAddCohost} disabled={!cohostEmail.trim()}>
                                Add Co-host
                            </Button>
                        </div>
                        {cohosts.length > 0 && (
                            <ul className="mt-3 space-y-2">
                                {cohosts.map((email, i) => (
                                    <li key={i} className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-md px-3 py-2">
                                        <span className="flex-1 text-gray-800 dark:text-gray-100">{email}</span>
                                        <Button type="button" size="icon" variant="destructive" onClick={() => handleRemoveCohost(email)}>
                                            <X className="size-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex gap-4 justify-end mt-4">
                        <Button type="button" variant="outline" onClick={handleCancel} className="font-semibold">
                            Cancel
                        </Button>
                        <Button type="submit" className="font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white">
                            {isEditing ? "Update Event" : "Create Event"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 