import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { Event } from "@/services/event";

interface EventCardProps {
  event: Event;
  index: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, index }) => {
  const startDate = new Date(event.startTime);
  const formattedDate = format(startDate, "MMM d, yyyy");
  const timeFromNow = formatDistanceToNow(startDate, { addSuffix: true });

  // Convert event title to a predictable color based on title text
  const getColorClass = (title: string) => {
    const colorOptions = [
      "from-pink-500 to-orange-400",
      "from-cyan-500 to-blue-500",
      "from-indigo-500 to-purple-500",
      "from-green-500 to-emerald-500",
      "from-yellow-400 to-amber-500",
      "from-red-500 to-pink-500",
    ];

    // Use the sum of character codes to get a consistent color for the same title
    const charSum = title
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colorOptions[charSum % colorOptions.length];
  };

  const cardColor = getColorClass(event.title);

  return (
    <motion.div
      className="glass-card rounded-xl overflow-hidden shadow-lg border border-white/10 card-hover h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 15px 30px -10px rgba(0, 0, 0, 0.3), 0 5px 15px -5px rgba(45, 212, 191, 0.1)",
      }}
    >
      <div className={`h-2 bg-gradient-to-r ${cardColor} w-full`}></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold gradient-text line-clamp-2">
            {event.title}
          </h3>
          <div className="subtle-glass px-2 py-1 rounded-full text-xs font-medium text-white ml-2 whitespace-nowrap flex-shrink-0">
            {timeFromNow}
          </div>
        </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-grow">
          {event.description}
        </p>

        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-text-tertiary text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-primary-light"
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
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center text-text-tertiary text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2 text-primary-light"
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
            {formattedDate}
          </div>

          <div>
            <div className="flex items-center justify-between text-text-tertiary text-sm mb-1">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-primary-light"
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
                <span>
                  {event.registrationCount}/{event.maxAttendees}
                </span>
              </div>
              <span
                className={`text-xs font-semibold ${
                  event.isFull ? "text-error" : "text-green-400"
                }`}
              >
                {event.isFull ? "Full" : "Available"}
              </span>
            </div>
            <div className="w-full bg-surface/50 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  event.isFull
                    ? "bg-error"
                    : "bg-gradient-to-r from-primary to-secondary"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (event.registrationCount / event.maxAttendees) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <Link href={`/events/${event.id}`} className="w-full">
          <motion.button
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;
