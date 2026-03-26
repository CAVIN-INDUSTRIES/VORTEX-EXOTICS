"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[vex] Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.25rem",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        color: "var(--text-primary, #f4f2ed)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: "1.65rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        Something went wrong
      </h2>
      <p style={{ color: "var(--text-muted, #5c5a56)", maxWidth: "28rem" }}>
        An unexpected error occurred. You can try again or go back to the home page.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={reset}
          style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontWeight: 700,
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            padding: "0.85rem 1.5rem",
            background: "var(--accent, #c9a962)",
            color: "#0a0906",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            fontFamily: "var(--font-montserrat), system-ui, sans-serif",
            fontWeight: 600,
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase" as const,
            padding: "0.85rem 1.5rem",
            border: "1px solid var(--line-gold, rgba(201,169,98,0.35))",
            borderRadius: "12px",
            color: "var(--text-primary, #f4f2ed)",
            textDecoration: "none",
          }}
        >
          Home
        </a>
      </div>
    </div>
  );
}
