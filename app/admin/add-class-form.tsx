"use client";

import { useActionState } from "react";
import { addClass } from "@/app/actions";

// 15-min slots from 5:00 AM to 10:00 PM, value = 24h "HH:mm"
const TIME_OPTIONS: { value: string; label: string }[] = [];
for (let hour = 5; hour <= 22; hour++) {
  for (let min = 0; min < 60; min += 15) {
    if (hour === 22 && min > 0) break;
    const value = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "AM" : "PM";
    const label = `${h12}:${min.toString().padStart(2, "0")} ${ampm}`;
    TIME_OPTIONS.push({ value, label });
  }
}

export function AddClassForm() {
  const [state, formAction] = useActionState(addClass, { message: "", success: false });

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-stone-200/60 bg-white/80 p-6">
      <h2 className="text-lg font-semibold">Add class</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Class name</label>
          <input id="name" name="name" type="text" required className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2" />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium">Type</label>
          <input id="type" name="type" type="text" required placeholder="e.g. Strength, Kickboxing, Somatic" className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2" />
        </div>
      </div>
      <div>
        <label htmlFor="instructor" className="block text-sm font-medium">Instructor</label>
        <input id="instructor" name="instructor" type="text" required className="mt-1 w-full max-w-xs rounded-lg border border-stone-300 bg-white px-4 py-2" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="class_date" className="block text-sm font-medium">Date</label>
          <input id="class_date" name="class_date" type="date" required className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2" />
        </div>
        <div>
          <label htmlFor="class_time" className="block text-sm font-medium">Time</label>
          <select id="class_time" name="class_time" required className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2">
            {TIME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="duration_minutes" className="block text-sm font-medium">Duration</label>
          <select id="duration_minutes" name="duration_minutes" className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2">
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium">Capacity</label>
        <input id="capacity" name="capacity" type="number" defaultValue={12} min={1} className="mt-1 w-full max-w-xs rounded-lg border border-stone-300 bg-white px-4 py-2" />
      </div>
      <div>
        <label htmlFor="price_dollars" className="block text-sm font-medium">Price ($)</label>
        <input id="price_dollars" name="price_dollars" type="number" defaultValue={35} min={0} step="0.01" className="mt-1 w-full max-w-xs rounded-lg border border-stone-300 bg-white px-4 py-2" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description (optional)</label>
        <textarea id="description" name="description" rows={4} className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-4 py-2 resize-y" />
      </div>
      <button
        type="submit"
        className="rounded-lg px-4 py-2 font-semibold text-white"
        style={{ backgroundColor: "#c45c26" }}
      >
        Add class
      </button>
      {state.message && (
        <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
