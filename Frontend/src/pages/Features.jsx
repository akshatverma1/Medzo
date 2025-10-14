import React from 'react';

export default function Features() {
  return (
    <main className="container py-32">
      <h1 className="h2">Features</h1>
      <p className="muted mt-8">Explore what CareLink can do for you.</p>

      <div className="grid-3 gap-16 mt-24">
        <Feature title="Unified Dashboard">All your operations in one clean interface.</Feature>
        <Feature title="Role-Based Access">Secure access for patients, doctors, and admins.</Feature>
        <Feature title="Scheduling & Reminders">Reduce no-shows with automated notifications.</Feature>
        <Feature title="Analytics">Visualize trends across appointments, treatments, and revenue.</Feature>
        <Feature title="EHR Integrations">Connect to popular systems securely and compliantly.</Feature>
        <Feature title="Developer APIs">Build custom workflows on top of CareLink.</Feature>
      </div>
    </main>
  )
}

function Feature({ title, children }) {
  return (
    <div className="card p-16">
      <h3 className="h4">{title}</h3>
      <p className="muted mt-8">{children}</p>
    </div>
  )
}
