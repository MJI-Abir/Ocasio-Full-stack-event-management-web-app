"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Event, PagedResponse } from "@/services/event";
import Header from "@/components/Header";
import EventGrid from "@/components/ui/EventGrid";
import Pagination from "@/components/ui/Pagination";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // Fetch search results on component mount and when page or keyword changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get("token");
        console.log("Token from cookies:", token);
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

        if (!token) {
          console.log("No token found, redirecting to login");
          router.push("/login");
          return;
        }

        const response = await axios.get<PagedResponse<Event>>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/search`,
          {
            params: {
              keyword: keyword,
              page: page,
              size: 12,
              sortBy: "startTime",
              direction: "asc",
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents(response.data.content);
        setTotalPages(response.data.totalPages);
        setIsLoading(false);
      } catch (err: unknown) {
        console.error("Error fetching search results:", err);
        setError("Failed to load search results. Please try again later.");
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

    fetchSearchResults();
  }, [page, keyword, router]);

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
          <h3 className="text-xl text-gray-300">Searching for events...</h3>
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
        {/* Search Results Header */}
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
                Search Results for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                  {keyword}
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Found {events.length} events matching your search. Browse
                through them below.
              </motion.p>
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

        {/* Search Results Grid */}
        <motion.section className="mb-20" variants={itemVariants}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Search Results</h2>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Sort by:</span>
              <select className="bg-gray-800 text-gray-200 rounded-md border border-gray-700 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>Date</option>
                <option>Popularity</option>
                <option>Name</option>
              </select>
            </div>
          </div>

          <EventGrid events={events} isLoading={false} />

          {events.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </motion.section>

        {/* No Results Message */}
        {events.length === 0 && !isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">
              No events found
            </h3>
            <p className="text-gray-400 mb-6">
              We couldn&apos;t find any events matching your search. Try
              different keywords or browse all events.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Browse All Events
            </button>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-teal-400 mb-4">Ocasio</h3>
              <p className="text-gray-400">
                Your seamless event planning solution. Create, discover, and
                attend amazing events.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">
                Help & Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map(
                  (social) => (
                    <a key={social} href="#" aria-label={social}>
                      <div className="w-10 h-10 rounded-full bg-gray-800 hover:bg-teal-500 flex items-center justify-center transition-colors duration-200">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Ocasio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
