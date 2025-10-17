import React from 'react';

export default function Features() {
  return (
    <main className="container py-32">
      <h1 className="h2">Healthcare Platform Features</h1>
      <p className="muted mt-8">Comprehensive tools for modern healthcare communication and management.</p>

      <div className="grid-4 gap-12 mt-24">
        <Feature title="Open Chat" icon="💬">
          Public community chat for healthcare discussions and knowledge sharing.
        </Feature>
        <Feature title="Private Messaging" icon="🔒">
          Secure one-on-one conversations between patients and healthcare providers.
        </Feature>
        <Feature title="Appointment Booking" icon="📅">
          Easy scheduling with real-time availability and confirmation notifications.
        </Feature>
        <Feature title="Medical History" icon="📋">
          Digital access to patient records, test results, and treatment history.
        </Feature>
        <Feature title="Hospital Locator" icon="🏥">
          Find nearby medical facilities with detailed information and directions.
        </Feature>
        <Feature title="Doctor Directory" icon="👨‍⚕️">
          Comprehensive directory of healthcare professionals with specialties and availability.
        </Feature>
        <Feature title="Emergency Services" icon="🚑">
          Quick access to emergency contacts and nearby emergency rooms.
        </Feature>
        <Feature title="Health Records" icon="📊">
          Secure storage and management of personal health information.
        </Feature>
      </div>
    </main>
  )
}

function Feature({ title, children, icon }) {
  return (
    <div className="card p-12 text-center hover:shadow-md transition-all duration-300 hover:translate-y-[-4px]">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="h5 font-semibold mb-3">{title}</h3>
      <p className="muted text-sm">{children}</p>
    </div>
  )
}