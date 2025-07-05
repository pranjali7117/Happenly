import { useReducer } from "react";
import { eventReducer } from "../reducers/eventReducer.js";
import { getInitialState } from "../utils/localStorage.js";
import { EventContext } from "./useEventContext.js";

export function EventProvider({ children }) {
    const [state, dispatch] = useReducer(eventReducer, getInitialState());

    function addEvent(eventData) {
        const newEvent = {
            ...eventData,
            id: crypto.randomUUID(),
        };

        dispatch({ type: "ADD_EVENT", payload: newEvent });
    }

    function addAttendee(eventId, email) {
        const attendee = {
            email,
            status: "Yes",
        };

        dispatch({
            type: "ADD_ATTENDEE",
            payload: { eventId, attendee },
        });
    }

    function deleteEvent(id) {
        dispatch({
            type: "DELETE_EVENT",
            payload: id,
        });
    }

    function updateEvent(event) {
        dispatch({ type: "UPDATE_EVENT", payload: event });
    }

    function updateAttendeeStatus(eventId, email, status) {
        dispatch({
            type: "UPDATE_ATTENDEE_STATUS",
            payload: { eventId, email, status },
        });
    }

    const value = {
        state,
        dispatch,
        addEvent,
        addAttendee,
        deleteEvent,
        updateEvent,
        updateAttendeeStatus,
    };

    return (
        <EventContext.Provider value={value}>{children}</EventContext.Provider>
    );
} 