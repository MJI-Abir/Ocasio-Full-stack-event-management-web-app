import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EventImage } from "@/services/event";

interface EventImageCarouselProps {
  images: EventImage[];
  autoPlayInterval?: number; // Time in milliseconds between auto-advancing
}

const EventImageCarousel: React.FC<EventImageCarouselProps> = ({
  images,
  autoPlayInterval = 5000, // Default to 5 seconds
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Default placeholder if no images are provided
  const defaultPlaceholder =
    "https://unsplash.com/photos/crowd-of-people-sitting-on-chairs-inside-room-F2KRf_QfCqw";

  // If no images are provided, use a placeholder
  const displayImages =
    images.length > 0
      ? [...images].toSorted((a, b) => a.displayOrder - b.displayOrder)
      : [
          {
            id: 0,
            imageUrl: defaultPlaceholder,
            displayOrder: 1,
            createdAt: new Date().toISOString(),
          },
        ];

  // Carousel controls
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === displayImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [displayImages.length]);

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? displayImages.length - 1 : prevIndex - 1
    );
  };

  // Auto-advance carousel
  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      nextImage();
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlayInterval, displayImages.length, nextImage]);

  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <Image
            src={displayImages[currentImageIndex].imageUrl}
            alt={`Event image ${currentImageIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Only show controls if there are multiple images */}
      {displayImages.length > 1 && (
        <>
          {/* Carousel Controls */}
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <motion.button
              onClick={prevImage}
              className="w-12 h-12 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white hover:bg-opacity-50 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="w-12 h-12 rounded-full bg-black bg-opacity-30 flex items-center justify-center text-white hover:bg-opacity-50 transition-all duration-200 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {displayImages.map((image, index) => (
              <button
                key={`carousel-indicator-${image.id || index}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
                  index === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white bg-opacity-50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventImageCarousel;
