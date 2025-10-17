"use client"

import { useState, useEffect, useRef } from "react"
import React from 'react';

// Dynamic import for Leaflet to avoid SSR issues
const DynamicMap = ({ center, onLocationSelect }) => {
  const [MapContainer, setMapContainer] = useState(null);
  const [TileLayer, setTileLayer] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [Popup, setPopup] = useState(null);
  const [useMapEvents, setUseMapEvents] = useState(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      // Fix for default markers in Next.js
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const { MapContainer: MC, TileLayer: TL, Marker: M, Popup: P, useMapEvents: UME } = await import('react-leaflet');
      setMapContainer(() => MC);
      setTileLayer(() => TL);
      setMarker(() => M);
      setPopup(() => P);
      setUseMapEvents(() => UME);
    };

    loadLeaflet();
  }, []);

  // Map events component
  const MapEvents = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      },
    });
    return null;
  };

  if (!MapContainer || !TileLayer || !Marker) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>
          Patient Location <br />
          Lat: {center[0].toFixed(6)}, Lng: {center[1].toFixed(6)}
        </Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default function RegisterPatient() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    geoLocation: {
      latitude: 0,
      longitude: 0
    },
    age: "",
    password: "",
    gender: "",
    medicalHistory: "",
    assignedDoctor: ""
  });
  
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Use your API base URL - Fixed to port 5000
  const API_BASE = 'http://127.0.0.1:3000';

  // Fetch patients and doctors on component mount
  useEffect(() => {
    console.log('🔄 Component mounted - fetching initial data');
    fetchPatients();
    fetchDoctors();
    getCurrentLocation();
  }, []);

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setForm(prev => ({
            ...prev,
            geoLocation: {
              latitude: lat,
              longitude: lng
            }
          }));
          setMapLoaded(true);
          setIsGettingLocation(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default coordinates if geolocation fails
          setForm(prev => ({
            ...prev,
            geoLocation: {
              latitude: 28.6139,
              longitude: 77.2090
            }
          }));
          setMapLoaded(true);
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      // Default coordinates if geolocation not supported
      setForm(prev => ({
        ...prev,
        geoLocation: {
          latitude: 28.6139,
          longitude: 77.2090
        }
      }));
      setMapLoaded(true);
      setIsGettingLocation(false);
    }
  };

  // Handle location selection from map
  const handleLocationSelect = (lat, lng) => {
    setForm(prev => ({
      ...prev,
      geoLocation: {
        latitude: lat,
        longitude: lng
      }
    }));
  };

  // Create or Update Patient
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Format data for backend according to new schema
      const patientData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        geoLocation: {
          latitude: parseFloat(form.geoLocation.latitude),
          longitude: parseFloat(form.geoLocation.longitude)
        },
        age: parseInt(form.age) || 0,
        password: form.password,
        gender: form.gender,
        medicalHistory: form.medicalHistory ? form.medicalHistory.split(',').map(item => item.trim()) : [],
        assignedDoctor: form.assignedDoctor
      };

      const url = editingId 
        ? `${API_BASE}/api/patients/${editingId}`
        : `${API_BASE}/api/patients`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('📤 Sending request to:', url);
      console.log('📝 Request method:', method);
      console.log('📦 Request data:', patientData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
      
      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const savedPatient = await response.json();
      console.log('✅ Saved patient response:', savedPatient);
      
      if (editingId) {
        setPatients(patients.map(patient => patient._id === editingId ? savedPatient : patient));
        console.log('🔄 Updated patient in state');
      } else {
        setPatients([...patients, savedPatient]);
        console.log('➕ Added new patient to state');
      }
      
      resetForm();
      alert(`Patient ${editingId ? 'updated' : 'registered'} successfully!`);
    } catch (error) {
      console.error('💥 Error saving patient:', error);
      setError(`Failed to save patient: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get all patients
  async function fetchPatients() {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/patients`;
      console.log('🔄 Fetching patients from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Patients response status:', response.status);
      console.log('📨 Patients response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Patients response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Patients data received:', data);
      console.log('📊 Number of patients:', data.length);
      
      setPatients(data);
    } catch (error) {
      console.error('💥 Error fetching patients:', error);
      setError(`Failed to fetch patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get all doctors for dropdown
  async function fetchDoctors() {
    try {
      const url = `${API_BASE}/api/doctors`;
      console.log('🔄 Fetching doctors from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Doctors response status:', response.status);
      console.log('📨 Doctors response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Doctors data received:', data);
        console.log('👨‍⚕️ Number of doctors:', data.length);
        setDoctors(data);
      } else {
        console.warn('⚠️ Could not fetch doctors, continuing without doctor data');
        console.log('Doctors response status:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Error fetching doctors, continuing without doctor data:', error);
    }
  }

  // Get patient by ID
  async function fetchPatientById(id) {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/patients/${id}`;
      console.log('🔄 Fetching patient by ID from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Single patient response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const patient = await response.json();
      console.log('✅ Single patient data:', patient);
      
      // Format data for form according to new schema
      setForm({
        name: patient.name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        geoLocation: {
          latitude: patient.geoLocation?.latitude || 0,
          longitude: patient.geoLocation?.longitude || 0
        },
        age: patient.age?.toString() || "",
        password: patient.password || "",
        gender: patient.gender || "",
        medicalHistory: patient.medicalHistory ? patient.medicalHistory.join(', ') : "",
        assignedDoctor: patient.assignedDoctor?._id || ""
      });
      setEditingId(patient._id);
      setMapLoaded(true);
    } catch (error) {
      console.error('💥 Error fetching patient:', error);
      setError(`Failed to fetch patient: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Delete patient
  async function deletePatient(id) {
    if (!confirm('Are you sure you want to delete this patient?')) return;
    
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/patients/${id}`;
      console.log('🗑️ Deleting patient from:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      console.log('📨 Delete response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setPatients(patients.filter(patient => patient._id !== id));
      console.log('✅ Patient deleted successfully');
      alert('Patient deleted successfully!');
    } catch (error) {
      console.error('💥 Error deleting patient:', error);
      setError(`Failed to delete patient: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    console.log('🔄 Resetting form');
    setForm({ 
      name: "", 
      email: "", 
      phone: "", 
      geoLocation: {
        latitude: form.geoLocation.latitude, // Keep current location
        longitude: form.geoLocation.longitude
      },
      age: "",
      password: "",
      gender: "",
      medicalHistory: "",
      assignedDoctor: ""
    });
    setEditingId(null);
    setError("");
  }

  function handleEdit(patient) {
    console.log('✏️ Editing patient:', patient);
    // Format data for form according to new schema
    setForm({
      name: patient.name || "",
      email: patient.email || "",
      phone: patient.phone || "",
      geoLocation: {
        latitude: patient.geoLocation?.latitude || 0,
        longitude: patient.geoLocation?.longitude || 0
      },
      age: patient.age?.toString() || "",
      password: patient.password || "",
      gender: patient.gender || "",
      medicalHistory: patient.medicalHistory ? patient.medicalHistory.join(', ') : "",
      assignedDoctor: patient.assignedDoctor?._id || ""
    });
    setEditingId(patient._id);
    setError("");
    setMapLoaded(true);
  }

  function handleCancel() {
    console.log('❌ Canceling edit');
    resetForm();
  }

  // Test backend connection
  async function testBackendConnection() {
    console.log('🔍 Testing backend connection...');
    try {
      const response = await fetch(`${API_BASE}/api/patients`);
      console.log('🔍 Connection test response status:', response.status);
      console.log('🔍 Connection test response ok:', response.ok);
      
      if (response.ok) {
        alert('✅ Backend connection successful!');
        fetchPatients();
      } else {
        alert('❌ Backend connection failed! Status: ' + response.status);
      }
    } catch (error) {
      console.error('🔍 Connection test error:', error);
      alert('❌ Backend connection failed: ' + error.message);
    }
  }

  // Log state changes
  useEffect(() => {
    console.log('📊 Patients state updated:', patients);
  }, [patients]);

  useEffect(() => {
    console.log('👨‍⚕️ Doctors state updated:', doctors);
  }, [doctors]);

  useEffect(() => {
    console.log('📝 Form state updated:', form);
  }, [form]);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Patient Management</h1>
      
      {/* Connection Test */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-700">
          <strong>Backend Status:</strong> {error ? '❌ Disconnected' : '✅ Connected'}
        </p>
        <p className="text-sm text-blue-600 mt-1">
          API Base: {API_BASE}
        </p>
        <button 
          className="btn btn-sm btn-outline mt-2"
          onClick={testBackendConnection}
        >
          Test Backend Connection
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error: </strong>{error}
          <div className="mt-2">
            <button 
              className="btn btn-sm btn-outline mr-2"
              onClick={fetchPatients}
            >
              Retry API
            </button>
            <button 
              className="btn btn-sm btn-secondary"
              onClick={resetForm}
            >
              Clear Error
            </button>
          </div>
        </div>
      )}
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Registration/Edit Form */}
        <div className="card p-6">
          <h2 className="text-2xl font-semibold mb-6">
            {editingId ? 'Edit Patient' : 'Register New Patient'}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field 
              label="Patient Name" 
              value={form.name} 
              onChange={(v) => setForm({ ...form, name: v })} 
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="email" 
                label="Email" 
                value={form.email} 
                onChange={(v) => setForm({ ...form, email: v })} 
                required
              />
              <Field 
                type="tel"
                label="Phone Number" 
                value={form.phone} 
                onChange={(v) => setForm({ ...form, phone: v })} 
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="number"
                label="Age" 
                value={form.age} 
                onChange={(v) => setForm({ ...form, age: v })} 
                min="0"
                max="120"
                required
              />
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Gender</span>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.gender} 
                  onChange={(e) => setForm({ ...form, gender: e.target.value })} 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <Field 
              type="password"
              label="Password" 
              value={form.password} 
              onChange={(v) => setForm({ ...form, password: v })} 
              required
            />
            
            {/* Geolocation Section */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <span className="block text-sm font-medium text-gray-700">Location Selection</span>
                <button 
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Getting Location...
                    </>
                  ) : (
                    '📍 Get My Location'
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="text-xs text-gray-500">Latitude</span>
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="number" 
                    step="any"
                    value={form.geoLocation.latitude} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      geoLocation: { 
                        ...form.geoLocation, 
                        latitude: parseFloat(e.target.value) || 0 
                      } 
                    })} 
                    required
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-500">Longitude</span>
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="number" 
                    step="any"
                    value={form.geoLocation.longitude} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      geoLocation: { 
                        ...form.geoLocation, 
                        longitude: parseFloat(e.target.value) || 0 
                      } 
                    })} 
                    required
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                Click on the map below to set location, or use "Get My Location" button
              </p>
            </div>

            {/* Interactive Map */}
            {mapLoaded && (
              <div className="border rounded-lg p-4 bg-white">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Select Location on Map</h4>
                <div className="h-64 rounded-lg overflow-hidden">
                  <DynamicMap 
                    center={[form.geoLocation.latitude, form.geoLocation.longitude]}
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-600">
                    Current: Lat: {form.geoLocation.latitude.toFixed(6)}, Lng: {form.geoLocation.longitude.toFixed(6)}
                  </p>
                  <a 
                    href={`https://www.openstreetmap.org/?mlat=${form.geoLocation.latitude}&mlon=${form.geoLocation.longitude}#map=15/${form.geoLocation.latitude}/${form.geoLocation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline mt-1 inline-block"
                  >
                    View on OpenStreetMap
                  </a>
                </div>
              </div>
            )}
            
            <Field 
              type="textarea"
              label="Medical History (comma separated)" 
              value={form.medicalHistory} 
              onChange={(v) => setForm({ ...form, medicalHistory: v })} 
              placeholder="Diabetes, Hypertension, Asthma, etc."
            />
            
            <div className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Assigned Doctor</span>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.assignedDoctor} 
                onChange={(e) => setForm({ ...form, assignedDoctor: e.target.value })} 
              >
                <option value="">Select Doctor (Optional)</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 pt-4">
              <button 
                className="btn btn-primary flex-1" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update Patient' : 'Register Patient'}
              </button>
              
              {editingId && (
                <button 
                  className="btn btn-secondary" 
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Patients List */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Patients List</h2>
            <button 
              className="btn btn-outline" 
              onClick={fetchPatients}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Patients'}
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {patients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {loading ? 'Loading patients...' : 'No patients found. Click "Refresh Patients" to load.'}
              </p>
            ) : (
              patients.map((patient) => (
                <div key={patient._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{patient.name}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Age:</strong> {patient.age} | <strong>Gender:</strong> {patient.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {patient.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {patient.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {patient.geoLocation?.latitude?.toFixed(6)}, {patient.geoLocation?.longitude?.toFixed(6)}
                      </p>
                      {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Medical History:</strong> {patient.medicalHistory.join(', ')}
                        </p>
                      )}
                      {patient.assignedDoctor && (
                        <p className="text-sm text-gray-600">
                          <strong>Assigned Doctor:</strong> Dr. {patient.assignedDoctor.name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(patient)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => deletePatient(patient._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, type = "text", placeholder = "", required = false, ...props }) {
  if (type === "textarea") {
    return (
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
        <textarea 
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          required={required}
          {...props}
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input 
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </label>
  );
}