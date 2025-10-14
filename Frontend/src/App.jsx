import { Routes, Route, Link, Navigate } from "react-router-dom"
import Landing from "./pages/Landing.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Features from "./pages/Features.jsx"
import Contact from "./pages/Contact.jsx"
import RegisterHospital from "./pages/register/Hospital.jsx"
import RegisterPatient from "./pages/register/Patient.jsx"
import RegisterDoctor from "./pages/register/Doctor.jsx"
import ApiServicesPage from "./pages/Apiservices.jsx"
import DoctorLogin from "./pages/Login/Doctor_Login.jsx"
import PatientLogin from "./pages/Login/Patient_Login.jsx"
import HospitalLogin from "./pages/Login/Hosiptal_Login.jsx"
import Hospital_dashboard from "./pages/Hosiptal_dashboard.jsx";
import Doctor_dashboard from "./pages/Doctor_dashboard.jsx";
import Patient_dashboard from "./pages/Paitent_dashboard.jsx";
import API_SAAS from "./pages/API_SAAS.jsx";
import React from 'react';

export default function App() {
  return (
    <div className="app-bg text-foreground">
      <header className="border-b border">
        <div className="container row-between py-16">
          <div className="row gap-8">
            <div className="logo" aria-hidden="true"></div>
            <span className="brand">Medzo</span>
          </div>
          <nav className="row gap-16 text-sm">
            <Link className="link" to="/">
              Home
            </Link>
            <Link className="link" to="/features">
              Features
            </Link>
            <a className="link" href="#services">
              Services
            </a>
            <a className="link" href="#register">
              Register
            </a>
            <Link className="link" to="/contact">
              Contact
            </Link>
            <Link className="link" to="/api_saas">
              Api Services
            </Link>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register/hospital" element={<RegisterHospital />} />
        <Route path="/register/patient" element={<RegisterPatient />} />
        <Route path="/register/doctor" element={<RegisterDoctor />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/api" element={<ApiServicesPage></ApiServicesPage>}></Route>
        <Route path="/doctorlogin" element ={<DoctorLogin></DoctorLogin>}></Route>
        <Route path="/patientlogin" element ={<PatientLogin></PatientLogin>}></Route>
        <Route path="/hospitallogin" element ={<HospitalLogin></HospitalLogin>}></Route>
        <Route path="/hd" element ={<Hospital_dashboard></Hospital_dashboard>}></Route>
        <Route path="/dd" element ={<Doctor_dashboard></Doctor_dashboard>}></Route>
        <Route path="/pd" element ={<Patient_dashboard></Patient_dashboard>}></Route>
        <Route path="/api_saas" element ={<API_SAAS></API_SAAS>}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer id="contact" className="border-t border mt-auto">
        <div className="container grid-4 py-24 gap-24">
          <div className="col-span-2">
            <div className="row gap-8">
              <div className="logo" aria-hidden="true"></div>
              <span className="brand">Medzo</span>
            </div>
            <p className="muted mt-12">
              CareLink is a modern hospital platform that unifies patients, hospitals, and doctors in one dashboard.
              Schedule faster, collaborate securely, and monitor outcomes with clear analytics.
            </p>
          </div>
          <div>
            <h4 className="h4">Product</h4>
            <ul className="list">
              <li>
                <Link className="link" to="/features">
                  Features
                </Link>
              </li>
              <li>
                <a className="link" href="#services">
                  Services
                </a>
              </li>
              <li>
                <Link className="link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="h4">Get Started</h4>
            <ul className="list">
              <li>
                <Link className="link" to="/register/patient">
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link className="link" to="/register/hospital">
                  Hospital Registration
                </Link>
              </li>
              <li>
                <Link className="link" to="/register/doctor">
                  Doctor Registration
                </Link>
              </li>
              <li>
                <Link className="link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border">
          <div className="container py-16 muted text-sm">
            © {new Date().getFullYear()} CareLink — All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
