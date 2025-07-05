import { createContext, useContext } from "react";

export const EventContext = createContext(undefined);

export function useEventContext() {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error("useEventContext must be within an EventProvider");
    }
    return context;
} 