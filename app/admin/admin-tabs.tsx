"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ClassesTab } from "./classes-tab";
import { BookingsTab } from "./bookings-tab";
import { EmailTab } from "./email-tab";

export type ClassRow = {
  id: string;
  name: string;
  type: string;
  instructor: string;
  description: string | null;
  start_time: string;
  duration_minutes: number;
  capacity: number;
  price_cents: number;
};

export type BookingRow = {
  id: string;
  class_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  created_at: string;
  classes: { name: string; start_time: string } | null;
};

type AdminTabsProps = {
  classes: ClassRow[];
  bookings: BookingRow[];
  subscriberCount: number;
};

export function AdminTabs({ classes, bookings, subscriberCount }: AdminTabsProps) {
  return (
    <Tabs defaultValue="classes">
      <TabsList variant="line" className="border-b border-[var(--border)]">
        <TabsTrigger value="classes" className="data-[state=active]:after:bg-[var(--primary)]">Classes</TabsTrigger>
        <TabsTrigger value="bookings" className="data-[state=active]:after:bg-[var(--primary)]">Bookings</TabsTrigger>
        <TabsTrigger value="email" className="data-[state=active]:after:bg-[var(--primary)]">Email</TabsTrigger>
      </TabsList>

      <TabsContent value="classes">
        <ClassesTab classes={classes} />
      </TabsContent>

      <TabsContent value="bookings">
        <BookingsTab bookings={bookings} classes={classes} />
      </TabsContent>

      <TabsContent value="email">
        <EmailTab subscriberCount={subscriberCount} />
      </TabsContent>
    </Tabs>
  );
}
