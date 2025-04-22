/**
 * Collection of animation variants for use with Framer Motion
 * These can be used with our AnimateOnScroll component or directly with motion components
 */

// Framer Motion compatible easing functions
const easings = {
  easeOut: [0, 0, 0.58, 1],
  easeIn: [0.42, 0, 1, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  easeBack: [0.34, 1.56, 0.64, 1],
};

// Basic fade animations
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easings.easeOut,
    },
  },
};

// Fade up animation (popular choice)
export const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.easeOut,
    },
  },
};

// Fade down animation
export const fadeDownVariants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easings.easeOut,
    },
  },
};

// Fade left animation
export const fadeLeftVariants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.easeOut,
    },
  },
};

// Fade right animation
export const fadeRightVariants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: easings.easeOut,
    },
  },
};

// Scale up from center with fade
export const scaleUpVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easings.easeOut,
    },
  },
};

// Stagger children animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

// For use with containerVariants
export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    },
  },
};

// Slide in from edge of screen
export const slideInVariants = {
  hidden: {
    x: "-100vw",
  },
  visible: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
    },
  },
};

// Rotating entry animation
export const rotateInVariants = {
  hidden: {
    opacity: 0,
    rotate: 15,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easings.easeOut,
    },
  },
};

/**
 * Function to generate custom fade animation variants with specified parameters
 */
export const createFadeAnimation = (
  direction: "up" | "down" | "left" | "right" | "none" = "up",
  distance = 30,
  duration = 0.6,
  delay = 0,
  ease = easings.easeOut
) => {
  // Define directional movement
  let directionProps = {};
  switch (direction) {
    case "up":
      directionProps = { y: distance };
      break;
    case "down":
      directionProps = { y: -distance };
      break;
    case "left":
      directionProps = { x: distance };
      break;
    case "right":
      directionProps = { x: -distance };
      break;
    default:
      directionProps = {};
  }

  return {
    hidden: {
      opacity: 0,
      ...directionProps,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease,
      },
    },
  };
};
