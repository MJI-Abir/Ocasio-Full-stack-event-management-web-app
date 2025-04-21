"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { User } from "@/types/auth";
import Link from "next/link";

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
}

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id;

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    maxAttendees: 100,
  });

  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [eventNotFound, setEventNotFound] = useState(false);
  const router = useRouter();

  // Validate dates when either startTime or endTime changes
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const startDate = new Date(formData.startTime);
      const endDate = new Date(formData.endTime);

      if (endDate < startDate) {
        setDateError("End date cannot be earlier than start date");
      } else {
        setDateError(null);
      }
    }
  }, [formData.startTime, formData.endTime]);

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
            console.log("User is not an admin, redirecting...");
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

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      const token = Cookies.get("token");

      if (!token || !eventId) {
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const event = response.data;

        // Format dates for datetime-local input (YYYY-MM-DDThh:mm format)
        const formatDateForInput = (dateString: string) => {
          const date = new Date(dateString);
          return date.toISOString().slice(0, 16);
        };

        setFormData({
          title: event.title,
          description: event.description,
          location: event.location,
          startTime: formatDateForInput(event.startTime),
          endTime: formatDateForInput(event.endTime),
          maxAttendees: event.maxAttendees,
        });

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setEventNotFound(true);
        setIsLoading(false);
        setError("Event not found or you don't have permission to edit it.");
      }
    };

    if (user && user.isAdmin) {
      fetchEventData();
    }
  }, [user, eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check date validation before submission
    if (dateError) {
      setError(dateError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Event updated successfully!");

      // Redirect to the admin dashboard after a short delay
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    } catch (err: unknown) {
      console.error("Error updating event:", err);

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 403) {
          setError(
            "You don't have permission to update this event. Only admins can update events."
          );
        } else if (err.response.data) {
          setError(
            typeof err.response.data === "string"
              ? err.response.data
              : "An error occurred"
          );
        }
      } else {
        setError("Failed to update event. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Only administrators can edit events.
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

  // If event is not found
  if (eventNotFound) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex items-center justify-center min-h-screen -mt-16">
          <div className="text-center">
            <h1 className="text-3xl text-teal-400 font-bold mb-4">
              Event Not Found
            </h1>
            <p className="text-white mb-6">
              The event you're looking for doesn't exist or you don't have
              permission to edit it.
            </p>
            <Link
              href="/admin/dashboard"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg"
          variants={itemVariants}
        >
          <div className="flex justify-between items-center mb-6">
            <motion.h1
              className="text-3xl font-bold text-white"
              variants={itemVariants}
            >
              Edit Event
            </motion.h1>
            <Link
              href="/admin/dashboard"
              className="text-teal-400 hover:text-teal-300 transition-colors duration-150"
            >
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <motion.div
              className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6"
              variants={itemVariants}
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-6"
              variants={itemVariants}
            >
              {success}
            </motion.div>
          )}

          {isLoading ? (
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
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={itemVariants}
            >
              <div>
                <label className="block text-gray-300 mb-1">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Describe your event"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter event location"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-1">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className={`w-full bg-gray-700 border ${
                      dateError ? "border-red-500" : "border-gray-600"
                    } rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500`}
                    required
                  />
                  {dateError && (
                    <p className="mt-1 text-sm text-red-400">{dateError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">
                  Maximum Attendees
                </label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !!dateError}
                  className={`flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                    isSubmitting || !!dateError
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      Updating Event...
                    </>
                  ) : (
                    "Update Event"
                  )}
                </motion.button>

                <Link
                  href="/admin/dashboard"
                  className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
            </motion.form>
          )}
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
