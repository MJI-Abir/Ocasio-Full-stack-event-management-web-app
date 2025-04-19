"use client";
import { motion } from "framer-motion";
import Link from "next/link";

// TypeScript interface for TicketCard props
export interface TicketCardProps {
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

export default function TicketCard({
  id,
  event,
  registrationDate,
  status,
}: TicketCardProps) {
  return (
    <motion.div
      key={id}
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
          <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
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
              <span>{new Date(event.startTime).toLocaleDateString()}</span>
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
                Registered on {new Date(registrationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className={`px-4 py-1 rounded-full text-xs font-bold ${
              status === "CONFIRMED"
                ? "bg-green-900 text-green-300"
                : status === "PENDING"
                ? "bg-yellow-900 text-yellow-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {status}
          </div>
          <Link href={`/events/${event.id}`}>
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
  );
}
