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
          <div className="services-header">
            <h2 className="h2">Healthcare Platform Features</h2>
            <p className="subtitle muted mt-8">
              Comprehensive tools for modern healthcare communication and management
            </p>
          </div>
          
          <div className="services-grid mt-20">
            {/* Open Chat */}
            <div className="service-card card p-16">
              <div className="service-icon">💬</div>
              <h3 className="h4">Open Chat</h3>
              <p className="muted mt-8">Public community chat for healthcare discussions and knowledge sharing.</p>
            </div>
            
            {/* Private Messaging */}
            <div className="service-card card p-16">
              <div className="service-icon">🔒</div>
              <h3 className="h4">Private Messaging</h3>
              <p className="muted mt-8">Secure one-on-one conversations between patients and healthcare providers.</p>
            </div>
            
            {/* Appointment Booking */}
            <div className="service-card card p-16">
              <div className="service-icon">📅</div>
              <h3 className="h4">Appointment Booking</h3>
              <p className="muted mt-8">Easy scheduling with real-time availability and confirmation notifications.</p>
            </div>
            
            {/* Medical History */}
            <div className="service-card card p-16">
              <div className="service-icon">📋</div>
              <h3 className="h4">Medical History</h3>
              <p className="muted mt-8">Digital access to patient records, test results, and treatment history.</p>
            </div>
            
            {/* Hospital Locator */}
            <div className="service-card card p-16">
              <div className="service-icon">🏥</div>
              <h3 className="h4">Hospital Locator</h3>
              <p className="muted mt-8">Find nearby medical facilities with detailed information and directions.</p>
            </div>
            
            {/* Doctor Directory */}
            <div className="service-card card p-16">
              <div className="service-icon">👨‍⚕️</div>
              <h3 className="h4">Doctor Directory</h3>
              <p className="muted mt-8">Comprehensive directory of healthcare professionals with specialties and availability.</p>
            </div>
            
            {/* Emergency Services */}
            <div className="service-card card p-16">
              <div className="service-icon">🚑</div>
              <h3 className="h4">Emergency Services</h3>
              <p className="muted mt-8">Quick access to emergency contacts and nearby emergency rooms.</p>
            </div>
            
            {/* Health Records */}
            <div className="service-card card p-16">
              <div className="service-icon">📊</div>
              <h3 className="h4">Health Records</h3>
              <p className="muted mt-8">Secure storage and management of personal health information.</p>
            </div>

            {/* API Integration */}
            <div className="service-card card p-16">
              <div className="service-icon">🔌</div>
              <h3 className="h4">API Integration</h3>
              <p className="muted mt-8">Seamlessly connect with existing healthcare systems and applications.</p>
              <pre className="code mt-16">{`POST /v1/appointments
Authorization: Bearer <token>
{
  "patientId": "pat_123",
  "doctorId": "doc_456",
  "time": "2025-10-20T09:00:00Z"
}`}</pre>
            </div>

            {/* Financial Tools */}
            <div className="service-card card p-16">
              <div className="service-icon">💰</div>
              <h3 className="h4">Financial Tools</h3>
              <p className="muted mt-8">Manage billing, insurance claims, and payment processing efficiently.</p>
            </div>

            {/* Webhooks */}
            <div className="service-card card p-16">
              <div className="service-icon">🔄</div>
              <h3 className="h4">Webhooks</h3>
              <p className="muted mt-8">Real-time updates for bookings, cancellations, and status changes.</p>
            </div>

            {/* EHR Integrations */}
            <div className="service-card card p-16">
              <div className="service-icon">🏥</div>
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

      <style jsx>{`
        .services-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .services-header .h2 {
          font-size: 2.5rem;
          color: #1e293b;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .subtitle {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
        }
        
        .service-card {
          transition: all 0.3s ease;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }
        
        .service-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
          display: block;
        }
        
        .service-card .h4 {
          font-size: 1.3rem;
          color: #1e293b;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .service-card .muted {
          line-height: 1.6;
          font-size: 0.95rem;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }
          
          .services-header .h2 {
            font-size: 2rem;
          }
          
          .subtitle {
            font-size: 1.1rem;
          }
        }
        
        @media (max-width: 480px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
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