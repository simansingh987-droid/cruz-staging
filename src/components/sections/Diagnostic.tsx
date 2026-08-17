"use client";

import { useState } from "react";
import { Section, Heading, Lede } from "../ui/Section";
import { Cta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

/**
 * Row 9 — replaces EOXS's lead-magnet ebook capture.
 *
 * Deliberately collects nothing. An email field here would either read as a
 * waitlist (banned by Section 8) or compete with the single fit-call CTA. The
 * visitor ticks the systems they already run, sees concretely what Cruz would
 * be able to answer from them, and the only exit is the same CTA as everywhere
 * else.
 */
const SOURCES = [
  {
    id: "erp",
    label: "ERP / order entry",
    unlocks: [
      "Which orders are at risk of missing their promise date, right now",
      "True margin by customer, including freight and processing",
    ],
  },
  {
    id: "email",
    label: "Email",
    unlocks: [
      "What was actually promised to a customer, and by whom",
      "Every open thread on an account before you walk into the call",
    ],
  },
  {
    id: "calls",
    label: "Call recordings",
    unlocks: [
      "Why a quote was lost, in the buyer's own words",
      "The pricing objections your reps hear but never log",
    ],
  },
  {
    id: "inventory",
    label: "Inventory / processing",
    unlocks: [
      "Where a partial coil ended up and what it's still good for",
      "Which line is the bottleneck this week, and why",
    ],
  },
] as const;

export function Diagnostic() {
  const [picked, setPicked] = useState<string[]>(["erp", "email"]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const unlocked = SOURCES.filter((s) => picked.includes(s.id)).flatMap(
    (s) => s.unlocks,
  );

  return (
    <Section className="border-rule/40 border-t">
      <Reveal>

        <Heading>See what Cruz would know about your business</Heading>
        <Lede>
          Tick what you already run. No form, no email — this just shows you the
          questions Cruz could answer on day one from the systems you have.
        </Lede>
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-12">
        <Reveal>
          <fieldset>
            <legend className="type-data text-mute/70 mb-4">
              What you run today
            </legend>
            <ul className="space-y-2.5">
              {SOURCES.map((s) => {
                const on = picked.includes(s.id);
                return (
                  <li key={s.id}>
                    <label
                      className={`flex cursor-pointer items-center gap-3 border px-4 py-3.5 transition-colors ${
                        on
                          ? "border-slate/60 text-ink"
                          : "border-rule/60 text-mute hover:border-rule"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(s.id)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                          on ? "border-slate bg-slate" : "border-rule"
                        }`}
                      >
                        {on ? (
                          <svg
                            viewBox="0 0 12 12"
                            className="text-paper h-3 w-3"
                            fill="none"
                          >
                            <path
                              d="M2.5 6.2l2.4 2.3L9.5 3.6"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        ) : null}
                      </span>
                      <span className="text-sm font-medium">{s.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        </Reveal>

        <Reveal
          delay={90}
          className="border-rule/50 bg-card/50 border p-7 sm:p-9"
        >
          <p className="type-data text-slate">
            Cruz could answer on day one
          </p>

          {unlocked.length === 0 ? (
            <p className="text-mute mt-6 text-sm">
              Select at least one system to see what becomes answerable.
            </p>
          ) : (
            <ul aria-live="polite" className="mt-6 space-y-4">
              {unlocked.map((u) => (
                <li key={u} className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="bg-slate/70 mt-[0.6rem] h-px w-5 shrink-0"
                  />
                  <span className="text-ink/85 text-sm leading-relaxed">
                    {u}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
