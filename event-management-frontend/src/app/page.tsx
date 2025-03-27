"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <motion.main
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h1
            className="text-4xl font-extrabold text-teal-400 sm:text-5xl sm:tracking-tight lg:text-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to Ocasio
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl mx-auto text-xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            You have successfully authenticated! This is the home page.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl mx-auto border border-gray-700">
              <h2 className="text-2xl font-bold text-teal-400 mb-4">
                Getting Started with Ocasio
              </h2>
              <p className="text-gray-300 mb-4">
                Ocasio makes event planning and management simple and intuitive.
                Here are some things you can do:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Browse upcoming events</li>
                <li>Create and manage your own events</li>
                <li>Register for events you're interested in</li>
                <li>Connect with other attendees</li>
              </ul>
              <button className="bg-teal-500 hover:bg-teal-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                Explore Events
              </button>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}
