"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UnsplashImagePicker from "@/components/ui/UnsplashImagePicker";
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

interface PreviewImage {
  url: string;
  id?: string | number;
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
  const [dateError, setDateError] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<number | null>(null);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUnsplashSearch = async (keyword: string) => {
    if (!keyword.trim()) return;

    setIsLoadingImages(true);
    setError(null);

    try {
      if (!createdEventId) {
        // Store preview images temporarily
        // In a real implementation, you would fetch from Unsplash directly for preview
        setPreviewImages([
          {
            url: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
              keyword
            )}&sig=${Math.random()}`,
          },
          {
            url: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
              keyword
            )}&sig=${Math.random() + 1}`,
          },
          {
            url: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
              keyword
            )}&sig=${Math.random() + 2}`,
          },
          {
            url: `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
              keyword
            )}&sig=${Math.random() + 3}`,
          },
        ]);
      } else {
        // If event is already created, actually fetch from your backend
        const token = Cookies.get("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/events/${createdEventId}/images/generate`,
          { keyword, count: 4 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update with actual images returned from the backend
        setPreviewImages(
          response.data.map((img: any) => ({
            url: img.imageUrl,
            id: img.id,
          }))
        );

        setSuccess("Images added successfully!");

        // Redirect to the event page after a short delay
        setTimeout(() => {
          router.push(`/events/${createdEventId}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : "An error occurred while fetching images"
        );
      } else {
        setError("Failed to fetch images. Please try again.");
      }
    } finally {
      setIsLoadingImages(false);
    }
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

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Event created successfully! You can now add images.");
      setCreatedEventId(response.data.id);

      // Don't reset the form after event creation to allow adding images
    } catch (err: unknown) {
      console.error("Error creating event:", err);

      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 403) {
          setError(
            "You don't have permission to create events. Only admins can create events."
          );
        } else if (err.response.data) {
          setError(
            typeof err.response.data === "string"
              ? err.response.data
              : "An error occurred"
          );
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
          <h1 className="text-3xl text-teal-400 font-bold mb-4">
            Access Denied
          </h1>
          <p className="text-white mb-6">
            Only administrators can create events.
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

            <motion.button
              type="submit"
              disabled={isSubmitting || !!dateError || !!createdEventId}
              className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center ${
                isSubmitting || !!dateError || !!createdEventId
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
              whileHover={
                !(isSubmitting || !!dateError || !!createdEventId)
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !(isSubmitting || !!dateError || !!createdEventId)
                  ? { scale: 0.98 }
                  : {}
              }
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
              ) : createdEventId ? (
                "Event Created ✓"
              ) : (
                "Create Event"
              )}
            </motion.button>
          </motion.form>

          {/* Image Section - Show only after event is created or during creation with preview */}
          <motion.div
            className={`mt-8 pt-8 ${
              createdEventId ? "border-t border-gray-700" : ""
            }`}
            variants={itemVariants}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Event Images</h2>
            <p className="text-gray-400 mb-6">
              {createdEventId
                ? "Your event has been created. Now add some images by searching with keywords related to your event."
                : "Preview images for your event. You'll be able to add these after creating the event."}
            </p>

            <UnsplashImagePicker
              onKeywordSubmit={handleUnsplashSearch}
              loading={isLoadingImages}
              images={previewImages}
            />

            {previewImages.length > 0 && !createdEventId && (
              <div className="mt-4 p-4 bg-gray-700/50 border border-gray-600 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  Note: Create your event first to save these images. They are
                  currently just previews.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
}
