import { Link } from "react-router-dom"
import React from 'react';

export default function Sidebar() {
  const items = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "#", label: "Schedule" },
    { to: "#", label: "Appointments" },
    { to: "#", label: "Patients" },
    { to: "#", label: "Doctors" },
    { to: "#", label: "Messages" },
    { to: "#", label: "Payments" },
  ]
  return (
    <aside className="sidebar column gap-8 p-16">
      <div className="brand sm">CareLink</div>
      <nav className="grow">
        <ul className="nav">
          {items.map((i) => (
            <li key={i.label}>
              {i.to.startsWith("#") ? (
                <a href={i.to} className="nav-item">
                  {i.label}
                </a>
              ) : (
                <Link to={i.to} className="nav-item">
                  {i.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="column gap-8">
        <a className="nav-item" href="#">
          Settings
        </a>
        <a className="nav-item" href="#">
          Support
        </a>
        <a className="nav-item destructive" href="#">
          Log Out
        </a>
      </div>
    </aside>
  )
}
