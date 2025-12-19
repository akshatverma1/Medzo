import { useLocation } from "react-router-dom"
import Sidebar from "../shared/Sidebar.jsx"
import Topbar from "../shared/Topbar.jsx"
import React from 'react';
import { useState, useEffect } from "react"

export default function Dashboard() {
  const role = new URLSearchParams(useLocation().search).get("role") || "patient"
  const roleLabel = role === "doctor" ? "Doctor" : role === "hospital" ? "Hospital" : role === "patient" ? "Patient" : "User"

  const [patient, setPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);

  // Chat Feature States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatUsers, setChatUsers] = useState([]);

  const API_BASE = 'http://localhost:3000';

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
    initializeChatUsers();
  }, []);

  // Initialize chat users (doctors and hospitals)
  const initializeChatUsers = () => {
    const users = [
      { id: 1, name: "Dr. Sarah Johnson", type: "doctor", specialty: "Cardiology", online: true, lastSeen: "2 min ago" },
      { id: 2, name: "Dr. Michael Chen", type: "doctor", specialty: "Neurology", online: false, lastSeen: "1 hour ago" },
      { id: 3, name: "City General Hospital", type: "hospital", department: "Emergency", online: true, lastSeen: "Just now" },
      { id: 4, name: "Dr. Priya Sharma", type: "doctor", specialty: "Pediatrics", online: true, lastSeen: "5 min ago" },
      { id: 5, name: "Metropolitan Medical", type: "hospital", department: "Reception", online: true, lastSeen: "Just now" }
    ];
    setChatUsers(users);
  };

  // Filter doctors and hospitals when search term changes
  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filteredDocs = doctors.filter(doctor =>
        doctor.name?.toLowerCase().includes(searchLower) ||
        doctor.specialization?.toLowerCase().includes(searchLower) ||
        doctor.organization?.name?.toLowerCase().includes(searchLower)
      );
      const filteredHosps = hospitals.filter(hospital =>
        hospital.name?.toLowerCase().includes(searchLower) ||
        hospital.fullAddress?.toLowerCase().includes(searchLower) ||
        hospital.type?.toLowerCase().includes(searchLower)
      );
      setFilteredDoctors(filteredDocs);
      setFilteredHospitals(filteredHosps);
    } else {
      setFilteredDoctors(doctors);
      setFilteredHospitals(hospitals);
    }
  }, [searchTerm, doctors, hospitals]);

  // Fetch all necessary data
  async function fetchAllData() {
    setLoading(true);
    setError("");
    try {
      await Promise.all([
        fetchPatientProfile(),
        fetchDoctors(),
        fetchHospitals()
      ]);
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('💥 Error loading data:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get patient profile
  async function fetchPatientProfile() {
    try {
      const response = await fetch(`${API_BASE}/api/patients`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const patients = await response.json();
      if (patients.length > 0) {
        setPatient(patients[0]);
        generateAppointments(patients[0]);
      }
    } catch (error) {
      console.error('💥 Error fetching patient profile:', error);
      throw error;
    }
  }

  // Get all doctors
  async function fetchDoctors() {
    try {
      const response = await fetch(`${API_BASE}/api/doctors`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('✅ Doctors data received:', data);
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (error) {
      console.error('💥 Error fetching doctors:', error);
      throw error;
    }
  }

  // Get all hospitals
  async function fetchHospitals() {
    try {
      const response = await fetch(`${API_BASE}/api/hospitals`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      console.log('✅ Hospitals data received:', data);
      setHospitals(data);
      setFilteredHospitals(data);
    } catch (error) {
      console.error('💥 Error fetching hospitals:', error);
      throw error;
    }
  }

  // Generate mock appointments
  function generateAppointments(patientData) {
    const mockAppointments = [
      {
        id: 1,
        doctorName: "Dr. Sarah Johnson",
        specialty: "Cardiology",
        date: "Today, 10:00 AM",
        hospital: "City General Hospital",
        status: "Confirmed"
      },
      {
        id: 2,
        doctorName: "Dr. Michael Chen",
        specialty: "Neurology",
        date: "Tomorrow, 2:00 PM",
        hospital: "Metropolitan Medical Center",
        status: "Scheduled"
      },
      {
        id: 3,
        doctorName: "Dr. Priya Sharma",
        specialty: "Pediatrics",
        date: "Dec 20, 11:00 AM",
        hospital: "Children's Healthcare",
        status: "Pending"
      }
    ];
    setAppointments(mockAppointments);
  }

  // Book appointment
  async function bookAppointment(doctorId, hospitalId) {
    try {
      console.log('Booking appointment:', { doctorId, hospitalId });
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  }

  // Test backend connection
  async function testBackendConnection() {
    try {
      const response = await fetch(`${API_BASE}/api/patients`);
      if (response.ok) {
        alert('✅ Backend connection successful!');
        fetchAllData();
      } else {
        alert('❌ Backend connection failed!');
      }
    } catch (error) {
      alert('❌ Backend connection failed: ' + error.message);
    }
  }

  // Calculate distance (mock function)
  function calculateDistance(location) {
    const distances = ['0.5 km', '1.2 km', '2.5 km', '3.8 km', '5.1 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  }

  // OpenStreetMap Component
  const OpenStreetMap = ({ location, type, name }) => {
    if (!location || !location.latitude || !location.longitude) {
      return (
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-gray-500">Location data not available</p>
        </div>
      );
    }

    const { latitude, longitude } = location;
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01}%2C${latitude-0.01}%2C${longitude+0.01}%2C${latitude+0.01}&layer=mapnik&marker=${latitude}%2C${longitude}`;

    return (
      <div className="bg-white rounded-lg border border-gray-200 mt-4">
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-semibold text-gray-800">
            {type === 'doctor' ? 'Doctor Location' : 
             type === 'hospital' ? 'Hospital Location' : 
             'Patient Location'} - {name}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
        
        <div className="rounded-b-lg overflow-hidden">
          <iframe
            width="100%"
            height="300"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={mapUrl}
            title={`Location of ${name}`}
            className="w-full"
          >
          </iframe>
        </div>
        
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <a 
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            View larger map on OpenStreetMap →
          </a>
        </div>
      </div>
    );
  };

  // Chat Functions
  const openChat = (user) => {
    setSelectedChat(user);
    setIsChatOpen(true);
    // Load previous messages for this chat
    const previousMessages = [
      { id: 1, text: "Hello! How can I help you today?", sender: user.id, timestamp: new Date(Date.now() - 300000) },
      { id: 2, text: "I wanted to ask about my recent test results.", sender: 'me', timestamp: new Date(Date.now() - 240000) },
      { id: 3, text: "Your test results are ready. Would you like me to explain them?", sender: user.id, timestamp: new Date(Date.now() - 120000) }
    ];
    setMessages(previousMessages);
  };

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'me',
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
    
    // Simulate reply after 1-3 seconds
    setTimeout(() => {
      const replies = [
        "I understand your concern. Let me check that for you.",
        "Thank you for sharing that information.",
        "I'll look into this and get back to you shortly.",
        "Is there anything else I can help you with?",
        "Your request has been noted. We'll follow up soon."
      ];
      const reply = {
        id: messages.length + 2,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: selectedChat.id,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, reply]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Topbar /> */}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {patient?.name || 'Patient'}</h1>
              <p className="text-gray-600 mt-2">Your health is our priority</p>
              {patient && (
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                  <span>Age: {patient.age} years</span>
                  <span>•</span>
                  <span>Gender: {patient.gender}</span>
                  {patient.assignedDoctor && (
                    <>
                      <span>•</span>
                      <span>Doctor: {patient.assignedDoctor.name}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={testBackendConnection}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for doctors, hospitals, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <strong>Error: </strong>{error}
                </div>
                <button 
                  className="ml-4 px-3 py-1 border border-red-300 rounded text-red-700 hover:bg-red-200 transition-colors text-sm"
                  onClick={fetchAllData}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {['overview', 'hospitals', 'doctors', 'appointments', 'medical'].map(tab => (
              <button
                key={tab}
                className={`px-6 py-3 font-medium text-base capitalize whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'medical' ? 'Medical Records' : tab}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">🏥</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-2xl">{hospitals.length}</h3>
                    <p className="text-sm text-gray-600 mt-1">Hospitals Nearby</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">👨‍⚕️</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-2xl">{doctors.length}</h3>
                    <p className="text-sm text-gray-600 mt-1">Doctors Available</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-lg">📅</span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-2xl">{appointments.length}</h3>
                    <p className="text-sm text-gray-600 mt-1">Upcoming Appointments</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Upcoming Appointments */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {appointments.length} appointments
                      </span>
                    </div>
                    <div className="space-y-4">
                      {appointments.map(appt => (
                        <div key={appt.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                            <div className="mb-3 sm:mb-0">
                              <h4 className="font-semibold text-gray-800">{appt.doctorName}</h4>
                              <p className="text-sm text-gray-600">{appt.specialty}</p>
                              <p className="text-xs text-gray-500 mt-1">{appt.hospital}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-semibold text-gray-800">{appt.date}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded ${
                                appt.status === 'Confirmed' 
                                  ? 'bg-green-100 text-green-800'
                                  : appt.status === 'Scheduled'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appt.status}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                              Reschedule
                            </button>
                            <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        className="p-4 border border-gray-200 rounded-lg text-center hover:bg-blue-50 transition-colors"
                        onClick={() => setActiveTab('doctors')}
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-sm">👨‍⚕️</span>
                        </div>
                        <span className="text-sm font-medium">Find Doctor</span>
                      </button>
                      <button 
                        className="p-4 border border-gray-200 rounded-lg text-center hover:bg-green-50 transition-colors"
                        onClick={() => setActiveTab('hospitals')}
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-sm">🏥</span>
                        </div>
                        <span className="text-sm font-medium">Find Hospital</span>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg text-center hover:bg-purple-50 transition-colors">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-sm">💊</span>
                        </div>
                        <span className="text-sm font-medium">Medications</span>
                      </button>
                      <button className="p-4 border border-gray-200 rounded-lg text-center hover:bg-orange-50 transition-colors">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white text-sm">📋</span>
                        </div>
                        <span className="text-sm font-medium">My Records</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nearby Hospitals Preview */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Hospitals Around You</h2>
                    <button 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      onClick={() => setActiveTab('hospitals')}
                    >
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {hospitals.slice(0, 4).map(hospital => (
                      <div key={hospital._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {hospital.fullAddress}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          🏃‍♂️ {calculateDistance(hospital)} away
                        </p>
                        <p className="text-xs text-gray-500">
                          🏥 {hospital.type === 'gov' ? 'Government' : 'Private'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hospitals Tab */}
            {activeTab === 'hospitals' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Hospitals Around You'}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredHospitals.length} hospitals
                  </span>
                </div>

                <div className="space-y-6">
                  {filteredHospitals.map(hospital => (
                    <div key={hospital._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-lg">🏥</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-800 mb-2">{hospital.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  📍 {hospital.fullAddress}
                                </p>
                                <p className="text-gray-600">📞 {hospital.phone}</p>
                                <p className="text-gray-600">📧 {hospital.email}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">🏥 Type: {hospital.type === 'gov' ? 'Government' : 'Private'}</p>
                                <p className="text-gray-600">👥 Staff: {hospital.staffCount}</p>
                                <p className="text-green-600 font-medium">
                                  🏃‍♂️ {calculateDistance(hospital)} away
                                </p>
                              </div>
                            </div>
                            
                            {hospital.facilities && hospital.facilities.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700">Facilities:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {hospital.facilities.slice(0, 5).map((facility, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                      {facility}
                                    </span>
                                  ))}
                                  {hospital.facilities.length > 5 && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                      +{hospital.facilities.length - 5} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={() => bookAppointment(null, hospital._id)}
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>

                      {/* Hospital Map */}
                      <OpenStreetMap 
                        location={hospital.geoLocation}
                        type="hospital"
                        name={hospital.name}
                      />
                    </div>
                  ))}
                  
                  {filteredHospitals.length === 0 && (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🏥</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {searchTerm ? 'No hospitals found' : 'No Hospitals Available'}
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms' : 'Check back later for hospital listings'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-2 sm:mb-0">
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'Doctors Around You'}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {filteredDoctors.length} doctors
                  </span>
                </div>

                <div className="space-y-6">
                  {filteredDoctors.map(doctor => (
                    <div key={doctor._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {doctor.name?.[0]}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-800">
                               {doctor.name}
                            </h3>
                            <p className="text-lg text-blue-600 font-medium mb-2">{doctor.specialization}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">📧 {doctor.email}</p>
                                <p className="text-gray-600">📞 {doctor.phone}</p>
                                {doctor.organization && (
                                  <p className="text-gray-600">🏥 {doctor.organization.name}</p>
                                )}
                              </div>
                              <div>
                                {doctor.degree && doctor.degree.length > 0 && (
                                  <p className="text-gray-600">
                                    🎓 {doctor.degree.slice(0, 2).join(', ')}
                                    {doctor.degree.length > 2 && '...'}
                                  </p>
                                )}
                                <p className="text-green-600 font-medium">
                                  🏃‍♂️ {calculateDistance(doctor)} away
                                </p>
                                <p className="text-gray-600">💰 ${doctor.visitingFees} fee</p>
                              </div>
                            </div>
                            
                            {doctor.permanentAddress && (
                              <p className="text-sm text-gray-500 mt-2">
                                📍 {doctor.permanentAddress}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {doctor.experience} years experience
                              </span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                {doctor.timeShift}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                {doctor.gender}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={() => bookAppointment(doctor._id, doctor.organization?._id)}
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>

                      {/* Doctor Map */}
                      <OpenStreetMap 
                        location={doctor.geoLocation}
                        type="doctor"
                        name={` ${doctor.name}`}
                      />
                    </div>
                  ))}
                  
                  {filteredDoctors.length === 0 && (
                    <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👨‍⚕️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {searchTerm ? 'No doctors found' : 'No Doctors Available'}
                      </h3>
                      <p className="text-gray-600">
                        {searchTerm ? 'Try adjusting your search terms' : 'Check back later for doctor listings'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">My Appointments</h2>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mt-2 sm:mt-0">
                    Book New Appointment
                  </button>
                </div>

                <div className="space-y-6">
                  {appointments.map(appt => (
                    <div key={appt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-lg">👨‍⚕️</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">{appt.doctorName}</h3>
                            <p className="text-gray-600">{appt.specialty}</p>
                            <p className="text-sm text-gray-500 mt-1">{appt.hospital}</p>
                          </div>
                        </div>
                        <div className="text-left lg:text-right">
                          <p className="font-semibold text-gray-800">{appt.date}</p>
                          <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                            appt.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800'
                              : appt.status === 'Scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          Reschedule
                        </button>
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                        <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'medical' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800">Medical Records</h2>
                
                {patient && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Full Name:</span>
                          <span className="font-medium">{patient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium">{patient.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium">{patient.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{patient.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{patient.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Medical History */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Medical History</h3>
                      {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                        <div className="space-y-2">
                          {patient.medicalHistory.map((condition, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-gray-700">{condition}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No medical history recorded</p>
                      )}
                    </div>

                    {/* Assigned Doctor */}
                    {patient.assignedDoctor && (
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Primary Doctor</h3>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600">👨‍⚕️</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {patient.assignedDoctor.name}
                            </h4>
                            <p className="text-gray-600">{patient.assignedDoctor.specialization}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location Information */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">My Location</h3>
                      
                      {/* Patient Map */}
                      <OpenStreetMap 
                        location={patient.geoLocation}
                        type="patient"
                        name={patient.name}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Chat Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💬</span>
                <h2 className="text-xl font-bold">Messages</h2>
              </div>
              <button 
                className="w-8 h-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
                onClick={() => setIsChatOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Users List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {chatUsers.map(user => (
                <div 
                  key={user.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedChat?.id === user.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => openChat(user)}
                >
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                      user.type === 'doctor' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {user.type === 'doctor' ? '👨‍⚕️' : '🏥'}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      user.online ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                      {user.online && (
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {user.type === 'doctor' ? user.specialty : user.department}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.online ? 'Online' : `Last seen ${user.lastSeen}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          {selectedChat && (
            <div className="flex-1 flex flex-col border-t border-gray-200">
              {/* Current Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                      selectedChat.type === 'doctor' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {selectedChat.type === 'doctor' ? '👨‍⚕️' : '🏥'}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white ${
                      selectedChat.online ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900">{selectedChat.name}</p>
                      {selectedChat.online && (
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedChat.online ? 'Online' : `Last seen ${selectedChat.lastSeen}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-2 ${
                      message.sender === 'me' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="1"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Toggle Button */}
      {!isChatOpen && (
        <button 
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40"
          onClick={() => setIsChatOpen(true)}
        >
          <span className="text-xl">💬</span>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </button>
      )}
    </div>
  )
}