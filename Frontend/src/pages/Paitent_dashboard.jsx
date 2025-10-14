import { useLocation } from "react-router-dom"
import Sidebar from "../shared/Sidebar.jsx"
import Topbar from "../shared/Topbar.jsx"
import MetricsRow from "../shared/MetricsRow.jsx"
import Charts from "../shared/Charts.jsx"
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

  const API_BASE = 'http://127.0.0.1:3000';

  // Mock patient data (in real app, this would come from auth context)
  const currentPatientId = "mock-patient-id";

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter doctors and hospitals when search term changes
  useEffect(() => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const filteredDocs = doctors.filter(doctor =>
        `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchLower) ||
        doctor.specialty.toLowerCase().includes(searchLower) ||
        doctor.hospital?.name.toLowerCase().includes(searchLower)
      );
      const filteredHosps = hospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchLower) ||
        hospital.address?.city.toLowerCase().includes(searchLower) ||
        hospital.address?.state.toLowerCase().includes(searchLower)
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
      // In real app, you'd fetch the specific patient's profile
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
      // In real app, you'd make a POST request to create appointment
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

  // Calculate distance (mock function - in real app, use geolocation)
  function calculateDistance(hospital) {
    const distances = ['0.5 km', '1.2 km', '2.5 km', '3.8 km', '5.1 km'];
    return distances[Math.floor(Math.random() * distances.length)];
  }

  return (
    <main className="dashboard grid-2-fixed">
      <Sidebar />
      <section className="column">
        <Topbar />
        <div className="container-narrow py-24">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="h2">Welcome back, {patient?.firstName || 'Patient'}</h1>
              <p className="muted mt-2">Your health is our priority</p>
              {patient && (
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                  <span>Age: {patient.age} years</span>
                  <span>•</span>
                  <span>Gender: {patient.gender}</span>
                  {patient.assignedDoctor && (
                    <>
                      <span>•</span>
                      <span>Doctor: Dr. {patient.assignedDoctor.firstName}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <button 
              className="btn btn-outline"
              onClick={testBackendConnection}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {/* Search Bar */}
          <div className="card p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for doctors, hospitals, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="btn btn-outline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong>Error: </strong>{error}
              <button 
                className="btn btn-sm btn-outline ml-2"
                onClick={fetchAllData}
              >
                Retry
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {['overview', 'hospitals', 'doctors', 'appointments', 'medical'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm capitalize ${
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats */}
              <div className="grid-3 mt-8 gap-6">
                <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-lg">🏥</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{hospitals.length}</h3>
                  <p className="text-sm text-gray-600 mt-1">Hospitals Nearby</p>
                </div>

                <div className="card p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-lg">👨‍⚕️</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{doctors.length}</h3>
                  <p className="text-sm text-gray-600 mt-1">Doctors Available</p>
                </div>

                <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-lg">📅</span>
                  </div>
                  <h3 className="font-semibold text-gray-800">{appointments.length}</h3>
                  <p className="text-sm text-gray-600 mt-1">Upcoming Appointments</p>
                </div>
              </div>

              <div className="grid-2 mt-8 gap-8">
                {/* Upcoming Appointments */}
                <div className="card p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="h4 text-gray-800">Upcoming Appointments</h2>
                    <span className="badge badge-primary">{appointments.length} appointments</span>
                  </div>
                  <div className="space-y-4">
                    {appointments.map(appt => (
                      <div key={appt.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{appt.doctorName}</h4>
                            <p className="text-sm text-gray-600">{appt.specialty}</p>
                            <p className="text-xs text-gray-500 mt-1">{appt.hospital}</p>
                          </div>
                          <div className="text-right">
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
                          <button className="btn btn-sm btn-outline flex-1">Reschedule</button>
                          <button className="btn btn-sm btn-primary flex-1">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card p-6">
                  <h2 className="h4 text-gray-800 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      className="p-4 border rounded-lg text-center hover:bg-blue-50 transition-colors"
                      onClick={() => setActiveTab('doctors')}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm">👨‍⚕️</span>
                      </div>
                      <span className="text-sm font-medium">Find Doctor</span>
                    </button>
                    <button 
                      className="p-4 border rounded-lg text-center hover:bg-green-50 transition-colors"
                      onClick={() => setActiveTab('hospitals')}
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm">🏥</span>
                      </div>
                      <span className="text-sm font-medium">Find Hospital</span>
                    </button>
                    <button className="p-4 border rounded-lg text-center hover:bg-purple-50 transition-colors">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm">💊</span>
                      </div>
                      <span className="text-sm font-medium">Medications</span>
                    </button>
                    <button className="p-4 border rounded-lg text-center hover:bg-orange-50 transition-colors">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm">📋</span>
                      </div>
                      <span className="text-sm font-medium">My Records</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Nearby Hospitals Preview */}
              <div className="card p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="h4 text-gray-800">Hospitals Around You</h2>
                  <button 
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveTab('hospitals')}
                  >
                    View All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {hospitals.slice(0, 4).map(hospital => (
                    <div key={hospital._id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {hospital.address?.city}, {hospital.address?.state}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        🏃‍♂️ {calculateDistance(hospital)} away
                      </p>
                      <p className="text-xs text-gray-500">
                        🛏️ {hospital.capacityBeds} beds • 🫁 {hospital.ventilatorCount} ventilators
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Hospitals Tab */}
          {activeTab === 'hospitals' && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="h3 text-gray-800">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Hospitals Around You'}
                </h2>
                <span className="badge badge-primary">{filteredHospitals.length} hospitals</span>
              </div>

              <div className="grid gap-6">
                {filteredHospitals.map(hospital => (
                  <div key={hospital._id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">🏥</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-gray-800 mb-2">{hospital.name}</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">
                                📍 {hospital.address?.city}, {hospital.address?.state}, {hospital.address?.country}
                              </p>
                              <p className="text-gray-600">📞 {hospital.phone}</p>
                              <p className="text-gray-600">📧 {hospital.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">🛏️ Bed Capacity: {hospital.capacityBeds}</p>
                              <p className="text-gray-600">🫁 Ventilators: {hospital.ventilatorCount}</p>
                              <p className="text-green-600 font-medium">
                                🏃‍♂️ {calculateDistance(hospital)} away
                              </p>
                            </div>
                          </div>
                          
                          {hospital.equipment && hospital.equipment.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700">Available Equipment:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {hospital.equipment.slice(0, 5).map((equip, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                    {equip}
                                  </span>
                                ))}
                                {hospital.equipment.length > 5 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    +{hospital.equipment.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button 
                          className="btn btn-primary"
                          onClick={() => bookAppointment(null, hospital._id)}
                        >
                          Book Appointment
                        </button>
                        <button className="btn btn-outline">
                          View Doctors
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredHospitals.length === 0 && (
                  <div className="card p-12 text-center">
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
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="h3 text-gray-800">
                  {searchTerm ? `Search Results for "${searchTerm}"` : 'Doctors Around You'}
                </h2>
                <span className="badge badge-primary">{filteredDoctors.length} doctors</span>
              </div>

              <div className="grid gap-6">
                {filteredDoctors.map(doctor => (
                  <div key={doctor._id} className="card p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            Dr. {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-gray-800">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-lg text-blue-600 font-medium mb-2">{doctor.specialty}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">📧 {doctor.email}</p>
                              <p className="text-gray-600">📞 {doctor.phone}</p>
                              {doctor.hospital && (
                                <p className="text-gray-600">🏥 {doctor.hospital.name}</p>
                              )}
                            </div>
                            <div>
                              {doctor.qualifications && doctor.qualifications.length > 0 && (
                                <p className="text-gray-600">
                                  🎓 {doctor.qualifications.slice(0, 2).join(', ')}
                                  {doctor.qualifications.length > 2 && '...'}
                                </p>
                              )}
                              <p className="text-green-600 font-medium">
                                🏃‍♂️ {calculateDistance(doctor)} away
                              </p>
                            </div>
                          </div>
                          
                          {doctor.hospital?.address && (
                            <p className="text-sm text-gray-500 mt-2">
                              📍 {doctor.hospital.address.city}, {doctor.hospital.address.state}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button 
                          className="btn btn-primary"
                          onClick={() => bookAppointment(doctor._id, doctor.hospital?._id)}
                        >
                          Book Appointment
                        </button>
                        <button className="btn btn-outline">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredDoctors.length === 0 && (
                  <div className="card p-12 text-center">
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
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="h3 text-gray-800">My Appointments</h2>
                <button className="btn btn-primary">Book New Appointment</button>
              </div>

              <div className="grid gap-6">
                {appointments.map(appt => (
                  <div key={appt.id} className="card p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-lg">👨‍⚕️</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">{appt.doctorName}</h3>
                          <p className="text-gray-600">{appt.specialty}</p>
                          <p className="text-sm text-gray-500 mt-1">{appt.hospital}</p>
                        </div>
                      </div>
                      <div className="text-right">
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
                    <div className="flex space-x-2 mt-4">
                      <button className="btn btn-outline flex-1">Reschedule</button>
                      <button className="btn btn-outline flex-1">Cancel</button>
                      <button className="btn btn-primary flex-1">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Records Tab */}
          {activeTab === 'medical' && (
            <div className="mt-8">
              <h2 className="h3 text-gray-800 mb-6">Medical Records</h2>
              
              {patient && (
                <div className="grid-2 gap-8">
                  {/* Personal Information */}
                  <div className="card p-6">
                    <h3 className="h4 text-gray-800 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{patient.firstName} {patient.lastName}</span>
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
                  <div className="card p-6">
                    <h3 className="h4 text-gray-800 mb-4">Medical History</h3>
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
                    <div className="card p-6">
                      <h3 className="h4 text-gray-800 mb-4">Primary Doctor</h3>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600">👨‍⚕️</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Dr. {patient.assignedDoctor.firstName} {patient.assignedDoctor.lastName}
                          </h4>
                          <p className="text-gray-600">{patient.assignedDoctor.specialty}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Address Information */}
                  {patient.address && (
                    <div className="card p-6">
                      <h3 className="h4 text-gray-800 mb-4">Address</h3>
                      <div className="space-y-2">
                        <p className="text-gray-700">{patient.address.city}</p>
                        <p className="text-gray-700">{patient.address.state}, {patient.address.country}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}