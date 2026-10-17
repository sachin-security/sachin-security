// Server-only adapter contract. No biometric or Aadhaar secrets reach the browser.
export async function identityProvider(path: string, payload: Record<string, unknown>) {
  const endpoint = process.env.IDENTITY_PROVIDER_URL;
  const token = process.env.IDENTITY_PROVIDER_API_KEY;
  if (!endpoint || !token) throw new Error("Identity verification is not configured. Contact your administrator.");
  const base = new URL(endpoint);
  if (base.protocol !== "https:" || base.username || base.password) throw new Error("Invalid identity provider configuration");
  const response = await fetch(`${base.href.replace(/\/$/, "")}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload), cache: "no-store", redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error("Verification service is unavailable. Please try again.");
  return await response.json() as Record<string, unknown>;
}
