import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, User, Edit, Trash2, Share2, Copy, Eye, EyeOff, Users, Tag, Globe, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useEventContext } from "../context/useEventContext.js";

export default function EventCard({ event, viewMode = "grid", isSelected = false, onSelect }) {
    const { deleteEvent, addEvent } = useEventContext();

    const {
        id,
        title,
        description,
        date,
        startTime,
        endTime,
        location,
        venue,
        attendees = [],
        type,
        privacy,
        color,
        isOnline,
        onlineLink,
        capacity,
        image,
        isRecurring,
        timezone,
        cohosts = []
    } = event;

    const confirmedAttendees = attendees.filter(
        (attendee) => attendee.status === "Yes"
    ).length;

    // Event status
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = eventDate < today;
    const isToday = eventDate.getTime() === today.getTime();

    // Color mapping
    const colorClasses = {
        indigo: "bg-indigo-500",
        purple: "bg-purple-500",
        blue: "bg-blue-500",
        green: "bg-green-500",
        orange: "bg-orange-500",
        pink: "bg-pink-500",
        gray: "bg-gray-500"
    };

    const handleSelect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.(id);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            deleteEvent(id);
        }
    };

    const handleDuplicate = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Create a duplicate event with modified title
        const duplicateEvent = {
            ...event,
            title: `${event.title} (Copy)`,
            createdAt: new Date().toISOString()
        };

        // Remove the id from the duplicate to let the context generate a new one
        const { id, ...eventData } = duplicateEvent;

        // Add the duplicate event using the context
        addEvent(eventData);

        // Show success message
        alert(`Event "${event.title}" has been duplicated successfully!`);
    };

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Create shareable link
        const shareUrl = `${window.location.origin}/event/${id}`;

        if (navigator.share) {
            navigator.share({
                title: title,
                text: description,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Event link copied to clipboard!");
            });
        }
    };

    if (viewMode === "list") {
        return (
            <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        {/* Selection Checkbox */}
                        {onSelect && (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={handleSelect}
                                className="w-5 h-5 accent-indigo-600"
                            />
                        )}

                        {/* Event Image */}
                        {image && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={image} alt={title} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Event Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold text-gray-900 truncate">{title}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color] || 'bg-gray-500'} text-white`}>
                                            {type}
                                        </span>
                                        {privacy === 'private' ? (
                                            <Lock className="size-4 text-gray-500" />
                                        ) : (
                                            <Globe className="size-4 text-gray-500" />
                                        )}
                                        {isOnline && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Online</span>}
                                        {isRecurring && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Recurring</span>}
                                    </div>
                                    <p className="text-gray-600 line-clamp-2 mb-2">{description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Calendar className="size-4" />
                                    <span>{new Date(date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="size-4" />
                                    <span>{startTime} - {endTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <MapPin className="size-4" />
                                    <span className="truncate">{venue || location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="size-4" />
                                    <span>{confirmedAttendees}/{capacity || '∞'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/events/${id}`}>View</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link to={`/events/edit/${id}`}>Edit</Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDuplicate}>
                                <Copy className="size-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="size-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDelete}>
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Grid view (default)
    return (
        <Card className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
            <CardContent className="p-6">
                {/* Selection Checkbox */}
                {onSelect && (
                    <div className="flex justify-end mb-2">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={handleSelect}
                            className="w-5 h-5 accent-indigo-600"
                        />
                    </div>
                )}

                {/* Event Image */}
                {image && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
                        <img src={image} alt={title} className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Event Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color] || 'bg-gray-500'} text-white`}>
                                {type}
                            </span>
                            {privacy === 'private' ? (
                                <Lock className="size-3 text-gray-500" />
                            ) : (
                                <Globe className="size-3 text-gray-500" />
                            )}
                            {isOnline && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Online</span>}
                            {isRecurring && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">Recurring</span>}
                        </div>
                    </div>
                </div>

                {/* Event Description */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="size-4" />
                        <span>{new Date(date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="size-4" />
                        <span>{startTime} - {endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="size-4" />
                        <span className="truncate">{venue || location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="size-4" />
                        <span>{confirmedAttendees}/{capacity || '∞'} attendees</span>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link to={`/events/${id}`}>View</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <Link to={`/events/edit/${id}`}>
                            <Edit className="size-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDuplicate}>
                        <Copy className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDelete}>
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}