"use client"

import { useState } from "react"
import React from 'react';

export default function RegisterDoctor() {
  const [form, set] = useState({ name: "", email: "", phone: "", specialty: "", license: "", availability: "" })
  function onSubmit(e) {
    e.preventDefault()
    alert(`Doctor ${form.name} registered!`)
  }
  return (
    <main className="container py-32">
      <h1 className="h2">Doctor Registration</h1>
      <form className="card p-16 grid-2 gap-16 mt-20" onSubmit={onSubmit}>
        <Field label="Full Name" value={form.name} onChange={(v) => set({ ...form, name: v })} />
        <Field type="email" label="Email" value={form.email} onChange={(v) => set({ ...form, email: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => set({ ...form, phone: v })} />
        <Field label="Specialty" value={form.specialty} onChange={(v) => set({ ...form, specialty: v })} />
        <Field label="License #" value={form.license} onChange={(v) => set({ ...form, license: v })} />
        <Field label="Availability" value={form.availability} onChange={(v) => set({ ...form, availability: v })} />
        <div className="col-span-2">
          <button className="btn btn-primary" type="submit">
            Register Doctor
          </button>
        </div>
      </form>
    </main>
  )
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} required />
    </label>
  )
}
