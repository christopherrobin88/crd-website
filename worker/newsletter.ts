const consentVersion = "crd-studio-notes-v1";
const consentText = "I'd like to receive CRD marketing emails. I can unsubscribe at any time.";

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Record a signup request in the owner's inbox, never send a campaign. */
export async function handleNewsletter(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json(405, { ok: false, error: "Method not allowed." });
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) return json(403, { ok: false, error: "Forbidden." });
    } catch { return json(403, { ok: false, error: "Forbidden." }); }
  }
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false, error: "Please submit the signup form." });
  }
  if (!env.EMAIL || !env.ENQUIRY_RATE) return json(503, { ok: false, error: "Signups are unavailable right now. Please try again later." });
  const { success } = await env.ENQUIRY_RATE.limit({ key: `studio-notes:${request.headers.get("CF-Connecting-IP") ?? "unknown"}` });
  if (!success) return json(429, { ok: false, error: "Too many requests. Please try again in a minute." });

  // Bound bytes while reading, including requests without Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return json(400, { ok: false, error: "Invalid signup." });
  let text = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 2048) {
        await reader.cancel();
        return json(413, { ok: false, error: "Signup is too large." });
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    text += decoder.decode();
  } catch { return json(400, { ok: false, error: "Invalid signup." }); }
  finally { reader.releaseLock(); }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid signup");
    body = parsed as Record<string, unknown>;
  } catch { return json(400, { ok: false, error: "Invalid signup." }); }
  if (typeof body.website === "string" && body.website.trim()) return json(200, { ok: true });
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: "Please enter a valid email address." });
  }
  if (body.consent !== true || body.consentVersion !== consentVersion) {
    return json(400, { ok: false, error: "Please agree to receive CRD marketing emails." });
  }
  try {
    await env.EMAIL.send({
      to: env.CONTACT_INBOX,
      from: { email: env.ENQUIRY_FROM, name: "CRD Studio notes" },
      replyTo: email,
      subject: "[CRD Studio notes] New signup request",
      text: ["CRD Studio notes signup request", `Email: ${email}`, `Received (UTC): ${new Date().toISOString()}`,
        `Source: Studio notes form on ${new URL(request.url).hostname}`, `Consent version: ${consentVersion}`,
        `Consent: ${consentText}`, "", "The visitor checked the marketing consent box. Email ownership has not been verified.",
        "This is a signup notification, not a campaign. Retain this record privately and honour removal requests before sending updates."].join("\n"),
    });
  } catch {
    console.error("studio_notes_notification_failed");
    return json(502, { ok: false, error: "Your signup could not be sent. Please try again later." });
  }
  return json(200, { ok: true });
}
