"use client";
import React from 'react';

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Link } from "react-router-dom"; // ✅ Changed import

export default function PatientRegistrationPage() {
  function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    alert("Patient registered! (demo)\n" + JSON.stringify(data, null, 2));
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-semibold">Patient Registration</h1>
      <p className="mt-2 text-muted-foreground">
        Create your profile to book and manage appointments.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-6 rounded-lg border border-border bg-card p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required />
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
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" name="dob" type="date" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Input id="gender" name="gender" placeholder="Female / Male / Other" />
          </div>
          <div>
            <Label htmlFor="insurance">Insurance provider</Label>
            <Input id="insurance" name="insurance" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="policy">Policy number</Label>
            <Input id="policy" name="policy" />
          </div>
          <div>
            <Label htmlFor="emergency">Emergency contact</Label>
            <Input id="emergency" name="emergency" placeholder="Name and phone" />
          </div>
        </div>

        <div>
          <Label htmlFor="allergies">Allergies / Notes</Label>
          <Textarea id="allergies" name="allergies" rows={4} />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit">Create account</Button>
          <Link to="/dashboard?role=patient" className="text-sm underline">
            Skip and view dashboard
          </Link>
        </div>
      </form>
    </main>
  );
}
