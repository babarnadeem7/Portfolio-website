"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef, useState, type FormEvent } from "react";
import { dur, ease } from "@/motion.config";
import { contact } from "@/content/site";
import { sendContactMessage, type ContactPayload } from "@/lib/contact";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/button";

type Field = keyof ContactPayload;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent-endpoint" | "sent-mailto" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: ContactPayload): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.message.trim().length < 10) e.message = "A few more words, please (at least 10 characters).";
  return e;
}

/** Front-end validated contact form. Delivery lives in lib/contact.ts. */
export function ContactForm() {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactPayload>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const errors = validate(values);
  const visible = (f: Field) => (touched[f] ? errors[f] : undefined);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const first = (Object.keys(errors) as Field[])[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    const res = await sendContactMessage(values, honeypot);
    setStatus(res.ok ? (res.via === "mailto" ? "sent-mailto" : "sent-endpoint") : "error");
  }

  const sent = status === "sent-endpoint" || status === "sent-mailto";

  return (
    <div className="relative overflow-hidden rounded-md border border-line bg-frame shadow-[var(--shadow-frame)]">
      <div className="text-label flex items-center justify-between border-b border-line px-5 py-3 text-muted">
        <span className="text-ink">Message</span>
        <span>Front-end validated</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur.base, ease: ease.out }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-5 p-6 md:p-8"
            role="status"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-accent text-on-accent">
              <svg width="20" height="20" viewBox="0 0 14 14" aria-hidden>
                <motion.path
                  d="M2.5 7.4l2.8 2.8 6.2-6.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: dur.slow, ease: ease.out, delay: 0.2 }}
                />
              </svg>
            </span>
            <p className="font-display text-2xl font-bold text-balance">
              {status === "sent-mailto" ? contact.form.successMailto : contact.form.success}
            </p>
            <button
              type="button"
              className="link-underline text-sm text-muted"
              onClick={() => {
                setValues({ name: "", email: "", message: "" });
                setTouched({});
                setStatus("idle");
              }}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={form}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: dur.base * 0.6 }}
            className="space-y-6 p-5 md:p-8"
          >
            {(["name", "email", "message"] as const).map((f) => {
              const err = visible(f);
              const fieldId = `${id}-${f}`;
              const errId = `${fieldId}-error`;
              const shared = {
                id: fieldId,
                name: f,
                value: values[f],
                "aria-invalid": err ? true : undefined,
                "aria-describedby": err ? errId : undefined,
                onChange: (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                  setValues((v) => ({ ...v, [f]: ev.target.value })),
                onBlur: () => setTouched((t) => ({ ...t, [f]: true })),
                className: cn(
                  "w-full rounded-[4px] border bg-canvas px-3.5 py-3 text-base outline-none transition-colors duration-200",
                  "placeholder:text-muted/70 focus:border-accent",
                  err ? "border-accent" : "border-line hover:border-muted",
                ),
              };
              return (
                <div key={f}>
                  <label htmlFor={fieldId} className="text-label mb-2 block text-muted">
                    {contact.form[f]}
                  </label>
                  {f === "message" ? (
                    <textarea {...shared} rows={5} className={cn(shared.className, "resize-y")} />
                  ) : (
                    <input
                      {...shared}
                      type={f === "email" ? "email" : "text"}
                      autoComplete={f === "email" ? "email" : "name"}
                      inputMode={f === "email" ? "email" : undefined}
                    />
                  )}
                  <AnimatePresence initial={false}>
                    {err && (
                      <motion.p
                        id={errId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: dur.micro * 1.5 }}
                        className="text-label overflow-hidden pt-2 text-accent-ink"
                      >
                        {err}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Honeypot: hidden from people and assistive tech, catches bots */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label>
                Leave this empty
                <input tabIndex={-1} autoComplete="off" name="_gotcha" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <button type="submit" disabled={status === "sending"} className={buttonClass("solid", "h-12 px-6")}>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={status === "sending" ? "sending" : "send"}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: dur.micro * 1.5, ease: ease.out }}
                    className="flex items-center gap-2"
                  >
                    {status === "sending" ? contact.form.sending : contact.form.submit}
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
                      <path d="M2 7h10M8 3l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </motion.span>
                </AnimatePresence>
              </button>
              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-label text-accent-ink"
                  >
                    {contact.form.error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
