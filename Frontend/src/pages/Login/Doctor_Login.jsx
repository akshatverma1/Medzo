import RoleLoginForm from "../Login/Role-login-form.jsx"
import React from 'react';

export default function DoctorLoginPage() {
  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-pretty">Doctor Login</h1>
        <p className="text-muted-foreground">Manage schedules, patients, and approvals.</p>
      </header>
      <RoleLoginForm role="doctor" />
    </main>
  )
}
