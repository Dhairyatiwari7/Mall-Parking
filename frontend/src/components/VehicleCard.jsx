import React from 'react';

const VehicleCard = ({ vehicle, isSelected, onSelect, onExit }) => {
  const calculateDuration = (entryTime) => {
    const now = new Date();
    const entry = new Date(entryTime);
    const diffMs = now - entry;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const duration = calculateDuration(vehicle.entry_time);

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'border-red-500 bg-red-50 shadow-lg transform scale-105' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-gray-800 mb-1">
            {vehicle.vehicle_id.number_plate}
          </h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
            Active Session
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-bold text-lg text-purple-600">{duration.hours}h {duration.minutes}m</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-600 font-medium">Type</p>
          <p className="font-semibold">{vehicle.vehicle_id.type}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Slot</p>
          <p className="font-semibold text-indigo-600">{vehicle.slot_id.slot_number}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Entry</p>
          <p className="font-semibold">{new Date(vehicle.entry_time).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-600 font-medium">Billing</p>
          <p className="font-semibold capitalize">{vehicle.billing_type}</p>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onExit(vehicle);
        }}
        className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold transform hover:scale-105"
      >
        Select for Exit
      </button>
    </div>
  );
};

export default VehicleCard;
