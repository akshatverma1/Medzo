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
          Hospital Location <br />
          Lat: {center[0].toFixed(6)}, Lng: {center[1].toFixed(6)}
        </Popup>
      </Marker>
      <MapEvents />
    </MapContainer>
  );
};

export default function RegisterHospital() {
  const [form, setForm] = useState({ 
    name: "", 
    type: "private",
    fullAddress: "",
    geoLocation: {
      latitude: 0,
      longitude: 0
    },
    website: "",
    facilities: "",
    equipment: "",
    registrationId: "",
    yearOfEstablishment: "",
    staffCount: "",
    password: "",
    phone: "",
    email: ""
  });
  
  const [hospitals, setHospitals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const API_BASE = 'http://localhost:3000';

  // Fetch hospitals on component mount
  useEffect(() => {
    fetchHospitals();
    // Get current location for map
    getCurrentLocation();
  }, []);

  // Get current location for map
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
          // Default to Delhi coordinates if geolocation fails
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
      // Default to Delhi coordinates if geolocation not supported
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

  // Create or Update Hospital
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Format data for backend according to new schema
      const hospitalData = {
        name: form.name,
        type: form.type,
        fullAddress: form.fullAddress,
        geoLocation: {
          latitude: parseFloat(form.geoLocation.latitude),
          longitude: parseFloat(form.geoLocation.longitude)
        },
        website: form.website,
        facilities: form.facilities ? form.facilities.split(',').map(item => item.trim()) : [],
        equipment: form.equipment ? form.equipment.split(',').map(item => item.trim()) : [],
        registrationId: form.registrationId,
        yearOfEstablishment: parseInt(form.yearOfEstablishment) || 0,
        staffCount: parseInt(form.staffCount) || 0,
        password: form.password,
        phone: form.phone,
        email: form.email
      };

      const url = editingId 
        ? `${API_BASE}/api/hospitals/${editingId}`
        : `${API_BASE}/api/hospitals`;
      
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('📤 Sending request to:', url);
      console.log('📝 Request method:', method);
      console.log('📦 Request data:', hospitalData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hospitalData),
      });
      
      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const savedHospital = await response.json();
      console.log('✅ Saved hospital response:', savedHospital);
      
      if (editingId) {
        setHospitals(hospitals.map(hosp => hosp._id === editingId ? savedHospital : hosp));
        console.log('🔄 Updated hospital in state');
      } else {
        setHospitals([...hospitals, savedHospital]);
        console.log('➕ Added new hospital to state');
      }
      
      resetForm();
      alert(`Hospital ${editingId ? 'updated' : 'registered'} successfully!`);
    } catch (error) {
      console.error('💥 Error saving hospital:', error);
      setError(`Failed to save hospital: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get all hospitals
  async function fetchHospitals() {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/hospitals`;
      console.log('🔄 Fetching hospitals from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Hospitals response status:', response.status);
      console.log('📨 Hospitals response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Hospitals response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Hospitals data received:', data);
      console.log('🏥 Number of hospitals:', data.length);
      
      setHospitals(data);
    } catch (error) {
      console.error('💥 Error fetching hospitals:', error);
      setError(`Failed to fetch hospitals: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Get hospital by ID
  async function fetchHospitalById(id) {
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/hospitals/${id}`;
      console.log('🔄 Fetching hospital by ID from:', url);
      
      const response = await fetch(url);
      
      console.log('📨 Single hospital response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const hospital = await response.json();
      console.log('✅ Single hospital data:', hospital);
      
      // Format data for form according to new schema
      setForm({
        name: hospital.name || "",
        type: hospital.type || "private",
        fullAddress: hospital.fullAddress || "",
        geoLocation: {
          latitude: hospital.geoLocation?.latitude || 0,
          longitude: hospital.geoLocation?.longitude || 0
        },
        website: hospital.website || "",
        facilities: hospital.facilities ? hospital.facilities.join(', ') : "",
        equipment: hospital.equipment ? hospital.equipment.join(', ') : "",
        registrationId: hospital.registrationId || "",
        yearOfEstablishment: hospital.yearOfEstablishment?.toString() || "",
        staffCount: hospital.staffCount?.toString() || "",
        password: hospital.password || "",
        phone: hospital.phone || "",
        email: hospital.email || ""
      });
      setEditingId(hospital._id);
      setMapLoaded(true);
    } catch (error) {
      console.error('💥 Error fetching hospital:', error);
      setError(`Failed to fetch hospital: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Delete hospital
  async function deleteHospital(id) {
    if (!confirm('Are you sure you want to delete this hospital?')) return;
    
    setLoading(true);
    setError("");
    try {
      const url = `${API_BASE}/api/hospitals/${id}`;
      console.log('🗑️ Deleting hospital from:', url);
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      console.log('📨 Delete response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setHospitals(hospitals.filter(hosp => hosp._id !== id));
      console.log('✅ Hospital deleted successfully');
      alert('Hospital deleted successfully!');
    } catch (error) {
      console.error('💥 Error deleting hospital:', error);
      setError(`Failed to delete hospital: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    console.log('🔄 Resetting form');
    setForm({ 
      name: "", 
      type: "private",
      fullAddress: "",
      geoLocation: {
        latitude: form.geoLocation.latitude, // Keep current location
        longitude: form.geoLocation.longitude
      },
      website: "",
      facilities: "",
      equipment: "",
      registrationId: "",
      yearOfEstablishment: "",
      staffCount: "",
      password: "",
      phone: "",
      email: ""
    });
    setEditingId(null);
    setError("");
  }

  function handleEdit(hospital) {
    console.log('✏️ Editing hospital:', hospital);
    // Format data for form according to new schema
    setForm({
      name: hospital.name || "",
      type: hospital.type || "private",
      fullAddress: hospital.fullAddress || "",
      geoLocation: {
        latitude: hospital.geoLocation?.latitude || 0,
        longitude: hospital.geoLocation?.longitude || 0
      },
      website: hospital.website || "",
      facilities: hospital.facilities ? hospital.facilities.join(', ') : "",
      equipment: hospital.equipment ? hospital.equipment.join(', ') : "",
      registrationId: hospital.registrationId || "",
      yearOfEstablishment: hospital.yearOfEstablishment?.toString() || "",
      staffCount: hospital.staffCount?.toString() || "",
      password: hospital.password || "",
      phone: hospital.phone || "",
      email: hospital.email || ""
    });
    setEditingId(hospital._id);
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
      const response = await fetch(`${API_BASE}/api/hospitals`);
      console.log('🔍 Connection test response status:', response.status);
      console.log('🔍 Connection test response ok:', response.ok);
      
      if (response.ok) {
        alert('✅ Backend connection successful!');
        fetchHospitals();
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
    console.log('🏥 Hospitals state updated:', hospitals);
  }, [hospitals]);

  useEffect(() => {
    console.log('📝 Form state updated:', form);
  }, [form]);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Hospital Management</h1>
      
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
              onClick={fetchHospitals}
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
            {editingId ? 'Edit Hospital' : 'Register New Hospital'}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <Field 
              label="Hospital Name" 
              value={form.name} 
              onChange={(v) => setForm({ ...form, name: v })} 
              required
            />
            
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">Hospital Type</span>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio"
                    value="private"
                    checked={form.type === "private"}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                  <span className="ml-2">Private</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    className="form-radio"
                    value="gov"
                    checked={form.type === "gov"}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                  <span className="ml-2">Government</span>
                </label>
              </div>
            </div>
            
            <Field 
              type="textarea"
              label="Full Address" 
              value={form.fullAddress} 
              onChange={(v) => setForm({ ...form, fullAddress: v })} 
              placeholder="Complete hospital address with street, city, state, and country"
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
                type="url"
                label="Website URL" 
                value={form.website} 
                onChange={(v) => setForm({ ...form, website: v })} 
                placeholder="https://example.com"
              />
              <Field 
                label="Registration ID" 
                value={form.registrationId} 
                onChange={(v) => setForm({ ...form, registrationId: v })} 
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="number"
                label="Year of Establishment" 
                value={form.yearOfEstablishment} 
                onChange={(v) => setForm({ ...form, yearOfEstablishment: v })} 
                min="1800"
                max="2030"
                required
              />
              <Field 
                type="number"
                label="Staff Count" 
                value={form.staffCount} 
                onChange={(v) => setForm({ ...form, staffCount: v })} 
                min="1"
                required
              />
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
            
            <Field 
              type="textarea"
              label="Facilities (comma separated)" 
              value={form.facilities} 
              onChange={(v) => setForm({ ...form, facilities: v })} 
              placeholder="ICU, Emergency, Pharmacy, Lab, Operation Theater"
            />
            
            <Field 
              type="textarea"
              label="Equipment (comma separated)" 
              value={form.equipment} 
              onChange={(v) => setForm({ ...form, equipment: v })} 
              placeholder="MRI, CT Scanner, X-Ray, Ventilator, ECG"
            />
            
            <div className="flex gap-3 pt-4">
              <button 
                className="btn btn-primary flex-1" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update Hospital' : 'Register Hospital'}
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

        {/* Hospitals List */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Hospitals List</h2>
            <button 
              className="btn btn-outline" 
              onClick={fetchHospitals}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Hospitals'}
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {hospitals.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {loading ? 'Loading hospitals...' : 'No hospitals found. Click "Refresh Hospitals" to load.'}
              </p>
            ) : (
              hospitals.map((hospital) => (
                <div key={hospital._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{hospital.name}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Type:</strong> {hospital.type === 'gov' ? 'Government' : 'Private'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Address:</strong> {hospital.fullAddress}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {hospital.geoLocation?.latitude?.toFixed(6)}, {hospital.geoLocation?.longitude?.toFixed(6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {hospital.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {hospital.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Registration ID:</strong> {hospital.registrationId}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Established:</strong> {hospital.yearOfEstablishment}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Staff Count:</strong> {hospital.staffCount}
                      </p>
                      {hospital.website && (
                        <p className="text-sm text-gray-600">
                          <strong>Website:</strong> 
                          <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-1">
                            {hospital.website}
                          </a>
                        </p>
                      )}
                      {hospital.facilities && hospital.facilities.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Facilities:</strong> {hospital.facilities.join(', ')}
                        </p>
                      )}
                      {hospital.equipment && hospital.equipment.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Equipment:</strong> {hospital.equipment.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleEdit(hospital)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteHospital(hospital._id)}
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