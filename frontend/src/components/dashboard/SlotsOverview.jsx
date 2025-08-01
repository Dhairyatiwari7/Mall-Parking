import React, { useState, useRef } from 'react';
import Pagination from './Pagination';

const SlotsOverview = ({ dashboardData, selectedType, setSelectedType, handleMaintenanceToggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef(null);
  const itemsPerPage = 10;

  // Pagination calculation
  const totalItems = dashboardData?.slots?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSlots = dashboardData?.slots?.slice(startIndex, endIndex) || [];

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Slots by Type</h3>
        
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={scrollLeft}
              className="p-2 sm:p-3 bg-white rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-500">
                Swipe or click arrows to navigate
              </p>
            </div>
            
            <button
              onClick={scrollRight}
              className="p-2 sm:p-3 bg-white rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div 
            ref={scrollRef}
            className="flex space-x-3 sm:space-x-4 lg:space-x-6 overflow-x-auto pb-4 sm:pb-6 snap-x snap-mandatory scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {dashboardData?.slotsByType && Object.entries(dashboardData.slotsByType).map(([type, stats]) => (
              <div 
                key={type} 
                className="flex-none w-64 sm:w-72 md:w-80 lg:w-96 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 snap-start group"
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h4 className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
                    {type}
                  </h4>
                  
                  <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    {type === 'Regular' && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6z"/>
                      </svg>
                    )}
                    {type === 'Compact' && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                      </svg>
                    )}
                    {type === 'Bike' && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                        <path d="M5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"/>
                      </svg>
                    )}
                    {type === 'EV' && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.5 11l-3-6v4h-2l3 6v-4h2z"/>
                      </svg>
                    )}
                    {type === 'Handicap Accessible' && (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                    <span className="text-gray-600 font-medium text-sm sm:text-base">Total:</span>
                    <span className="font-bold text-lg sm:text-xl text-gray-800">{stats.total}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium text-sm sm:text-base">Available:</span>
                    <span className="font-bold text-lg sm:text-xl text-green-700">{stats.available}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-medium text-sm sm:text-base">Occupied:</span>
                    <span className="font-bold text-lg sm:text-xl text-red-700">{stats.occupied}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-700 font-medium text-sm sm:text-base">Maintenance:</span>
                    <span className="font-bold text-lg sm:text-xl text-yellow-700">{stats.maintenance}</span>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-medium">Availability</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: stats.total > 0 ? `${(stats.available / stats.total) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex-none w-4"></div>
          </div>
          <div className="flex justify-center mt-4 space-x-1.5">
            {dashboardData?.slotsByType && Object.keys(dashboardData.slotsByType).map((_, index) => (
              <div key={index} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full transition-all duration-300 hover:bg-blue-400"></div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Detailed Slots View</h3>
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white text-sm sm:text-base"
          >
            <option value="">All Types</option>
            <option value="Regular">Regular</option>
            <option value="Compact">Compact</option>
            <option value="Bike">Bike</option>
            <option value="EV">EV</option>
            <option value="Handicap Accessible">Handicap Accessible</option>
          </select>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Slot Number</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Type</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSlots.map((slot, index) => (
                  <tr key={slot._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap font-bold text-gray-900 text-sm sm:text-base">{slot.slot_number}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-gray-700 text-sm sm:text-base">{slot.type}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        slot.status === 'Available' ? 'bg-green-100 text-green-800' :
                        slot.status === 'Occupied' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {slot.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleMaintenanceToggle(slot)}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                      >
                        {slot.status === 'Maintenance' ? 'Mark Available' : 'Set Maintenance'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        </div>
      </div>
    </div>
  );
};

export default SlotsOverview;
