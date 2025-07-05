import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import EventCreatePage from "./pages/EventCreatePage.jsx";
import EventDetailsPage from "./pages/EventDetailsPage.jsx";
import EventEditPage from "./pages/EventEditPage.jsx";
import EventsListPage from "./pages/EventsListPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { EventProvider } from "./context/EventContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import AddReview from "./pages/AddReview.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

const routes = [
    {
        path: "/",
        element: <LandingPage />,
        errorElement: <NotFoundPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/add-review",
        element: <AddReview />,
    },
    {
        path: "/events",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <EventsListPage />,
            },
            {
                path: "create",
                element: <EventCreatePage />,
            },
            {
                path: ":id",
                element: <EventDetailsPage />,
            },
            {
                path: "edit/:id",
                element: <EventEditPage />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export default function App() {
    return (
        <AuthProvider>
            <EventProvider>
                <RouterProvider router={router} />
            </EventProvider>
        </AuthProvider>
    );
} 