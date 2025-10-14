"use client"

import { useState, useEffect } from "react"
import React from 'react';

export default function RegisterHospital() {
  const [form, setForm] = useState({ 
    name: "", 
    address: {
      city: "",
      state: "", 
      country: ""
    },
    phone: "", 
    email: "", 
    capacityBeds: "", 
    ventilatorCount: "",
    equipment: "" 
  });
  
  const [hospitals, setHospitals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = 'http://127.0.0.1:3000';

  // Fetch hospitals on component mount
  useEffect(() => {
    fetchHospitals();
  }, []);

  // Create or Update Hospital
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Format data for backend
      const hospitalData = {
        ...form,
        capacityBeds: parseInt(form.capacityBeds) || 0,
        ventilatorCount: parseInt(form.ventilatorCount) || 0,
        equipment: form.equipment ? form.equipment.split(',').map(item => item.trim()) : []
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
      
      // Format data for form
      setForm({
        name: hospital.name || "",
        address: {
          city: hospital.address?.city || "",
          state: hospital.address?.state || "",
          country: hospital.address?.country || ""
        },
        phone: hospital.phone || "",
        email: hospital.email || "",
        capacityBeds: hospital.capacityBeds?.toString() || "",
        ventilatorCount: hospital.ventilatorCount?.toString() || "",
        equipment: hospital.equipment ? hospital.equipment.join(', ') : ""
      });
      setEditingId(hospital._id);
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
      address: {
        city: "",
        state: "", 
        country: ""
      },
      phone: "", 
      email: "", 
      capacityBeds: "", 
      ventilatorCount: "",
      equipment: "" 
    });
    setEditingId(null);
    setError("");
  }

  function handleEdit(hospital) {
    console.log('✏️ Editing hospital:', hospital);
    // Format data for form
    setForm({
      name: hospital.name || "",
      address: {
        city: hospital.address?.city || "",
        state: hospital.address?.state || "",
        country: hospital.address?.country || ""
      },
      phone: hospital.phone || "",
      email: hospital.email || "",
      capacityBeds: hospital.capacityBeds?.toString() || "",
      ventilatorCount: hospital.ventilatorCount?.toString() || "",
      equipment: hospital.equipment ? hospital.equipment.join(', ') : ""
    });
    setEditingId(hospital._id);
    setError("");
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

  // Handle address field changes
  function handleAddressChange(field, value) {
    setForm({
      ...form,
      address: {
        ...form.address,
        [field]: value
      }
    });
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
            />
            
            <div className="grid grid-cols-3 gap-4">
              <Field 
                label="City" 
                value={form.address.city} 
                onChange={(v) => handleAddressChange('city', v)} 
              />
              <Field 
                label="State" 
                value={form.address.state} 
                onChange={(v) => handleAddressChange('state', v)} 
              />
              <Field 
                label="Country" 
                value={form.address.country} 
                onChange={(v) => handleAddressChange('country', v)} 
              />
            </div>
            
            <Field 
              type="email" 
              label="Email" 
              value={form.email} 
              onChange={(v) => setForm({ ...form, email: v })} 
            />
            
            <Field 
              label="Phone" 
              value={form.phone} 
              onChange={(v) => setForm({ ...form, phone: v })} 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Field 
                type="number"
                label="Bed Capacity" 
                value={form.capacityBeds} 
                onChange={(v) => setForm({ ...form, capacityBeds: v })} 
              />
              <Field 
                type="number"
                label="Ventilator Count" 
                value={form.ventilatorCount} 
                onChange={(v) => setForm({ ...form, ventilatorCount: v })} 
              />
            </div>
            
            <Field 
              label="Equipment (comma separated)" 
              value={form.equipment} 
              onChange={(v) => setForm({ ...form, equipment: v })} 
              placeholder="MRI, CT Scanner, X-Ray, ICU"
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
                        <strong>Address:</strong> {hospital.address?.city}, {hospital.address?.state}, {hospital.address?.country}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {hospital.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {hospital.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Bed Capacity:</strong> {hospital.capacityBeds}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Ventilators:</strong> {hospital.ventilatorCount}
                      </p>
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

function Field({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input 
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder}
        required={type !== "number"}
      />
    </label>
  )
}