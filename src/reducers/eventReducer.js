import { saveEvents } from "../utils/localStorage.js";

export function eventReducer(state, action) {
    let updatedEvents;

    switch (action.type) {
        case "ADD_EVENT":
            updatedEvents = [...state.events, action.payload];
            saveEvents(updatedEvents);

            return {
                ...state,
                events: updatedEvents,
            };

        case "ADD_ATTENDEE":
            updatedEvents = state.events.map((event) => {
                if (event.id !== action.payload.eventId) return event;

                const { attendee } = action.payload;
                const exists = event.attendees.some((a) => a.email === attendee.email);
                if (exists) return event;

                return {
                    ...event,
                    attendees: [...event.attendees, attendee],
                };
            });
            saveEvents(updatedEvents);

            return {
                ...state,
                events: updatedEvents,
            };

        case "UPDATE_EVENT":
            updatedEvents = state.events.map((event) =>
                event.id === action.payload.id ? action.payload : event
            );
            saveEvents(updatedEvents);
            return {
                ...state,
                events: updatedEvents,
            };

        case "DELETE_EVENT":
            updatedEvents = state.events.filter(
                (event) => event.id !== action.payload
            );
            saveEvents(updatedEvents);
            return {
                ...state,
                events: updatedEvents,
            };

        case "UPDATE_ATTENDEE_STATUS": {
            const { eventId, email, status } = action.payload;

            updatedEvents = state.events.map((event) =>
                event.id === eventId
                    ? {
                        ...event,
                        attendees: event.attendees.map((attendee) =>
                            attendee.email === email ? { ...attendee, status } : attendee
                        ),
                    }
                    : event
            );
            saveEvents(updatedEvents);

            return { ...state, events: updatedEvents };
        }

        default:
            return state;
    }
} 