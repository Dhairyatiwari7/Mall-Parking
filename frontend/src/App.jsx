import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ParkingProvider from './contexts/ParkingContext'
import Dashboard from './pages/Dashboard';
import VehicleEntry from './pages/VehicleEntry';
import VehicleExit from './pages/VehicleExit';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Alert from './pages/Alert'

const App = () => {
  return (
    <ParkingProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 p-6 bg-gray-50 pt-20">
            <Routes>
              <Route path='/' element={<Dashboard/>}/>
              <Route path='/vehicle-entry' element={<VehicleEntry/>} />
              <Route path='/vehicle-exit' element={<VehicleExit/>} />
              <Route path='/alert' element={<Alert/>} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      
    </ParkingProvider>
  )
}

export default App
