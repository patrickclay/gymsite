"use server";

import { createServerClient } from "@/lib/supabase/server";

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
