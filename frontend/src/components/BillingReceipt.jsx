import React from 'react';

const BillingReceipt = ({ billingDetails, numberPlate, onReset }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8">
      <div className="text-center mb-8">
        <div className="bg-green-500 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        <h3 className="text-3xl font-bold text-green-800 mb-2">Exit Successful!</h3>
        <p className="text-green-600 text-lg">Vehicle has been checked out</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-green-300 shadow-lg">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-bold text-gray-800 mb-2">PARKING RECEIPT</h4>
          <div className="w-24 h-1 bg-green-500 mx-auto rounded"></div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Vehicle Number:</span>
            <span className="font-bold text-lg">{numberPlate}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Exit Time:</span>
            <span className="font-bold">{new Date().toLocaleString()}</span>
          </div>
          <div className="bg-green-50 rounded-xl p-4 mt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total Amount:</span>
              <span className="text-3xl font-bold text-green-600">₹{billingDetails.billing_amount}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Thank you for using our parking facility!</p>
          <div className="flex items-center justify-center text-sm text-gray-400">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
            </svg>
            Generated at {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-bold transform hover:scale-105 shadow-lg"
        >
          Process Another Exit
        </button>
      </div>
    </div>
  );
};

export default BillingReceipt;
