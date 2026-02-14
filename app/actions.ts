"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { sendReservationConfirmation } from "@/lib/resend";

export type SignupState = {
  message: string;
  success: boolean;
};

export async function signupEmail(prevState: SignupState, formData: FormData) {
  const email = formData.get("email")?.toString()?.trim();

  if (!email) {
    return { message: "Please enter your email.", success: false };
  }

  const supabase = createServerClient();

  const { error } = await supabase.from("email_signups").insert({
    email,
  });

  if (error) {
    if (error.code === "23505") {
      return { message: "You're already on the list! We'll be in touch.", success: true };
    }
    console.error("Supabase signup error:", error);
    return { message: "Something went wrong. Please try again.", success: false };
  }

  return { message: "You're on the list! We'll be in touch.", success: true };
}

export type ReservationState = {
  message: string;
  success: boolean;
};

export async function createReservation(
  prevState: ReservationState,
  formData: FormData
): Promise<ReservationState> {
  const classId = formData.get("classId")?.toString();
  const name = formData.get("name")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim() ?? null;

  if (!classId || !name || !email) {
    return { message: "Please enter your name and email.", success: false };
  }

  const supabase = createServerClient();

  const { data: classRow, error: classError } = await supabase
    .from("classes")
    .select("id, name, type, instructor, start_time, duration_minutes, price_cents")
    .eq("id", classId)
    .single();

  if (classError || !classRow) {
    return { message: "This class is no longer available.", success: false };
  }

  const { error: insertError } = await supabase.from("bookings").insert({
    class_id: classId,
    customer_name: name,
    customer_email: email,
    customer_phone: phone || null,
    status: "confirmed",
  });

  if (insertError) {
    console.error("Booking insert error:", insertError);
    return { message: "Something went wrong. Please try again.", success: false };
  }

  const startTime = new Date(classRow.start_time);
  await sendReservationConfirmation({
    to: email,
    customerName: name,
    className: classRow.name,
    classType: classRow.type,
    instructor: classRow.instructor,
    startTime,
    durationMinutes: classRow.duration_minutes,
    priceDollars: classRow.price_cents / 100,
  });

  return {
    message: "You're reserved! Payment will be collected at the start of class. Check your email for details.",
    success: true,
  };
}

export type AddClassState = { message: string; success: boolean };

export async function addClass(prevState: AddClassState, formData: FormData): Promise<AddClassState> {
  const { hasAdminSession } = await import("@/lib/admin-auth");
  if (!(await hasAdminSession())) {
    return { message: "Session expired. Please log in again.", success: false };
  }

  const name = formData.get("name")?.toString()?.trim();
  const type = formData.get("type")?.toString()?.trim();
  const instructor = formData.get("instructor")?.toString()?.trim();
  const classDate = formData.get("class_date")?.toString();
  const classTime = formData.get("class_time")?.toString(); // "HH:mm" 24h
  const durationMinutes = parseInt(formData.get("duration_minutes")?.toString() ?? "60", 10);
  const capacity = parseInt(formData.get("capacity")?.toString() ?? "12", 10);
  const priceDollars = parseFloat(formData.get("price_dollars")?.toString() ?? "35");
  const priceCents = Math.round(priceDollars * 100);
  const description = formData.get("description")?.toString()?.trim() ?? null;

  if (!name || !type || !instructor || !classDate || !classTime) {
    return { message: "Please fill in name, type, instructor, date, and time.", success: false };
  }

  // Combine date (YYYY-MM-DD) and time (HH:mm) as local, then to ISO for DB
  const startTime = new Date(`${classDate}T${classTime}`);
  if (Number.isNaN(startTime.getTime())) {
    return { message: "Invalid date or time.", success: false };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();

  const { error } = await supabase.from("classes").insert({
    name,
    type,
    instructor,
    start_time: startTime.toISOString(),
    duration_minutes: durationMinutes,
    capacity,
    price_cents: priceCents,
    description,
  });

  if (error) {
    console.error("Add class error:", error);
    return { message: "Failed to add class. Try again.", success: false };
  }
  revalidatePath("/admin");
  revalidatePath("/schedule");
  redirect("/admin");
}

export type VerifyAdminState = { message: string };

export async function verifyAdminPasswordAction(
  _prevState: VerifyAdminState,
  formData: FormData
): Promise<VerifyAdminState> {
  const password = formData.get("adminPassword")?.toString();
  if (!password) {
    return { message: "Enter the admin password." };
  }
  const { verifyAdminPassword, setAdminSession } = await import("@/lib/admin-auth");
  if (!verifyAdminPassword(password)) {
    return { message: "Invalid password." };
  }
  await setAdminSession();
  revalidatePath("/admin");
  redirect("/admin");
}

export async function clearAdminSessionAction(_prevState?: unknown, _formData?: FormData) {
  const { clearAdminSession } = await import("@/lib/admin-auth");
  await clearAdminSession();
  revalidatePath("/admin");
  redirect("/admin");
}
