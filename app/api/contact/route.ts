import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

type MailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

type SmtpAttempt = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  authMethod?: "PLAIN" | "LOGIN";
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MIN_FORM_FILL_TIME_MS = 3000;
const DESTINATION_EMAIL = "damiannrams@gmail.com";
const SMTP_DEFAULT_PORT = 587;
const SMTP_TIMEOUT_MS = 15000;

const globalWithRateLimit = globalThis as typeof globalThis & {
  contactRateLimitStore?: RateLimitStore;
};

const rateLimitStore: RateLimitStore = globalWithRateLimit.contactRateLimitStore ?? new Map<string, RateLimitEntry>();
globalWithRateLimit.contactRateLimitStore = rateLimitStore;

function toStringValue(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeEnvValue(value: string | undefined): string {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  const hasDoubleQuotes = trimmed.startsWith('"') && trimmed.endsWith('"');
  const hasSingleQuotes = trimmed.startsWith("'") && trimmed.endsWith("'");

  if ((hasDoubleQuotes || hasSingleQuotes) && trimmed.length >= 2) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseBoolean(value: string | undefined): boolean | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  return null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ip);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(ip, current);
  return false;
}

function createSmtpAttempts(base: { host: string; port: number; secure: boolean; user: string; pass: string }): SmtpAttempt[] {
  const attempts: SmtpAttempt[] = [];

  const pushAttempt = (attempt: SmtpAttempt) => {
    const key = `${attempt.host}|${attempt.port}|${attempt.secure}|${attempt.user}|${attempt.authMethod ?? "AUTO"}`;
    if (attempts.some((item) => `${item.host}|${item.port}|${item.secure}|${item.user}|${item.authMethod ?? "AUTO"}` === key)) {
      return;
    }
    attempts.push(attempt);
  };

  pushAttempt({ ...base });
  pushAttempt({ ...base, authMethod: "LOGIN" });

  if (base.user.includes("@")) {
    const shortUser = base.user.split("@")[0];
    if (shortUser) {
      pushAttempt({ ...base, user: shortUser, authMethod: "LOGIN" });
    }
  }

  if (base.port === 465) {
    pushAttempt({ ...base, port: 587, secure: false });
    pushAttempt({ ...base, port: 587, secure: false, authMethod: "LOGIN" });
  } else if (base.port === 587) {
    pushAttempt({ ...base, port: 465, secure: true });
    pushAttempt({ ...base, port: 465, secure: true, authMethod: "LOGIN" });
  }

  return attempts;
}

