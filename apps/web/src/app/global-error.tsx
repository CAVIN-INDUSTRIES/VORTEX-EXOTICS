"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en-US">
      <body className="min-h-screen bg-[#070707] text-[#f6f1e8]">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f1d38a]/70">VEX system notice</p>
          <h1 className="mt-5 font-[var(--font-display)] text-5xl leading-none text-[#fff8eb]">
            The private room needs a reset.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-[#d8d0c2]">
            We captured the fault for review. Refresh the experience to reopen the collection with a clean runtime state.
          </p>
          <button type="button" className="gold-button mt-8 w-fit" onClick={reset}>
            Reset experience
          </button>
        </main>
      </body>
    </html>
  );
}
