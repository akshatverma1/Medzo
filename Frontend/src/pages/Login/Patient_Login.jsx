import { useNavigate } from "react-router-dom"
import React from 'react';
import { useState } from "react"

export default function PatientLoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogin = (email, password) => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      console.log('Patient login attempt:', { email })
      
      // Navigate to "/pd" regardless of password
      navigate("/pd")
      
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-pretty">Patient Login</h1>
        <p className="text-muted-foreground">Access your medical records and appointments.</p>
      </header>
      
      {/* Custom Login Form */}
      <div className="max-w-md mx-auto">
        <div className="card p-6 shadow-lg border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome to Patient Portal</h2>
          
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter any password"
                />
                <p className="text-xs text-gray-500 mt-1">Password is not validated</p>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Access Patient Dashboard'
                )}
              </button>
            </div>
          </form>

          

          {/* Sign up link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}