async function sendWithSmtpAttempts(attempts: SmtpAttempt[], mail: MailPayload) {
  let lastError: unknown = null;

  for (const attempt of attempts) {
    try {
      const transporter = nodemailer.createTransport({
        host: attempt.host,
        port: attempt.port,
        secure: attempt.secure,
        authMethod: attempt.authMethod,
        auth: {
          user: attempt.user,
          pass: attempt.pass,
        },
        connectionTimeout: SMTP_TIMEOUT_MS,
        greetingTimeout: SMTP_TIMEOUT_MS,
        socketTimeout: SMTP_TIMEOUT_MS * 2,
      });

      await transporter.verify();
      await transporter.sendMail(mail);
      return;
    } catch (error) {
      lastError = error;
      const smtpError = error as NodeJS.ErrnoException;
      console.warn("SMTP attempt failed", {
        host: attempt.host,
        port: attempt.port,
        secure: attempt.secure,
        user: attempt.user,
        authMethod: attempt.authMethod ?? "AUTO",
        code: smtpError?.code,
        responseCode: (smtpError as NodeJS.ErrnoException & { responseCode?: number })?.responseCode,
      });
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const website = toStringValue(body.website);
    if (website) {
      return NextResponse.json({ ok: true, message: "Wiadomość została wysłana." });
    }

    const formTs = Number(body.formTs ?? 0);
    if (!Number.isFinite(formTs) || Date.now() - formTs < MIN_FORM_FILL_TIME_MS) {
      return NextResponse.json(
        { ok: false, message: "Wykryto podejrzaną aktywność. Spróbuj ponownie za chwilę." },
        { status: 429 },
      );
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ ok: false, message: "Przekroczono limit prób. Spróbuj ponownie za kilka minut." }, { status: 429 });
    }

    const childName = toStringValue(body.childName);
    const birthDate = toStringValue(body.birthDate);
    const email = toStringValue(body.email);
    const phone = toStringValue(body.phone);
    const notes = toStringValue(body.notes);

    if (!childName || !birthDate || !email || !notes) {
      return NextResponse.json({ ok: false, message: "Uzupełnij wszystkie wymagane pola formularza." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, message: "Podaj poprawny adres e-mail." }, { status: 400 });
    }

    const smtpHost = normalizeEnvValue(process.env.SMTP_HOST);
    const smtpPort = Number(normalizeEnvValue(process.env.SMTP_PORT) || String(SMTP_DEFAULT_PORT));
    const smtpUser = normalizeEnvValue(process.env.SMTP_USER);
    const smtpPass = normalizeEnvValue(process.env.SMTP_PASS);
    const smtpFrom = normalizeEnvValue(process.env.SMTP_FROM);
    const smtpSecureEnv = parseBoolean(process.env.SMTP_SECURE);
    let smtpSecure = smtpSecureEnv ?? smtpPort === 465;

    if (!Number.isInteger(smtpPort) || smtpPort <= 0) {
      console.error("Invalid SMTP_PORT configuration");
      return NextResponse.json({ ok: false, message: "Konfiguracja serwera poczty jest niepełna." }, { status: 500 });
    }

    if (smtpPort === 465 && smtpSecure === false) {
      console.warn("SMTP misconfiguration detected: forcing secure=true for port 465");
      smtpSecure = true;
    }

    if (smtpPort === 587 && smtpSecureEnv === true) {
      console.warn("SMTP misconfiguration detected: forcing secure=false for port 587");
      smtpSecure = false;
    }

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      console.error("Missing SMTP configuration");
      return NextResponse.json({ ok: false, message: "Konfiguracja serwera poczty jest niepełna." }, { status: 500 });
    }

    const safeChildName = escapeHtml(childName);
    const safeBirthDate = escapeHtml(birthDate);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "Nie podano");
    const safeNotes = escapeHtml(notes).replaceAll("\n", "<br />");

    const mailPayload: MailPayload = {
      from: smtpFrom,
      to: DESTINATION_EMAIL,
      replyTo: email,
      subject: `Nowe zapytanie o metryczkę: ${childName}`,
      text: [
        "Nowe zapytanie z formularza:",
        `Imię dziecka: ${childName}`,
        `Data urodzenia: ${birthDate}`,
        `E-mail: ${email}`,
        `Telefon: ${phone || "Nie podano"}`,
        "",
        "Dodatkowe informacje:",
        notes,
      ].join("\n"),
      html: `
        <h2>Nowe zapytanie z formularza</h2>
        <p><strong>Imię dziecka:</strong> ${safeChildName}</p>
        <p><strong>Data urodzenia:</strong> ${safeBirthDate}</p>
        <p><strong>E-mail kontaktowy:</strong> ${safeEmail}</p>
        <p><strong>Telefon:</strong> ${safePhone}</p>
        <p><strong>Dodatkowe informacje:</strong><br />${safeNotes}</p>
      `,
    };

    const attempts = createSmtpAttempts({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      user: smtpUser,
      pass: smtpPass,
    });

    await sendWithSmtpAttempts(attempts, mailPayload);

    return NextResponse.json({ ok: true, message: "Wiadomość została wysłana. Odezwiemy się wkrótce." });
  } catch (error) {
    console.error("Contact form submission failed", error);
    const smtpError = error as NodeJS.ErrnoException & { responseCode?: number };

    if (smtpError?.code === "EAUTH" || smtpError?.responseCode === 535) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Błąd logowania do serwera poczty. Sprawdź SMTP_USER, SMTP_PASS oraz ustawienia portu i szyfrowania (587/STARTTLS albo 465/SSL).",
        },
        { status: 500 },
      );
    }

    if (smtpError?.code === "ETIMEDOUT" || smtpError?.code === "ECONNECTION") {
      return NextResponse.json({ ok: false, message: "Serwer poczty nie odpowiada. Spróbuj ponownie za chwilę." }, { status: 502 });
    }

    return NextResponse.json({ ok: false, message: "Nie udało się wysłać wiadomości. Spróbuj ponownie." }, { status: 500 });
  }
}
