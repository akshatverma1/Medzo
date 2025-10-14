"use client"

import { useState } from "react"
import React from 'react';

export default function RegisterPatient() {
  const [form, set] = useState({ name: "", email: "", phone: "", gender: "", dob: "", height: "", weight: "" })
  function onSubmit(e) {
    e.preventDefault()
    alert(`Welcome, ${form.name}! Your patient profile is created.`)
  }
  return (
    <main className="container py-32">
      <h1 className="h2">Patient Registration</h1>
      <form className="card p-16 grid-2 gap-16 mt-20" onSubmit={onSubmit}>
        <Field label="Full Name" value={form.name} onChange={(v) => set({ ...form, name: v })} />
        <Field type="email" label="Email" value={form.email} onChange={(v) => set({ ...form, email: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => set({ ...form, phone: v })} />
        <Field label="Gender" value={form.gender} onChange={(v) => set({ ...form, gender: v })} />
        <Field type="date" label="Date of Birth" value={form.dob} onChange={(v) => set({ ...form, dob: v })} />
        <Field label="Height (cm)" value={form.height} onChange={(v) => set({ ...form, height: v })} />
        <Field label="Weight (kg)" value={form.weight} onChange={(v) => set({ ...form, weight: v })} />
        <div className="col-span-2">
          <button className="btn btn-primary" type="submit">
            Register Patient
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
