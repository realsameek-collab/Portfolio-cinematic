"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { EASE, staggerContainer, staggerItem } from "@/lib/motion";

const EMAIL = "ameek263@gmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

/**
 * Spacing lives in inline styles, not Tailwind utilities: `globals.css` resets
 * `* { margin: 0; padding: 0 }` outside any cascade layer, which outranks
 * Tailwind's layered `mt-*` / `p-*`. Same approach the rest of the page uses.
 */
const FIELD_PAD: CSSProperties = { padding: "10px 0 12px" };

/** Hairline field: no box, just a rule a gold line sweeps across on focus. */
const fieldBase =
  "peer w-full cursor-text appearance-none border-0 bg-transparent text-[15px] leading-relaxed text-[#f0ece4] placeholder:text-[#4c4c47] focus:outline-none disabled:opacity-50";

export function ContactForm() {
  const { ref, inView } = useInView();
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  const sending = status === "sending";

  function clearFieldError(field: keyof FieldErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();

    const nextErrors: FieldErrors = {};
    if (!name) nextErrors.name = "Your name is required.";
    if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";
    if (message.length < 10) nextErrors.message = "At least 10 characters, please.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setFormError(null);
      return;
    }

    setStatus("sending");
    setFormError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("error");
        setFormError(result?.error ?? "Message could not be sent. Please try again.");
        return;
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
      setFormError("Network error. Please try again, or email me directly.");
    }
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="w-full"
      style={{ maxWidth: "34rem" }}
    >
      {/* ── Masthead ─────────────────────────────────────────────── */}
      <motion.div variants={staggerItem} className="flex items-center gap-5">
        <span className="text-label whitespace-nowrap text-[#c8a882]">Get in touch</span>
        <span
          aria-hidden
          className="h-px flex-1"
          style={{
            background:
              "linear-gradient(90deg, rgba(200,168,130,0.35), rgba(200,168,130,0.05) 65%, transparent)",
          }}
        />
      </motion.div>

      <motion.h2
        variants={staggerItem}
        className="font-heading text-[clamp(2.5rem,4.6vw,3.8rem)] font-normal leading-[0.92] tracking-[-0.02em] text-[#f0ece4]"
        style={{ marginTop: "clamp(20px, 2.4vw, 30px)" }}
      >
        Let&apos;s work
        <br />
        <span className="gradient-gold">together</span>
      </motion.h2>

      <motion.p
        variants={staggerItem}
        className="text-[15px] leading-[1.75] text-[#f0ece4]/45"
        style={{ marginTop: "clamp(16px, 2vw, 22px)", maxWidth: "36ch" }}
      >
        Have a project, a role, or an idea worth building? Send a message and I&apos;ll
        get back to you.
      </motion.p>

      {/* ── Direct email ─────────────────────────────────────────── */}
      <motion.a
        variants={staggerItem}
        href={`mailto:${EMAIL}`}
        data-cursor
        className="group relative block border-t border-b border-[#c8a882]/15 transition-colors duration-500 hover:border-[#c8a882]/35"
        style={{
          marginTop: "clamp(26px, 3.2vw, 36px)",
          padding: "clamp(16px, 2.2vw, 22px) 0",
        }}
      >
        <span className="text-label text-[#f0ece4]/30 transition-colors duration-500 group-hover:text-[#c8a882]/70">
          Write directly
        </span>
        <span
          className="flex items-baseline justify-between gap-6"
          style={{ marginTop: "12px" }}
        >
          <span className="font-heading block text-[clamp(1.35rem,2.8vw,1.95rem)] leading-none tracking-[-0.01em] text-[#f0ece4] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:text-[#c8a882]">
            {EMAIL}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="h-4 w-4 shrink-0 text-[#c8a882]/55 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#c8a882]"
          >
            <path
              d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </span>
        {/* Line sweeps in from the left on hover */}
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-[#c8a882] transition-transform duration-[700ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100"
        />
      </motion.a>

      {/* ── Form panel ───────────────────────────────────────────── */}
      <motion.div
        variants={staggerItem}
        className="relative overflow-hidden"
        style={{
          marginTop: "clamp(24px, 2.8vw, 32px)",
          borderRadius: "4px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.006) 100%)",
          border: "1px solid rgba(200,168,130,0.12)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.045), 0 32px 64px -48px rgba(0,0,0,0.95)",
        }}
      >
        {/* Hairline across the panel head, same idiom as the editor rail */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 h-px"
          style={{
            left: "32px",
            right: "32px",
            background:
              "linear-gradient(90deg, transparent, rgba(200,168,130,0.35), transparent)",
          }}
        />

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, ease: EASE.smooth }}
              className="flex flex-col items-start"
              style={{ padding: "clamp(34px, 4.4vw, 48px) clamp(22px, 3.4vw, 34px)" }}
              role="status"
              aria-live="polite"
            >
              <span className="text-label text-[#c8a882]">Message sent</span>
              <p
                className="font-heading text-[clamp(1.6rem,3vw,2.1rem)] leading-tight text-[#f0ece4]"
                style={{ marginTop: "14px" }}
              >
                Thanks for reaching out.
              </p>
              <p
                className="text-[14px] leading-[1.75] text-[#f0ece4]/45"
                style={{ marginTop: "12px", maxWidth: "40ch" }}
              >
                Your message is on its way to {EMAIL}. I&apos;ll reply to the address
                you left.
              </p>
              <button
                type="button"
                data-cursor
                onClick={() => {
                  setStatus("idle");
                  setFormError(null);
                  setErrors({});
                }}
                className="hover-line text-label text-[#f0ece4]/50 transition-colors duration-300 hover:text-[#c8a882]"
                style={{ marginTop: "28px" }}
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE.smooth }}
              onSubmit={handleSubmit}
              noValidate
              className="relative"
              style={{ padding: "clamp(24px, 2.8vw, 30px) clamp(22px, 3.2vw, 32px)" }}
            >
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                <Field
                  id="contact-name"
                  name="name"
                  label="Name"
                  placeholder="Your name"
                  autoComplete="name"
                  maxLength={100}
                  disabled={sending}
                  error={errors.name}
                  onInput={() => clearFieldError("name")}
                />
                <Field
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={200}
                  disabled={sending}
                  error={errors.email}
                  onInput={() => clearFieldError("email")}
                />
              </div>

              <div style={{ marginTop: "28px" }}>
                <FieldLabel htmlFor="contact-message" error={errors.message}>
                  Message
                </FieldLabel>
                <div className="relative">
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    maxLength={5000}
                    disabled={sending}
                    placeholder="Tell me what you're building."
                    onInput={() => clearFieldError("message")}
                    aria-invalid={!!errors.message}
                    className={`${fieldBase} block resize-none`}
                    style={{ ...FIELD_PAD, minHeight: "92px" }}
                  />
                  <Underline error={!!errors.message} />
                </div>
                <FieldError message={errors.message} />
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div
                className="pointer-events-none absolute h-0 w-0 overflow-hidden"
                style={{ left: "-9999px" }}
                aria-hidden
              >
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* ── CTA ───────────────────────────────────────────── */}
              <button
                type="submit"
                data-cursor
                disabled={sending}
                className="group relative flex w-full items-center justify-center overflow-hidden border border-[#c8a882]/35 transition-colors duration-500 hover:border-[#c8a882] disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  marginTop: "clamp(24px, 2.8vw, 32px)",
                  padding: "18px 24px",
                  borderRadius: "3px",
                }}
              >
                {/* Fill sweeps in from the left */}
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-[#c8a882] transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100 group-disabled:scale-x-0"
                />
                <span className="relative flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#f0ece4] transition-colors duration-300 group-hover:text-[#080808] group-hover:delay-200 group-disabled:text-[#f0ece4]">
                  {sending ? (
                    <>
                      <span
                        aria-hidden
                        className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
                      />
                      Sending
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className="h-3.5 w-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
                      >
                        <path
                          d="M2.5 8h10m0 0L9 4.5M12.5 8 9 11.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {formError ? (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3, ease: EASE.smooth }}
                    className="text-[12.5px] leading-relaxed text-[#cf8a6a]"
                    style={{ marginTop: "14px" }}
                  >
                    {formError}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Field primitives ───────────────────────────────────────────── */

function FieldLabel({
  htmlFor,
  error,
  children,
}: {
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-label block transition-colors duration-300 ${
        error ? "text-[#cf8a6a]" : "text-[#f0ece4]/35"
      }`}
    >
      {children}
    </label>
  );
}

function Underline({ error }: { error: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors duration-300 ${
          error ? "bg-[#cf8a6a]/70" : "bg-[#f0ece4]/12"
        }`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#c8a882] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100"
      />
    </>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: EASE.smooth }}
          className="text-[12px] text-[#cf8a6a]"
          style={{ marginTop: "8px" }}
        >
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  maxLength,
  disabled,
  error,
  onInput,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  maxLength?: number;
  disabled?: boolean;
  error?: string;
  onInput?: () => void;
}) {
  return (
    <div>
      <FieldLabel htmlFor={id} error={error}>
        {label}
      </FieldLabel>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          onInput={onInput}
          aria-invalid={!!error}
          className={fieldBase}
          style={FIELD_PAD}
        />
        <Underline error={!!error} />
      </div>
      <FieldError message={error} />
    </div>
  );
}

export default ContactForm;
