import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface UnsplashImagePickerProps {
  onKeywordSubmit: (keyword: string) => Promise<void>;
  loading: boolean;
  images: { url: string; id?: string | number }[];
}

const UnsplashImagePicker: React.FC<UnsplashImagePickerProps> = ({
  onKeywordSubmit,
  loading,
  images,
}) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      onKeywordSubmit(keyword);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-gray-300">
          Search Unsplash for Event Images
        </label>
        <p className="text-sm text-gray-400">
          Enter a keyword related to your event (e.g., &quot;conference&quot;,
          &quot;coding&quot;, &quot;hackathon&quot;) to get relevant images
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword (e.g., conference, coding)"
          className="flex-grow bg-gray-700 border border-gray-600 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <motion.button
          type="submit"
          disabled={loading || !keyword.trim()}
          className={`bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
            loading || !keyword.trim() ? "opacity-70 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            </>
          ) : (
            "Search"
          )}
        </motion.button>
      </form>

      {images.length > 0 && (
        <div>
          <h4 className="text-gray-300 mb-2">Preview Images</h4>
          <div className="grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="relative h-40 rounded-lg overflow-hidden border border-gray-700"
              >
                <Image
                  src={image.url}
                  alt={`Unsplash image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Images powered by{" "}
            <a
              href="https://unsplash.com/?utm_source=event_management&utm_medium=referral"
              className="text-teal-400"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default UnsplashImagePicker;
