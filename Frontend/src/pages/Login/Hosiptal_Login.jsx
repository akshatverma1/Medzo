import { useNavigate } from "react-router-dom"
import React from 'react';
import { useState } from "react"

export default function HospitalLoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = (email, password) => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Hospital login attempt:', { email })
      
      // Navigate to "/hd" regardless of password
      navigate("/hd")
      
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <div style={{height:"5rem"}}></div>
      {/* <header className="mb-8">
        <h1 className="text-3xl font-semibold text-pretty">Hospital Admin Login</h1>
        <p className="text-muted-foreground">Manage hospital operations, staff, and resources.</p>
      </header> */}
      
      {/* Custom Login Form */}
      <div className="max-w-md mx-auto">
        <div className="card p-6 shadow-lg border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Hospital Management System</h2>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const email = formData.get('email')
            const password = formData.get('password')
            handleLogin(email, password)
          }}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="admin@hospital.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter any password"
                />
                <p className="text-xs text-gray-500 mt-1">Password is not validated</p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Access Hospital Dashboard'
                )}
              </button>
            </div>
          </form>

          

          {/* Admin contact */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Hospital administrator?{' '}
              <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                Request system access
              </a>
            </p>
          </div>
        </div>

        {/* Hospital Stats Preview */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">Hospital Management Features</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">50+</div>
              <div className="text-gray-600">Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">200+</div>
              <div className="text-gray-600">Patients</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">150</div>
              <div className="text-gray-600">Beds</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}