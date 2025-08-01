import React from 'react';

const SearchSection = ({ searchPlate, setSearchPlate, handleSearch, clearSearch, searchResult }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-3 rounded-xl mr-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Quick Vehicle Search</h2>
      </div>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter vehicle number plate (e.g., MH12AB1234)"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
            className="w-full pl-12 pr-20 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 text-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          {searchPlate && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-20 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
          
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-r-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
          >
            Search
          </button>
        </div>
      </form>
      
      {searchResult && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 text-white p-2 rounded-lg mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800">Vehicle Found!</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 font-medium">Number Plate</p>
                  <p className="text-lg font-bold text-gray-800">{searchResult.vehicle_id?.number_plate}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 font-medium">Slot Number</p>
                  <p className="text-lg font-bold text-gray-800">{searchResult.slot_id?.slot_number}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 font-medium">Entry Time</p>
                  <p className="text-lg font-bold text-gray-800">{new Date(searchResult.entry_time).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-sm text-gray-600 font-medium">Billing Type</p>
                  <p className="text-lg font-bold text-gray-800 capitalize">{searchResult.billing_type}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={clearSearch}
              className="ml-4 p-2 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSection;
