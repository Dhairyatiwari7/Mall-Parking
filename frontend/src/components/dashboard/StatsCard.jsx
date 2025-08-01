import React from 'react';

const StatsCard = ({ title, value, icon, gradient }) => {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium opacity-90">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
