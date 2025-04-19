"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import CreatedEventCard, { CreatedEventCardProps } from "./CreatedEventCard";

interface CreatedEventsSectionProps {
  events: CreatedEventCardProps[];
  isLoading: boolean;
}

export default function CreatedEventsSection({
  events,
  isLoading,
}: CreatedEventsSectionProps) {
  return (
    <>
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 rounded-full border-t-4 border-teal-400 border-opacity-50 border-r-4 border-r-teal-400 animate-spin"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <CreatedEventCard
              key={event.id}
              id={event.id}
              title={event.title}
              startTime={event.startTime}
              location={event.location}
              registrationCount={event.registrationCount}
              maxAttendees={event.maxAttendees}
            />
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
          <h3 className="text-xl font-bold text-white mb-2">No Events Found</h3>
          <p className="text-gray-400 mb-6">
            You haven&apos;t created any events yet.
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
    </>
  );
}
