import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { BuildProvider } from "@/contexts/BuildContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { TenantThemeProvider } from "@/components/TenantThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SkipToContent } from "@/components/SkipToContent";
import { AmbientShell } from "@/components/ambient";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { AmbientGlow, AutomotiveAtmosphere, GradientDrift, LightField, NoiseLayer } from "@/components/atmosphere";
import { CinematicMotionProvider, LuxuryEdgeAccent, SceneAwareFx } from "@/components/fx";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

/**
 * Typography stack (CSS variable names kept for existing modules):
 * - --font-montserrat -> Manrope (structured labels, UI chrome, section titles)
 * - --font-display -> Cormorant Garamond (hero/editorial statements)
 * - --font-serif -> Cormorant Garamond (select luxury accents)
 * - --font-inter -> Manrope (body, forms, readable UI)
 * - --font-poppins -> Manrope (nav, cards, secondary UI)
 */
const manropeUi = Manrope({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const cormorantDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const cormorantSerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const manropeBody = Manrope({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const manropeNav = Manrope({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "VEX Atelier | Private Market Luxury Automotive Platform",
  description:
    "Luxury cinematic vehicle platform for private inventory, concierge transactions, appraisals, and premium dealer operations.",
  keywords: [
    "luxury cars",
    "dealer CRM",
    "automotive marketplace",
    "vehicle appraisal",
    "private inventory",
    "concierge acquisition",
  ],
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: { capable: true, title: "Vex" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "VEX Atelier",
    description: "A luxury cinematic platform for private vehicle discovery, appraisal, and concierge acquisition flow.",
    siteName: "VEX Atelier",
    type: "website",
    url: siteUrl,
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VEX Atelier",
    description: "Luxury cinematic website for private inventory, appraisals, and dealer-grade operations.",
    images: ["/twitter-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-US"
      className={`${manropeUi.variable} ${cormorantDisplay.variable} ${cormorantSerif.variable} ${manropeBody.variable} ${manropeNav.variable}`}
    >
      <body className="site-shell" style={{ fontFamily: "var(--font-body), var(--font-inter), system-ui, sans-serif" }}>
        <SkipToContent />
        <AnalyticsProvider />
        <AmbientShell />
        <AmbientGlow />
        <LightField />
        <GradientDrift />
        <NoiseLayer />
        <AutomotiveAtmosphere variant="subtle" intensity="low" />
        <CinematicMotionProvider>
          <LuxuryEdgeAccent />
          <SceneAwareFx />
          <TenantThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <BuildProvider>
                  <Header />
                  {children}
                  <Footer />
                </BuildProvider>
              </AuthProvider>
            </QueryProvider>
          </TenantThemeProvider>
        </CinematicMotionProvider>
      </body>
    </html>
  );
}
