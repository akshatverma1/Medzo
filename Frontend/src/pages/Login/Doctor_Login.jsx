import { useNavigate } from "react-router-dom"
import RoleLoginForm from "../Login/Role-login-form.jsx"
import React from 'react';
import { useState } from "react"

export default function DoctorLoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = (email, password) => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Doctor login attempt:', { email })
      
      // Navigate to "/dd" regardless of password
      navigate("/dd")
      
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      {/* <header className="mb-8">
        <h1 className="text-3xl font-semibold text-pretty">Doctor Login</h1>
        <p className="text-muted-foreground">Manage schedules, patients, and approvals.</p>
      </header>
       */}
      {/* Custom Login Form */}
      <div style={{height:"5rem"}}></div>
      <div className="max-w-md mx-auto">
        <div className="card p-6 shadow-lg border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back, Doctor</h2>
          
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
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter any password"
                />
                <p className="text-xs text-gray-500 mt-1">Password is not validated</p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </div>
          </form>

          
        </div>
      </div>
    </main>
  )
}