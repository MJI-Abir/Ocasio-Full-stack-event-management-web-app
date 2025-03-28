import React from "react";
import { motion } from "framer-motion";
import EventCard from "./EventCard";
import { Event } from "@/services/event";

interface EventGridProps {
  events: Event[];
  isLoading: boolean;
}

const EventGrid: React.FC<EventGridProps> = ({ events, isLoading }) => {
  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-xl overflow-hidden border border-white/5 h-[400px] animate-pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <div className="h-2 bg-gradient-to-r from-primary/30 to-secondary/30 w-full"></div>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <div className="h-8 bg-white/10 rounded-lg w-2/3 mb-2"></div>
                <div className="h-6 bg-white/10 rounded-full w-20"></div>
              </div>

              <div className="space-y-2 mb-4 flex-grow">
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
                <div className="h-4 bg-white/10 rounded w-5/6"></div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-white/10 mr-2"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-white/10 mr-2"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-white/10 mr-2"></div>
                      <div className="h-4 bg-white/10 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-white/10 rounded w-16"></div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full w-full"></div>
                </div>
              </div>

              <div className="h-10 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-lg w-full"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <motion.div
        className="text-center p-10 glass-card rounded-xl border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white/60"
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
          </div>
        </div>
        <h3 className="text-2xl font-bold gradient-text mb-3">
          No Events Found
        </h3>
        <p className="text-text-secondary max-w-md mx-auto">
          There are no events available at this time. Check back later or adjust
          your search criteria.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </motion.div>
  );
};

export default EventGrid;
