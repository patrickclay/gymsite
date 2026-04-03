"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateNavProps {
  date: string;
  onDateChange: (date: string) => void;
}

function formatDisplay(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = today.getTime() - d.getTime();
  const dayMs = 86400000;

  if (diff < dayMs && diff >= 0) return "Today";
  if (diff < dayMs * 2 && diff >= dayMs) return "Yesterday";
  if (diff < 0 && diff > -dayMs) return "Tomorrow";

  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function shiftDate(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function DateNav({ date, onDateChange }: DateNavProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDateChange(shiftDate(date, -1))}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <button
        className="text-sm font-semibold"
        onClick={() => {
          const today = new Date().toISOString().slice(0, 10);
          onDateChange(today);
        }}
      >
        {formatDisplay(date)}
      </button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDateChange(shiftDate(date, 1))}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
