"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { href: "/inventory", label: "Inventory" },
  { href: "/how-it-works", label: "Experience" },
  { href: "/sell", label: "Sell" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 transition ${scrolled ? "pt-3" : "pt-4"}`}
    >
      <div className="shell pb-3">
        <div className="luxury-nav-bar flex items-center justify-between gap-4 px-3 py-3 sm:px-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="flex h-11 items-center">
            <span className="mr-3 h-8 w-px bg-[linear-gradient(180deg,rgba(241,211,138,0),rgba(241,211,138,0.9),rgba(241,211,138,0))]" aria-hidden />
            <span className="leading-none">
              <span className="block font-[family-name:var(--font-display)] text-[1.55rem] tracking-[0.08em] text-[#fff8eb] sm:text-[1.8rem]">
                VEX
              </span>
              <span className="mt-1 block font-[family-name:var(--font-montserrat)] text-[0.62rem] uppercase tracking-[0.52em] text-[#f1d38a] sm:text-[0.66rem]">
                Atelier
              </span>
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-md px-3 py-2 font-[family-name:var(--font-montserrat)] text-[0.7rem] uppercase tracking-[0.24em] transition ${
                  active ? "text-[#fff8eb]" : "text-[#d6ccbd]/72 hover:text-[#f1d38a]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/appraisal" className="hidden rounded-md border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[#f5f1e8] transition hover:border-[#f1d38a]/28 lg:inline-flex">
            Request Appraisal
          </Link>
          <Link href="/contact" className="gold-button hidden sm:inline-flex">
            Private Access
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[#f5f1e8] md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="space-y-1.5">
              <span className={`block h-0.5 w-4 bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-5 top-24 rounded-2xl border border-[#f1d38a]/16 bg-[#111111]/90 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.36)] backdrop-blur-xl"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-[#f1d38a]/70">Navigate the estate</p>
              <div className="mt-5 grid gap-3">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md border border-white/10 px-4 py-3 text-[#f5f1e8]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-5 grid gap-3">
                <Link href="/appraisal" className="ghost-button" onClick={() => setMenuOpen(false)}>
                  Start Appraisal
                </Link>
                <Link href="/contact" className="gold-button" onClick={() => setMenuOpen(false)}>
                  Reserve Concierge
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
