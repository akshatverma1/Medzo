"use client"

import { useState } from "react"
import React from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  function onSubmit(e) {
    e.preventDefault()
    alert(`Thanks, ${form.name}! We received your message.`)
  }
  return (
    <main className="container py-32 grid-2 gap-24">
      <div>
        <h1 className="h2">Contact us</h1>
        <p className="muted mt-8">We usually reply within 1-2 business days.</p>
        <ul className="list-vert mt-16">
          <li>Email: hello@carelink.example</li>
          <li>Support: support@carelink.example</li>
        </ul>
      </div>
      <form className="card p-16 column gap-12" onSubmit={onSubmit}>
        <label className="field">
          <span>Name</span>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="field">
          <span>Message</span>
          <textarea
            className="input"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </label>
        <button className="btn btn-primary" type="submit">
          Send message
        </button>
      </form>
    </main>
  )
}
