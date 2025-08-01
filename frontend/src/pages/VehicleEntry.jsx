import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { ParkingContext } from '../contexts/ParkingContext';
import { toast } from 'react-toastify';

const VehicleEntry = () => {
  const [number_plate, setNumberPlate] = useState('');
  const [type, setType] = useState('Car');
  const [billing_type, setBillingType] = useState('hourly');
  const [overrideSlot, setOverrideSlot] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { BASE_URL, slots, fetchSlots } = useContext(ParkingContext);
  useEffect(() => {
    if (fetchSlots) fetchSlots();
  }, [type]); 
  useEffect(() => {
    const interval = setInterval(() => {
      if (fetchSlots) fetchSlots();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [fetchSlots]);

  const getPreferredSlotId = () => {
    if (!overrideSlot) return null;
    const slot = slots.find(s => s.slot_number.toLowerCase() === overrideSlot.toLowerCase());
    return slot ? slot._id : null;
  };

  const getAvailableSlots = () => {
    let allowedTypes = [];
    if (type === 'Bike') allowedTypes = ['Bike'];
    else if (type === 'EV') allowedTypes = ['EV'];
    else if (type === 'Handicap Accessible') allowedTypes = ['Handicap Accessible'];
    else allowedTypes = ['Regular', 'Compact'];

    return slots.filter(slot => 
      allowedTypes.includes(slot.type) && slot.status === 'Available'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const preferred_slot_id = getPreferredSlotId();
    
    if (overrideSlot && !preferred_slot_id) {
      toast.error('Preferred slot number not found or not available.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/vehicles/entry`, {
        number_plate,
        type,
        billing_type,
        ...(preferred_slot_id && { preferred_slot_id })
      });
      
      toast.success(`${response.data.message} - Assigned Slot: ${response.data.slot}`);
      
      if (fetchSlots) fetchSlots();
      setNumberPlate('');
      setOverrideSlot('');
      
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to park vehicle');
    }
    setLoading(false);
  };

  const availableSlots = getAvailableSlots();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 bg-gradient-to-br from-blue-100 via-white to-indigo-100">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6">
            <h2 className="text-xl font-semibold text-white text-center">Create New Vehicle Entry</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 16a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2a2 2 0 012-2h4a2 2 0 012 2v2z"/>
                </svg>
                Vehicle Number Plate *
              </label>
              <input
                type="text"
                placeholder="e.g., MH12AB1234"
                value={number_plate}
                onChange={e => setNumberPlate(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-lg font-medium"
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                  </svg>
                  Vehicle Type *
                </label>
                <select 
                  value={type} 
                  onChange={e => setType(e.target.value)} 
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 bg-white"
                  disabled={loading}
                >
                  <option value="Car">🚗 Car</option>
                  <option value="Bike">🏍️ Bike</option>
                  <option value="EV">⚡ Electric Vehicle</option>
                  <option value="Handicap Accessible">♿ Handicap Accessible</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700">
                  <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/>
                  </svg>
                  Billing Type *
                </label>
                <select 
                  value={billing_type} 
                  onChange={e => setBillingType(e.target.value)} 
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-300 bg-white"
                  disabled={loading}
                >
                  <option value="hourly">⏰ Hourly Billing</option>
                  <option value="daypass">📅 Day Pass</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                Preferred Slot (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., R-01, C-02 (Auto-assign if empty)"
                value={overrideSlot}
                onChange={e => setOverrideSlot(e.target.value.toUpperCase())}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-300"
                disabled={loading}
              />
            </div>
            {availableSlots.length > 0 ? (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="font-bold text-green-800">
                    Available Slots for {type}: {availableSlots.length} slots
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSlots.slice(0, 12).map(slot => (
                    <button
                      key={slot._id}
                      type="button"
                      onClick={() => setOverrideSlot(slot.slot_number)}
                      className="px-4 py-2 bg-white border-2 border-green-300 text-green-700 rounded-lg hover:bg-green-100 hover:border-green-400 transition-all duration-200 font-semibold"
                      disabled={loading}
                    >
                      {slot.slot_number}
                    </button>
                  ))}
                  {availableSlots.length > 12 && (
                    <div className="px-4 py-2 bg-green-100 text-green-600 rounded-lg font-medium">
                      +{availableSlots.length - 12} more
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="bg-red-500 p-2 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-800 font-bold">No available slots for {type} vehicles</p>
                    <p className="text-red-600 text-sm">Try a different vehicle type or check back later</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || availableSlots.length === 0}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                loading || availableSlots.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Processing Entry...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Park Vehicle
                </div>
              )}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default VehicleEntry;
