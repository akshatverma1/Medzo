import React from 'react';

export default function ApiServicesPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-3xl font-semibold text-pretty">API Services</h1>
        <p className="text-muted-foreground">
          Our SaaS provides secure APIs for appointments, patients, doctors, messages, and billing. Use our REST
          endpoints or the lightweight JS SDK to integrate within minutes.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { name: "Appointments API", desc: "Create, reschedule, and manage appointments programmatically." },
          { name: "Patient Records API", desc: "Read and update patient profiles with audit logs." },
          { name: "Messaging API", desc: "Notify patients and staff via in-app messages." },
          { name: "Doctors API", desc: "Manage rosters, specialties, and availability." },
          { name: "Payments API", desc: "Track invoices and payments asynchronously." },
          { name: "Analytics API", desc: "Query KPIs and dashboards securely." },
        ].map((s) => (
          <div key={s.name} className="rounded-xl border p-5 bg-card text-card-foreground">
            <h3 className="font-medium">{s.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6 bg-card text-card-foreground">
          <h2 className="text-xl font-semibold">Quick REST Example</h2>
          <pre className="mt-3 text-sm bg-muted/50 rounded-md p-4 overflow-auto">
            {`GET https://api.your-hospital-saas.com/v1/appointments?patientId=123

curl -H "Authorization: Bearer <API_KEY>" \\
  "https://api.your-hospital-saas.com/v1/appointments?patientId=123"`}
          </pre>
        </div>
        <div className="rounded-xl border p-6 bg-card text-card-foreground">
          <h2 className="text-xl font-semibold">JavaScript SDK</h2>
          <pre className="mt-3 text-sm bg-muted/50 rounded-md p-4 overflow-auto">
            {`import { HospitalClient } from "@your/hospi-sdk"

const client = new HospitalClient({ apiKey: "<API_KEY>" })
const { items } = await client.appointments.list({ patientId: "123" })
console.log(items)`}
          </pre>
        </div>
      </section>
    </main>
  )
}
