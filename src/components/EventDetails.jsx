import { Calendar, Clock, Edit, MapPin, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../context/useEventContext.js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { toast } from "sonner";

export default function EventDetails({ event }) {
    const [newAttendee, setNewAttendee] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDuplicateError, setShowDuplicateError] = useState(false);
    const navigate = useNavigate();

    const { addAttendee, deleteEvent, updateAttendeeStatus } = useEventContext();

    const { id, title, description, date, time, location, attendees } = event;
    const confirmedAttendees = attendees.filter(
        (attendee) => attendee.status === "Yes"
    ).length;

    function handleAddAttendee() {
        const attendeeExists = attendees.some((a) => a.email === newAttendee);
        if (attendeeExists) {
            setShowDuplicateError(true);
            setTimeout(() => {
                setShowDuplicateError(false);
            }, 3000);
            toast.error("This email is already in the attendee list.");
            return;
        }
        addAttendee(event.id, newAttendee);
        setNewAttendee("");
        toast.success("Attendee added!");
    }

    function handleEventEdit() {
        navigate(`/edit/${id}`);
    }

    function handleDeleteEvent() {
        deleteEvent(id);
        navigate("/");
        toast.success("Event deleted!");
    }

    function handleChangeStatus(email, status) {
        updateAttendeeStatus(id, email, status);
        toast.success(`Status updated to ${status}`);
    }

    return (
        <>
            <Card className="max-w-3xl mx-auto">
                <CardContent className="flex flex-col gap-6 p-6">
                    <div className="flex flex-col-reverse gap-4">
                        <h2 className="text-3xl font-bold text-secondary capitalize">
                            {title}
                        </h2>
                        <div className="self-end flex gap-2">
                            <Button variant="outline" size="icon" onClick={handleEventEdit}>
                                <Edit className="size-5" />
                            </Button>
                            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="icon">
                                        <Trash2 className="size-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Delete Event</DialogTitle>
                                    </DialogHeader>
                                    <p className="text-base">Are you sure you want to delete this event? This action cannot be undone.</p>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDeleteEvent}>
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 *:flex *:gap-2 *:text-white *:text-lg">
                        <p>
                            <Calendar className="text-secondary" /> {date}
                        </p>
                        <p>
                            <Clock className="text-secondary" /> {time}
                        </p>
                        <p>
                            <MapPin className="text-secondary" /> {location}
                        </p>
                        <p>
                            <Users className="text-secondary" />
                            {confirmedAttendees === 1
                                ? "1 Confirmed Attendee"
                                : `${confirmedAttendees} Confirmed Attendees`}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl text-secondary font-bold">Description</h2>
                        <p className="text-white">{description}</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl text-secondary font-bold">Attendees</h2>
                        <div className="flex flex-col gap-4 max-w-md">
                            <Input
                                type="email"
                                value={newAttendee}
                                onChange={(e) => setNewAttendee(e.target.value)}
                                placeholder="Add attendee email"
                            />
                            <Button onClick={handleAddAttendee}>
                                Add Attendee
                            </Button>
                            {showDuplicateError && (
                                <p className="text-red-400 text-lg">
                                    This email is already in the attendee list.
                                </p>
                            )}
                        </div>
                    </div>

                    {attendees.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="border-separate border-spacing-x-6 md:border-spacing-x-12 -ml-4 md:-ml-12">
                                <thead>
                                    <tr>
                                        <th className="py-3 text-left text-white">EMAIL</th>
                                        <th className="py-3 text-left text-white">STATUS</th>
                                        <th className="py-3 text-left text-white">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendees.map((attendee, index) => (
                                        <tr key={index} className="*:py-4">
                                            <td className="text-white md:text-lg">{attendee.email}</td>
                                            <td>
                                                <span
                                                    className={`px-2 py-1 text-sm font-bold rounded-full text-white ${attendee.status === "Yes"
                                                        ? "bg-green-700"
                                                        : attendee.status === "No"
                                                            ? "bg-red-700"
                                                            : "bg-yellow-700"
                                                        }`}
                                                >
                                                    {attendee.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant={attendee.status === "Yes" ? "default" : "outline"}
                                                        onClick={() => handleChangeStatus(attendee.email, "Yes")}
                                                    >
                                                        Yes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={attendee.status === "No" ? "destructive" : "outline"}
                                                        onClick={() => handleChangeStatus(attendee.email, "No")}
                                                    >
                                                        No
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant={attendee.status === "Maybe" ? "secondary" : "outline"}
                                                        onClick={() => handleChangeStatus(attendee.email, "Maybe")}
                                                    >
                                                        Maybe
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-white italic">No Attendees Added Yet.</p>
                    )}
                </CardContent>
            </Card>
        </>
    );
} 