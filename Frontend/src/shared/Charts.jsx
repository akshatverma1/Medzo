"use client"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"
import React from 'react';

const barData = [
  { name: "Jan", value: 60 },
  { name: "Feb", value: 75 },
  { name: "Mar", value: 90 },
  { name: "Apr", value: 80 },
  { name: "May", value: 110 },
  { name: "Jun", value: 95 },
]

const pieData = [
  { name: "Root Canal", value: 38 },
  { name: "Wisdom Tooth", value: 22 },
  { name: "Bleaching", value: 31 },
  { name: "Others", value: 9 },
]

// blue family to match reference
const ACCENTS = ["#2563eb", "#60a5fa", "#93c5fd", "#1d4ed8"]

function BarAppointments() {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData} barCategoryGap={24}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--chart-2)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function PieTreatments() {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip />
          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {pieData.map((_, idx) => (
              <Cell key={idx} fill={ACCENTS[idx % ACCENTS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default { BarAppointments, PieTreatments }
export { BarAppointments, PieTreatments }
