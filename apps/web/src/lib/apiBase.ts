/**
 * API Base URL Configuration
 * 
 * PRODUCTION REQUIREMENTS:
 * - Set NEXT_PUBLIC_API_URL in Netlify/Vercel environment variables
 * - Do NOT rely on fallback URLs - they may be stale
 * 
 * Expected production values:
 * - Netlify: Set NEXT_PUBLIC_API_URL to your Railway/Fly backend URL
 * - Vercel: Set NEXT_PUBLIC_API_URL in Vercel dashboard
 */

// NOTE: Removed stale fallback URL. Production MUST set NEXT_PUBLIC_API_URL.

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

/**
 * Get the public API base URL for frontend API calls.
 * 
 * Priority:
 * 1. NEXT_PUBLIC_API_URL (explicitly configured)
 * 2. Warn in production if not configured (but don't break SSG)
 * 3. localhost for development
 * 
 * Note: Returns a safe default in production build to avoid breaking SSG/SSG,
 * but logs a warning. Runtime calls will show the error.
 */
let hasWarnedMissingApiBase = false;

function isTruthy(value: string | undefined): boolean {
  if (!value) return false;
  return /^(1|true|yes|on)$/i.test(value);
}

export function isApiConfiguredForProduction(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL);
}

export function isApiReadyRequiredInProduction(): boolean {
  return isTruthy(process.env.NEXT_PUBLIC_FORCE_API_READY);
}

export function getApiConfigErrorMessage(surface: string = "public-api"): string | null {
  if (process.env.NODE_ENV !== "production" || isApiConfiguredForProduction()) {
    return null;
  }
  return `[PRODUCTION WARNING] NEXT_PUBLIC_API_URL is not set for ${surface}. Public web API calls may fail. Configure NEXT_PUBLIC_API_URL before deploying production traffic.`;
}

export function getPublicApiBase(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (configured) {
    return trimTrailingSlash(configured);
  }
  
  // In production build, return safe default to avoid breaking SSG
  // Runtime will show warning via console
  if (process.env.NODE_ENV === "production") {
    const message = getApiConfigErrorMessage();
    if (isApiReadyRequiredInProduction() && message) {
      throw new Error(
        `${message} NEXT_PUBLIC_FORCE_API_READY is enabled, so startup is blocked until NEXT_PUBLIC_API_URL is configured.`
      );
    }
    if (!hasWarnedMissingApiBase) {
      hasWarnedMissingApiBase = true;
      // eslint-disable-next-line no-console
      console.warn(message);
    }
    // Return empty string - callers should check isApiConfiguredForProduction() first
    return "";
  }
  
  // Development fallback
  return "http://localhost:3001";
}

export function hasConfiguredPublicApiBase(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL);
}

export function getInternalApiBase(): string {
  return trimTrailingSlash(process.env.INTERNAL_API_URL || getPublicApiBase());
}

export function assertPublicApiConfigured(fallbackMessage?: string): void {
  if (process.env.NODE_ENV !== "production") {
    return;
  }
  if (isApiConfiguredForProduction()) {
    return;
  }
  throw new Error(fallbackMessage ?? getApiConfigErrorMessage("runtime") ?? "Public API is not configured.");
}
