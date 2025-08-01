import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ParkingContext } from '../contexts/ParkingContext';
import { toast } from 'react-toastify';
import StatsCard from '../components/dashboard/StatsCard';
import SearchSection from '../components/dashboard/SearchSection';
import SlotsOverview from '../components/dashboard/SlotsOverview';
import VehicleDatabase from '../components/dashboard/VehicleDatabase';
import ActiveSessions from '../components/dashboard/ActiveSessions';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [searchPlate, setSearchPlate] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { BASE_URL } = useContext(ParkingContext);

  const fetchDashboardData = async (type = '') => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/slots/dashboard-stats`, 
        type ? { type } : {}
      );
      setDashboardData(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPlate.trim()) return;
    
    try {
      const response = await axios.post(`${BASE_URL}/vehicles/search`, {
        number_plate: searchPlate
      });
      
      if (response.data.session) {
        setSearchResult(response.data.session);
        toast.success('Vehicle found!');
      } else {
        setSearchResult(null);
        toast.info('No active session found.');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
      setSearchResult(null);
    }
  };

  const clearSearch = () => {
    setSearchPlate('');
    setSearchResult(null);
  };

  const handleMaintenanceToggle = async (slot) => {
    try {
      const endpoint = slot.status === 'Maintenance'
        ? `${BASE_URL}/slots/${slot._id}/available`
        : `${BASE_URL}/slots/${slot._id}/maintenance`;
      
      await axios.post(endpoint, {});
      await fetchDashboardData(selectedType);
      toast.success('Slot status updated');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchDashboardData(selectedType);
  }, [selectedType]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsCards = [
  {
    title: "Total Slots",
    value: dashboardData?.overview.totalSlots || 0,
    gradient: "from-slate-600 via-slate-700 to-slate-800",
    bgPattern: "from-slate-50 to-slate-100",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    textColor: "text-slate-700",
    trend: "+12%",
    description: "All parking slots",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>
    )
  },
  {
    title: "Available",
    value: dashboardData?.overview.availableSlots || 0,
    gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
    bgPattern: "from-emerald-50 to-emerald-100",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    textColor: "text-emerald-700",
    trend: "+5%",
    description: "Ready for parking",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    )
  },
  {
    title: "Occupied",
    value: dashboardData?.overview.occupiedSlots || 0,
    gradient: "from-rose-500 via-rose-600 to-rose-700",
    bgPattern: "from-rose-50 to-rose-100",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    textColor: "text-rose-700",
    trend: "-8%",
    description: "Currently in use",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
      </svg>
    )
  },
  {
    title: "Maintenance",
    value: dashboardData?.overview.maintenanceSlots || 0,
    gradient: "from-amber-500 via-amber-600 to-amber-700",
    bgPattern: "from-amber-50 to-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    textColor: "text-amber-700",
    trend: "0%",
    description: "Under maintenance",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    )
  },
  {
    title: "Active Sessions",
    value: dashboardData?.overview.activeSessions || 0,
    gradient: "from-violet-500 via-violet-600 to-violet-700",
    bgPattern: "from-violet-50 to-violet-100",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    textColor: "text-violet-700",
    trend: "+15%",
    description: "Live parking sessions",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    )
  },
  {
    title: "Total Vehicles",
    value: dashboardData?.overview.totalVehicles || 0,
    gradient: "from-blue-500 via-blue-600 to-blue-700",
    bgPattern: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    textColor: "text-blue-700",
    trend: "+23%",
    description: "Registered vehicles",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
      </svg>
    )
  }
];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Modern Page Header */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100 bg-gradient-to-r from-blue-100 to-indigo-300">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Parking Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Real-time parking management and analytics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Search Section */}
        <SearchSection 
          searchPlate={searchPlate}
          setSearchPlate={setSearchPlate}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          searchResult={searchResult}
        />

        {/* Tabbed Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Slots Overview', icon: '🏢' },
                { id: 'vehicles', label: 'Vehicle Database', icon: '🚗' },
                { id: 'active-sessions', label: 'Active Sessions', icon: '⏱️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-6 px-4 border-b-4 font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <SlotsOverview 
                dashboardData={dashboardData}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                handleMaintenanceToggle={handleMaintenanceToggle}
              />
            )}

            {activeTab === 'vehicles' && (
              <VehicleDatabase dashboardData={dashboardData} />
            )}

            {activeTab === 'active-sessions' && (
              <ActiveSessions dashboardData={dashboardData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
