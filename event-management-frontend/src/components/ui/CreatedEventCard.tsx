"use client";
import { motion } from "framer-motion";
import Link from "next/link";

// TypeScript interface for CreatedEventCard props
export interface CreatedEventCardProps {
  id: number;
  title: string;
  startTime: string;
  location: string;
  registrationCount: number;
  maxAttendees: number;
}

export default function CreatedEventCard({
  id,
  title,
  startTime,
  location,
  registrationCount,
  maxAttendees,
}: Readonly<CreatedEventCardProps>) {
  return (
    <motion.div
      key={id}
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
          <span className="text-white text-2xl font-bold">Event Image</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 truncate">{title}</h3>
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
            <span>{new Date(startTime).toLocaleDateString()}</span>
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
            <span>{location}</span>
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
                  {registrationCount}/{maxAttendees}
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
              <motion.div
                style={{
                  width: `${(registrationCount / maxAttendees) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${(registrationCount / maxAttendees) * 100}%`,
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>
            </div>
          </div>
        </div>

        <Link href={`/events/${id}`}>
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
  );
}
