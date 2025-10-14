import React from 'react';

export default function MetricsRow() {
  const items = [
    { label: "Total Patients", value: 156, delta: "+6%" },
    { label: "Consultation", value: 92, delta: "+14%" },
    { label: "Procedure", value: 64, delta: "-7%" },
    { label: "Payment", value: "¥28,7041", delta: "+12%" },
  ]
  return (
    <div className="grid-4 gap-16 mt-20">
      {items.map((it) => (
        <div key={it.label} className="card p-16">
          <div className="muted text-sm">{it.label}</div>
          <div className="metric">{it.value}</div>
          <div className="muted tiny">Trend {it.delta}</div>
        </div>
      ))}
    </div>
  )
}
