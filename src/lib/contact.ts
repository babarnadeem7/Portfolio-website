import { site } from "@/content/site";

export type ContactPayload = { name: string; email: string; message: string };
export type ContactResult = { ok: true; via: "endpoint" | "mailto" } | { ok: false };

/**
 * INTEGRATION POINT for the contact form.
 *
 * Default: Formspree. Create a form at https://formspree.io, then set
 *   NEXT_PUBLIC_FORMSPREE_ID=yourFormId
 * in .env.local (and in your host's environment).
 *
 * Without that variable the form falls back to opening the visitor's email
 * app with the message pre-filled, so it never silently fails.
 *
 * To use Resend or another service instead, replace the fetch below with a
 * call to your own route handler (e.g. POST /api/contact) that sends the email
 * server-side. Keep the return shape the same and the UI needs no changes.
 */
export async function sendContactMessage(data: ContactPayload, honeypot: string): Promise<ContactResult> {
  // Bots fill hidden fields; pretend success and drop it.
  if (honeypot) return { ok: true, via: "endpoint" };

  const formId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
  if (!formId) {
    const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    return { ok: true, via: "mailto" };
  }

  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok ? { ok: true, via: "endpoint" } : { ok: false };
  } catch {
    return { ok: false };
  }
}
