"use client";

import { useState, useActionState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { sendBroadcast } from "@/app/actions";

type EmailTabProps = {
  subscriberCount: number;
};

export function EmailTab({ subscriberCount }: EmailTabProps) {
  const [state, formAction] = useActionState(sendBroadcast, { message: "", success: false });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewBody, setPreviewBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // After user confirms, let the form action run normally
    if (confirmedRef.current) {
      confirmedRef.current = false;
      return;
    }

    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = fd.get("subject")?.toString() ?? "";
    const body = fd.get("body")?.toString() ?? "";

    if (!subject.trim() || !body.trim()) return;

    setPreviewSubject(subject);
    setPreviewBody(body);
    setConfirmOpen(true);
  }

  function handleConfirmSend() {
    setConfirmOpen(false);
    confirmedRef.current = true;
    formRef.current?.requestSubmit();
  }

  return (
    <div className="mt-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Email broadcast</h2>
        <p className="text-sm text-[var(--muted)]">
          {subscriberCount === 0
            ? "No subscribers yet."
            : `Send an email to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}.`}
        </p>
      </div>

      <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" type="text" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="body">Body</Label>
          <Textarea id="body" name="body" rows={8} required className="mt-1" />
        </div>
        <Button type="submit" disabled={subscriberCount === 0}>
          Send broadcast
        </Button>
        {state.message && (
          <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>
            {state.message}
          </p>
        )}
      </form>

      {/* Confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm broadcast</DialogTitle>
            <DialogDescription>
              This will send an email to {subscriberCount} subscriber{subscriberCount === 1 ? "" : "s"}. Please review the content below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 rounded-lg border border-stone-200 bg-stone-50 p-4 text-sm">
            <p><strong>Subject:</strong> {previewSubject}</p>
            <p className="whitespace-pre-wrap"><strong>Body:</strong> {previewBody}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSend}>
              Confirm &amp; send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
