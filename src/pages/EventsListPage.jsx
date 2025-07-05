import { useState, useMemo } from "react";
import EventCard from "../components/EventCard.jsx";
import { useEventContext } from "../context/useEventContext.js";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import {
    Calendar,
    Search,
    Filter,
    Grid3X3,
    List,
    CalendarDays,
    SortAsc,
    Download,
    Share2,
    Plus,
    Users,
    Clock,
    MapPin,
    Eye,
    EyeOff,
    Trash2,
    CheckSquare,
    Square,
    ChevronLeft,
    ChevronRight,
    FileText,
    FileDown,
    Settings
} from "lucide-react";

export default function EventsListPage() {
    const { state, deleteEvent } = useEventContext();
    const { events } = state;

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("all");
    const [selectedPrivacy, setSelectedPrivacy] = useState("all");
    const [showPastEvents, setShowPastEvents] = useState(false);

    // Sort states
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("asc");

    // View mode state
    const [viewMode, setViewMode] = useState("grid");

    // Bulk selection states
    const [selectedEvents, setSelectedEvents] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // Export states
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [exportFormat, setExportFormat] = useState("csv");
    const [exportFields, setExportFields] = useState(["title", "date", "time", "location", "type", "attendees"]);

    // Event types for filter
    const eventTypes = ["Conference", "Meetup", "Party", "Workshop", "Webinar", "Birthday", "Wedding", "Other"];

    // Export field options
    const availableExportFields = [
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        { key: "location", label: "Location" },
        { key: "venue", label: "Venue" },
        { key: "type", label: "Type" },
        { key: "privacy", label: "Privacy" },
        { key: "attendees", label: "Attendees" },
        { key: "capacity", label: "Capacity" },
        { key: "isOnline", label: "Online Event" },
        { key: "isRecurring", label: "Recurring" },
        { key: "timezone", label: "Timezone" }
    ];

    // Calculate statistics
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = events.filter(e => new Date(e.date) >= today).length;
        const past = events.filter(e => new Date(e.date) < today).length;
        const totalAttendees = events.reduce((sum, e) => sum + (e.attendees?.length || 0), 0);

        return {
            total: events.length,
            upcoming,
            past,
            totalAttendees
        };
    }, [events]);

    // Filter and sort events
    const filteredAndSortedEvents = useMemo(() => {
        // First filter events
        let filtered = events.filter(event => {
            // Search filter
            const matchesSearch = !searchTerm.trim() ||
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase());

            // Type filter
            const matchesType = selectedType === "all" || event.type === selectedType;

            // Privacy filter
            const matchesPrivacy = selectedPrivacy === "all" || event.privacy === selectedPrivacy;

            // Past events filter
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = eventDate < today;
            const showEvent = showPastEvents ? true : !isPast;

            return matchesSearch && matchesType && matchesPrivacy && showEvent;
        });

        // Then sort events
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "date":
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
                    break;
                case "title":
                    aValue = a.title.toLowerCase();
                    bValue = b.title.toLowerCase();
                    break;
                case "attendees":
                    aValue = a.attendees?.length || 0;
                    bValue = b.attendees?.length || 0;
                    break;
                case "created":
                    aValue = new Date(a.createdAt || 0);
                    bValue = new Date(b.createdAt || 0);
                    break;
                default:
                    aValue = new Date(a.date);
                    bValue = new Date(b.date);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [events, searchTerm, selectedType, selectedPrivacy, showPastEvents, sortBy, sortOrder]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedEvents = filteredAndSortedEvents.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedType, selectedPrivacy, showPastEvents, sortBy, sortOrder]);

    // Bulk action handlers
    const handleSelectEvent = (eventId) => {
        setSelectedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const handleSelectAll = () => {
        if (selectedEvents.length === filteredAndSortedEvents.length) {
            setSelectedEvents([]);
        } else {
            setSelectedEvents(filteredAndSortedEvents.map(e => e.id));
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedEvents.length} selected events?`)) {
            selectedEvents.forEach(id => deleteEvent(id));
            setSelectedEvents([]);
        }
    };

    const handleBulkShare = () => {
        const shareUrls = selectedEvents.map(id => `${window.location.origin}/event/${id}`).join('\n');
        navigator.clipboard.writeText(shareUrls).then(() => {
            alert(`${selectedEvents.length} event links copied to clipboard!`);
        });
    };

    // Advanced export functions
    const handleBulkExport = () => {
        const selectedEventData = filteredAndSortedEvents.filter(e => selectedEvents.includes(e.id));
        exportEvents(selectedEventData, `selected-events-${new Date().toISOString().split('T')[0]}`);
    };

    const handleExportAll = () => {
        exportEvents(filteredAndSortedEvents, `all-events-${new Date().toISOString().split('T')[0]}`);
    };

    const exportEvents = (eventData, filename) => {
        switch (exportFormat) {
            case "csv":
                exportToCSV(eventData, filename);
                break;
            case "json":
                exportToJSON(eventData, filename);
                break;
            case "txt":
                exportToTXT(eventData, filename);
                break;
            default:
                exportToCSV(eventData, filename);
        }
    };

    const exportToCSV = (eventData, filename) => {
        const headers = exportFields.map(field => availableExportFields.find(f => f.key === field)?.label || field);
        const csvContent = [
            headers,
            ...eventData.map(e => exportFields.map(field => {
                let value = e[field];
                if (field === "time") value = `${e.startTime} - ${e.endTime}`;
                if (field === "attendees") value = e.attendees?.length || 0;
                if (field === "isOnline") value = e.isOnline ? "Yes" : "No";
                if (field === "isRecurring") value = e.isRecurring ? "Yes" : "No";
                return `"${value || ''}"`;
            }))
        ].map(row => row.join(',')).join('\n');

        downloadFile(csvContent, `${filename}.csv`, 'text/csv');
    };

    const exportToJSON = (eventData, filename) => {
        const jsonContent = JSON.stringify(eventData.map(e => {
            const exportData = {};
            exportFields.forEach(field => {
                let value = e[field];
                if (field === "time") value = `${e.startTime} - ${e.endTime}`;
                if (field === "attendees") value = e.attendees?.length || 0;
                exportData[field] = value;
            });
            return exportData;
        }), null, 2);

        downloadFile(jsonContent, `${filename}.json`, 'application/json');
    };

    const exportToTXT = (eventData, filename) => {
        const txtContent = eventData.map(e => {
            const lines = [];
            exportFields.forEach(field => {
                let value = e[field];
                if (field === "time") value = `${e.startTime} - ${e.endTime}`;
                if (field === "attendees") value = e.attendees?.length || 0;
                if (field === "isOnline") value = e.isOnline ? "Yes" : "No";
                if (field === "isRecurring") value = e.isRecurring ? "Yes" : "No";
                const label = availableExportFields.find(f => f.key === field)?.label || field;
                lines.push(`${label}: ${value || ''}`);
            });
            return lines.join('\n') + '\n' + '-'.repeat(50);
        }).join('\n\n');

        downloadFile(txtContent, `${filename}.txt`, 'text/plain');
    };

    const downloadFile = (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const toggleExportField = (field) => {
        setExportFields(prev =>
            prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg leading-tight mb-4">
                        Your Events
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                        Manage and organize all your events in one place
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Events</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">{stats.upcoming}</div>
                            <div className="text-sm text-gray-600">Upcoming</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-gray-600 mb-1">{stats.past}</div>
                            <div className="text-sm text-gray-600">Past Events</div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalAttendees}</div>
                            <div className="text-sm text-gray-600">Total Attendees</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                                <Input
                                    type="text"
                                    placeholder="Search events by title, description, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                                >
                                    <option value="all">All Types</option>
                                    {eventTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedPrivacy}
                                    onChange={(e) => setSelectedPrivacy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                                >
                                    <option value="all">All Privacy</option>
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>

                                <Button
                                    variant="outline"
                                    onClick={() => setShowPastEvents(!showPastEvents)}
                                    className="flex items-center gap-2"
                                >
                                    {showPastEvents ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    {showPastEvents ? "Hide Past" : "Show Past"}
                                </Button>
                            </div>
                        </div>

                        {/* Sort and View Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <SortAsc className="size-4 text-gray-600" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700"
                                >
                                    <option value="date">Sort by Date</option>
                                    <option value="title">Sort by Title</option>
                                    <option value="attendees">Sort by Attendees</option>
                                    <option value="created">Sort by Created</option>
                                </select>
                                <Button
                                    variant="outline"
                                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                    className="px-3"
                                >
                                    {sortOrder === "asc" ? "↑" : "↓"}
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    onClick={() => setViewMode("grid")}
                                    size="sm"
                                >
                                    <Grid3X3 className="size-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    onClick={() => setViewMode("list")}
                                    size="sm"
                                >
                                    <List className="size-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "calendar" ? "default" : "outline"}
                                    onClick={() => setViewMode("calendar")}
                                    size="sm"
                                >
                                    <CalendarDays className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions Bar */}
                {selectedEvents.length > 0 && (
                    <Card className="bg-yellow-50 border-yellow-200 mb-6">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-yellow-800 font-semibold">
                                        {selectedEvents.length} event(s) selected
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                                    >
                                        {selectedEvents.length === filteredAndSortedEvents.length ? "Deselect All" : "Select All"}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleBulkShare}>
                                        <Share2 className="size-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleBulkExport}>
                                        <Download className="size-4 mr-2" />
                                        Export
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                        <Trash2 className="size-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Export Options Modal */}
                {showExportOptions && (
                    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Export Options</h3>
                                <Button variant="outline" size="sm" onClick={() => setShowExportOptions(false)}>
                                    ✕
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Export Format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                                    <div className="space-y-2">
                                        {["csv", "json", "txt"].map(format => (
                                            <label key={format} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={format}
                                                    checked={exportFormat === format}
                                                    onChange={(e) => setExportFormat(e.target.value)}
                                                    className="accent-indigo-600"
                                                />
                                                <span className="text-sm text-gray-700 uppercase">{format}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Export Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Export Fields</label>
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {availableExportFields.map(field => (
                                            <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={exportFields.includes(field.key)}
                                                    onChange={() => toggleExportField(field.key)}
                                                    className="accent-indigo-600"
                                                />
                                                <span className="text-sm text-gray-700">{field.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <Button onClick={handleExportAll} className="flex-1">
                                    <FileDown className="size-4 mr-2" />
                                    Export All Events
                                </Button>
                                <Button variant="outline" onClick={() => setShowExportOptions(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Export All Button */}
                {!showExportOptions && (
                    <div className="flex justify-end mb-6">
                        <Button variant="outline" onClick={() => setShowExportOptions(true)}>
                            <Settings className="size-4 mr-2" />
                            Export Options
                        </Button>
                    </div>
                )}

                {/* Events Display */}
                {filteredAndSortedEvents.length === 0 ? (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Calendar className="size-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {searchTerm || selectedType !== "all" || selectedPrivacy !== "all"
                                    ? "No events match your filters"
                                    : "No events created yet"}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || selectedType !== "all" || selectedPrivacy !== "all"
                                    ? "Try adjusting your search or filters"
                                    : "Create your first event to get started"}
                            </p>
                            <Button asChild>
                                <Link to="/create">
                                    <Plus className="size-4 mr-2" />
                                    Create Event
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className={`grid gap-6 ${viewMode === "grid"
                            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                            }`}>
                            {paginatedEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    viewMode={viewMode}
                                    isSelected={selectedEvents.includes(event.id)}
                                    onSelect={handleSelectEvent}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">
                                        Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedEvents.length)} of {filteredAndSortedEvents.length} events
                                    </span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                    >
                                        <option value={6}>6 per page</option>
                                        <option value={9}>9 per page</option>
                                        <option value={12}>12 per page</option>
                                        <option value={24}>24 per page</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="size-4" />
                                        Previous
                                    </Button>

                                    <div className="flex gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Results Summary */}
                {filteredAndSortedEvents.length > 0 && (
                    <div className="text-center mt-8 text-gray-600">
                        Showing {filteredAndSortedEvents.length} of {events.length} events
                        {(searchTerm || selectedType !== "all" || selectedPrivacy !== "all") && " (filtered)"}
                        {` • Sorted by ${sortBy} (${sortOrder === "asc" ? "ascending" : "descending"})`}
                        {` • ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view`}
                        {selectedEvents.length > 0 && ` • ${selectedEvents.length} selected`}
                        {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
                    </div>
                )}
            </div>
        </div>
    );
} 