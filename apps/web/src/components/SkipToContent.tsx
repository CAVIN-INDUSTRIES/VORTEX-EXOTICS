import Link from "next/link";

/** First focusable control — jump past nav and ambient background to page content. */
export function SkipToContent() {
  return (
    <Link href="#main-content" className="skip-link">
      Skip to main content
    </Link>
  );
}
