import { motion } from "framer-motion";
import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label
        className="block text-gray-200 text-sm font-semibold mb-2"
        htmlFor={props.id}
      >
        {label}
      </label>
      <input
        className={`shadow appearance-none border ${
          error ? "border-red-500" : "border-gray-600"
        } rounded-lg w-full py-3 px-4 bg-gray-800 text-gray-100 leading-tight focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all duration-200`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </motion.div>
  );
};

export default Input;
