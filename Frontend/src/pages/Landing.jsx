import { Link } from "react-router-dom"
import React from 'react';

export default function Landing() {
  return (
    <main>
      <section className="container grid-2 gap-24 py-32 items-center">
        <div>
          <h1 className="hero">One dashboard for Patients, Hospitals, and Doctors</h1>
          <p className="lead mt-12">
            Manage appointments, monitor activity, and track key metrics in a single, secure place.
          </p>
          <div className="row wrap gap-12 mt-20" id="roles">
            <Link className="btn btn-primary" to="/patientlogin">
              I am a Patient
            </Link>
            <Link className="btn btn-secondary" to="/hospitallogin">
              For Hospital
            </Link>
            <Link className="btn btn-outline" to="/doctorlogin">
              I am a Doctor
            </Link>
          </div>
        </div>
        <div className="card p-16">
          <img
            src="https://i.pinimg.com/736x/6b/78/01/6b7801ae49b0e7dac902e1ee49eb1e15.jpg"
            alt="Dashboard preview with charts, metrics, and sidebar navigation"
            className="rounded"
            width="900"
            height="600"
          />
        </div>
      </section>

      <section id="services" className="container pb-40">
        <div className="card p-20">
          <h2 className="h2">Services for your hospital stack</h2>
          <p className="muted mt-8">
            CareLink is a healthcare SaaS that connects patients, hospitals, and doctors. Integrate with our API,
            automate scheduling, and sync data securely with existing systems.
          </p>
          <div className="grid-3 gap-16 mt-20">
            <div className="card p-16">
              <h3 className="h4">REST API</h3>
              <p className="muted mt-8">Create/read appointments, patients, and doctors with secure tokens.</p>
              <pre className="code mt-16">{`POST /v1/appointments
Authorization: Bearer <token>
{
  "patientId": "pat_123",
  "doctorId": "doc_456",
  "time": "2025-10-20T09:00:00Z"
}`}</pre>
            </div>
            <div className="card p-16">
              <h3 className="h4">Webhooks</h3>
              <p className="muted mt-8">Real-time updates for bookings, cancellations, and status changes.</p>
            </div>
            <div className="card p-16">
              <h3 className="h4">EHR Integrations</h3>
              <p className="muted mt-8">Optional connectors to sync records compliantly.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container pb-40">
        <div className="grid-3 gap-16">
          <Feature title="Appointments">Track upcoming visits and approvals with ease.</Feature>
          <Feature title="Analytics">View trends and treatments in simple charts.</Feature>
          <Feature title="Secure Access">Role-based access and modern best practices.</Feature>
          <Feature title="Messaging">Coordinate care with in-app secure messages.</Feature>
          <Feature title="Payments">Collect payments and reconcile balances.</Feature>
          <Feature title="Reports">Export summaries for audits and compliance.</Feature>
        </div>
      </section>

      <section id="register" className="container pb-48">
        <h2 className="h2">Register your account</h2>
        <p className="muted mt-8">Choose your role and complete the onboarding form.</p>
        <div className="grid-3 gap-16 mt-20">
          <CardLink title="Patient" to="/register/patient" cta="Register as Patient">
            Create a profile, manage appointments, and access records.
          </CardLink>
          <CardLink title="Hospital" to="/register/hospital" cta="Register Hospital" variant="secondary">
            Onboard your facility, departments, and staff in minutes.
          </CardLink>
          <CardLink title="Doctor" to="/register/doctor" cta="Register as Doctor" variant="outline">
            Connect your schedule, specialties, and availability.
          </CardLink>
        </div>
      </section>
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

function CardLink({ title, children, to, cta, variant }) {
  return (
    <div className="card p-16">
      <h3 className="h4">{title}</h3>
      <p className="muted mt-8">{children}</p>
      <div className="mt-16">
        <Link
          to={to}
          className={`btn ${variant === "secondary" ? "btn-secondary" : variant === "outline" ? "btn-outline" : "btn-primary"}`}
        >
          {cta}
        </Link>
      </div>
    </div>
  )
}
