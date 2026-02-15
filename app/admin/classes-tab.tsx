"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { deleteClass } from "@/app/actions";
import { AddClassForm } from "./add-class-form";
import type { ClassRow } from "./admin-tabs";

type ClassesTabProps = {
  classes: ClassRow[];
};

export function ClassesTab({ classes }: ClassesTabProps) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassRow | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ClassRow | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState("");

  function handleEdit(c: ClassRow) {
    setEditClass(c);
    setEditOpen(true);
  }

  function handleDeleteClick(c: ClassRow) {
    setDeleteTarget(c);
    setDeleteError("");
    setDeleteOpen(true);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteClass(deleteTarget.id);
      if (result.success) {
        setDeleteOpen(false);
        setDeleteTarget(null);
        router.refresh();
      } else {
        setDeleteError(result.message);
      }
    });
  }

  function handleFormSuccess() {
    setAddOpen(false);
    setEditOpen(false);
    setEditClass(null);
    router.refresh();
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming classes</h2>
        <Button onClick={() => setAddOpen(true)}>Add class</Button>
      </div>

      {classes.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No upcoming classes. Add one to get started.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((c) => {
              const start = new Date(c.start_time);
              const dateStr = start.toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric",
              });
              const timeStr = start.toLocaleTimeString("en-US", {
                hour: "numeric", minute: "2-digit", hour12: true,
              });
              const price = (c.price_cents / 100).toFixed(0);
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>{c.instructor}</TableCell>
                  <TableCell>{dateStr} &middot; {timeStr}</TableCell>
                  <TableCell>${price}</TableCell>
                  <TableCell>{c.capacity}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(c)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add class dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add class</DialogTitle>
          </DialogHeader>
          <AddClassForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit class dialog */}
      <Dialog open={editOpen} onOpenChange={(open) => {
        setEditOpen(open);
        if (!open) setEditClass(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit class</DialogTitle>
          </DialogHeader>
          {editClass && (
            <AddClassForm
              key={editClass.id}
              editMode
              classData={editClass}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete class</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteTarget?.name}&rdquo;? This will also
              delete all bookings associated with this class. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <p className="text-sm text-red-600">{deleteError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
