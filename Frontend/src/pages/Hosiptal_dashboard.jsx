import { useLocation } from "react-router-dom"
import React from 'react';
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const doctorIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const patientIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Small Map Component for individual items
const SmallMap = ({ location, type, name }) => {
  if (!location || !location.latitude || !location.longitude) {
    return (
      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-sm">Location not available</p>
      </div>
    );
  }

  const position = [location.latitude, location.longitude];
  const icon = type === 'doctor' ? doctorIcon : type === 'patient' ? patientIcon : hospitalIcon;

  return (
    <div className="h-32 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="text-sm">
              <strong>{name}</strong>
              <br />
              {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default function Dashboard() {
  const role = new URLSearchParams(useLocation().search).get("role") || "hospital"
  const roleLabel = role === "doctor" ? "Doctor" : role === "hospital" ? "Hospital" : role === "patient" ? "Patient" : "User"

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapView, setMapView] = useState("all");
  const [editingFacilities, setEditingFacilities] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(false);
  const [newFacility, setNewFacility] = useState("");
  const [newEquipment, setNewEquipment] = useState("");
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    appointments: 0,
    revenue: 0
  });

  const API_BASE = 'http://127.0.0.1:3000';

  // Default center for map (New Delhi)
  const defaultCenter = [28.6139, 77.2090];

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
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDoctors(data);
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
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setPatients(data);
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
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setHospitals(data);
      if (data.length > 0) {
        const totalBeds = data.reduce((sum, hospital) => sum + (hospital.capacityBeds || 0), 0);
        const occupiedBeds = Math.floor(totalBeds * 0.7);
        setStats(prev => ({ 
          ...prev, 
          availableBeds: totalBeds - occupiedBeds,
          occupiedBeds: occupiedBeds,
          appointments: Math.floor(data.length * 25),
          revenue: Math.floor(data.length * 125000)
        }));
      }
    } catch (error) {
      console.error('💥 Error fetching hospitals:', error);
      throw error;
    }
  }

  // View doctor details
  const viewDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  // View patient details
  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  // View hospital details
  const viewHospitalDetails = (hospital) => {
    setSelectedHospital(hospital);
    setShowHospitalModal(true);
  };

  // View map
  const viewMap = (type = "all") => {
    setMapView(type);
    setShowMapModal(true);
  };

  // Close modals
  const closeDoctorModal = () => {
    setShowDoctorModal(false);
    setTimeout(() => setSelectedDoctor(null), 300);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setTimeout(() => setSelectedPatient(null), 300);
  };

  const closeHospitalModal = () => {
    setShowHospitalModal(false);
    setEditingFacilities(false);
    setEditingEquipment(false);
    setNewFacility("");
    setNewEquipment("");
    setTimeout(() => setSelectedHospital(null), 300);
  };

  const closeMapModal = () => {
    setShowMapModal(false);
  };

  // Delete doctor
  async function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/doctors/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
      const response = await fetch(`${API_BASE}/api/patients/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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

  // Add facility
  const addFacility = () => {
    if (newFacility.trim() && selectedHospital) {
      const updatedHospital = {
        ...selectedHospital,
        facilities: [...(selectedHospital.facilities || []), newFacility.trim()]
      };
      setSelectedHospital(updatedHospital);
      setNewFacility("");
    }
  };

  // Remove facility
  const removeFacility = (index) => {
    if (selectedHospital) {
      const updatedFacilities = [...(selectedHospital.facilities || [])];
      updatedFacilities.splice(index, 1);
      const updatedHospital = { ...selectedHospital, facilities: updatedFacilities };
      setSelectedHospital(updatedHospital);
    }
  };

  // Add equipment
  const addEquipment = () => {
    if (newEquipment.trim() && selectedHospital) {
      const updatedHospital = {
        ...selectedHospital,
        equipment: [...(selectedHospital.equipment || []), newEquipment.trim()]
      };
      setSelectedHospital(updatedHospital);
      setNewEquipment("");
    }
  };

  // Remove equipment
  const removeEquipment = (index) => {
    if (selectedHospital) {
      const updatedEquipment = [...(selectedHospital.equipment || [])];
      updatedEquipment.splice(index, 1);
      const updatedHospital = { ...selectedHospital, equipment: updatedEquipment };
      setSelectedHospital(updatedHospital);
    }
  };

  // Update hospital
  async function updateHospital() {
    if (!selectedHospital) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/hospitals/${selectedHospital._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          facilities: selectedHospital.facilities || [],
          equipment: selectedHospital.equipment || []
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedHospital = await response.json();
      setHospitals(hospitals.map(h => h._id === updatedHospital._id ? updatedHospital : h));
      setSelectedHospital(updatedHospital);
      alert('Hospital updated successfully!');
    } catch (error) {
      console.error('💥 Error updating hospital:', error);
      alert('Failed to update hospital: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1);
  };

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

  // Render map based on current view
  const renderMap = () => {
    return (
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Doctors markers */}
        {(mapView === 'all' || mapView === 'doctors') && doctors.map((doctor, index) => (
          doctor.geoLocation && (
            <Marker 
              key={`doctor-${index}`} 
              position={[doctor.geoLocation.latitude, doctor.geoLocation.longitude]}
              icon={doctorIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-blue-700">Dr. {doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <p className="text-xs text-gray-500">{doctor.permanentAddress}</p>
                  <button 
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    onClick={() => {
                      closeMapModal();
                      setTimeout(() => viewDoctorDetails(doctor), 300);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
        
        {/* Patients markers */}
        {(mapView === 'all' || mapView === 'patients') && patients.map((patient, index) => (
          patient.geoLocation && (
            <Marker 
              key={`patient-${index}`} 
              position={[patient.geoLocation.latitude, patient.geoLocation.longitude]}
              icon={patientIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-green-700">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.age} years • {patient.gender}</p>
                  <p className="text-xs text-gray-500">{patient.geoLocation.latitude.toFixed(4)}, {patient.geoLocation.longitude.toFixed(4)}</p>
                  <button 
                    className="mt-2 bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    onClick={() => {
                      closeMapModal();
                      setTimeout(() => viewPatientDetails(patient), 300);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
        
        {/* Hospitals markers */}
        {(mapView === 'all' || mapView === 'hospitals') && hospitals.map((hospital, index) => (
          hospital.geoLocation && (
            <Marker 
              key={`hospital-${index}`} 
              position={[hospital.geoLocation.latitude, hospital.geoLocation.longitude]}
              icon={hospitalIcon}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-red-700">{hospital.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{hospital.type} Hospital</p>
                  <p className="text-xs text-gray-500">{hospital.fullAddress}</p>
                  <button 
                    className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    onClick={() => {
                      closeMapModal();
                      setTimeout(() => viewHospitalDetails(hospital), 300);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900">
                  Hospital Dashboard
                </h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back, {roleLabel}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-sm"
                onClick={testBackendConnection}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Refreshing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 transform animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </p>
              </div>
              <button 
                className="ml-4 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                onClick={fetchAllData}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-2 transform animate-slide-down">
          <nav className="flex space-x-2">
            {['overview', 'doctors', 'patients', 'hospitals', 'map'].map(tab => (
              <button
                key={tab}
                className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm capitalize transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'map' ? 'Map View' : tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 transform animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  label: 'Total Doctors', 
                  value: stats.totalDoctors, 
                  icon: '👨‍⚕️',
                  change: '+2.5%'
                },
                { 
                  label: 'Total Patients', 
                  value: stats.totalPatients, 
                  icon: '👥',
                  change: '+5.2%'
                },
                { 
                  label: 'Available Beds', 
                  value: stats.availableBeds, 
                  icon: '🛏️',
                  change: '-3.1%'
                },
                { 
                  label: 'Occupied Beds', 
                  value: stats.occupiedBeds, 
                  icon: '🏥',
                  change: '+3.1%'
                }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transform hover:scale-105 transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  onClick={() => setActiveTab('doctors')}
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">👨‍⚕️</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Manage Doctors</span>
                </button>
                <button 
                  className="p-4 bg-gray-100 rounded-lg text center hover:bg-gray-200 transition-colors"
                  onClick={() => setActiveTab('patients')}
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">👥</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Manage Patients</span>
                </button>
                <button 
                  className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  onClick={() => setActiveTab('hospitals')}
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">🏥</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Manage Hospitals</span>
                </button>
                <button 
                  className="p-4 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition-colors"
                  onClick={() => viewMap('all')}
                >
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">🗺️</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">View Map</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Featured Doctors */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transform animate-slide-up">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Featured Doctors</h3>
                      <p className="text-sm text-gray-600 mt-1">Top medical specialists</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('doctors')}
                      className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {doctors.slice(0, 4).map((doctor, index) => (
                      <div 
                        key={doctor._id}
                        className="group bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        onClick={() => viewDoctorDetails(doctor)}
                        style={{ animationDelay: `${index * 150}ms` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <span className="text-gray-700 font-bold text-lg">
                                Dr. {doctor.name?.[0]}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                              Dr. {doctor.name}
                            </h4>
                            <p className="text-gray-600 font-semibold">{doctor.specialization}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {doctor.permanentAddress || "Address not set"}
                            </div>
                          </div>
                        </div>
                        {/* Small Map for Doctor */}
                        {doctor.geoLocation && (
                          <div className="mt-4">
                            <SmallMap 
                              location={doctor.geoLocation} 
                              type="doctor" 
                              name={`Dr. ${doctor.name}`}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transform animate-slide-up">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Recent Patients</h3>
                      <p className="text-sm text-gray-600 mt-1">Latest admissions</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('patients')}
                      className="bg-gray-900 text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {patients.slice(0, 5).map((patient, index) => (
                      <div 
                        key={patient._id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer"
                        onClick={() => viewPatientDetails(patient)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-700 font-bold text-sm">
                              {patient.name?.[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                            <p className="text-sm text-gray-600">
                              {patient.age} years • {patient.gender}
                            </p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {patient.geoLocation ? `${patient.geoLocation.latitude.toFixed(2)}, ${patient.geoLocation.longitude.toFixed(2)}` : "Location not set"}
                            </div>
                          </div>
                        </div>
                        {/* Small Map for Patient */}
                        {patient.geoLocation && (
                          <div className="w-32 h-24">
                            <SmallMap 
                              location={patient.geoLocation} 
                              type="patient" 
                              name={patient.name}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <div className="transform animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Medical Team</h3>
                    <p className="text-sm text-gray-600 mt-1">All registered doctors and specialists</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                      onClick={() => viewMap('doctors')}
                    >
                      View on Map
                    </button>
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      {doctors.length} Doctors
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor, index) => (
                    <div 
                      key={doctor._id}
                      className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-500 transform hover:scale-105 overflow-hidden cursor-pointer"
                      onClick={() => viewDoctorDetails(doctor)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Doctor Header */}
                      <div className="bg-gray-900 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                              <span className="text-xl font-bold">
                                Dr. {doctor.name?.[0]}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">Dr. {doctor.name}</h4>
                              <p className="text-gray-300">{doctor.specialization}</p>
                            </div>
                          </div>
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {doctor.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {doctor.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {doctor.permanentAddress || "Address not set"}
                          </div>
                        </div>

                        {/* Small Map for Doctor */}
                        {doctor.geoLocation && (
                          <div className="mt-4">
                            <SmallMap 
                              location={doctor.geoLocation} 
                              type="doctor" 
                              name={`Dr. ${doctor.name}`}
                            />
                          </div>
                        )}

                        {/* Location Details */}
                        {doctor.geoLocation && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center text-sm text-blue-800">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="font-semibold">Coordinates:</span>
                              <span className="ml-1">{doctor.geoLocation.latitude.toFixed(4)}, {doctor.geoLocation.longitude.toFixed(4)}</span>
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              Distance: {calculateDistance(28.6139, 77.2090, doctor.geoLocation.latitude, doctor.geoLocation.longitude)} km from center
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-6">
                          <button 
                            className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewDoctorDetails(doctor);
                            }}
                          >
                            View Profile
                          </button>
                          <button 
                            className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors transform hover:scale-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDoctor(doctor._id);
                            }}
                            disabled={loading}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {doctors.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">👨‍⚕️</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Doctors Found</h3>
                    <p className="text-gray-600">Start by adding doctors to your hospital</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transform animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Patient Records</h3>
                <div className="flex items-center space-x-4">
                  <button 
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                    onClick={() => viewMap('patients')}
                  >
                    View on Map
                  </button>
                  <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
                    {patients.length} Patients
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient, index) => (
                  <div 
                    key={patient._id}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-500 transform hover:scale-105 overflow-hidden cursor-pointer"
                    onClick={() => viewPatientDetails(patient)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Patient Header */}
                    <div className="bg-gray-900 p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {patient.name?.[0]}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold">{patient.name}</h4>
                            <p className="text-gray-300">{patient.age} years • {patient.gender}</p>
                          </div>
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {patient.phone}
                        </div>
                      </div>

                      {/* Small Map for Patient */}
                      {patient.geoLocation && (
                        <div className="mt-4">
                          <SmallMap 
                            location={patient.geoLocation} 
                            type="patient" 
                            name={patient.name}
                          />
                        </div>
                      )}

                      {/* Location Details */}
                      {patient.geoLocation && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center text-sm text-green-800">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <span className="font-semibold">Coordinates:</span>
                            <span className="ml-1">{patient.geoLocation.latitude.toFixed(4)}, {patient.geoLocation.longitude.toFixed(4)}</span>
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            Distance: {calculateDistance(28.6139, 77.2090, patient.geoLocation.latitude, patient.geoLocation.longitude)} km from center
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2 mt-6">
                        <button 
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewPatientDetails(patient);
                          }}
                        >
                          View Details
                        </button>
                        <button 
                          className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors transform hover:scale-110"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePatient(patient._id);
                          }}
                          disabled={loading}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {patients.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👥</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No Patients Found</h3>
                  <p className="text-gray-600">No patients registered in the system</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hospitals Tab */}
        {activeTab === 'hospitals' && (
          <div className="transform animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Hospital Network</h3>
                    <p className="text-sm text-gray-600 mt-1">All affiliated hospitals and medical centers</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      onClick={() => viewMap('hospitals')}
                    >
                      View on Map
                    </button>
                    <span className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      {hospitals.length} Hospitals
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hospitals.map((hospital, index) => (
                    <div 
                      key={hospital._id}
                      className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-500 transform hover:scale-105 overflow-hidden cursor-pointer"
                      onClick={() => viewHospitalDetails(hospital)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Hospital Header */}
                      <div className="bg-gray-900 p-6 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                              <span className="text-xl font-bold">🏥</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold">{hospital.name}</h4>
                              <p className="text-gray-300 capitalize">{hospital.type} Hospital</p>
                            </div>
                          </div>
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Hospital Details */}
                      <div className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {hospital.fullAddress}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {hospital.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Staff: {hospital.staffCount}
                          </div>
                        </div>

                        {/* Small Map for Hospital */}
                        {hospital.geoLocation && (
                          <div className="mt-4">
                            <SmallMap 
                              location={hospital.geoLocation} 
                              type="hospital" 
                              name={hospital.name}
                            />
                          </div>
                        )}

                        {/* Location Details */}
                        {hospital.geoLocation && (
                          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center text-sm text-red-800">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="font-semibold">Coordinates:</span>
                              <span className="ml-1">{hospital.geoLocation.latitude.toFixed(4)}, {hospital.geoLocation.longitude.toFixed(4)}</span>
                            </div>
                          </div>
                        )}

                        {/* Facilities Preview */}
                        {hospital.facilities && hospital.facilities.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-1">
                              {hospital.facilities.slice(0, 3).map((facility, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                  {facility}
                                </span>
                              ))}
                              {hospital.facilities.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  +{hospital.facilities.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-6">
                          <button 
                            className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewHospitalDetails(hospital);
                            }}
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {hospitals.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🏥</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Hospitals Found</h3>
                    <p className="text-gray-600">No hospitals registered in the system</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="transform animate-fade-in">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Geographical Distribution</h3>
                    <p className="text-sm text-gray-600 mt-1">View all doctors, patients, and hospitals on the map</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={mapView}
                      onChange={(e) => setMapView(e.target.value)}
                      className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Locations</option>
                      <option value="doctors">Doctors Only</option>
                      <option value="patients">Patients Only</option>
                      <option value="hospitals">Hospitals Only</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Doctors ({doctors.filter(d => d.geoLocation).length})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Patients ({patients.filter(p => p.geoLocation).length})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Hospitals ({hospitals.filter(h => h.geoLocation).length})</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-300">
                  {renderMap()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add CSS animations */}
        <style jsx>{`
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          @keyframes slide-up {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-up {
            animation: slide-up 0.5s ease-out;
          }
          @keyframes slide-down {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          .animate-slide-down {
            animation: slide-down 0.5s ease-out;
          }
          @keyframes scale-up {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-up {
            animation: scale-up 0.3s ease-out;
          }
        `}</style>
      </main>
    </div>
  )
}