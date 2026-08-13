/**
 * Shared section chrome. Keeps rhythm and gutters consistent so the
 * Convergence stays the only thing on the page competing for attention.
 */
export function Section({
  id,
  children,
  className = "",
  bleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative w-full px-5 py-20 sm:px-8 md:py-28 lg:px-12 ${className}`}
    >
      <div className={bleed ? "w-full" : "mx-auto w-full max-w-6xl"}>
        {children}
      </div>
    </section>
  );
}

/** Monospace kicker. Doubles as the "real data" signal described in Section 2. */
export function Eyebrow({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`type-data text-slate mb-4 ${className}`}>
      <span aria-hidden className="mr-2 opacity-60">
        {"//"}
      </span>
      {children}
    </p>
  );
}

export function Heading({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={`type-display text-ink text-3xl sm:text-4xl md:text-5xl ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Lede({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-mute mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${className}`}
    >
      {children}
    </p>
  );
}
