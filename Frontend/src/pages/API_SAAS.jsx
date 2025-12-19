"use client"

import { useState, useEffect } from "react"
import React from 'react';

export default function APIDocumentation() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedEndpoint, setCopiedEndpoint] = useState("");
  const [apiStatus, setApiStatus] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:3000';

  // Test API endpoints status
  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    setLoading(true);
    const status = {};
    
    // Check each endpoint group
    const endpointsToCheck = [
      '/api/doctors',
      '/api/patients', 
      '/api/hospitals'
    ];

    for (const endpoint of endpointsToCheck) {
      try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        status[endpoint] = response.ok ? 'operational' : 'degraded';
      } catch (error) {
        status[endpoint] = 'down';
      }
    }

    setApiStatus(status);
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(""), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational': return 'Operational';
      case 'degraded': return 'Degraded';
      case 'down': return 'Down';
      default: return 'Unknown';
    }
  };

  // API Endpoints Data
  const apiEndpoints = [
    // DOCTORS ENDPOINTS
    {
      id: 1,
      method: 'POST',
      endpoint: '/api/doctors',
      category: 'doctors',
      description: 'Create a new doctor',
      requestBody: {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        phone: 'string',
        specialty: 'string',
        qualifications: 'array',
        hospital: 'ObjectId'
      },
      response: {
        _id: 'ObjectId',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        phone: 'string',
        specialty: 'string',
        qualifications: ['MD', 'MBBS'],
        hospital: 'ObjectId',
        createdAt: 'Date'
      }
    },
    {
      id: 2,
      method: 'GET',
      endpoint: '/api/doctors',
      category: 'doctors',
      description: 'Get all doctors',
      parameters: '?page=1&limit=10&specialty=cardiology',
      response: 'Array of doctor objects'
    },
    {
      id: 3,
      method: 'GET',
      endpoint: '/api/doctors/:id',
      category: 'doctors',
      description: 'Get doctor by ID',
      parameters: ':id - Doctor ObjectId',
      response: 'Single doctor object'
    },
    {
      id: 4,
      method: 'PUT',
      endpoint: '/api/doctors/:id',
      category: 'doctors',
      description: 'Update doctor details',
      parameters: ':id - Doctor ObjectId',
      requestBody: 'Partial doctor object',
      response: 'Updated doctor object'
    },
    {
      id: 5,
      method: 'DELETE',
      endpoint: '/api/doctors/:id',
      category: 'doctors',
      description: 'Delete doctor by ID',
      parameters: ':id - Doctor ObjectId',
      response: '{ message: "Doctor deleted" }'
    },

    // PATIENTS ENDPOINTS
    {
      id: 6,
      method: 'POST',
      endpoint: '/api/patients',
      category: 'patients',
      description: 'Create a new patient',
      requestBody: {
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        phone: 'string',
        age: 'number',
        gender: 'string',
        address: {
          city: 'string',
          state: 'string',
          country: 'string'
        },
        medicalHistory: 'array',
        assignedDoctor: 'ObjectId'
      },
      response: 'Patient object with _id'
    },
    {
      id: 7,
      method: 'GET',
      endpoint: '/api/patients',
      category: 'patients',
      description: 'Get all patients',
      parameters: '?page=1&limit=10&age=30',
      response: 'Array of patient objects'
    },
    {
      id: 8,
      method: 'GET',
      endpoint: '/api/patients/:id',
      category: 'patients',
      description: 'Get patient by ID',
      parameters: ':id - Patient ObjectId',
      response: 'Single patient object'
    },
    {
      id: 9,
      method: 'PUT',
      endpoint: '/api/patients/:id',
      category: 'patients',
      description: 'Update patient details',
      parameters: ':id - Patient ObjectId',
      requestBody: 'Partial patient object',
      response: 'Updated patient object'
    },
    {
      id: 10,
      method: 'DELETE',
      endpoint: '/api/patients/:id',
      category: 'patients',
      description: 'Delete patient by ID',
      parameters: ':id - Patient ObjectId',
      response: '{ message: "Patient deleted" }'
    },

    // HOSPITALS ENDPOINTS
    {
      id: 11,
      method: 'POST',
      endpoint: '/api/hospitals',
      category: 'hospitals',
      description: 'Create a new hospital',
      requestBody: {
        name: 'string',
        address: {
          city: 'string',
          state: 'string',
          country: 'string'
        },
        phone: 'string',
        email: 'string',
        capacityBeds: 'number',
        ventilatorCount: 'number',
        equipment: 'array'
      },
      response: 'Hospital object with _id'
    },
    {
      id: 12,
      method: 'GET',
      endpoint: '/api/hospitals',
      category: 'hospitals',
      description: 'Get all hospitals',
      parameters: '?page=1&limit=10&city=NewYork',
      response: 'Array of hospital objects'
    },
    {
      id: 13,
      method: 'GET',
      endpoint: '/api/hospitals/:id',
      category: 'hospitals',
      description: 'Get hospital by ID',
      parameters: ':id - Hospital ObjectId',
      response: 'Single hospital object'
    },
    {
      id: 14,
      method: 'PUT',
      endpoint: '/api/hospitals/:id',
      category: 'hospitals',
      description: 'Update hospital details',
      parameters: ':id - Hospital ObjectId',
      requestBody: 'Partial hospital object',
      response: 'Updated hospital object'
    },
    {
      id: 15,
      method: 'DELETE',
      endpoint: '/api/hospitals/:id',
      category: 'hospitals',
      description: 'Delete hospital by ID',
      parameters: ':id - Hospital ObjectId',
      response: '{ message: "Hospital deleted" }'
    },

    // HEALTHCARE ANALYTICS
    {
      id: 16,
      method: 'GET',
      endpoint: '/api/analytics/doctors/specialties',
      category: 'analytics',
      description: 'Get doctor specialty distribution',
      response: '{ cardiology: 5, neurology: 3, ... }'
    },
    {
      id: 17,
      method: 'GET',
      endpoint: '/api/analytics/patients/age-groups',
      category: 'analytics',
      description: 'Get patient age group distribution',
      response: '{ "0-18": 10, "19-35": 25, ... }'
    },
    {
      id: 18,
      method: 'GET',
      endpoint: '/api/analytics/hospitals/capacity',
      category: 'analytics',
      description: 'Get hospital capacity analytics',
      response: 'Hospital capacity statistics'
    }
  ];

  // Filter endpoints based on category and search
  const filteredEndpoints = apiEndpoints.filter(endpoint => {
    const matchesCategory = activeCategory === 'all' || endpoint.category === activeCategory;
    const matchesSearch = endpoint.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         endpoint.method.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all', name: 'All Endpoints', count: apiEndpoints.length, icon: '🌐' },
    { id: 'doctors', name: 'Doctors API', count: apiEndpoints.filter(e => e.category === 'doctors').length, icon: '👨‍⚕️' },
    { id: 'patients', name: 'Patients API', count: apiEndpoints.filter(e => e.category === 'patients').length, icon: '👥' },
    { id: 'hospitals', name: 'Hospitals API', count: apiEndpoints.filter(e => e.category === 'hospitals').length, icon: '🏥' },
    { id: 'analytics', name: 'Analytics API', count: apiEndpoints.filter(e => e.category === 'analytics').length, icon: '📊' }
  ];

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800 border-green-200';
      case 'POST': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PUT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'DELETE': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">API Base URL: {API_BASE}</span>
            <button 
              onClick={() => copyToClipboard(API_BASE)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copiedEndpoint === API_BASE ? '✅ Copied!' : '📋'}
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Healthcare SaaS API Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive API documentation for MedZo Healthcare Management System. 
            Build powerful healthcare applications with our RESTful APIs.
          </p>
        </div>

        {/* API Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {categories.slice(1).map(category => (
            <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{category.icon}</div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(apiStatus[`/api/${category.id}`] || 'unknown')}`}></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.count} endpoints</p>
              <p className="text-xs text-gray-500 mt-2">
                Status: {getStatusText(apiStatus[`/api/${category.id}`] || 'unknown')}
              </p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">API Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={checkAPIStatus}
                    disabled={loading}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <span>🔄</span>
                    <span>{loading ? 'Checking...' : 'Check API Status'}</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <span>📚</span>
                    <span>View Examples</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <span>🔑</span>
                    <span>API Keys</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints List */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeCategory === 'all' ? 'All API Endpoints' : 
                 categories.find(c => c.id === activeCategory)?.name}
              </h2>
              <span className="text-gray-600">
                {filteredEndpoints.length} endpoints found
              </span>
            </div>

            <div className="space-y-6">
              {filteredEndpoints.map(endpoint => (
                <div key={endpoint.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-lg font-mono font-semibold text-gray-900">
                          {endpoint.endpoint}
                        </code>
                        <button
                          onClick={() => copyToClipboard(`${API_BASE}${endpoint.endpoint}`)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy endpoint URL"
                        >
                          {copiedEndpoint === `${API_BASE}${endpoint.endpoint}` ? '✅' : '📋'}
                        </button>
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {endpoint.category}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{endpoint.description}</p>

                    {/* Parameters */}
                    {endpoint.parameters && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Parameters</h4>
                        <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700 font-mono">
                          {endpoint.parameters}
                        </code>
                      </div>
                    )}

                    {/* Request Body */}
                    {endpoint.requestBody && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Request Body</h4>
                        <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 font-mono overflow-x-auto">
                          {JSON.stringify(endpoint.requestBody, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Response */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
                      <pre className="bg-green-50 border border-green-200 p-4 rounded-lg text-sm text-gray-700 font-mono overflow-x-auto">
                        {typeof endpoint.response === 'string' 
                          ? endpoint.response 
                          : JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>

                    {/* Try It Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
                        <span>🚀</span>
                        <span className="font-medium">Try this endpoint</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEndpoints.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No endpoints found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or select a different category
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🚀 Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get API Key</h3>
              <p className="text-gray-600 text-sm">
                Register your application to get your unique API key for authentication.
              </p>
            </div>
            <div className="p-6 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Make Your First Request</h3>
              <p className="text-gray-600 text-sm">
                Use the endpoints above to start integrating with our healthcare APIs.
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Explore Documentation</h3>
              <p className="text-gray-600 text-sm">
                Check out our detailed guides and examples for each endpoint.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p>Need help? Contact our support team at api-support@medzo.com</p>
          <p className="text-sm mt-2">© 2024 MedZo Healthcare SaaS. All rights reserved.</p>
        </div>
      </div>
    </main>
  )
}