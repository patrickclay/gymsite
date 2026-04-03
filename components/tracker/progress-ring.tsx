"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit?: string;
  className?: string;
  color?: string;
}

export function ProgressRing({
  value,
  max,
  size = 100,
  strokeWidth = 8,
  label,
  unit = "",
  className,
  color = "var(--primary)",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = max > 0 ? Math.min(value / max, 1) : 0;
  const offset = circumference - percent * circumference;
  const isOver = value > max;

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isOver ? "var(--destructive)" : color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="text-center -mt-[calc(var(--size)*0.5+1rem)]" style={{ "--size": `${size}px` } as React.CSSProperties}>
        <div className={cn("text-lg font-bold tabular-nums", isOver && "text-destructive")}>
          {Math.round(value)}
          {unit}
        </div>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
      <span className="text-xs text-muted-foreground tabular-nums">
        / {max}{unit}
      </span>
    </div>
  );
}

interface MacroBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit?: string;
}

export function MacroBar({ label, value, max, color, unit = "g" }: MacroBarProps) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isOver = value > max;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className={cn("tabular-nums", isOver && "text-destructive font-medium")}>
          {Math.round(value)} / {max}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: isOver ? "var(--destructive)" : color,
          }}
        />
      </div>
    </div>
  );
}
