"use client"

import { useState } from "react"
import React from 'react';

export default function RegisterHospital() {
  const [form, set] = useState({ org: "", admin: "", email: "", phone: "", address: "", departments: "" })
  function onSubmit(e) {
    e.preventDefault()
    alert(`Hospital ${form.org} registered!`)
  }
  return (
    <main className="container py-32">
      <h1 className="h2">Hospital Registration</h1>
      <form className="card p-16 grid-2 gap-16 mt-20" onSubmit={onSubmit}>
        <Field label="Hospital Name" value={form.org} onChange={(v) => set({ ...form, org: v })} />
        <Field label="Admin Name" value={form.admin} onChange={(v) => set({ ...form, admin: v })} />
        <Field type="email" label="Email" value={form.email} onChange={(v) => set({ ...form, email: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => set({ ...form, phone: v })} />
        <Field label="Address" value={form.address} onChange={(v) => set({ ...form, address: v })} />
        <Field
          label="Departments (comma separated)"
          value={form.departments}
          onChange={(v) => set({ ...form, departments: v })}
        />
        <div className="col-span-2">
          <button className="btn btn-primary" type="submit">
            Register Hospital
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
