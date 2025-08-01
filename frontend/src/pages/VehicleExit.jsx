import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ParkingContext } from '../contexts/ParkingContext';
import { toast } from 'react-toastify';
import FormCard from '../components/FormCard';
import VehicleCard from '../components/VehicleCard';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import BillingReceipt from '../components/BillingReceipt';

const VehicleExit = () => {
  const [number_plate, setNumberPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [billingDetails, setBillingDetails] = useState(null);
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vehiclesPerPage] = useState(6);
  
  const { BASE_URL, fetchSlots } = useContext(ParkingContext);

  useEffect(() => {
    fetchActiveVehicles();
  }, []);

  const fetchActiveVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const response = await axios.get(`${BASE_URL}/sessions/active`);
      setActiveVehicles(response.data);
    } catch (err) {
      toast.error('Failed to fetch active vehicles');
      console.error(err);
    }
    setLoadingVehicles(false);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setNumberPlate(vehicle.vehicle_id.number_plate);
    setSessionDetails(vehicle);
    toast.success('Vehicle selected! Review details below.');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!number_plate.trim()) {
      toast.error('Please enter vehicle number plate');
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/vehicles/search`, {
        number_plate: number_plate
      });
      
      if (response.data.session) {
        setSessionDetails(response.data.session);
        setSelectedVehicle(response.data.session);
        toast.success('Vehicle found! Review details below.');
      } else {
        setSessionDetails(null);
        setSelectedVehicle(null);
        toast.error('No active parking session found for this vehicle.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to search vehicle');
      setSessionDetails(null);
      setSelectedVehicle(null);
    }
    setSearchLoading(false);
  };

  const handleExit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/vehicles/exit`, {
        number_plate: number_plate
      });
      
      setBillingDetails(response.data);
      
      toast.success(response.data.message);
      if (response.data.late_alert && response.data.late_alert.is_late) {
        toast.warning(
          `🚨 LATE ALERT: ${response.data.late_alert.message}`,
          {
            position: "top-center",
            autoClose: 8000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
      
      if (fetchSlots) fetchSlots();
      await fetchActiveVehicles();
      setSessionDetails(null);
      setSelectedVehicle(null);
      
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to process exit');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setNumberPlate('');
    setSessionDetails(null);
    setBillingDetails(null);
    setSelectedVehicle(null);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setNumberPlate('');
    setSessionDetails(null);
    setSelectedVehicle(null);
  };

  // Pagination calculations
  const indexOfLastVehicle = currentPage * vehiclesPerPage;
  const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
  const currentVehicles = activeVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
  const totalPages = Math.ceil(activeVehicles.length / vehiclesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100 bg-gradient-to-br from-blue-400 via-white to-blue-300">
          <div className="bg-red-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
            Vehicle Exit
          </h1>
          <p className="text-gray-600 text-lg">Select a parked vehicle or search by number plate</p>
        </div>
        <FormCard 
          title="Currently Parked Vehicles" 
          subtitle={`${activeVehicles.length} vehicles currently in parking`}
          headerGradient="from-blue-400 to-blue-500"
          icon={
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
            </svg>
          }
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Showing {indexOfFirstVehicle + 1} to {Math.min(indexOfLastVehicle, activeVehicles.length)} of {activeVehicles.length} vehicles</span>
            </div>
            <button
              onClick={fetchActiveVehicles}
              disabled={loadingVehicles}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              {loadingVehicles ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {loadingVehicles ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2 text-gray-600">Loading parked vehicles...</span>
            </div>
          ) : activeVehicles.length === 0 ? (
            <div className="text-center p-12 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No Vehicles Currently Parked</h3>
              <p className="text-gray-500">All parking slots are empty</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id}
                    vehicle={vehicle}
                    isSelected={selectedVehicle?._id === vehicle._id}
                    onSelect={handleVehicleSelect}
                    onExit={handleVehicleSelect}
                  />
                ))}
              </div>
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </FormCard>

        <FormCard 
          title="Manual Search" 
          subtitle="Search by entering vehicle number plate"
          headerGradient="from-blue-500 to-indigo-600"
          icon={
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          }
        >
          <SearchBar
            searchValue={number_plate}
            onSearchChange={(e) => setNumberPlate(e.target.value.toUpperCase())}
            onSearch={handleSearch}
            onClear={clearSearch}
            loading={searchLoading}
            placeholder="Enter vehicle number plate (e.g., MH12AB1234)"
          />
        </FormCard>

        {sessionDetails && (
          <FormCard 
            title="Selected Vehicle Details" 
            subtitle="Review parking information before processing exit"
            headerGradient="from-blue-500 to-blue-600"
            icon={
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-600 font-medium mb-1">Vehicle Details</p>
                <p className="text-xl font-bold text-blue-800">{sessionDetails.vehicle_id?.number_plate}</p>
                <p className="text-blue-600">{sessionDetails.vehicle_id?.type}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <p className="text-sm text-green-600 font-medium mb-1">Parking Slot</p>
                <p className="text-xl font-bold text-green-800">{sessionDetails.slot_id?.slot_number}</p>
                <p className="text-green-600">{sessionDetails.slot_id?.type} Slot</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <p className="text-sm text-purple-600 font-medium mb-1">Entry Time</p>
                <p className="text-lg font-bold text-purple-800">{new Date(sessionDetails.entry_time).toLocaleString()}</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
                <p className="text-sm text-indigo-600 font-medium mb-1">Billing Type</p>
                <p className="text-lg font-bold text-indigo-800 capitalize">{sessionDetails.billing_type}</p>
              </div>
            </div>

            <button
              onClick={handleExit}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Exit...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7"/>
                  </svg>
                  Process Vehicle Exit
                </div>
              )}
            </button>
          </FormCard>
        )}
        {billingDetails && (
          <BillingReceipt 
            billingDetails={billingDetails}
            numberPlate={number_plate}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleExit;
