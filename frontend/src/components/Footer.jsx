import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center p-4 text-sm text-gray-600 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <p>
          &copy; {new Date().getFullYear()} Mall Parking System. All rights reserved.
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Designed & Developed by Dhairya
        </p>
      </div>
    </footer>
  );
};


export default Footer;
