import { useEffect, useRef, useState } from "react";

interface ScrollAnimationOptions {
  /**
   * How much of the element needs to be visible before triggering (0 to 1)
   * @default 0.1
   */
  threshold?: number;

  /**
   * Delay before the animation starts (in milliseconds)
   * @default 0
   */
  delay?: number;

  /**
   * Root margin for the Intersection Observer
   * @default "0px"
   */
  rootMargin?: string;

  /**
   * Whether to trigger the animation only once
   * @default false
   */
  triggerOnce?: boolean;

  /**
   * Animation direction - useful for animations that need directional context
   * @default "up"
   */
  direction?: "up" | "down" | "left" | "right";
}

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * Returns a ref to attach to the element and animation states for styling
 */
export function useScrollAnimation({
  threshold = 0.1,
  delay = 0,
  rootMargin = "0px",
  triggerOnce = false, // Changed default to false so animation happens every time
  direction = "up",
}: ScrollAnimationOptions = {}) {
  // Reference to the element we want to observe
  const elementRef = useRef<HTMLElement | null>(null);

  // Animation state - controls visibility and animation
  const [isVisible, setIsVisible] = useState(false);

  // State to track whether the animation has been triggered
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;

    // Skip if the element doesn't exist or animation has been triggered once
    if (!currentElement || (triggerOnce && hasAnimated)) return;

    // Create an observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If element is in view
          if (entry.isIntersecting) {
            // Delay the animation if specified
            setTimeout(() => {
              setIsVisible(true);
              if (triggerOnce) {
                setHasAnimated(true);
              }
            }, delay);

            // If we only need to trigger once, unobserve after triggering
            if (triggerOnce) {
              observer.unobserve(currentElement);
            }
          } else if (!triggerOnce) {
            // If element is out of view and we're not triggering once, hide it again
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    // Start observing the element
    observer.observe(currentElement);

    // Clean up the observer when component unmounts
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, delay, rootMargin, triggerOnce, hasAnimated]);

  // Return the ref and animation states to be used by components
  return {
    ref: elementRef,
    isVisible,
    hasAnimated,
    direction,
  };
}
