import { useState } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-card rounded-full border border-white/10 flex items-center overflow-hidden shadow-lg">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="pl-5 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for events by title, description or location..."
            className="flex-1 py-4 px-5 bg-transparent text-white placeholder:text-text-tertiary focus:outline-none text-lg"
          />
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary-light hover:to-secondary-light text-white font-medium py-3 px-8 border-none focus:outline-none transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Search
          </motion.button>
        </div>

        {/* Suggestions (optional) */}
        <div className="flex flex-wrap gap-2 mt-3 px-3">
          <p className="text-text-tertiary mr-1">Popular:</p>
          {["Tech", "Business", "Workshop", "Conference", "Virtual"].map(
            (tag) => (
              <motion.button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchTerm(tag);
                  onSearch(tag);
                }}
                className="px-3 py-1 rounded-full bg-surface-light hover:bg-surface-light/80 text-text-secondary text-sm border border-white/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {tag}
              </motion.button>
            )
          )}
        </div>
      </form>
    </motion.div>
  );
}
