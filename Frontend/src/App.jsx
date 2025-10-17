import { Routes, Route, Link, Navigate } from "react-router-dom"
import Landing from "./pages/Landing.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Features from "./pages/Features.jsx"
import Contact from "./pages/Contact.jsx"
import RegisterHospital from "./pages/register/Hospital.jsx"
import RegisterPatient from "./pages/register/Patient.jsx"
import RegisterDoctor from "./pages/register/Doctor.jsx"
import ApiServicesPage from "./pages/Apiservices.jsx"
import DoctorLogin from "./pages/Login/Doctor_Login.jsx"
import PatientLogin from "./pages/Login/Patient_Login.jsx"
import HospitalLogin from "./pages/Login/Hosiptal_Login.jsx"
import Hospital_dashboard from "./pages/Hosiptal_dashboard.jsx";
import Doctor_dashboard from "./pages/Doctor_dashboard.jsx";
import Patient_dashboard from "./pages/Paitent_dashboard.jsx";
import API_SAAS from "./pages/API_SAAS.jsx";
import ChatPage from "./pages/Chat_open.jsx"
import MapView from "./pages/Mapples/Maps.jsx"
import EMI from "./pages/EMI_PAGE.jsx";
import React, { useState } from 'react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-bg text-foreground min-h-screen flex flex-col">
      {/* CSS Animations */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="relative overflow-hidden bg-white">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        
        {/* Subtle top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient"></div>
        
        <div className="relative w-full max-w-7xl mx-auto border-b border-gray-200">
          <div className="flex items-center justify-between h-20 px-4 lg:px-8">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-md opacity-50 group-hover:opacity-100 group-hover:blur-lg transition-all duration-500"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <img
                    src="https://i.pinimg.com/736x/ce/cc/4e/cecc4e736952fa453cca8ab96d9c30d1.jpg"
                    alt="Medzo Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Medzo
                </span>
                <p className="text-xs text-gray-600 -mt-1 font-semibold">Healthcare Excellence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {[
                { name: 'Home', to: '/' },
                
                
                { name: 'Register', href: '#register' },
                { name: 'Features', to: '/features' },
                { name: 'Contact', to: '/contact' },
                { name: 'API Services', to: '/api_saas' },
                { name: 'Open Chat', to: '/chat' },
                { name: 'Finance', to: '/emi' }
              ].map((item, index) => (
                item.to ? (
                  <Link
                    key={index}
                    to={item.to}
                    className="relative px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-xl"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]"></div>
                    </div>
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={item.href}
                    className="relative px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-300 group overflow-hidden rounded-xl"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_ease-in-out]"></div>
                    </div>
                  </a>
                )
              ))}
            </nav>

            {/* CTA Button & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
              <Link to="/register/patient" className="hidden lg:block relative px-8 py-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white text-sm font-bold rounded-full overflow-hidden group transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/40">
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
              </Link>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 hover:text-blue-600 transition-all duration-300 border border-gray-200 hover:border-blue-300"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div 
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="px-4 py-4 space-y-2 bg-gradient-to-br from-gray-50 to-blue-50/30 border-t border-gray-200">
              {[
                { name: 'Home', to: '/' },
                { name: 'Features', to: '/features' },
                { name: 'Register', href: '#register' },
                { name: 'Contact', to: '/contact' },
                { name: 'API Services', to: '/api_saas' },
                { name: 'Open Chat', to: '/chat' },
                { name: 'Finance', to: '/emi' }
              ].map((item, index) => (
                item.to ? (
                  <Link
                    key={index}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:translate-x-2 shadow-sm hover:shadow-md"
                    style={{transitionDelay: `${index * 30}ms`}}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 border border-gray-200 hover:border-blue-300 transform hover:translate-x-2 shadow-sm hover:shadow-md"
                    style={{transitionDelay: `${index * 30}ms`}}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <Link 
                to="/register/patient" 
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full mt-3 px-6 py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 text-center"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* <div style={{height:"5rem"}}></div> */}

      {/* Main Content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register/hospital" element={<RegisterHospital />} />
          <Route path="/register/patient" element={<RegisterPatient />} />
          <Route path="/register/doctor" element={<RegisterDoctor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api" element={<ApiServicesPage />} />
          <Route path="/doctorlogin" element={<DoctorLogin />} />
          <Route path="/patientlogin" element={<PatientLogin />} />
          <Route path="/hospitallogin" element={<HospitalLogin />} />
          <Route path="/hd" element={<Hospital_dashboard />} />
          <Route path="/dd" element={<Doctor_dashboard />} />
          <Route path="/pd" element={<Patient_dashboard />} />
          <Route path="/api_saas" element={<API_SAAS />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/emi" element={<EMI />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <div style={{height:"10rem"}}></div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-700 bg-clip-text text-transparent">
                  Medzo
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed max-w-md">
                Medzo is a modern healthcare platform that unifies patients, hospitals, and doctors in one ecosystem.
                Schedule faster, collaborate securely, and monitor outcomes with clear analytics.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Product</h4>
              <ul className="space-y-4">
                <li>
                  <Link className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" to="/features">
                    Features
                  </Link>
                </li>
                <li>
                  <a className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" href="#services">
                    Services
                  </a>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get Started Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Get Started</h4>
              <ul className="space-y-4">
                <li>
                  <Link className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" to="/register/patient">
                    Patient Registration
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" to="/register/hospital">
                    Hospital Registration
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" to="/register/doctor">
                    Doctor Registration
                  </Link>
                </li>
                <li>
                  <Link className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-base" to="/contact">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Medzo — All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200 text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}