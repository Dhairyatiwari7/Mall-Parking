import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ParkingContext } from '../contexts/ParkingContext';
import axios from 'axios';

const Alert = () => {
  const { BASE_URL } = useContext(ParkingContext);
  const [lateVehicles, setLateVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getLateVehicles = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${BASE_URL}/billing/late`);
      setLateVehicles(response.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getLateVehicles();
    const interval = setInterval(getLateVehicles, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours % 1) * 60);
    return `${h}h ${m}m`;
  };

  const calculateLateTime = (exitTime) => {
    const exit = new Date(exitTime);
    const mallClosing = new Date(exit);
    mallClosing.setHours(22, 0, 0, 0); // 10 PM
    
    if (exit > mallClosing) {
      const lateMs = exit - mallClosing;
      const lateHours = lateMs / (1000 * 60 * 60);
      return formatDuration(lateHours);
    }
    return '0h 0m';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-xl font-medium text-gray-700">Loading alert notifications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 19.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Alert Notifications
          </h1>
          <p className="text-gray-600 text-lg">Vehicles that have exceeded their parking time limit</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Late Vehicles</h3>
                <p className="text-3xl font-bold">{lateVehicles.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Mall Status</h3>
                <p className="text-lg font-bold">Closed at 10 PM</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium opacity-90">Last Updated</h3>
                <p className="text-lg font-bold">{new Date().toLocaleTimeString()}</p>
              </div>
              <button
                onClick={getLateVehicles}
                disabled={refreshing}
                className="bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-colors"
              >
                <svg className={`w-8 h-8 ${refreshing ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          {lateVehicles.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">All Clear!</h3>
              <p className="text-gray-600 text-lg">No vehicles have exceeded their parking time limit.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  Late Vehicle Alerts ({lateVehicles.length})
                </h2>
                <p className="text-red-100 mt-2">Immediate attention required for these vehicles</p>
              </div>

              <div className="p-6 space-y-4">
                {lateVehicles.map((vehicle, index) => (
                  <div key={vehicle._id || index} className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Vehicle Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                            URGENT
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {vehicle.vehicle_number}
                          </h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {vehicle.vehicle_type}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500 font-medium">Parking Slot</p>
                            <p className="text-lg font-bold text-indigo-600">{vehicle.slot_number}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500 font-medium">Total Duration</p>
                            <p className="text-lg font-bold text-gray-800">{formatDuration(vehicle.duration_hours)}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500 font-medium">Overtime</p>
                            <p className="text-lg font-bold text-red-600">{calculateLateTime(vehicle.exit_time)}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-xs text-gray-500 font-medium">Exit Time</p>
                            <p className="text-sm font-semibold text-gray-800">
                              {new Date(vehicle.exit_time).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 lg:ml-6">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                          Contact Security
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                          Send Alert
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Action Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <span className="text-yellow-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Check Vehicle Location</h4>
                <p className="text-sm text-gray-600">Verify the vehicle is still in the assigned parking slot</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Contact Owner</h4>
                <p className="text-sm text-gray-600">Use PA system or contact information if available</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Security Action</h4>
                <p className="text-sm text-gray-600">If no response, initiate security protocols</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
