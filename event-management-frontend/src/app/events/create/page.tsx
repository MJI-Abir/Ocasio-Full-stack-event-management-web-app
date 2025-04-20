"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cookies from "js-cookie";
import { User } from "@/types/auth";

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
}

export default function CreateEventPage() {
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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data to check if admin
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("User data received:", response.data);
          console.log("Is admin field:", response.data.isAdmin);
          console.log("Type of isAdmin:", typeof response.data.isAdmin);
          setUser(response.data);
          
          // Redirect non-admin users
          if (!response.data.isAdmin) {
            console.log("User is not an admin, redirecting...");
            router.push("/");
          } else {
            console.log("User is an admin, staying on create page");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = Cookies.get("token");
      
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Event created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        startTime: "",
        endTime: "",
        maxAttendees: 100,
      });

      // Redirect to the event page after a short delay
      setTimeout(() => {
        router.push(`/events/${response.data.id}`);
      }, 2000);
    } catch (err: unknown) {
      console.error("Error creating event:", err);
      
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 403) {
          setError("You don't have permission to create events. Only admins can create events.");
        } else if (err.response.data) {
          setError(typeof err.response.data === 'string' ? err.response.data : 'An error occurred');
        }
      } else {
        setError("Failed to create event. Please try again.");
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
          <h1 className="text-3xl text-teal-400 font-bold mb-4">Access Denied</h1>
          <p className="text-white mb-6">Only administrators can create events.</p>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-lg"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-3xl font-bold text-white mb-6"
            variants={itemVariants}
          >
            Create New Event
          </motion.h1>

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
                <label className="block text-gray-300 mb-1">Start Date & Time</label>
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
                <label className="block text-gray-300 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Maximum Attendees</label>
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

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
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
                  Creating Event...
                </>
              ) : "Create Event"}
            </motion.button>
          </motion.form>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}