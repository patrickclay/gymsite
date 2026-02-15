"use client";

import { useActionState, useEffect } from "react";
import { addClass, updateClass } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClassRow } from "./admin-tabs";

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

type AddClassFormProps = {
  editMode?: boolean;
  classData?: ClassRow;
  onSuccess?: () => void;
};

export function AddClassForm({ editMode, classData, onSuccess }: AddClassFormProps) {
  const action = editMode ? updateClass : addClass;
  const [state, formAction] = useActionState(action, { message: "", success: false });

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  // Extract defaults for edit mode
  const defaultDate = classData
    ? new Date(classData.start_time).toLocaleDateString("en-CA") // YYYY-MM-DD
    : undefined;
  const defaultTime = classData
    ? `${new Date(classData.start_time).getHours().toString().padStart(2, "0")}:${new Date(classData.start_time).getMinutes().toString().padStart(2, "0")}`
    : undefined;
  const defaultPriceDollars = classData
    ? (classData.price_cents / 100).toString()
    : "35";

  return (
    <form action={formAction} className="space-y-4">
      {editMode && classData && (
        <input type="hidden" name="class_id" value={classData.id} />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Class name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={classData?.name}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            name="type"
            type="text"
            required
            placeholder="e.g. Strength, Kickboxing, Somatic"
            defaultValue={classData?.type}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="instructor">Instructor</Label>
        <Input
          id="instructor"
          name="instructor"
          type="text"
          required
          defaultValue={classData?.instructor}
          className="mt-1 max-w-xs"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="class_date">Date</Label>
          <Input
            id="class_date"
            name="class_date"
            type="date"
            required
            defaultValue={defaultDate}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="class_time">Time</Label>
          <select
            id="class_time"
            name="class_time"
            required
            defaultValue={defaultTime}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            {TIME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="duration_minutes">Duration</Label>
          <select
            id="duration_minutes"
            name="duration_minutes"
            defaultValue={classData?.duration_minutes ?? 60}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          defaultValue={classData?.capacity ?? 12}
          min={1}
          className="mt-1 max-w-xs"
        />
      </div>
      <div>
        <Label htmlFor="price_dollars">Price ($)</Label>
        <Input
          id="price_dollars"
          name="price_dollars"
          type="number"
          defaultValue={defaultPriceDollars}
          min={0}
          step="0.01"
          className="mt-1 max-w-xs"
        />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={classData?.description ?? ""}
          className="mt-1 resize-y"
        />
      </div>
      <Button type="submit">
        {editMode ? "Update class" : "Add class"}
      </Button>
      {state.message && (
        <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
