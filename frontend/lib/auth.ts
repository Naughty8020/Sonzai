export const AUTH_COOKIE_NAME = "imhere_token";
export const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function createMockToken(email: string): string {
  return `token-${email}-${Date.now()}`;
}

export function setAuthCookie(token: string): void {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${AUTH_COOKIE_MAX_AGE_SECONDS}`,
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

export function clearAuthCookie(): void {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${AUTH_COOKIE_NAME}=`,
    "Max-Age=0",
    "Path=/",
    "SameSite=Lax",
  ].join("; ");
}

export function getAuthTokenFromCookieString(cookieString: string | undefined): string | null {
  if (!cookieString) return null;

  const target = `${AUTH_COOKIE_NAME}=`;
  const parts = cookieString.split(";");
  const authPart = parts.find((part) => part.trim().startsWith(target));

  if (!authPart) return null;

  const value = authPart.trim().slice(target.length);
  return value ? decodeURIComponent(value) : null;
}

export function hasAuthCookieInBrowser(): boolean {
  if (typeof document === "undefined") return false;
  return getAuthTokenFromCookieString(document.cookie) !== null;
}
