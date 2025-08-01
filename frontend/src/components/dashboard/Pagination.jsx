import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === 1 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => onPageChange(index + 1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              currentPage === index + 1
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            {index + 1}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === totalPages 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
