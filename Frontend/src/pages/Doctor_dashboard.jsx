import { useLocation } from "react-router-dom"
import MetricsRow from "../shared/MetricsRow.jsx"
import Charts from "../shared/Charts.jsx"
import React from 'react';
import { useState, useEffect } from "react"

export default function Dashboard() {
  const role = new URLSearchParams(useLocation().search).get("role") || "doctor"
  const roleLabel = role === "doctor" ? "Doctor" : role === "hospital" ? "Hospital" : role === "patient" ? "Patient" : "User"

  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const API_BASE = 'http://localhost:3000';

  // Mock doctor data (in real app, this would come from auth context)
  const currentDoctorId = "mock-doctor-id";

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all necessary data
  async function fetchAllData() {
    setLoading(true);
    setError("");
    try {
      await Promise.all([
        fetchDoctorProfile(),
        fetchPatients(),
        fetchAllPatients()
      ]);
      console.log('✅ All data loaded successfully');
    } catch (error) {
      console.error('💥 Error loading data:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get doctor profile
  async function fetchDoctorProfile() {
    try {
      // In real app, you'd fetch the specific doctor's profile
      // For now, we'll use the first doctor from the list
      const response = await fetch(`${API_BASE}/api/doctors`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const doctors = await response.json();
      if (doctors.length > 0) {
        setDoctor(doctors[0]);
        
        // Filter patients assigned to this doctor
        const myPatients = allPatients.filter(patient => 
          patient.assignedDoctor && patient.assignedDoctor._id === doctors[0]._id
        );
        setPatients(myPatients);
      }
    } catch (error) {
      console.error('💥 Error fetching doctor profile:', error);
      throw error;
    }
  }

  // Get all patients (for the doctor's assigned patients)
  async function fetchPatients() {
    try {
      const response = await fetch(`${API_BASE}/api/patients`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      
      // Mock: Assign some patients to current doctor
      const myPatients = data.slice(0, 8).map(patient => ({
        ...patient,
        assignedDoctor: doctor || { firstName: "Current", lastName: "Doctor" }
      }));
      
      setPatients(myPatients);
      generateAppointments(myPatients);
    } catch (error) {
      console.error('💥 Error fetching patients:', error);
      throw error;
    }
  }

  // Get all patients for reference
  async function fetchAllPatients() {
    try {
      const response = await fetch(`${API_BASE}/api/patients`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setAllPatients(data);
    } catch (error) {
      console.error('💥 Error fetching all patients:', error);
      throw error;
    }
  }

  // Generate mock appointments based on patients
  function generateAppointments(patientList) {
    const todayAppointments = patientList.slice(0, 4).map((patient, index) => ({
      id: `appt-${index}`,
      patientId: patient._id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      time: `${9 + index * 2}:00`,
      type: ['Consultation', 'Follow-up', 'Check-up', 'Treatment'][index],
      status: index === 0 ? 'In Progress' : 'Scheduled',
      room: `Room ${index + 1}`
    }));
    
    const upcomingAppointments = patientList.slice(4, 8).map((patient, index) => ({
      id: `appt-upcoming-${index}`,
      patientId: patient._id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      date: `Tomorrow ${10 + index}:00`,
      type: ['Consultation', 'Surgery', 'Therapy', 'Examination'][index],
      status: 'Scheduled'
    }));
    
    setAppointments({
      today: todayAppointments,
      upcoming: upcomingAppointments
    });
  }

  // Add prescription to patient
  async function addPrescription(patientId, prescription) {
    try {
      // In real app, you'd make a PUT request to update patient
      console.log('Adding prescription:', { patientId, prescription });
      alert(`Prescription added for patient ${patientId}`);
    } catch (error) {
      console.error('Error adding prescription:', error);
      alert('Failed to add prescription');
    }
  }

  // Update patient status
  async function updatePatientStatus(patientId, status) {
    try {
      // In real app, you'd make a PUT request to update patient
      console.log('Updating patient status:', { patientId, status });
      alert(`Patient status updated to: ${status}`);
    } catch (error) {
      console.error('Error updating patient status:', error);
      alert('Failed to update patient status');
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

  // Calculate statistics
  const stats = {
    totalPatients: patients.length,
    todayAppointments: appointments.today?.length || 0,
    completedTreatments: Math.floor(patients.length * 0.7),
    pendingCases: Math.floor(patients.length * 0.3)
  };

  return (
    <main className="dashboard w-full min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Dr. {doctor?.firstName || 'Doctor'}</h1>
            <p className="text-gray-600 mt-2">
              {doctor?.specialty || 'Medical Specialist'} • {doctor?.hospital?.name || 'General Hospital'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {doctor?.qualifications?.join(', ') || 'MD, MBBS'}
            </p>
          </div>
          <button 
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={testBackendConnection}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error: </strong>{error}
            <button 
              className="ml-2 px-3 py-1 text-sm border border-red-400 rounded hover:bg-red-200"
              onClick={fetchAllData}
            >
              Retry
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['overview', 'patients', 'appointments', 'reports'].map(tab => (
            <button
              key={tab}
              className={`px-6 py-3 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Doctor Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{stats.totalPatients}</span>
                </div>
                <h3 className="font-semibold text-gray-800">Total Patients</h3>
                <p className="text-sm text-gray-600 mt-1">Under your care</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{stats.todayAppointments}</span>
                </div>
                <h3 className="font-semibold text-gray-800">Today's Appointments</h3>
                <p className="text-sm text-gray-600 mt-1">Scheduled visits</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{stats.completedTreatments}</span>
                </div>
                <h3 className="font-semibold text-gray-800">Completed</h3>
                <p className="text-sm text-gray-600 mt-1">Successful treatments</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm text-center border">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold text-lg">{stats.pendingCases}</span>
                </div>
                <h3 className="font-semibold text-gray-800">Pending Cases</h3>
                <p className="text-sm text-gray-600 mt-1">Require attention</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Today's Schedule */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Today's Schedule</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {appointments.today?.length || 0} appointments
                  </span>
                </div>
                <div className="space-y-4">
                  {appointments.today?.map(appt => (
                    <div key={appt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          appt.status === 'In Progress' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{appt.patientName}</h4>
                          <p className="text-sm text-gray-600">{appt.type} • {appt.room}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{appt.time}</p>
                        <p className={`text-xs ${
                          appt.status === 'In Progress' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {appt.status}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!appointments.today || appointments.today.length === 0) && (
                    <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 border rounded-lg text-center hover:bg-blue-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm">📋</span>
                    </div>
                    <span className="text-sm font-medium">New Prescription</span>
                  </button>
                  <button className="p-4 border rounded-lg text-center hover:bg-green-50 transition-colors">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm">📅</span>
                    </div>
                    <span className="text-sm font-medium">Schedule</span>
                  </button>
                  <button className="p-4 border rounded-lg text-center hover:bg-purple-50 transition-colors">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <span className="text-sm font-medium">Reports</span>
                  </button>
                  <button className="p-4 border rounded-lg text-center hover:bg-orange-50 transition-colors">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm">💬</span>
                    </div>
                    <span className="text-sm font-medium">Messages</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Patient Statistics */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Patient Statistics</h2>
                <Charts.BarAppointments />
              </div>

              {/* Treatment Distribution */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Treatment Distribution</h2>
                <Charts.PieTreatments />
              </div>
            </div>
          </>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Patients</h2>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Add New Patient
                </button>
              </div>
            </div>

            <div className="grid gap-6">
              {patients.map(patient => (
                <div key={patient._id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {patient.firstName?.[0]}{patient.lastName?.[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-gray-600">
                          {patient.age} years • {patient.gender} • {patient.phone}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{patient.email}</p>
                        
                        {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">Medical History:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.medicalHistory.slice(0, 3).map((condition, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {condition}
                                </span>
                              ))}
                              {patient.medicalHistory.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{patient.medicalHistory.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                        onClick={() => addPrescription(patient._id, 'New prescription')}
                      >
                        Add Prescription
                      </button>
                      <button 
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                        onClick={() => updatePatientStatus(patient._id, 'Reviewed')}
                      >
                        Mark Reviewed
                      </button>
                    </div>
                  </div>
                  
                  {patient.address && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <strong>Address:</strong> {patient.address.city}, {patient.address.state}, {patient.address.country}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {patients.length === 0 && (
                <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Patients Assigned</h3>
                  <p className="text-gray-600">You don't have any patients assigned to you yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Today's Appointments */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Appointments</h2>
                <div className="space-y-4">
                  {appointments.today?.map(appt => (
                    <div key={appt.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{appt.patientName}</h4>
                          <p className="text-sm text-gray-600">{appt.type}</p>
                          <p className="text-xs text-gray-500 mt-1">{appt.room}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{appt.time}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded ${
                            appt.status === 'In Progress' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                          Reschedule
                        </button>
                        <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                          Start Consultation
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Upcoming Appointments</h2>
                <div className="space-y-4">
                  {appointments.upcoming?.map(appt => (
                    <div key={appt.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800">{appt.patientName}</h4>
                          <p className="text-sm text-gray-600">{appt.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{appt.date}</p>
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                            Scheduled
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Monthly Performance</h2>
                <Charts.BarAppointments />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Patient Demographics</h2>
                <Charts.PieTreatments />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Medical Reports</h2>
              <div className="space-y-4">
                {patients.slice(0, 5).map(patient => (
                  <div key={patient._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-semibold text-gray-800">{patient.firstName} {patient.lastName}</h4>
                      <p className="text-sm text-gray-600">Last visit: 2 days ago</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                        View Report
                      </button>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}