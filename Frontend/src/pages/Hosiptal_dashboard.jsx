import { useLocation } from "react-router-dom"
import Sidebar from "../shared/Sidebar.jsx"
import Topbar from "../shared/Topbar.jsx"
import MetricsRow from "../shared/MetricsRow.jsx"
import Charts from "../shared/Charts.jsx"
import React from 'react';
import { useState, useEffect } from "react"

export default function Dashboard() {
  const role = new URLSearchParams(useLocation().search).get("role") || "hospital"
  const roleLabel = role === "doctor" ? "Doctor" : role === "hospital" ? "Hospital" : role === "patient" ? "Patient" : "User"

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    availableBeds: 0,
    occupiedBeds: 0
  });

  const API_BASE = 'http://127.0.0.1:3000';

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
        fetchDoctors(),
        fetchPatients(),
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

  // Get all doctors
  async function fetchDoctors() {
    try {
      const url = `${API_BASE}/api/doctors`;
      console.log('🔄 Fetching doctors from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Doctors data received:', data);
      setDoctors(data);
      
      // Update stats
      setStats(prev => ({ ...prev, totalDoctors: data.length }));
    } catch (error) {
      console.error('💥 Error fetching doctors:', error);
      throw error;
    }
  }

  // Get all patients
  async function fetchPatients() {
    try {
      const url = `${API_BASE}/api/patients`;
      console.log('🔄 Fetching patients from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Patients data received:', data);
      setPatients(data);
      
      // Update stats
      setStats(prev => ({ ...prev, totalPatients: data.length }));
    } catch (error) {
      console.error('💥 Error fetching patients:', error);
      throw error;
    }
  }

  // Get all hospitals
  async function fetchHospitals() {
    try {
      const url = `${API_BASE}/api/hospitals`;
      console.log('🔄 Fetching hospitals from:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Hospitals data received:', data);
      setHospitals(data);
      
      // Calculate bed statistics
      if (data.length > 0) {
        const totalBeds = data.reduce((sum, hospital) => sum + (hospital.capacityBeds || 0), 0);
        const occupiedBeds = Math.floor(totalBeds * 0.7); // Mock data - 70% occupancy
        setStats(prev => ({ 
          ...prev, 
          availableBeds: totalBeds - occupiedBeds,
          occupiedBeds: occupiedBeds
        }));
      }
    } catch (error) {
      console.error('💥 Error fetching hospitals:', error);
      throw error;
    }
  }

  // Delete doctor
  async function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/doctors/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setDoctors(doctors.filter(doc => doc._id !== id));
      setStats(prev => ({ ...prev, totalDoctors: prev.totalDoctors - 1 }));
      alert('Doctor deleted successfully!');
    } catch (error) {
      console.error('💥 Error deleting doctor:', error);
      alert('Failed to delete doctor: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Delete patient
  async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/patients/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setPatients(patients.filter(patient => patient._id !== id));
      setStats(prev => ({ ...prev, totalPatients: prev.totalPatients - 1 }));
      alert('Patient deleted successfully!');
    } catch (error) {
      console.error('💥 Error deleting patient:', error);
      alert('Failed to delete patient: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Test backend connection
  async function testBackendConnection() {
    try {
      const response = await fetch(`${API_BASE}/api/hospitals`);
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

  return (
    <main className="dashboard grid-2-fixed">
      <Sidebar />
      <section className="column">
        <Topbar />
        <div className="container-narrow py-24">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="h2">Welcome back, {roleLabel}</h1>
              <p className="muted mt-8">Here's an overview of your hospital management.</p>
            </div>
            <button 
              className="btn btn-outline"
              onClick={testBackendConnection}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 mt-4">
              <strong>Error: </strong>{error}
              <button 
                className="btn btn-sm btn-outline ml-2"
                onClick={fetchAllData}
              >
                Retry
              </button>
            </div>
          )}

          {/* Custom Metrics Row for Hospital */}
          <div className="grid-4 mt-24 gap-16">
            <div className="card p-16 text-center">
              <h3 className="h3 text-primary">{stats.totalDoctors}</h3>
              <p className="muted mt-4">Total Doctors</p>
            </div>
            <div className="card p-16 text-center">
              <h3 className="h3 text-secondary">{stats.totalPatients}</h3>
              <p className="muted mt-4">Total Patients</p>
            </div>
            <div className="card p-16 text-center">
              <h3 className="h3 text-success">{stats.availableBeds}</h3>
              <p className="muted mt-4">Available Beds</p>
            </div>
            <div className="card p-16 text-center">
              <h3 className="h3 text-warning">{stats.occupiedBeds}</h3>
              <p className="muted mt-4">Occupied Beds</p>
            </div>
          </div>

          <div className="grid-2 mt-24 gap-16">
            {/* Doctors Section */}
            <div className="card p-16">
              <div className="flex justify-between items-center mb-12">
                <h2 className="h4">Hospital Doctors</h2>
                <span className="badge badge-primary">{doctors.length} doctors</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {doctors.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {loading ? 'Loading doctors...' : 'No doctors found.'}
                  </p>
                ) : (
                  doctors.map((doctor) => (
                    <div key={doctor._id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">Dr. {doctor.firstName} {doctor.lastName}</h4>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                          <p className="text-sm text-gray-600">{doctor.email}</p>
                          {doctor.qualifications && (
                            <p className="text-xs text-gray-500">
                              {doctor.qualifications.join(', ')}
                            </p>
                          )}
                        </div>
                        <button 
                          className="btn btn-sm btn-danger ml-2"
                          onClick={() => deleteDoctor(doctor._id)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Patients Section */}
            <div className="card p-16">
              <div className="flex justify-between items-center mb-12">
                <h2 className="h4">Hospital Patients</h2>
                <span className="badge badge-secondary">{patients.length} patients</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {patients.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    {loading ? 'Loading patients...' : 'No patients found.'}
                  </p>
                ) : (
                  patients.map((patient) => (
                    <div key={patient._id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{patient.firstName} {patient.lastName}</h4>
                          <p className="text-sm text-gray-600">
                            {patient.age} years • {patient.gender}
                          </p>
                          <p className="text-sm text-gray-600">{patient.email}</p>
                          {patient.assignedDoctor && (
                            <p className="text-xs text-gray-500">
                              Dr. {patient.assignedDoctor.firstName} {patient.assignedDoctor.lastName}
                            </p>
                          )}
                        </div>
                        <button 
                          className="btn btn-sm btn-danger ml-2"
                          onClick={() => deletePatient(patient._id)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid-3 mt-24 gap-16">
            {/* Hospital Statistics */}
            <div className="card p-16 col-span-2">
              <h2 className="h4 mb-12">Hospital Capacity</h2>
              <Charts.BarAppointments />
            </div>

            <div className="card p-16">
              <h2 className="h4 mb-12">Department Distribution</h2>
              <Charts.PieTreatments />
            </div>

            {/* Recent Activity */}
            <div className="card p-16">
              <h2 className="h4 mb-12">Recent Admissions</h2>
              <ul className="muted list-vert">
                {patients.slice(0, 3).map(patient => (
                  <li key={patient._id}>
                    {patient.firstName} {patient.lastName} — {patient.age}y — {patient.gender}
                  </li>
                ))}
                {patients.length === 0 && (
                  <li>No recent admissions</li>
                )}
              </ul>
            </div>

            <div className="card p-16">
              <h2 className="h4 mb-12">Available Specialists</h2>
              <ul className="muted list-vert">
                {doctors.slice(0, 3).map(doctor => (
                  <li key={doctor._id}>
                    Dr. {doctor.firstName} {doctor.lastName} — {doctor.specialty}
                  </li>
                ))}
                {doctors.length === 0 && (
                  <li>No doctors available</li>
                )}
              </ul>
            </div>

            {/* Hospital Information */}
            <div className="card p-16">
              <h2 className="h4 mb-12">Hospital Details</h2>
              <div className="space-y-2">
                {hospitals.slice(0, 1).map(hospital => (
                  <div key={hospital._id}>
                    <p><strong>Name:</strong> {hospital.name}</p>
                    <p><strong>Location:</strong> {hospital.address?.city}, {hospital.address?.state}</p>
                    <p><strong>Beds:</strong> {hospital.capacityBeds}</p>
                    <p><strong>Ventilators:</strong> {hospital.ventilatorCount}</p>
                    <p><strong>Contact:</strong> {hospital.phone}</p>
                  </div>
                ))}
                {hospitals.length === 0 && (
                  <p>No hospital information available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}