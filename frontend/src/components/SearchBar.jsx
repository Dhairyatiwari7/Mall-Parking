import React from 'react';

const SearchBar = ({ searchValue, onSearchChange, onSearch, onClear, loading, placeholder }) => {
  return (
    <form onSubmit={onSearch} className="mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={onSearchChange}
          className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all duration-300 text-lg font-medium"
          disabled={loading}
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        {searchValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-20 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-0 right-0 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-r-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
