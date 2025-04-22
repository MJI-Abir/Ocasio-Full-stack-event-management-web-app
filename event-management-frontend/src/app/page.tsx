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
import FaqItem from "@/components/ui/FaqItem";
import Cookies from "js-cookie";
import Footer from "@/components/Footer";
import { User } from "@/types/auth";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { containerVariants, itemVariants } from "@/hooks/animation/animationVariants";

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Fetch user data on component mount
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
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      }
    };

    fetchUserData();
  }, []);

  // Fetch events on component mount and when page changes
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        // Get JWT from cookies instead of localStorage
        const token = Cookies.get("token");
        // console.log("Token from cookies:", token);
        // console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

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
                {user?.isAdmin && (
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
                )}

                {user?.isAdmin && (
                  <Link href="/admin/dashboard">
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
                      Dashboard
                    </motion.button>
                  </Link>
                )}
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
        <AnimateOnScroll 
          className="mb-20" 
          threshold={0.05}
          direction="up"
          duration={0.7}
        >
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
        </AnimateOnScroll>

        {/* Upcoming Events Section */}
        <AnimateOnScroll 
          className="mb-20"
          threshold={0.05}
          direction="up"
          delay={100}
          duration={0.8}
        >
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
        </AnimateOnScroll>

        {/* FAQ Section */}
        <motion.section 
          className="mb-20" 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold text-white mb-8"
            variants={itemVariants}
          >
            FAQ
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                question: "How do I create an event?",
                answer:
                  "You can create an event by clicking the 'Create Event' button on the homepage. Fill out the event details form including title, description, date, time, location, and any other relevant information. Once submitted, your event will be published and visible to other users.",
              },
              {
                question: "Can I edit my event after publishing?",
                answer:
                  "Yes, you can edit your event details after publishing. Navigate to your dashboard, find the event you want to edit, and click on 'Edit Event'. Make your changes and save them to update your event information.",
              },
              {
                question: "How do I register for an event?",
                answer:
                  "To register for an event, navigate to the event page and click the 'Register' or 'RSVP' button. You may need to provide some additional information or answer questions set by the event organizer. Once registered, you'll receive a confirmation email with details.",
              },
              {
                question: "Are there refunds for paid events?",
                answer:
                  "Refund policies vary depending on the event organizer. Generally, most events allow refunds up to 48 hours before the event starts. Check the specific event's refund policy on its details page for accurate information.",
              },
              {
                question: "How can I contact event organizers?",
                answer:
                  "Each event has a contact section where you can reach out to organizers. Additionally, if you're registered for an event, you may have access to a discussion board or messaging system specifically for that event. Check your event confirmation email for contact details as well.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
                variants={itemVariants}
              >
                <FaqItem question={faq.question} answer={faq.answer} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Newsletter Section */}
        <AnimateOnScroll
          className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12"
          direction="up"
          distance={40}
          duration={0.9}
          delay={200}
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
        </AnimateOnScroll>
      </main>

      <Footer />
    </motion.div>
  );
}
