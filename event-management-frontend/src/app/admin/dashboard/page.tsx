"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User } from "@/types/auth";

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  creatorId: number;
  creatorName: string;
  registrationCount: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data to check if admin
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");

      if (token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(response.data);

          // Redirect non-admin users
          if (!response.data.isAdmin) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          Cookies.remove("token");
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch all events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Fetch all events
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events?size=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents(response.data.content || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchEvents();
    }
  }, [user, router]);

  const handleDeleteEvent = async (eventId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    const token = Cookies.get("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the deleted event from the list
      setEvents(events.filter((event) => event.id !== eventId));
      setDeleteSuccess("Event deleted successfully.");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setDeleteSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");

      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // If user is not an admin and is being redirected
  if (user && !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-teal-400 font-bold mb-4">
            Access Denied
          </h1>
          <p className="text-white mb-6">
            Only administrators can access this page.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-8">
            <motion.h1
              className="text-3xl font-bold text-white"
              variants={itemVariants}
            >
              Admin Dashboard
            </motion.h1>

            <motion.div variants={itemVariants}>
              <Link
                href="/events/create"
                className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              >
                Create New Event
              </Link>
            </motion.div>
          </div>

          {error && (
            <motion.div
              className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6"
              variants={itemVariants}
            >
              {error}
            </motion.div>
          )}

          {deleteSuccess && (
            <motion.div
              className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-6"
              variants={itemVariants}
            >
              {deleteSuccess}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-10 w-10 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No events found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 text-left">
                    <th className="px-6 py-3 text-gray-300 font-semibold rounded-tl-lg">
                      Title
                    </th>
                    <th className="px-6 py-3 text-gray-300 font-semibold">
                      Location
                    </th>
                    <th className="px-6 py-3 text-gray-300 font-semibold">
                      Start Time
                    </th>
                    <th className="px-6 py-3 text-gray-300 font-semibold">
                      End Time
                    </th>
                    <th className="px-6 py-3 text-gray-300 font-semibold text-center">
                      Attendees
                    </th>
                    <th className="px-6 py-3 text-gray-300 font-semibold rounded-tr-lg text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <motion.tr
                      key={event.id}
                      variants={itemVariants}
                      className={`border-t border-gray-700 ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      } hover:bg-gray-700 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <Link
                            href={`/events/${event.id}`}
                            className="font-medium text-white hover:text-teal-400 transition-colors duration-150"
                          >
                            {event.title}
                          </Link>
                          <span className="text-sm text-gray-400 mt-1 line-clamp-1">
                            {event.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(event.startTime)}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {formatDate(event.endTime)}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-center">
                        {event.registrationCount}/{event.maxAttendees}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-3">
                          <Link
                            href={`/admin/events/edit/${event.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
