import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const LandingPage = () => {
    const [isDark, setIsDark] = useState(false);
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Event Coordinator",
            company: "TechCorp",
            content: "This event planner has transformed how we organize our corporate events. The interface is intuitive and the features are exactly what we needed.",
            rating: 5
        },
        {
            id: 2,
            name: "Mike Chen",
            role: "Wedding Planner",
            company: "Elegant Events",
            content: "I've been using this for all my wedding planning needs. The ability to manage multiple events simultaneously is a game-changer.",
            rating: 5
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "Marketing Manager",
            company: "StartupXYZ",
            content: "Perfect for our startup's event management. Clean, fast, and reliable. Highly recommend for any business!",
            rating: 5
        },
        {
            id: 4,
            name: "David Kim",
            role: "Community Organizer",
            company: "Local Events",
            content: "As a community organizer, I need something simple and effective. This app delivers exactly that.",
            rating: 5
        },
        {
            id: 5,
            name: "Priya Sharma",
            role: "Freelance Event Host",
            company: "Self-Employed",
            content: "The best event planner app I've used! The design is beautiful and it saves me hours every week.",
            rating: 5
        },
        {
            id: 6,
            name: "Alex Brown",
            role: "Conference Organizer",
            company: "BigEvents Inc.",
            content: "Managing large conferences is so much easier now. The analytics and guest management are top-notch!",
            rating: 5
        },
        {
            id: 7,
            name: "Sofia Lee",
            role: "Birthday Party Planner",
            company: "PartyTime",
            content: "I love how easy it is to keep track of all my events and guests. The reminders are super helpful!",
            rating: 5
        },
        {
            id: 8,
            name: "Carlos Martinez",
            role: "Corporate Events Lead",
            company: "Enterprize",
            content: "A must-have for anyone planning events. The UI is clean and the features are exactly what I need.",
            rating: 5
        },
        {
            id: 9,
            name: "Liam Patel",
            role: "Nonprofit Event Manager",
            company: "Helping Hands",
            content: "This app makes organizing charity events a breeze. The guest management and analytics are fantastic!",
            rating: 5
        }
    ]);

    // Load reviews from localStorage on component mount
    useEffect(() => {
        const savedReviews = localStorage.getItem('eventPlannerReviews');
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
    }, []);

    // Save reviews to localStorage whenever reviews change
    useEffect(() => {
        localStorage.setItem('eventPlannerReviews', JSON.stringify(reviews));
    }, [reviews]);

    const addReview = (newReview) => {
        const review = {
            id: Date.now(),
            ...newReview,
            rating: 5
        };
        setReviews(prev => [...prev, review]);
        localStorage.setItem('reviews', JSON.stringify([...reviews, review]));
        toast.success('Review added successfully!');
    };

    const deleteReview = (reviewId) => {
        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        setReviews(updatedReviews);
        localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    };

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <div className={`min-h-screen transition-colors duration-300 relative ${isDark ? 'bg-gradient-to-b from-[#0a1020] via-[#181c2a] to-[#232a45] overflow-hidden' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'}`}>
            {/* Single grid and radial gradients overlay for the whole page in dark mode */}
            {isDark && (
                <>
                    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
                        <svg width="100%" height="100%" className="absolute inset-0 w-full h-full" style={{ opacity: 0.13 }}>
                            <defs>
                                <pattern id="grid-all" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid-all)" />
                        </svg>
                        {/* Radial gradients, match 'Built for modern teams' */}
                        <div className="absolute left-[-20%] top-[-30%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-700/60 via-purple-700/40 to-transparent blur-3xl" />
                        <div className="absolute right-[-20%] bottom-[-30%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-purple-700/60 via-indigo-700/40 to-transparent blur-3xl" />
                    </div>
                </>
            )}

            {/* Floating Theme Toggle */}
            <button
                onClick={toggleTheme}
                className={`fixed top-4 left-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${isDark
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-white text-gray-800 hover:bg-gray-50'
                    }`}
            >
                {isDark ? '☀️' : '🌙'}
            </button>

            {/* Desktop/Tablet: Top-right, Mobile: Hidden */}
            <div className="hidden sm:flex absolute top-4 right-4 z-50 flex-row gap-2 items-center">
                <Link to="/login">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        Sign In
                    </Button>
                </Link>
                <Link to="/register">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        Sign Up
                    </Button>
                </Link>
                <Link to="/events/create">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        Create Event
                    </Button>
                </Link>
                <Link to="/events">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        View Events
                    </Button>
                </Link>
            </div>

            {/* Mobile: Centered below logo/title, Tablet/Desktop: Hidden */}
            <div className="flex sm:hidden flex-col gap-2 w-full max-w-xs mx-auto mt-4">
                <Link to="/login">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        Sign In
                    </Button>
                </Link>
                <Link to="/register">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        Sign Up
                    </Button>
                </Link>
                <Link to="/events/create">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        Create Event
                    </Button>
                </Link>
                <Link to="/events">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg">
                        View Events
                    </Button>
                </Link>
            </div>

            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 z-10">
                {/* Modern icon with glow */}
                <div className="mb-6 mt-16 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 shadow-xl animate-bounce">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-white">
                            <rect x="3" y="5" width="18" height="16" rx="4" fill="currentColor" opacity="0.15" />
                            <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                            <rect x="7" y="9" width="2" height="2" rx="1" fill="currentColor" />
                            <rect x="11" y="9" width="2" height="2" rx="1" fill="currentColor" />
                            <rect x="15" y="9" width="2" height="2" rx="1" fill="currentColor" />
                        </svg>
                    </div>
                </div>
                {/* Gradient heading */}
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold text-center mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
                    EventPlanner
                </h1>
                {/* Tagline with accent */}
                <p className="text-base sm:text-lg md:text-2xl text-center mb-8 max-w-2xl mx-auto font-medium text-gray-400">
                    Plan, organize, and manage your events with ease. <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent font-semibold">Simple. Powerful. Beautiful.</span>
                </p>
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <Link to="/events/create">
                        <Button size="lg" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-bold shadow-lg rounded-xl">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link to="/events">
                        <Button size="lg" variant="outline" className="border-2 border-indigo-500 text-indigo-300 hover:bg-indigo-900/20 px-8 py-3 text-lg font-bold rounded-xl">
                            View Demo
                        </Button>
                    </Link>
                </div>

                {/* Glassy dashboard preview placeholder */}
                <div className={`w-full max-w-xs sm:max-w-xl h-24 sm:h-40 mt-8 rounded-3xl flex items-center justify-center ${isDark ? 'bg-gradient-to-br from-[#232a45]/90 via-[#181c2a]/80 to-[#232a45]/80 border border-white/10' : 'bg-gradient-to-br from-indigo-100/60 via-purple-100/50 to-white/60 border border-gray-100'} shadow-2xl backdrop-blur-md`} style={{ boxShadow: isDark ? '0 8px 32px 0 rgba(0,0,0,0.35)' : '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
                    <div className="flex w-full h-full items-center justify-center gap-4 sm:gap-8 opacity-60">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900" />
                        <div className="flex-1 h-4 sm:h-8 rounded-xl bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900" />
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 relative">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Everything you need to plan perfect events</h2>
                        <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
                            From small meetups to large conferences, we've got you covered with powerful features designed for modern event planning.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: (
                                    <span className="inline-block w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center mb-4">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <rect x="3" y="5" width="18" height="16" rx="4" fill="currentColor" opacity="0.15" />
                                            <rect x="3" y="5" width="18" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                                            <rect x="7" y="9" width="2" height="2" rx="1" fill="currentColor" />
                                        </svg>
                                    </span>
                                ),
                                title: "Smart Scheduling",
                                description: "Intelligent date and time management with conflict detection and optimization."
                            },
                            {
                                icon: (
                                    <span className="inline-block w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center mb-4">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
                                            <path d="M8 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm8 0a2 2 0 1 0-4 0 2 2 0 0 0 4 0Z" fill="currentColor" />
                                        </svg>
                                    </span>
                                ),
                                title: "Guest Management",
                                description: "Easy RSVP tracking, guest lists, and communication tools all in one place."
                            },
                            {
                                icon: (
                                    <span className="inline-block w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 flex items-center justify-center mb-4">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" opacity="0.15" />
                                            <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
                                            <rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" />
                                        </svg>
                                    </span>
                                ),
                                title: "Real-time Analytics",
                                description: "Track attendance, engagement, and success metrics with detailed insights."
                            }
                        ].map((feature, index) => (
                            <Card key={index} className={`text-center p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 rounded-2xl border-none ${isDark ? 'bg-[#10182a]/80 shadow-2xl backdrop-blur-md' : 'bg-white border-gray-200'}`}>
                                <CardContent className="p-0">
                                    {feature.icon}
                                    <h3 className={`text-xl font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
                                    <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Highlight Section */}
            <section className={`py-16 px-4 relative ${isDark ? 'overflow-hidden' : ''} ${isDark ? 'bg-[#0a1020]' : 'bg-gradient-to-r from-indigo-50/80 via-purple-50/70 to-white/80'}`}>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>Built for <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">modern teams</span></h2>
                            <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Streamline your event planning workflow with our comprehensive suite of tools designed for collaboration and efficiency.</p>
                            <div className="space-y-4">
                                {[
                                    "Real-time collaboration with team members",
                                    "Advanced calendar integration",
                                    "Automated email notifications",
                                    "Mobile-responsive design",
                                    "Export to multiple formats",
                                    "24/7 customer support"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">✓</span>
                                        </div>
                                        <span className={`${isDark ? 'text-gray-100' : 'text-gray-700'}`}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={`backdrop-blur-md rounded-3xl shadow-2xl p-8 transition-all duration-300 border ${isDark ? 'bg-[#10182a]/80 border-white/10' : 'bg-white/60 border-gray-100'}`} style={{ boxShadow: isDark ? '0 8px 32px 0 rgba(0,0,0,0.35)' : '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}>
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                <div className={`w-full h-40 sm:h-64 flex items-center justify-center rounded-2xl ${isDark ? 'bg-gradient-to-br from-[#232a45]/90 via-[#181c2a]/80 to-[#232a45]/80' : 'bg-gradient-to-br from-indigo-100/60 via-purple-100/50 to-white/60'}`} style={{ backdropFilter: 'blur(8px)' }}>
                                    <span className={`text-base sm:text-lg ${isDark ? 'text-white' : ''}`}>Dashboard Preview</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Section */}
            <section className={`py-16 px-4 relative ${isDark ? 'bg-gradient-to-b from-[#0a1020] via-[#181c2a] to-[#232a45]' : ''}`}>
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>What our users say</h2>
                        <p className={`text-xl mb-8 ${isDark ? 'text-white' : 'text-gray-700'}`}>Join thousands of satisfied event planners who trust our platform</p>

                        {/* Add Review Button */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold">
                                    Add Your Review
                                </Button>
                            </DialogTrigger>
                            <DialogContent className={`${isDark ? 'bg-[#10182a]/80 border-white/10' : 'bg-white'}`}>
                                <DialogHeader>
                                    <DialogTitle className={isDark ? 'text-white' : 'text-gray-900'}>Share Your Experience</DialogTitle>
                                </DialogHeader>
                                <AddReviewForm onAddReview={addReview} isDark={isDark} />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <Card key={review.id} className={`transition-all duration-300 rounded-3xl border relative ${isDark ? 'border-white/10 bg-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 backdrop-blur-md' : 'border-gray-200 bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1'}`}>
                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteReview(review.id)}
                                    className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-red-500 hover:text-white ${isDark ? 'text-gray-300 hover:bg-red-500' : 'text-gray-500 hover:bg-red-500'}`}
                                    title="Delete Review"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <CardContent className="p-8 flex flex-col h-full">
                                    <div className="flex items-center mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{review.name}</h4>
                                            <p className={`text-sm mb-1 ${isDark ? 'text-indigo-200/80' : 'text-gray-600'}`}>{review.role} at {review.company}</p>
                                        </div>
                                    </div>
                                    <p className={`mb-6 flex-1 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>{review.content}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 px-4 border-t ${isDark ? 'bg-transparent border-white/10' : 'bg-white border-gray-200'}`}>
                <div className="max-w-6xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                            📅
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-indigo-600">EventPlanner</h3>
                        <p className="text-gray-600 dark:text-gray-400">Making event planning simple and beautiful</p>
                    </div>

                    <div className="flex justify-center space-x-6 mb-8">
                        <Link to="/events" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                            Events
                        </Link>
                        <Link to="/events/create" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                            Create Event
                        </Link>
                    </div>

                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                        Made with ❤️ by Pranjali
                    </p>
                </div>
            </footer>
        </div>
    );
};

// Add Review Form Component
const AddReviewForm = ({ onAddReview, isDark }) => {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        company: '',
        content: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.content) {
            toast.error('Please fill in all required fields');
            return;
        }
        onAddReview(formData);
        setFormData({ name: '', role: '', company: '', content: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    Name *
                </label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
            </div>

            <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    Role
                </label>
                <Input
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Your role"
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
            </div>

            <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    Company
                </label>
                <Input
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your company"
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
            </div>

            <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                    Review *
                </label>
                <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience with EventPlanner..."
                    rows={4}
                    className={isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}
                />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Submit Review
            </Button>
        </form>
    );
};

export default LandingPage; 