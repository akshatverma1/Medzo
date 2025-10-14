"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import React from 'react';

export default function RoleLoginForm({ role = "patient" }) {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Fake auth; just route to the shared dashboard
      router.push(`/dashboard?role=${encodeURIComponent(role)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto rounded-xl border bg-card text-card-foreground p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-1 capitalize text-pretty">{role} login</h1>
      <p className="text-sm text-muted-foreground mb-6">Sign in to continue to your dashboard.</p>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-10 rounded-md border px-3 bg-background"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="h-10 rounded-md border px-3 bg-background"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-10 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          aria-busy={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our Terms and acknowledge our Privacy Policy.
        </p>
      </form>
    </div>
  )
}
