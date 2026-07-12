import { ChevronLeft, ChevronLeftIcon, ChevronRight, ChevronRightIcon } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-text border border-gray-200 flex items-center justify-center"
          aria-label="Previous page"
        >
        <ChevronLeftIcon size={20} />
        </button>
        <div className="text-sm text-text/70 whitespace-nowrap">
          Page {currentPage} of {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-text border border-gray-200 flex items-center justify-center"
          aria-label="Next page"
        >
        <ChevronRightIcon size={20} />
        </button>
      </div>
    </div>
  );
}
