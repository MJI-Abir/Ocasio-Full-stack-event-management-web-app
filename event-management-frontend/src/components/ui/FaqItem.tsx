"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FaqItemProps = {
  question: string;
  answer: string;
};

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <h3 className="text-lg md:text-xl font-semibold text-white">
          {question}
        </h3>
        <div className="ml-4 flex-shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 0 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-teal-400"
            >
              {isOpen ? (
                <line x1="5" y1="12" x2="19" y2="12"></line>
              ) : (
                <>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </>
              )}
            </svg>
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-5 pt-0 text-gray-300 border-t border-gray-700">
              <p>{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
