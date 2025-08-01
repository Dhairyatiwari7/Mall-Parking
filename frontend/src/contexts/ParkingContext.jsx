import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const ParkingContext = createContext();

const ParkingProvider = ({ children }) => {
  const BASE_URL = 'http://localhost:5000/api';
  
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSlots = async (type = '') => {
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/slots/list`, 
        type ? { type } : {}
      );
      setSlots(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const toggleMaintenance = async (slot) => {
    try {
      const endpoint = slot.status === 'Maintenance'
        ? `${BASE_URL}/slots/${slot._id}/available`
        : `${BASE_URL}/slots/${slot._id}/maintenance`;

      await axios.post(endpoint, {});
      await fetchSlots();
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const value = {
    BASE_URL,
    slots,
    loading,
    error,
    setError,
    fetchSlots,
    toggleMaintenance
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};

export default ParkingProvider;
