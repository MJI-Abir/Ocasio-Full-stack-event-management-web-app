import { motion } from "framer-motion";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

const Header = () => {
  const { logout } = useAuth();

  return (
    <motion.header
      className="bg-gray-900 border-b border-gray-800 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-teal-400">
                Ocasio
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className="border-teal-500 text-gray-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/events"
                className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Events
              </Link>
              <Link
                href="/profile"
                className="border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={logout}
              className="text-gray-300 hover:text-teal-400 p-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
