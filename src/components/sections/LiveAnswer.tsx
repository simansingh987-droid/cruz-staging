"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The flagship demo, played rather than pictured.
 *
 * A static question-and-answer card reads as a mockup. Watching the question
 * get typed, a beat of thinking, then the answer streaming in reads as a screen
 * recording of the product working — which is the point of the section.
 *
 * Plays once when scrolled into view, then holds on the finished answer. It
 * deliberately does not loop: a repeating demo becomes wallpaper and pulls
 * attention off the copy around it.
 *
 * State transitions all happen inside timers rather than in effect bodies, and
 * "finished" is derived rather than stored — a synchronous setState in an
 * effect would cascade an extra render on every single streamed character.
 */
const QUESTION = "Cruz, what happened this week?";

const ANSWER =
  "Three things worth your attention. First, the Kellerman order slipped — the slitter went down Tuesday afternoon and nobody told the customer; their buyer emailed twice on Wednesday. Second, margin on galvanized is down about four points this week, almost all of it on two jobs that were quoted before the last mill increase. Third, Dave has been quoting plate work at the old scrap assumption on three open jobs.";

const FOLLOW_UP = "I'd call Kellerman before they call you. Want me to draft that?";

const CHIPS = ["12 open orders", "48 emails", "9 calls", "ERP · live"];

type Phase = "idle" | "typing" | "thinking" | "answering";

/** Reduced-motion visitors get the finished exchange with no playback. */
function prefersReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LiveAnswer() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Seeded at first render so the reduced-motion path never needs an effect to
  // jump the animation to its end state.
  const [phase, setPhase] = useState<Phase>(() =>
    prefersReduced() ? "answering" : "idle",
  );
  const [typed, setTyped] = useState(() => (prefersReduced() ? QUESTION : ""));
  const [revealed, setRevealed] = useState(() =>
    prefersReduced() ? ANSWER.length : 0,
  );

  const finished = revealed >= ANSWER.length;

  // Start when the card is actually on screen, not on mount.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || prefersReduced()) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setPhase((p) => (p === "idle" ? "typing" : p));
          io.unobserve(el);
        }
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Type the question a character at a time.
  useEffect(() => {
    if (phase !== "typing") return;

    if (typed.length >= QUESTION.length) {
      const id = setTimeout(() => setPhase("thinking"), 420);
      return () => clearTimeout(id);
    }

    // Slight jitter so it reads as a person typing, not a metronome.
    const id = setTimeout(
      () => setTyped(QUESTION.slice(0, typed.length + 1)),
      34 + Math.random() * 46,
    );
    return () => clearTimeout(id);
  }, [phase, typed]);

  // A beat of thinking before anything streams back.
  useEffect(() => {
    if (phase !== "thinking") return;
    const id = setTimeout(() => setPhase("answering"), 1150);
    return () => clearTimeout(id);
  }, [phase]);

  // Stream the answer in, several characters per tick — token-speed rather
  // than typewriter-speed, which is how a model actually returns text.
  useEffect(() => {
    if (phase !== "answering" || finished) return;
    const id = setTimeout(
      () => setRevealed((r) => Math.min(ANSWER.length, r + 3)),
      16,
    );
    return () => clearTimeout(id);
  }, [phase, revealed, finished]);

  const streaming = phase === "answering" && !finished;
  const complete = phase === "answering" && finished;

  return (
    <div ref={rootRef}>
      <div className="border-rule/70 bg-card overflow-hidden rounded-sm border shadow-[0_18px_50px_rgba(26,26,26,0.07)]">
        {/* Prompt row */}
        <div className="border-rule/70 flex min-h-[3.75rem] items-center gap-3 border-b px-6 py-5">
          <span
            aria-hidden
            className="bg-slate h-1.5 w-1.5 shrink-0 rounded-full"
          />
          <p className="text-ink text-sm sm:text-base">
            {typed}
            {phase === "typing" ? (
              <span
                aria-hidden
                className="bg-ink ml-0.5 inline-block h-4 w-[2px] animate-pulse align-middle"
              />
            ) : null}
          </p>
        </div>

        <div className="min-h-[11rem] px-6 py-7 sm:px-8">
          {phase === "thinking" ? (
            <p className="text-faint flex items-center gap-2 text-sm">
              <span className="sr-only">Cruz is working</span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  className="bg-faint inline-block h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: `${i * 140}ms` }}
                />
              ))}
              <span aria-hidden className="ml-1">
                Reading orders, email and calls…
              </span>
            </p>
          ) : null}

          {phase === "answering" ? (
            <div aria-live="polite">
              <p className="text-ink/90 text-sm leading-relaxed sm:text-base">
                {ANSWER.slice(0, revealed)}
                {streaming ? (
                  <span
                    aria-hidden
                    className="bg-slate ml-0.5 inline-block h-4 w-[2px] align-middle"
                  />
                ) : null}
              </p>

              {complete ? (
                <p className="text-mute mt-4 text-sm leading-relaxed">
                  {FOLLOW_UP}
                </p>
              ) : null}
            </div>
          ) : null}

          {complete ? (
            <div className="border-rule/70 mt-6 flex flex-wrap gap-2 border-t pt-5">
              {CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="type-label text-faint border-rule/80 border px-2.5 py-1.5"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>

    </div>
  );
}
