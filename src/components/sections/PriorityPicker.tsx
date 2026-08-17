"use client";

import { useId, useState } from "react";
import { Section, Heading } from "../ui/Section";
import { Cta } from "../ui/Cta";
import { Reveal } from "../ui/Reveal";

/**
 * Row 16 — lets the visitor self-segment.
 *
 * Same interaction pattern as EOXS's priority tabs, with steel-specific
 * priorities. Which tab a visitor opens is the most useful qualification
 * signal on the page; wire it to analytics when a provider is chosen.
 */
const PRIORITIES = [
  {
    id: "inventory",
    tab: "Inventory visibility",
    headline: "Know what you're actually holding",
    body: "Your ERP knows the coil exists. It doesn't know it was set aside for a customer who's now three weeks late, or that half of it went to a trial run. Cruz reads the orders, the email and the calls around that coil and tells you what's genuinely available to sell.",
    proof: "Asked in plain English: “What's free to sell in 48\" hot rolled?”",
  },
  {
    id: "speed",
    tab: "Order-to-ship speed",
    headline: "Find the hold-up before the customer does",
    body: "Most late shipments were predictable days earlier — a credit hold, a processing queue, a missing release. Cruz watches those signals across systems and surfaces the order that's about to slip while you can still do something about it.",
    proof: "Asked in plain English: “What's going to ship late this week?”",
  },
  {
    id: "tribal",
    tab: "Tribal-knowledge risk",
    headline: "Keep what your veterans know",
    body: "When a thirty-year estimator retires, the pricing judgment goes with them. Cruz learns how your people actually make those calls — including the exceptions nobody documented — so the knowledge stays in the business.",
    proof: "Asked in plain English: “How would Dave have priced this?”",
  },
  {
    id: "forecast",
    tab: "Forecasting",
    headline: "Forecast on what's happening, not last quarter",
    body: "Your forecast is built from closed history. The signal is in open quotes, current conversations and what buyers are saying on calls right now. Cruz reads all of it continuously and shows you the shift as it happens.",
    proof: "Asked in plain English: “What's changed in demand since last month?”",
  },
] as const;

export function PriorityPicker() {
  const [active, setActive] = useState(0);
  const base = useId();
  const current = PRIORITIES[active];

  return (
    <Section className="border-rule/40 border-t">
      <Reveal>

        <Heading>What&rsquo;s your top priority?</Heading>
      </Reveal>

      <Reveal delay={80} className="mt-10">
        {/* Mobile: native select — one line, always fits, no wrap-orphan. */}
        <select
          className="border-rule/60 text-ink bg-paper w-full border px-4 py-3.5 text-sm font-medium sm:hidden"
          value={active}
          onChange={(e) => setActive(Number(e.target.value))}
          aria-label="Top priority"
        >
          {PRIORITIES.map((p, i) => (
            <option key={p.id} value={i}>
              {p.tab}
            </option>
          ))}
        </select>

        {/* Desktop: original tab bar, hidden on phones. */}
        <div
          role="tablist"
          aria-label="Top priority"
          className="border-rule/50 hidden flex-wrap gap-px border-b sm:flex"
        >
          {PRIORITIES.map((p, i) => {
            const selected = i === active;
            return (
              <button
                key={p.id}
                role="tab"
                id={`${base}-tab-${p.id}`}
                aria-selected={selected}
                aria-controls={`${base}-panel-${p.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const next =
                    e.key === "ArrowRight"
                      ? (active + 1) % PRIORITIES.length
                      : (active - 1 + PRIORITIES.length) % PRIORITIES.length;
                  setActive(next);
                  document
                    .getElementById(`${base}-tab-${PRIORITIES[next].id}`)
                    ?.focus();
                }}
                className={`type-display -mb-px border-b-2 px-4 py-3.5 text-sm tracking-tight transition-colors sm:px-6 sm:text-base ${
                  selected
                    ? "border-slate text-ink"
                    : "text-mute hover:text-ink/80 border-transparent"
                }`}
              >
                {p.tab}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${base}-panel-${current.id}`}
          aria-labelledby={`${base}-tab-${current.id}`}
          className="border-rule/50 border border-t-0 p-7 sm:p-10"
        >
          <h3 className="type-display text-ink max-w-2xl text-2xl sm:text-3xl">
            {current.headline}
          </h3>
          <p className="text-mute mt-5 max-w-2xl text-base leading-relaxed">
            {current.body}
          </p>
          <p className="type-data text-slate border-slate/25 mt-7 border-l-2 py-1 pl-4 normal-case">
            {current.proof}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
