import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export type SendConfirmationParams = {
  to: string;
  customerName: string;
  className: string;
  classType: string;
  instructor: string;
  startTime: Date;
  durationMinutes: number;
  priceDollars: number;
};

export async function sendReservationConfirmation(params: SendConfirmationParams) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping confirmation email");
    return { ok: false as const, error: "Email not configured" };
  }

  const { to, customerName, className, classType, instructor, startTime, durationMinutes, priceDollars } = params;
  const dateStr = startTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = startTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `You're reserved: ${className} – ${dateStr}`,
    html: `
      <p>Hi ${customerName},</p>
      <p>You're reserved for <strong>${className}</strong>.</p>
      <ul>
        <li><strong>Type:</strong> ${classType}</li>
        <li><strong>Instructor:</strong> ${instructor}</li>
        <li><strong>Date & time:</strong> ${dateStr} at ${timeStr}</li>
        <li><strong>Duration:</strong> ${durationMinutes} minutes</li>
        <li><strong>Amount:</strong> $${priceDollars}</li>
      </ul>
      <p><strong>Payment:</strong> Payment will be collected at the start of class (cash, card, or Venmo accepted).</p>
      <p>Location details will be sent closer to the date. Questions? Reply to this email.</p>
      <p>See you there!</p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const };
}

export type SendBroadcastParams = {
  emails: string[];
  subject: string;
  body: string;
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendBroadcastEmail(params: SendBroadcastParams) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping broadcast email");
    return { ok: false as const, error: "Email not configured" };
  }

  const { emails, subject, body } = params;
  const html = body
    .split("\n")
    .map((line) => (line.trim() ? `<p>${escapeHtml(line)}</p>` : ""))
    .join("\n");

  try {
    const { error } = await resend.batch.send(
      emails.map((to) => ({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }))
    );

    if (error) {
      console.error("Resend broadcast error:", error);
      return { ok: false as const, error: error.message };
    }
    return { ok: true as const };
  } catch (err) {
    console.error("Broadcast send error:", err);
    return { ok: false as const, error: "Unexpected error sending email" };
  }
}
