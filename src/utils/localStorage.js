const STORAGE_KEY = "planner_events_1";

function loadEvents() {
    const eventsJSON = localStorage.getItem(STORAGE_KEY);
    return eventsJSON ? JSON.parse(eventsJSON) : [];
}

export function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function getInitialState() {
    return {
        events: loadEvents(),
    };
} 