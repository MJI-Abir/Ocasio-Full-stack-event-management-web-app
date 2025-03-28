import { motion, HTMLMotionProps } from "framer-motion";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonMotionProps = HTMLMotionProps<"button">;

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonMotionProps
  > {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  children?: ReactNode;
}

type CombinedButtonProps = ButtonProps & ButtonMotionProps;

const Button: React.FC<CombinedButtonProps> = ({
  children,
  variant = "primary",
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-semibold py-3 px-6 rounded-lg focus:outline-none transition-all duration-300 ease-in-out";

  const variantStyles = {
    primary:
      "bg-teal-500 hover:bg-teal-600 text-gray-900 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600",
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      disabled={isLoading || disabled}
      whileHover={{ scale: isLoading ? 1 : 1.02 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
