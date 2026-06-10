import * as React from "react";
import { IG_DM, SERVICES } from "./services";
import styles from "./style.module.css";

// "Build request" intake flow. Three quick asks: what, about, contact.
// With a Formspree endpoint configured, leads land silently in the inbox;
// without one, we copy the whole brief to the clipboard and point them at
// the Instagram DM (IG doesn't allow pre-filled messages, so paste it is).
//
// To go silent-send: create a free form at https://formspree.io, then paste
// its endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
const FORMSPREE_ENDPOINT = "";

type IntakeProps = {
  open: boolean;
  preselect?: string;
  onClose: () => void;
};

export function IntakeModal({ open, preselect, onClose }: IntakeProps) {
  const [picked, setPicked] = React.useState<string[]>([]);
  const [about, setAbout] = React.useState("");
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState<"sent" | "ig" | null>(null);
  const [copied, setCopied] = React.useState(false);

  // Fresh form each time it opens, with the tapped tile pre-picked.
  React.useEffect(() => {
    if (open) {
      setPicked(preselect ? [preselect] : []);
      setDone(null);
    }
  }, [open, preselect]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const toggle = (code: string) => setPicked((p) => (p.includes(code) ? p.filter((c) => c !== code) : [...p, code]));

  const serviceList =
    SERVICES.filter((s) => picked.includes(s.code))
      .map((s) => `${s.code} — ${s.name}`)
      .join(", ") || "Not sure yet";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    if (FORMSPREE_ENDPOINT) {
      setSending(true);
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ services: serviceList, about, name, contact }),
        });
        if (res.ok) {
          setSending(false);
          setDone("sent");
          return;
        }
      } catch {
        // fall through to the mailto fallback
      }
      setSending(false);
    }

    const brief = `Build request 🔨\nServices: ${serviceList}\n\nAbout the business:\n${about || "—"}\n\nName: ${name || "—"}\nContact: ${contact}`;
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
    } catch {
      setCopied(false);
    }
    setDone("ig");
  };

  return (
    <div className={styles.intakeWrap} role="dialog" aria-modal="true" aria-label="Start your build">
      <button type="button" className={styles.intakeBackdrop} aria-label="Close" onClick={onClose} />
      <div className={styles.intake}>
        <button type="button" className={styles.intakeClose} aria-label="Close" onClick={onClose}>
          ×
        </button>

        {done ? (
          <div className={styles.intakeSuccess}>
            <div className={styles.intakeSuccessMark}>✓</div>
            {done === "sent" ? (
              <>
                <h3 className={styles.intakeTitle}>Got it.</h3>
                <p>Your build request just hit my inbox. I'll hit you back within 24 hours.</p>
                <button type="button" className={styles.cta} onClick={onClose}>
                  Back to the menu →
                </button>
              </>
            ) : (
              <>
                <h3 className={styles.intakeTitle}>One more step.</h3>
                <p>
                  {copied
                    ? "Your brief is copied — DM it to me on Instagram and I'll hit you back within 24 hours. Just paste and send."
                    : "DM me your brief on Instagram and I'll hit you back within 24 hours."}
                </p>
                <a className={styles.cta} href={IG_DM} target="_blank" rel="noopener noreferrer">
                  DM @smiledenzel →
                </a>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className={styles.intakeEyebrow}>build request</div>
            <h3 className={styles.intakeTitle}>
              Let&rsquo;s build it<span className={styles.blink}>_</span>
            </h3>

            <div className={styles.intakeStep}>
              <div className={styles.stepLabel}>01 — what are we building?</div>
              <div className={styles.chips}>
                {SERVICES.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    className={`${styles.chip} ${picked.includes(s.code) ? styles.chipOn : ""}`}
                    onClick={() => toggle(s.code)}
                  >
                    <span className={styles.chipCode}>{s.code}</span> {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.intakeStep}>
              <div className={styles.stepLabel}>02 — tell me about your business</div>
              <textarea
                className={styles.intakeText}
                rows={3}
                placeholder="e.g. I run a plumbing company in Atlanta and I'm missing calls every single day…"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>

            <div className={styles.intakeStep}>
              <div className={styles.stepLabel}>03 — how do I reach you?</div>
              <div className={styles.intakeRow}>
                <input
                  className={styles.intakeInput}
                  type="text"
                  placeholder="your name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className={styles.intakeInput}
                  type="text"
                  placeholder="email or phone (required)"
                  autoComplete="email"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.cta} disabled={sending || !contact.trim()}>
              {sending ? "Sending…" : "Send it →"}
            </button>
            <div className={styles.intakeNote}>straight to my DMs · I reply within 24h</div>
          </form>
        )}
      </div>
    </div>
  );
}
