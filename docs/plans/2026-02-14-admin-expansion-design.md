# Phase 1B: Admin Expansion + shadcn/ui — Design

## Overview

Expand the admin dashboard from a simple "add class" form into a full management interface with class editing/deletion, booking management, and email broadcast. Introduce shadcn/ui for consistent, accessible components without framework lock-in.

## Scope

**In scope:**
- shadcn/ui integration (admin pages only)
- Tabbed admin dashboard (Classes | Bookings | Email)
- Full class CRUD (add, edit, delete)
- Booking management (view, filter, cancel)
- Email broadcast to subscriber list

**Out of scope:**
- Payment processing (Stripe)
- User accounts / member authentication
- Public-facing UI changes
- Dashboard analytics / stats
- Email scheduling or segmentation

## shadcn/ui Integration

Initialize shadcn/ui with the existing Tailwind 4 config. Map theme variables (`--accent`, `--muted`, `--background`, `--foreground`) to shadcn's CSS variable system.

Components to install (admin-only to start):
- Button, Table, Dialog, Input, Textarea, Select, Label, Badge, Toast, Tabs, Card

Public-facing pages remain untouched. Components can be adopted there gradually later.

## Admin Page Architecture

The admin page at `/admin` becomes a tabbed dashboard:

### Classes Tab
- Table of all upcoming classes (name, type, instructor, date/time, price, capacity)
- Each row has Edit and Delete action buttons
- "Add Class" button opens a Dialog (modal) with the existing form
- "Edit" opens the same Dialog pre-filled with class data
- "Delete" shows a confirmation Dialog warning about cascading booking deletion

### Bookings Tab
- Table of all bookings (customer name, email, phone, class name, date, status)
- Filterable by class
- Cancel action sets status to "cancelled" (preserves booking history)

### Email Tab
- Compose form: subject line + body (plain text)
- Shows subscriber count before sending
- Confirmation Dialog before send with preview
- Sends via Resend batch API to all subscribers
- No rich text editor, scheduling, or segmentation

## Database Changes

### bookings table
- Add `cancelled_at` (timestamptz, nullable) column
- When a booking is cancelled, set both `status = 'cancelled'` and `cancelled_at = now()`

### RLS Policies
- Add policy: service role can SELECT on `email_signups` (for broadcast)
- Add policy: service role can UPDATE and DELETE on `bookings` (for cancellation)
- No changes to public-facing policies

## Server Actions

All new actions in `app/actions.ts`, all gated behind `hasAdminSession()`:

- `updateClass(classId, formData)` — validate and update class via service-role client
- `deleteClass(classId)` — delete class (cascade deletes bookings)
- `getBookings(classId?)` — fetch bookings, optionally filtered by class
- `cancelBooking(bookingId)` — set status to "cancelled", set cancelled_at
- `getSubscribers()` — return email_signups list and count
- `sendBroadcast(subject, body)` — fetch all subscriber emails, send via Resend batch API

## Data Flow

The admin page is a server component that fetches classes and bookings on load, then passes data to client-side tab components for interactivity. Tab switching is client-side only (no routing changes).

## Admin Audience

Small team (couple of people). Should be clear and usable but doesn't need to be fancy.
