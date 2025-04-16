import React from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/services/event";

interface FeaturedEventProps {
  event: Event;
}

const FeaturedEvent: React.FC<FeaturedEventProps> = ({ event }) => {
  if (!event) return null;

  const startDate = new Date(event.startTime);
  // const formattedDate = format(startDate, "EEEE, MMMM d, yyyy");
  // const formattedTime = format(startDate, "h:mm a");
  const timeFromNow = formatDistanceToNow(startDate, { addSuffix: true });

  // Get the first image from the event if available
  const imageUrl =
    event.images && event.images.length > 0 ? event.images[0].imageUrl : null;

  return (
    <motion.div
      className="mb-16 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold gradient-text mb-6 relative z-10 flex items-center"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <svg
          className="w-7 h-7 mr-3 text-primary-light"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Featured Event
      </motion.h2>

      <div className="relative glass-card rounded-2xl border border-white/10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[60px]"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[60px]"></div>
        </div>

        <div className="flex flex-col lg:flex-row relative z-10">
          <div className="lg:w-2/3 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <motion.div
                className="flex flex-wrap gap-3 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary-light text-sm font-medium border border-primary/20">
                  Featured
                </span>
                {event.isFull ? (
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent-light text-sm font-medium border border-accent/20">
                    Sold Out
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-light text-sm font-medium border border-secondary/20">
                    {event.maxAttendees - (event.registrationCount || 0)} spots
                    left
                  </span>
                )}
              </motion.div>

              <motion.h3
                className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {event.title}
              </motion.h3>

              <motion.p
                className="text-text-secondary text-lg mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {event.description.length > 200
                  ? `${event.description.substring(0, 200)}...`
                  : event.description}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <svg
                  className="w-5 h-5 mt-1 mr-3 text-primary-light"
                  xmlns="http://www.w3.org/2000/svg"
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
                <div>
                  <h4 className="text-white font-medium">Location</h4>
                  <p className="text-text-secondary">{event.location}</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <svg
                  className="w-5 h-5 mt-1 mr-3 text-primary-light"
                  xmlns="http://www.w3.org/2000/svg"
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
                <div>
                  <h4 className="text-white font-medium">Date & Time</h4>
                  <p className="text-text-secondary">
                    {format(new Date(event.startTime), "MMM d, yyyy")}
                    <span className="text-text-tertiary mx-2">·</span>
                    {format(new Date(event.startTime), "h:mm a")}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Link href={`/events/${event.id}`}>
                <motion.button
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Details
                </motion.button>
              </Link>
              <button
                className="subtle-glass hover:bg-surface-light text-white font-medium py-3 px-8 rounded-lg transition-all duration-300"
                disabled={event.isFull}
              >
                {event.isFull ? "Sold Out" : "Register Now"}
              </button>
            </motion.div>
          </div>

          <div className="lg:w-1/3 relative">
            {imageUrl ? (
              <div className="h-80 lg:h-full relative">
                <Image
                  src={imageUrl}
                  alt={`${event.title} featured image`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 flex items-end p-6">
                  <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
                    <p className="text-white font-medium">
                      Happening {timeFromNow}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 lg:h-full bg-gradient-to-br from-primary/40 via-secondary/40 to-accent/40 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-24 h-24 mb-6 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mx-auto">
                    <svg
                      className="w-12 h-12 text-white opacity-80"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Don&apos;t Miss Out!
                  </h3>
                  <p className="text-white/70 mb-6">
                    Join {event.registrationCount || 0} others who have already
                    registered
                  </p>

                  <div className="flex items-center justify-center">
                    <div className="flex -space-x-2">
                      {[
                        ...Array(Math.min(event.registrationCount || 0, 5)),
                      ].map((_, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-primary/80 to-secondary/80 border-2 border-surface flex items-center justify-center text-xs font-medium"
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                      ))}
                    </div>
                    {(event.registrationCount || 0) > 5 && (
                      <div className="ml-2 text-white/80 text-sm">
                        +{(event.registrationCount || 0) - 5} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedEvent;
