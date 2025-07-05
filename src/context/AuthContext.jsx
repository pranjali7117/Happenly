import { createContext, useContext, useReducer, useEffect } from "react";

const AuthContext = createContext(undefined);

// Auth reducer for state management
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                isLoading: false
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case "UPDATE_PROFILE":
            return {
                ...state,
                user: { ...state.user, ...action.payload }
            };
        case "SET_LOADING":
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
};

// Get initial auth state from localStorage
const getInitialAuthState = () => {
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            return {
                user,
                isAuthenticated: true,
                isLoading: false
            };
        } catch (error) {
            localStorage.removeItem("authUser");
        }
    }
    return {
        user: null,
        isAuthenticated: false,
        isLoading: false
    };
};

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, getInitialAuthState());

    // Save user to localStorage when authenticated
    useEffect(() => {
        if (state.user) {
            localStorage.setItem("authUser", JSON.stringify(state.user));
        } else {
            localStorage.removeItem("authUser");
        }
    }, [state.user]);

    // Register new user (calls backend)
    const register = async (userData) => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Registration failed");
            // Auto-login after registration
            // Now login to get JWT and user info
            const loginRes = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userData.email, password: userData.password })
            });
            const loginData = await loginRes.json();
            if (!loginRes.ok) throw new Error(loginData.message || "Login after registration failed");
            localStorage.setItem("authToken", loginData.token);
            localStorage.setItem("authUser", JSON.stringify(loginData.user));
            dispatch({ type: "LOGIN", payload: { user: loginData.user } });
            return { success: true, user: loginData.user };
        } catch (error) {
            dispatch({ type: "SET_LOADING", payload: false });
            throw error;
        }
    };

    // Login user (calls backend)
    const login = async (email, password) => {
        dispatch({ type: "SET_LOADING", payload: true });
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("authUser", JSON.stringify(data.user));
            dispatch({ type: "LOGIN", payload: { user: data.user } });
            return { success: true, user: data.user };
        } catch (error) {
            dispatch({ type: "SET_LOADING", payload: false });
            throw error;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        dispatch({ type: "LOGOUT" });
    };

    // Update user profile
    const updateProfile = (updates) => {
        const updatedUser = { ...state.user, ...updates };
        dispatch({ type: "UPDATE_PROFILE", payload: updates });

        // Update in localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const updatedUsers = users.map(user =>
            user.id === state.user.id ? updatedUser : user
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    // Check if user is admin
    const isAdmin = () => {
        return state.user?.role === "admin";
    };

    // Check if user owns an event
    const ownsEvent = (event) => {
        return state.user?.id === event.createdBy;
    };

    // Check if user can edit event
    const canEditEvent = (event) => {
        return isAdmin() || ownsEvent(event);
    };

    // Check if user can delete event
    const canDeleteEvent = (event) => {
        return isAdmin() || ownsEvent(event);
    };

    const value = {
        ...state,
        register,
        login,
        logout,
        updateProfile,
        isAdmin,
        ownsEvent,
        canEditEvent,
        canDeleteEvent
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
} 