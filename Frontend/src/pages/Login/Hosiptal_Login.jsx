"use client"

import { Input } from "../ui/input.js"
import { Label } from "../ui/label.js"
import { Textarea } from "../ui/textarea.js"
import { Button } from "../ui/button.js"
import React from 'react';

export default function HospitalRegistrationPage() {
  function onSubmit(e) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    alert("Hospital registered! (demo)\n" + JSON.stringify(data, null, 2))
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Hospital Registration</h1>
      <p className="mt-2 text-muted-foreground">Provide your facility information to get started.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6 rounded-lg border border-border bg-card p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="hospitalName">Hospital name</Label>
            <Input id="hospitalName" name="hospitalName" required />
          </div>
          <div>
            <Label htmlFor="registrationNumber">Registration number</Label>
            <Input id="registrationNumber" name="registrationNumber" required />
          </div>
          <div>
            <Label htmlFor="contactPerson">Contact person</Label>
            <Input id="contactPerson" name="contactPerson" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" required />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" type="url" placeholder="https://…" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" />
          </div>
          <div>
            <Label htmlFor="zip">ZIP/Postal</Label>
            <Input id="zip" name="zip" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="beds">Bed capacity</Label>
            <Input id="beds" name="beds" type="number" min="0" />
          </div>
          <div>
            <Label htmlFor="departments">Departments</Label>
            <Textarea id="departments" name="departments" rows={4} placeholder="Cardiology, Radiology, …" />
          </div>
        </div>

        <Button type="submit" className="mt-2">
          Submit registration
        </Button>
      </form>
    </main>
  )
}
