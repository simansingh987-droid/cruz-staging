import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

/* One geometric sans across the whole site — display and body.
   Carries light weights (200) for headlines without getting fragile,
   and stays legible at 14px for body. The mixed industrial/technical
   trio from the first pass is gone: restraint reads as expensive,
   three competing voices don't. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AskCruz — AI Operating System for Steel",
  description:
    "Cruz learns how your business actually runs — the calls, the judgment calls, the tribal knowledge — and turns it into one AI that helps you decide faster.",
  openGraph: {
    title: "AskCruz — AI Operating System for Steel",
    description:
      "One brain. Every person on your floor. An AI operating system built for steel service centers, processors, and distributors.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        {/* Runs before first paint, so scroll-reveal content is only hidden
            when there is JS available to reveal it again. No flash, and the
            page still reads with scripting off. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="bg-paper text-ink flex min-h-full flex-col">
        <a
          href="#main"
          className="bg-slate text-paper sr-only rounded px-4 py-2 font-semibold focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
