import { useLocation } from "react-router-dom"
import Sidebar from "../shared/Sidebar.jsx"
import Topbar from "../shared/Topbar.jsx"
import MetricsRow from "../shared/MetricsRow.jsx"
import Charts from "../shared/Charts.jsx"
import React from 'react';

export default function Dashboard() {
  const role = new URLSearchParams(useLocation().search).get("role") || "user"
  const roleLabel =
    role === "doctor" ? "Doctor" : role === "hospital" ? "Hospital" : role === "patient" ? "Patient" : "User"

  return (
    <main className="dashboard grid-2-fixed">
      <Sidebar />
      <section className="column">
        <Topbar />
        <div className="container-narrow py-24">
          <h1 className="h2">Welcome back, {roleLabel}</h1>
          <p className="muted mt-8">Here’s an overview of your activity.</p>

          <MetricsRow />

          <div className="grid-3 mt-24 gap-16">
            <div className="card p-16 col-span-2">
              <h2 className="h4 mb-12">Appointments</h2>
              <Charts.BarAppointments />
            </div>

            <div className="card p-16">
              <h2 className="h4 mb-12">Top Treatments</h2>
              <Charts.PieTreatments />
            </div>

            <div className="card p-16">
              <h2 className="h4 mb-12">Next Patient Details</h2>
              <ul className="muted list-vert">
                <li>Riko Tanaka — Root Canal — 09:00</li>
                <li>Akira Moriyama — Consultation — 11:00</li>
                <li>Peter Nakamura — Scaling — 14:00</li>
              </ul>
            </div>

            <div className="card p-16">
              <h2 className="h4 mb-12">Doctors at Work</h2>
              <ul className="muted list-vert">
                <li>Dr. Shin Tamura — 3 patients — At Work</li>
                <li>Dr. Yoshi Yamada — 2 patients — Lunch</li>
                <li>Dr. Ryo Fukuzawa — 4 patients — At Work</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
