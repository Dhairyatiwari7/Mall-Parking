import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ParkingContext } from '../contexts/ParkingContext';
import { toast } from 'react-toastify';

const Revenue = () => {
  const [billingRecords, setBillingRecords] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 10;
  
  const { BASE_URL } = useContext(ParkingContext);

  const fetchBillingRecords = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/billing/records`, {
        page,
        limit: itemsPerPage
      });

      setBillingRecords(response.data.data || []);
      setTotalRecords(response.data.total || 0);
    } catch (error) {
      toast.error('Failed to fetch billing records');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchTotalRevenue = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/billing/revenue`);
      setTotalRevenue(response.data.totalRevenue || 0);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  useEffect(() => {
    fetchBillingRecords(currentPage);
    fetchTotalRevenue();
  }, [currentPage]);

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours % 1) * 60);
    return `${h}h ${m}m`;
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Revenue Management</h1>
          <p className="text-gray-600">All billing records and revenue details</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Transactions</h3>
            <p className="text-2xl font-bold text-blue-600">{totalRecords.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Average per Transaction</h3>
            <p className="text-2xl font-bold text-purple-600">₹{totalRecords > 0 ? Math.round(totalRevenue / totalRecords) : 0}</p>
          </div>
        </div>

        {/* Billing Records Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Billing Records ({totalRecords})</h2>
              <button
                onClick={() => {
                  fetchBillingRecords(currentPage);
                  fetchTotalRevenue();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </div>
          ) : billingRecords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No billing records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingRecords.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{record.vehicle_number}</div>
                          <div className="text-sm text-gray-500">{record.vehicle_type}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-blue-600">{record.slot_number}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.billing_type === 'hourly' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {record.billing_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDuration(record.duration_hours)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(record.entry_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(record.exit_time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-green-600">
                          ₹{record.total_amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          record.is_late 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {record.is_late ? 'Late' : 'On Time'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Previous
                </button>
                
                <span className="px-3 py-1 bg-gray-100 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-400' 
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenue;
