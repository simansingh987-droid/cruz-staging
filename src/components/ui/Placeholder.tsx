/**
 * Non-negotiable #4: no fabricated trust signals.
 *
 * Client logos, press mentions, review badges and customer quotes stay as
 * visibly-marked empty slots until a real, confirmed asset exists. These
 * components are intentionally styled to look unfinished — a reviewer should
 * never mistake one for a shipped credential, and nobody should be able to
 * screenshot the page and claim a customer Cruz does not have.
 */

export function LogoSlot({
  label,
  note,
  className = "",
}: {
  label: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={`border-rule/60 flex h-20 flex-col items-center justify-center gap-1 rounded-sm border border-dashed px-4 text-center ${className}`}
    >
      <span className="type-data text-mute/70">{label}</span>
      {note ? (
        <span className="text-mute/45 text-[10px] tracking-wide">
          {note}
        </span>
      ) : null}
    </div>
  );
}

/** Banner marking a whole block as not-yet-real. */
export function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-data text-slate/70 border-slate/25 mt-6 inline-block border border-dashed px-3 py-2">
      Placeholder — {children}
    </p>
  );
}
