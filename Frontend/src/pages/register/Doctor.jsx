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
          Doctor Location <br />
          Lat: {center[0].toFixed(6)}, Lng: {center[1].toFixed(6)}
        </Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default function RegisterDoctor() {
  const [form, setForm] = useState({ 
    name: "",
    age: "",
    permanentAddress: "",
    geoLocation: {
      latitude: 0,
      longitude: 0
    },
    experience: "",
    specialization: "",
    timeShift: "",
    degree: "",
    visitingFees: "",
    approxPatientCount: "",
    organization: "",
    password: "",
    calendar: [],
    gender: "",
    email: "",
    phone: ""
  });
  
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Use your API base URL - Fixed to port 5000
  const API_BASE = 'http://localhost:3000';

  // Fetch doctors and hospitals on component mount
  useEffect(() => {
    console.log('🔄 Component mounted - fetching initial data');
    fetchDoctors();
    fetchHospitals();
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

  // Create or Update Doctor
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Format data for backend according to new schema
      const doctorData = {
        name: form.name,
        age: parseInt(form.age) || 0,
        permanentAddress: form.permanentAddress,
        geoLocation: {
          latitude: parseFloat(form.geoLocation.latitude),
          longitude: parseFloat(form.geoLocation.longitude)
        },
        experience: parseInt(form.experience) || 0,
        specialization: form.specialization,
        timeShift: form.timeShift,
        degree: form.degree ? form.degree.split(',').map(item => item.trim()) : [],
        visitingFees: parseInt(form.visitingFees) || 0,
        approxPatientCount: parseInt(form.approxPatientCount) || 0,
        organization: form.organization,
        password: form.password,
        calendar: form.calendar,
        gender: form.gender,
        email: form.email,
        phone: form.phone
      };

      const url = editingId 
        ? `${API_BASE}/api/doctors/${editingId}`
        : `${API_BASE}/api/doctors`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('📤 Sending request to:', url);
      console.log('📝 Request method:', method);
      console.log('📦 Request data:', doctorData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorData),
      });
      
      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const savedDoctor = await response.json();
      console.log('✅ Saved doctor response:', savedDoctor);
      
      if (editingId) {
        setDoctors(doctors.map(doc => doc._id === editingId ? savedDoctor : doc));
        console.log('🔄 Updated doctor in state');
      } else {
        setDoctors([...doctors, savedDoctor]);
        console.log('➕ Added new doctor to state');
      }
      
      resetForm();
      alert(`Doctor ${editingId ? 'updated' : 'registered'} successfully!`);
    } catch (error) {
      console.error('💥 Error saving doctor:', error);
      setError(`Failed to save doctor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get all doctors
  async function fetchDoctors() {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/doctors`;
      console.log('🔄 Fetching doctors from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Doctors response status:', response.status);
      console.log('📨 Doctors response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Doctors response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Doctors data received:', data);
      console.log('📊 Number of doctors:', data.length);
      
      setDoctors(data);
    } catch (error) {
      console.error('💥 Error fetching doctors:', error);
      setError(`Failed to fetch doctors: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get all hospitals for dropdown
  async function fetchHospitals() {
    try {
      const url = `${API_BASE}/api/hospitals`;
      console.log('🔄 Fetching hospitals from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Hospitals response status:', response.status);
      console.log('📨 Hospitals response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Hospitals data received:', data);
        console.log('🏥 Number of hospitals:', data.length);
        setHospitals(data);
      } else {
        console.warn('⚠️ Could not fetch hospitals, continuing without hospital data');
        console.log('Hospitals response status:', response.status);
      }
    } catch (error) {
      console.warn('⚠️ Error fetching hospitals, continuing without hospital data:', error);
    }
  }

  // Get doctor by ID
  async function fetchDoctorById(id) {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/doctors/${id}`;
      console.log('🔄 Fetching doctor by ID from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Single doctor response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const doctor = await response.json();
      console.log('✅ Single doctor data:', doctor);
      
      // Format data for form according to new schema
      setForm({
        name: doctor.name || "",
        age: doctor.age?.toString() || "",
        permanentAddress: doctor.permanentAddress || "",
        geoLocation: {
          latitude: doctor.geoLocation?.latitude || 0,
          longitude: doctor.geoLocation?.longitude || 0
        },
        experience: doctor.experience?.toString() || "",
        specialization: doctor.specialization || "",
        timeShift: doctor.timeShift || "",
        degree: doctor.degree ? doctor.degree.join(', ') : "",
        visitingFees: doctor.visitingFees?.toString() || "",
        approxPatientCount: doctor.approxPatientCount?.toString() || "",
        organization: doctor.organization?._id || "",
        password: doctor.password || "",
        calendar: doctor.calendar || [],
        gender: doctor.gender || "",
        email: doctor.email || "",
        phone: doctor.phone || ""
      });
      setEditingId(doctor._id);
      setMapLoaded(true);
    } catch (error) {
      console.error('💥 Error fetching doctor:', error);
      setError(`Failed to fetch doctor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Delete doctor
  async function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/doctors/${id}`;
      console.log('🗑️ Deleting doctor from:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      console.log('📨 Delete response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setDoctors(doctors.filter(doc => doc._id !== id));
      console.log('✅ Doctor deleted successfully');
      alert('Doctor deleted successfully!');
    } catch (error) {
      console.error('💥 Error deleting doctor:', error);
      setError(`Failed to delete doctor: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    console.log('🔄 Resetting form');
    setForm({ 
      name: "",
      age: "",
      permanentAddress: "",
      geoLocation: {
        latitude: form.geoLocation.latitude, // Keep current location
        longitude: form.geoLocation.longitude
      },
      experience: "",
      specialization: "",
      timeShift: "",
      degree: "",
      visitingFees: "",
      approxPatientCount: "",
      organization: "",
      password: "",
      calendar: [],
      gender: "",
      email: "",
      phone: ""
    });
    setEditingId(null);
    setError("");
  }

  function handleEdit(doctor) {
    console.log('✏️ Editing doctor:', doctor);
    // Format data for form according to new schema
    setForm({
      name: doctor.name || "",
      age: doctor.age?.toString() || "",
      permanentAddress: doctor.permanentAddress || "",
      geoLocation: {
        latitude: doctor.geoLocation?.latitude || 0,
        longitude: doctor.geoLocation?.longitude || 0
      },
      experience: doctor.experience?.toString() || "",
      specialization: doctor.specialization || "",
      timeShift: doctor.timeShift || "",
      degree: doctor.degree ? doctor.degree.join(', ') : "",
      visitingFees: doctor.visitingFees?.toString() || "",
      approxPatientCount: doctor.approxPatientCount?.toString() || "",
      organization: doctor.organization?._id || "",
      password: doctor.password || "",
      calendar: doctor.calendar || [],
      gender: doctor.gender || "",
      email: doctor.email || "",
      phone: doctor.phone || ""
    });
    setEditingId(doctor._id);
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
      const response = await fetch(`${API_BASE}/api/doctors`);
      console.log('🔍 Connection test response status:', response.status);
      console.log('🔍 Connection test response ok:', response.ok);
      
      if (response.ok) {
        alert('✅ Backend connection successful!');
        fetchDoctors();
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
    console.log('📊 Doctors state updated:', doctors);
  }, [doctors]);

  useEffect(() => {
    console.log('🏥 Hospitals state updated:', hospitals);
  }, [hospitals]);

  useEffect(() => {
    console.log('📝 Form state updated:', form);
  }, [form]);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Doctor Management</h1>
      
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
              onClick={fetchDoctors}
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
            {editingId ? 'Edit Doctor' : 'Register New Doctor'}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field 
              label="Doctor Name" 
              value={form.name} 
              onChange={(v) => setForm({ ...form, name: v })} 
              required
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="number"
                label="Age" 
                value={form.age} 
                onChange={(v) => setForm({ ...form, age: v })} 
                min="18"
                max="100"
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
              type="textarea"
              label="Permanent Address" 
              value={form.permanentAddress} 
              onChange={(v) => setForm({ ...form, permanentAddress: v })} 
              placeholder="Complete permanent address"
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
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="number"
                label="Experience (years)" 
                value={form.experience} 
                onChange={(v) => setForm({ ...form, experience: v })} 
                min="0"
                max="50"
                required
              />
              <Field 
                label="Specialization" 
                value={form.specialization} 
                onChange={(v) => setForm({ ...form, specialization: v })} 
                placeholder="Cardiology, Neurology, etc."
                required
              />
            </div>
            
            <Field 
              label="Time Shift" 
              value={form.timeShift} 
              onChange={(v) => setForm({ ...form, timeShift: v })} 
              placeholder="9AM-5PM, Night Shift, etc."
              required
            />
            
            <Field 
              label="Degree (comma-separated)" 
              value={form.degree} 
              onChange={(v) => setForm({ ...form, degree: v })} 
              placeholder="MBBS, MD, MS, PhD"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="number"
                label="Visiting Fees (₹)" 
                value={form.visitingFees} 
                onChange={(v) => setForm({ ...form, visitingFees: v })} 
                min="0"
                required
              />
              <Field 
                type="number"
                label="Approx Patient Count" 
                value={form.approxPatientCount} 
                onChange={(v) => setForm({ ...form, approxPatientCount: v })} 
                min="0"
                required
              />
            </div>
            
            <div className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Select Organization (Hospital)</span>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.organization} 
                onChange={(e) => setForm({ ...form, organization: e.target.value })} 
                required
              >
                <option value="">Select Hospital</option>
                {hospitals.map(hospital => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="password"
                label="Password" 
                value={form.password} 
                onChange={(v) => setForm({ ...form, password: v })} 
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
            
            <Field 
              type="email" 
              label="Email" 
              value={form.email} 
              onChange={(v) => setForm({ ...form, email: v })} 
              required
            />
            
            <div className="flex gap-3 pt-4">
              <button 
                className="btn btn-primary flex-1" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update Doctor' : 'Register Doctor'}
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

        {/* Doctors List */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Doctors List</h2>
            <button 
              className="btn btn-outline" 
              onClick={fetchDoctors}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Doctors'}
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {doctors.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {loading ? 'Loading doctors...' : 'No doctors found. Click "Refresh Doctors" to load.'}
              </p>
            ) : (
              doctors.map((doctor) => (
                <div key={doctor._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. {doctor.name}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Age:</strong> {doctor.age} | <strong>Gender:</strong> {doctor.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Specialization:</strong> {doctor.specialization}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Experience:</strong> {doctor.experience} years
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Time Shift:</strong> {doctor.timeShift}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {doctor.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {doctor.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Address:</strong> {doctor.permanentAddress}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {doctor.geoLocation?.latitude?.toFixed(6)}, {doctor.geoLocation?.longitude?.toFixed(6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Visiting Fees:</strong> ₹{doctor.visitingFees}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Patient Count:</strong> {doctor.approxPatientCount}
                      </p>
                      {doctor.degree && doctor.degree.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Degree:</strong> {doctor.degree.join(', ')}
                        </p>
                      )}
                      {doctor.organization && (
                        <p className="text-sm text-gray-600">
                          <strong>Hospital:</strong> {doctor.organization.name}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(doctor)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteDoctor(doctor._id)}
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