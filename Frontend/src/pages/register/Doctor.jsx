"use client"

import { useState, useEffect } from "react"
import React from 'react';

export default function RegisterDoctor() {
  const [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    specialty: "", 
    qualifications: "", 
    hospital: "" 
  });
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use your API base URL
  const API_BASE = 'http://127.0.0.1:3000';

  // Fetch doctors and hospitals on component mount
  useEffect(() => {
    console.log('🔄 Component mounted - fetching initial data');
    fetchDoctors();
    fetchHospitals();
  }, []);

  // Create or Update Doctor
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Format qualifications as array
      const doctorData = {
        ...form,
        qualifications: form.qualifications ? form.qualifications.split(',').map(q => q.trim()) : []
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
      
      // Format qualifications for display
      setForm({
        ...doctor,
        qualifications: doctor.qualifications ? doctor.qualifications.join(', ') : '',
        hospital: doctor.hospital?._id || ''
      });
      setEditingId(doctor._id);
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
      firstName: "", 
      lastName: "", 
      email: "", 
      phone: "", 
      specialty: "", 
      qualifications: "", 
      hospital: "" 
    });
    setEditingId(null);
    setError("");
  }

  function handleEdit(doctor) {
    console.log('✏️ Editing doctor:', doctor);
    // Format qualifications for display
    setForm({
      ...doctor,
      qualifications: doctor.qualifications ? doctor.qualifications.join(', ') : '',
      hospital: doctor.hospital?._id || ''
    });
    setEditingId(doctor._id);
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
            <div className="grid grid-cols-2 gap-4">
              <Field 
                label="First Name" 
                value={form.firstName} 
                onChange={(v) => setForm({ ...form, firstName: v })} 
              />
              <Field 
                label="Last Name" 
                value={form.lastName} 
                onChange={(v) => setForm({ ...form, lastName: v })} 
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
            
            <Field 
              label="Specialty" 
              value={form.specialty} 
              onChange={(v) => setForm({ ...form, specialty: v })} 
            />
            
            <Field 
              label="Qualifications (comma-separated)" 
              value={form.qualifications} 
              onChange={(v) => setForm({ ...form, qualifications: v })} 
              placeholder="MD, MBBS, PhD"
            />
            
            <div className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Hospital</span>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={form.hospital} 
                onChange={(e) => setForm({ ...form, hospital: e.target.value })} 
              >
                <option value="">Select Hospital</option>
                {hospitals.map(hospital => (
                  <option key={hospital._id} value={hospital._id}>
                    {hospital.name}
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
                      <h3 className="font-semibold text-lg">Dr. {doctor.firstName} {doctor.lastName}</h3>
                      <p className="text-sm text-gray-600">
                        <strong>Specialty:</strong> {doctor.specialty}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {doctor.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Phone:</strong> {doctor.phone}
                      </p>
                      {doctor.qualifications && doctor.qualifications.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <strong>Qualifications:</strong> {doctor.qualifications.join(', ')}
                        </p>
                      )}
                      {doctor.hospital && (
                        <p className="text-sm text-gray-600">
                          <strong>Hospital:</strong> {doctor.hospital.name}
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
        required 
      />
    </label>
  )
}