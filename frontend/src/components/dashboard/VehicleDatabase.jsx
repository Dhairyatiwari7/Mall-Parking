import React, { useState } from 'react';
import Pagination from './Pagination';

const VehicleDatabase = ({ dashboardData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculation
  const totalItems = dashboardData?.vehicles?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = dashboardData?.vehicles?.slice(startIndex, endIndex) || [];

  return (
    <div className="space-y-8">
      {/* Vehicle Stats by Type */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Vehicles by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {dashboardData?.vehiclesByType && Object.entries(dashboardData.vehiclesByType).map(([type, count]) => (
            <div key={type} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
              <h4 className="font-bold text-blue-800 mb-2">{type}</h4>
              <p className="text-3xl font-bold text-blue-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* All Vehicles Table with Pagination */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">All Registered Vehicles</h3>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Number Plate</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Vehicle Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentVehicles.map((vehicle, index) => {
                  const isCurrentlyParked = dashboardData?.activeSessionsDetails?.some(
                    session => session.vehicle_id._id === vehicle._id
                  );
                  return (
                    <tr key={vehicle._id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">{vehicle.number_plate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{vehicle.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-2 rounded-full text-sm font-semibold ${
                          isCurrentlyParked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isCurrentlyParked ? 'Currently Parked' : 'Not Parked'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(vehicle.createdAt || Date.now()).toLocaleDateString()}
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
    </div>
  );
};

export default VehicleDatabase;
