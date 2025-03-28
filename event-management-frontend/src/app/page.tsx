// pages/index.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Event, PagedResponse } from "@/services/event";
import Header from "@/components/Header";
import SearchBar from "@/components/ui/SearchBar";
import EventGrid from "@/components/ui/EventGrid";
import Pagination from "@/components/ui/Pagination";
import Cookies from "js-cookie";
import Footer from "@/components/Footer";

// Helper function to get category icons
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "tech":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "business":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
    case "social":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      );
    case "education":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
          />
        </svg>
      );
    case "entertainment":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      );
  }
};

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Fetch events on component mount and when page changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Get JWT from cookies instead of localStorage
        const token = Cookies.get("token");
        console.log("Token from cookies:", token);
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

        if (!token) {
          // If no token, redirect to login
          console.log("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        // Fetch upcoming events
        const response = await axios.get<PagedResponse<Event>>(
          `${process.env.NEXT_PUBLIC_API_URL}/events/upcoming`,
          {
            params: {
              page: page,
              size: 6,
              fromDate: new Date().toISOString(), // Add current date as fromDate
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUpcomingEvents(response.data.content);
        setTotalPages(response.data.totalPages);

        // Also fetch some featured events (newest ones)
        const featuredResponse = await axios.get<PagedResponse<Event>>(
          `${process.env.NEXT_PUBLIC_API_URL}/events?page=0&size=3&sortBy=startTime&direction=asc`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeaturedEvents(featuredResponse.data.content);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setIsLoading(false);

        // If unauthorized, redirect to login
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "status" in err.response &&
          err.response.status === 401
        ) {
          // Remove from cookies instead of localStorage
          Cookies.remove("token");
          router.push("/login");
        }
      }
    };

    fetchEvents();
  }, [page, router]);

  // Handle search submission
  const handleSearch = (term: string) => {
    router.push(`/events/search?keyword=${term}`);
  };

  // Layout animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
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

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full border-t-4 border-teal-400 border-opacity-50 border-r-4 border-r-teal-400 animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl text-gray-300">Loading amazing events...</h3>
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
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition-colors duration-200 cursor-pointer"
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
        {/* Hero Section */}
        <motion.section
          className="relative mb-20 rounded-2xl overflow-hidden"
          variants={itemVariants}
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
            <div className="p-8 md:p-12 lg:p-16 relative z-10">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Discover{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                  Extraordinary
                </span>{" "}
                Events
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Find the perfect events to attend, connect with like-minded
                people, and make unforgettable memories.
              </motion.p>

              <SearchBar onSearch={handleSearch} />

              <motion.div
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link href="/events/create">
                  <motion.button
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-gray-900 font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
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

                <Link href="/dashboard">
                  <motion.button
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-lg shadow-lg transition-all duration-300 border border-gray-600 flex items-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    My Dashboard
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Abstract shapes for visual interest */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 lg:mt-0 lg:mr-0 lg:right-0 opacity-50">
              <svg
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
                className="transform rotate-45 opacity-40"
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
            <div className="absolute bottom-0 left-0 opacity-50">
              <svg
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
                className="transform -rotate-45 opacity-40"
              >
                <defs>
                  <pattern
                    id="64e643ad-2176-4f86-b3d7-f2c5da3b6a6d"
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
                      className="text-blue-500"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="384"
                  fill="url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)"
                />
              </svg>
            </div>
          </div>
        </motion.section>

        {/* Featured Events Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Events</h2>
            <Link
              href="/events"
              className="text-teal-400 hover:text-teal-300 transition-colors duration-200 flex items-center"
            >
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <EventGrid events={featuredEvents} isLoading={false} />
        </motion.section>

        {/* Upcoming Events Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Sort by:</span>
              <select className="bg-gray-800 text-gray-200 rounded-md border border-gray-700 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Date</option>
                <option>Popularity</option>
                <option>Name</option>
              </select>
            </div>
          </div>

          <EventGrid events={upcomingEvents} isLoading={false} />

          {upcomingEvents.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </motion.section>

        {/* Categories Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-white mb-8">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {["Tech", "Business", "Social", "Education", "Entertainment"].map(
              (category, index) => (
                <Link
                  key={category}
                  href={`/events/search?keyword=${category.toLowerCase()}`}
                >
                  <motion.div
                    className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 text-center transition-all duration-200 h-full flex flex-col items-center justify-center group cursor-pointer"
                    whileHover={{
                      scale: 1.05,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                      {getCategoryIcon(category)}
                    </div>
                    <span className="text-gray-100 font-medium">
                      {category}
                    </span>
                    <span className="text-gray-400 text-sm mt-1">
                      12 events
                    </span>
                  </motion.div>
                </Link>
              )
            )}
          </div>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section
          className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12"
          variants={itemVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates on new events,
              exclusive offers, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow py-3 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <motion.button
                className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-medium py-3 px-6 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </motion.div>
  );
}
