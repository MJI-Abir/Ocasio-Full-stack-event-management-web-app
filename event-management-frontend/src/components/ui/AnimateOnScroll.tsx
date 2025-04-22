import React, { ReactNode } from "react";
import { useScrollAnimation } from "@/hooks/animation/useScrollAnimation";
import { motion } from "framer-motion";

interface AnimateOnScrollProps {
  children: ReactNode;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Animation easing function */
  easing?: [number, number, number, number] | string;
  /** How much of element should be in view before triggering */
  threshold?: number;
  /** Direction of entrance animation */
  direction?: "up" | "down" | "left" | "right";
  /** Distance in pixels the element travels during animation */
  distance?: number;
  /** Whether to only animate once */
  once?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Root margin for intersection observer */
  rootMargin?: string;
}

// Common easing presets for Framer Motion
const easings = {
  "ease-in-out": [0.42, 0, 0.58, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-back": [0.34, 1.56, 0.64, 1],
};

export const AnimateOnScroll = ({
  children,
  duration = 0.6,
  delay = 0,
  easing = [0, 0, 0.58, 1], // default is ease-out in cubic-bezier format
  threshold = 0.1,
  direction = "up",
  distance = 30,
  once = false, // Changed default to false so animation happens every time
  className = "",
  rootMargin = "0px",
}: AnimateOnScrollProps) => {
  // Use our custom hook to detect when the element is in view
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    delay,
    rootMargin,
    triggerOnce: once,
    direction,
  });

  // Calculate initial position based on direction
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance };
      case "down":
        return { y: -distance };
      case "left":
        return { x: distance };
      case "right":
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  // Convert string easing to array format if needed
  const getEasing = () => {
    if (typeof easing === "string" && easing in easings) {
      return easings[easing as keyof typeof easings];
    }
    return easing;
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      initial={{
        opacity: 0,
        ...getInitialPosition(),
      }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : getInitialPosition().x,
        y: isVisible ? 0 : getInitialPosition().y,
      }}
      transition={{
        duration,
        ease: getEasing(),
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateOnScroll;
