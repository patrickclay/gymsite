"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { cancelBooking } from "@/app/actions";
import type { BookingRow, ClassRow } from "./admin-tabs";

type BookingsTabProps = {
  bookings: BookingRow[];
  classes: ClassRow[];
};

export function BookingsTab({ bookings, classes }: BookingsTabProps) {
  const router = useRouter();
  const [filterClassId, setFilterClassId] = useState("all");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<BookingRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [cancelError, setCancelError] = useState("");

  const filtered = filterClassId === "all"
    ? bookings
    : bookings.filter((b) => b.class_id === filterClassId);

  function handleCancelClick(b: BookingRow) {
    setCancelTarget(b);
    setCancelError("");
    setCancelOpen(true);
  }

  function handleCancelConfirm() {
    if (!cancelTarget) return;
    startTransition(async () => {
      const result = await cancelBooking(cancelTarget.id);
      if (result.success) {
        setCancelOpen(false);
        setCancelTarget(null);
        router.refresh();
      } else {
        setCancelError(result.message);
      }
    });
  }

  // Unique classes that have bookings for the filter dropdown
  const classOptions = classes.filter((c) =>
    bookings.some((b) => b.class_id === c.id)
  );

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bookings</h2>
        <select
          value={filterClassId}
          onChange={(e) => setFilterClassId(e.target.value)}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm"
        >
          <option value="all">All classes</option>
          {classOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-base text-muted-foreground">No bookings found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((b) => {
              const className = b.classes?.name ?? "Unknown";
              const classDate = b.classes?.start_time
                ? new Date(b.classes.start_time).toLocaleDateString("en-US", {
                    weekday: "short", month: "short", day: "numeric",
                  })
                : "N/A";
              const classTime = b.classes?.start_time
                ? new Date(b.classes.start_time).toLocaleTimeString("en-US", {
                    hour: "numeric", minute: "2-digit", hour12: true,
                  })
                : "";
              return (
                <TableRow key={b.id} className="even:bg-stone-50/50">
                  <TableCell className="font-medium">{b.customer_name}</TableCell>
                  <TableCell>{b.customer_email}</TableCell>
                  <TableCell>{b.customer_phone ?? "-"}</TableCell>
                  <TableCell>{className}</TableCell>
                  <TableCell>{classDate}{classTime ? ` \u00b7 ${classTime}` : ""}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-stone-100 text-stone-500 border-stone-200"
                      }
                    >
                      {b.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {b.status === "confirmed" && (
                      <Button variant="outline" size="sm" onClick={() => handleCancelClick(b)}>
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the booking for{" "}
              <strong>{cancelTarget?.customer_name}</strong>?
            </DialogDescription>
          </DialogHeader>
          {cancelError && (
            <p className="text-sm rounded-md px-3 py-2 bg-red-50 text-red-700">{cancelError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep booking
            </Button>
            <Button variant="destructive" onClick={handleCancelConfirm} disabled={isPending}>
              {isPending ? "Cancelling..." : "Cancel booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
