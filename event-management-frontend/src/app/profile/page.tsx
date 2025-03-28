"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

// TypeScript interface for User
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

// Additional TypeScript interfaces
interface UserEvent {
  id: number;
  title: string;
  startTime: string;
  endTime: string | null;
  location: string;
  registrationCount: number;
  maxAttendees: number;
}

interface UserTicket {
  id: number;
  event: {
    id: number;
    title: string;
    startTime: string;
    location: string;
  };
  registrationDate: string;
  status: "CONFIRMED" | "PENDING" | "CANCELLED";
}

// API response types
interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "events" | "tickets">(
    "profile"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");

        if (!token) {
          router.push("/login");
          return;
        }

        // Get current user profile from API
        const response = await axios.get<User>(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile. Please try again later.");
        setIsLoading(false);

        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "status" in err.response &&
          err.response.status === 401
        ) {
          Cookies.remove("token");
          router.push("/login");
        }
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch user events
  useEffect(() => {
    if (activeTab === "events" && user) {
      const fetchUserEvents = async () => {
        setEventsLoading(true);
        try {
          const token = Cookies.get("token");

          if (!token) {
            router.push("/login");
            return;
          }

          const response = await axios.get<PagedResponse<UserEvent>>(
            `${process.env.NEXT_PUBLIC_API_URL}/events/creator/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserEvents(response.data.content || []);
        } catch (err) {
          console.error("Error fetching user events:", err);
        } finally {
          setEventsLoading(false);
        }
      };

      fetchUserEvents();
    }
  }, [activeTab, user, router]);

  // Fetch user tickets
  useEffect(() => {
    if (activeTab === "tickets" && user) {
      const fetchUserTickets = async () => {
        setTicketsLoading(true);
        try {
          const token = Cookies.get("token");

          if (!token) {
            router.push("/login");
            return;
          }

          const response = await axios.get<PagedResponse<UserTicket>>(
            `${process.env.NEXT_PUBLIC_API_URL}/registrations/user/${user.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUserTickets(response.data.content || []);
        } catch (err) {
          console.error("Error fetching user tickets:", err);
        } finally {
          setTicketsLoading(false);
        }
      };

      fetchUserTickets();
    }
  }, [activeTab, user, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
      },
    }),
  };

  const tabVariants = {
    inactive: {
      color: "rgb(156, 163, 175)",
      borderColor: "transparent",
      scale: 1,
    },
    active: {
      color: "rgb(20, 184, 166)",
      borderColor: "rgb(20, 184, 166)",
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
  };

  // Mock file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full border-t-4 border-teal-400 border-opacity-50 border-r-4 border-r-teal-400 animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl text-gray-300">Loading profile...</h3>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-md px-4"
        >
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-red-500 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl text-gray-100 font-bold mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <motion.section
          className="relative mb-20 rounded-2xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="absolute inset-0">
                <pattern
                  id="pattern-circles"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                  patternContentUnits="userSpaceOnUse"
                >
                  <circle
                    id="pattern-circle"
                    cx="20"
                    cy="20"
                    r="3.5"
                    fill="none"
                    stroke="#16A085"
                    strokeWidth="1"
                  ></circle>
                </pattern>
                <rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="url(#pattern-circles)"
                ></rect>
              </svg>
            </div>

            <div className="p-8 md:p-12 lg:p-16 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <motion.div
                    className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-blue-500 shadow-xl"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(45, 212, 191, 0.5)",
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        className="text-5xl font-bold text-white"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          damping: 10,
                          stiffness: 100,
                          delay: 0.5,
                        }}
                      >
                        {user?.name.charAt(0).toUpperCase()}
                      </motion.span>
                    </div>

                    {/* Upload photo overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center transition-all duration-300"
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                    >
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer w-full h-full flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </motion.div>
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                    </motion.div>

                    {/* Loading overlay for upload */}
                    {isUploading && (
                      <motion.div
                        className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <div>
                  <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                    {user?.name.split("").map((letter, i) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={letterVariants}
                        initial="hidden"
                        animate="visible"
                        className="inline-block"
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.h1>
                  <motion.p
                    className="text-gray-300 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {user?.email}
                  </motion.p>
                  <motion.p
                    className="text-gray-400 mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Member since{" "}
                    {new Date(user?.createdAt || "").toLocaleDateString()}
                  </motion.p>
                </div>
              </div>
            </div>

            {/* Abstract shapes */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 lg:mt-0 lg:mr-0 lg:right-0 opacity-30">
              <svg
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
                className="transform rotate-45 opacity-30"
              >
                <defs>
                  <pattern
                    id="de316486-4a29-4312-bdfc-fbce2132a2c1"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-teal-500"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="384"
                  fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)"
                />
              </svg>
            </div>
          </div>
        </motion.section>

        {/* Profile Tabs */}
        <motion.section className="mb-10" variants={itemVariants}>
          <div className="border-b border-gray-700">
            <div className="flex space-x-8">
              {[
                { id: "profile", label: "Profile" },
                { id: "events", label: "My Events" },
                { id: "tickets", label: "My Tickets" },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variants={tabVariants}
                  initial="inactive"
                  animate={activeTab === tab.id ? "active" : "inactive"}
                  whileHover="hover"
                  className={`py-4 px-1 font-medium text-lg border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-teal-500 text-teal-500"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Profile Content */}
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.section
              key="profile-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Full Name
                      </label>
                      <div className="bg-gray-700 rounded-lg p-3 text-white">
                        {user?.name}
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-1">
                        Email Address
                      </label>
                      <div className="bg-gray-700 rounded-lg p-3 text-white">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Account Settings
                  </h2>
                  <div className="space-y-4">
                    <motion.button
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Change Password
                    </motion.button>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-1">
                        0
                      </div>
                      <div className="text-gray-400">Events Created</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-teal-400 mb-1">
                        0
                      </div>
                      <div className="text-gray-400">Events Attended</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          )}

          {activeTab === "events" && (
            <motion.section
              key="events-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">My Events</h2>
                <Link href="/events/create">
                  <motion.button
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Event
                  </motion.button>
                </Link>
              </div>

              {eventsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-t-4 border-teal-400 border-opacity-50 border-r-4 border-r-teal-400 animate-spin"></div>
                </div>
              ) : userEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userEvents.map((event) => (
                    <motion.div
                      key={event.id}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <div className="h-40 bg-gradient-to-r from-teal-500 to-blue-500 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">
                            Event Image
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-white mb-2 truncate">
                          {event.title}
                        </h3>
                        <div className="text-gray-400 mb-3">
                          <div className="flex items-center mb-1">
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {new Date(event.startTime).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                              <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-500 bg-teal-200 bg-opacity-10">
                                  Attendance
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-gray-400">
                                  {event.registrationCount}/{event.maxAttendees}
                                </span>
                              </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                              <motion.div
                                style={{
                                  width: `${
                                    (event.registrationCount /
                                      event.maxAttendees) *
                                    100
                                  }%`,
                                }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${
                                    (event.registrationCount /
                                      event.maxAttendees) *
                                    100
                                  }%`,
                                }}
                                transition={{ duration: 1, ease: "easeOut" }}
                              ></motion.div>
                            </div>
                          </div>
                        </div>

                        <Link href={`/events/${event.id}`}>
                          <motion.button
                            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg w-full transition-colors duration-200"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                          >
                            View Details
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Events Found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You haven't created any events yet.
                  </p>
                  <Link href="/events/create">
                    <motion.button
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Create Your First Event
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.section>
          )}

          {activeTab === "tickets" && (
            <motion.section
              key="tickets-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">My Tickets</h2>

              {ticketsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-t-4 border-teal-400 border-opacity-50 border-r-4 border-r-teal-400 animate-spin"></div>
                </div>
              ) : userTickets.length > 0 ? (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
                      whileHover={{
                        y: -3,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      }}
                    >
                      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {ticket.event.title}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-gray-400">
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {new Date(
                                  ticket.event.startTime
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>{ticket.event.location}</span>
                            </div>
                            <div className="flex items-center">
                              <svg
                                className="h-4 w-4 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                />
                              </svg>
                              <span>
                                Registered on{" "}
                                {new Date(
                                  ticket.registrationDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div
                            className={`px-4 py-1 rounded-full text-xs font-bold ${
                              ticket.status === "CONFIRMED"
                                ? "bg-green-900 text-green-300"
                                : ticket.status === "PENDING"
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-red-900 text-red-300"
                            }`}
                          >
                            {ticket.status}
                          </div>
                          <Link href={`/events/${ticket.event.id}`}>
                            <motion.button
                              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              View Event
                            </motion.button>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Tickets Found
                  </h3>
                  <p className="text-gray-400 mb-6">
                    You haven't registered for any events yet.
                  </p>
                  <Link href="/events">
                    <motion.button
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Events
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </motion.div>
  );
}
