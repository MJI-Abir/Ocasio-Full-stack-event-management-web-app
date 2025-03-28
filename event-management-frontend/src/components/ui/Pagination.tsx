import React from "react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all of them
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(0);

      // Calculate range around current page
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);

      // Adjust range if at the beginning or end
      if (currentPage <= 1) {
        endPage = 3;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      // Add ellipsis after first page if needed
      if (startPage > 1) {
        pageNumbers.push("ellipsis1");
      }

      // Add range of pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 2) {
        pageNumbers.push("ellipsis2");
      }

      // Always include last page
      pageNumbers.push(totalPages - 1);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <motion.div
      className="flex justify-center mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="glass-card subtle-glass rounded-lg border border-white/10 flex items-center p-1.5">
        <motion.button
          onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`p-2 mx-1 rounded-md flex items-center justify-center transition-all duration-200 
            ${
              currentPage === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-surface-light"
            }`}
          whileHover={currentPage !== 0 ? { scale: 1.1 } : {}}
          whileTap={currentPage !== 0 ? { scale: 0.95 } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-text-secondary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>

        <div className="flex items-center">
          {pageNumbers.map((pageNumber, index) => {
            if (pageNumber === "ellipsis1" || pageNumber === "ellipsis2") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 text-center text-text-tertiary mx-1"
                >
                  ...
                </span>
              );
            }

            return (
              <motion.button
                key={index}
                onClick={() => onPageChange(Number(pageNumber))}
                className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200
                  ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                      : "hover:bg-surface-light text-text-secondary"
                  }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {Number(pageNumber) + 1}
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() =>
            currentPage < totalPages - 1 && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages - 1}
          className={`p-2 mx-1 rounded-md flex items-center justify-center transition-all duration-200
            ${
              currentPage === totalPages - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-surface-light"
            }`}
          whileHover={currentPage !== totalPages - 1 ? { scale: 1.1 } : {}}
          whileTap={currentPage !== totalPages - 1 ? { scale: 0.95 } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-text-secondary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
