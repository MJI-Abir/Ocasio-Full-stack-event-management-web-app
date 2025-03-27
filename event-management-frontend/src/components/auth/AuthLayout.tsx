import React from "react";
import { motion } from "framer-motion";
import Head from "next/head";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center px-4 py-12">
      <Head>
        <title>Ocasio | Login</title>
      </Head>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-teal-400 text-center">Ocasio</h1>
        <p className="text-gray-300 text-center mt-2 text-lg">
          Your seamless event planning solution
        </p>
      </motion.div>

      {children}

      <motion.p
        className="mt-8 text-gray-400 text-center text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        &copy; {new Date().getFullYear()} Ocasio. All rights reserved.
      </motion.p>
    </div>
  );
};

export default AuthLayout;
