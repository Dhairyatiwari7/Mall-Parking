import React from 'react';

const FormCard = ({ title, subtitle, icon, children, headerGradient = "from-blue-500 to-indigo-600" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className={`bg-gradient-to-r ${headerGradient} p-6`}>
        <div className="flex items-center">
          {icon && (
            <div className="bg-white/20 p-3 rounded-xl mr-4">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default FormCard;
