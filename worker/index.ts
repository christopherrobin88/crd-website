/**
 * CRD portfolio Worker. Serves the static site through the ASSETS binding and
 * handles POST /api/enquiry: validates the contact-form submission and emails
 * it to the studio inbox via the Email Routing / Email Service send_email
 * binding (free when the recipient is a verified destination address on the
 * account — see docs/email-migration.md).
 *
 * Nothing here is exposed to the browser: the binding, addresses and rate
 * limiter live server-side only; the frontend just POSTs JSON.
 */

interface EmailSendParams {
  to: string;
  from: { email: string; name?: string };
  replyTo?: string;
  subject: string;
  text: string;
}

// Narrow local shapes for the bindings we call. Regenerate with
// `wrangler types` once the account-side setup exists if fuller typing is
// wanted; the runtime contract is what matters here.
interface EmailSender {
  send(params: EmailSendParams): Promise<unknown>;
}

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** send_email binding; absent until deployed with the binding configured. */
  EMAIL?: EmailSender;
  /** Rate-limiting binding; absent in local dev. */
  ENQUIRY_RATE?: RateLimiter;
  /** Where enquiries land. Must be a verified destination address on the
   *  Cloudflare account for free sending. Set in wrangler.toml [vars]. */
  CONTACT_INBOX: string;
  /** From address, on the site's own domain. Set in wrangler.toml [vars]. */
  ENQUIRY_FROM: string;
}

interface EnquiryBody {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  projectType?: unknown;
  timeline?: unknown;
  budget?: unknown;
  message?: unknown;
  /** Honeypot. Humans never see it; anything non-empty is a bot. */
  website?: unknown;
}

const LIMITS: Record<string, { max: number; required: boolean }> = {
  name: { max: 200, required: true },
  email: { max: 254, required: true },
  company: { max: 200, required: false },
  projectType: { max: 100, required: true },
  timeline: { max: 100, required: true },
  budget: { max: 100, required: false },
  message: { max: 5000, required: true },
};

// Deliberately loose: real validation of deliverability happens by replying.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function fieldString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function handleEnquiry(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return json(405, { ok: false, error: "Method not allowed." });
  }

  // Same-origin check: browsers send Origin on cross-site POSTs; a mismatch
  // means the request did not come from the site's own form.
  const origin = request.headers.get("Origin");
  if (origin) {
    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      return json(403, { ok: false, error: "Forbidden." });
    }
    if (originHost !== new URL(request.url).host) {
      return json(403, { ok: false, error: "Forbidden." });
    }
  }

  if (env.ENQUIRY_RATE) {
    const key = request.headers.get("CF-Connecting-IP") ?? "unknown";
    const { success } = await env.ENQUIRY_RATE.limit({ key });
    if (!success) {
      return json(429, {
        ok: false,
        error: "Too many enquiries from this connection. Please try again in a minute.",
      });
    }
  }

  let body: EnquiryBody;
  try {
    body = (await request.json()) as EnquiryBody;
  } catch {
    return json(400, { ok: false, error: "Invalid request body." });
  }

  // Honeypot: report success so automated senders learn nothing.
  if (fieldString(body.website) !== "") {
    return json(200, { ok: true });
  }

  const fields: Record<string, string> = {};
  for (const [key, rule] of Object.entries(LIMITS)) {
    const value = fieldString(body[key as keyof EnquiryBody]);
    if (rule.required && value === "") {
      return json(400, { ok: false, error: `Missing required field: ${key}.` });
    }
    if (value.length > rule.max) {
      return json(400, { ok: false, error: `Field too long: ${key}.` });
    }
    fields[key] = value;
  }
  if (!EMAIL_SHAPE.test(fields.email)) {
    return json(400, { ok: false, error: "Please supply a valid email address." });
  }

  if (!env.EMAIL) {
    // Binding not configured (local dev, or account setup incomplete).
    return json(503, {
      ok: false,
      error: "Enquiry sending is not available right now.",
    });
  }

  const lines = [
    `Name: ${fields.name}`,
    `Email: ${fields.email}`,
    `Company: ${fields.company || "(not given)"}`,
    `Project type: ${fields.projectType}`,
    `Timeline: ${fields.timeline}`,
    `Budget range: ${fields.budget || "(not given)"}`,
    "",
    "Project details:",
    fields.message,
  ];

  try {
    await env.EMAIL.send({
      to: env.CONTACT_INBOX,
      from: { email: env.ENQUIRY_FROM, name: "CRD Website" },
      replyTo: fields.email,
      subject: `Project enquiry from ${fields.name}`,
      text: lines.join("\n"),
    });
  } catch (error) {
    console.error("enquiry send failed:", error);
    return json(502, {
      ok: false,
      error: "The enquiry could not be sent. Please email the studio directly.",
    });
  }

  return json(200, { ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api/enquiry") {
      return handleEnquiry(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
