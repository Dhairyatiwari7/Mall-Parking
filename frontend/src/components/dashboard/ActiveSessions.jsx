import React, { useState } from 'react';
import Pagination from './Pagination';

const ActiveSessions = ({ dashboardData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = dashboardData?.activeSessionsDetails?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSessions = dashboardData?.activeSessionsDetails?.slice(startIndex, endIndex) || [];

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Currently Parked Vehicles</h3>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Number Plate</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Vehicle Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Slot Number</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Entry Time</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Billing Type</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentSessions.map((session, index) => {
                const duration = Math.floor((new Date() - new Date(session.entry_time)) / (1000 * 60 * 60));
                return (
                  <tr key={session._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{session.vehicle_id.number_plate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{session.vehicle_id.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-indigo-600">{session.slot_id.slot_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{new Date(session.entry_time).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">
                        {session.billing_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-purple-600">
                      {duration}h {Math.floor(((new Date() - new Date(session.entry_time)) % (1000 * 60 * 60)) / (1000 * 60))}m
                    </td>
                  </tr>
                );
              })}
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
  );
};

export default ActiveSessions;
