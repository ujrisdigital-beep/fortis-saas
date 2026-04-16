// app/api/settings/platforms/route.ts
// Platform Credential Storage — AES-256 encrypted tokens per user
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

// AES-256-CBC encryption/decryption for tokens at rest
const ENC_KEY = (process.env.TOKEN_ENCRYPTION_KEY ?? "fortis-enc-key-dev-32chars-padded").slice(0, 32);
const IV_LEN  = 16;

function encrypt(plaintext: string): string {
  const iv     = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENC_KEY), iv);
  const enc    = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + enc.toString("hex");
}

function decrypt(ciphertext: string): string {
  const [ivHex, encHex] = ciphertext.split(":");
  const iv      = Buffer.from(ivHex, "hex");
  const enc     = Buffer.from(encHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENC_KEY), iv);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}

function safeDecrypt(val: string | null | undefined): string | undefined {
  if (!val) return undefined;
  try { return decrypt(val); } catch { return "[decryption error]"; }
}

const SUPPORTED_PLATFORMS = [
  "instagram", "facebook", "twitter", "linkedin", "tiktok", "youtube",
  "threads", "pinterest", "telegram", "discord", "slack", "bluesky",
  "mastodon", "substack", "medium", "circle", "snapchat", "whatsapp",
];

// ─── GET /api/settings/platforms — list credentials for current user ─────────
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  if (!userId) return NextResponse.json({ error: "No user ID in session" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");

  if (platform) {
    const cred = await prisma.platformCredential.findUnique({
      where: { userId_platform: { userId, platform } },
    });
    if (!cred) return NextResponse.json({ connected: false, platform });

    return NextResponse.json({
      platform: cred.platform,
      connected: cred.isActive,
      username: cred.username,
      pageId: cred.pageId,
      tokenExpiry: cred.tokenExpiry,
      connectedAt: cred.connectedAt,
    });
  }

  const creds = await prisma.platformCredential.findMany({
    where: { userId },
    select: {
      platform: true,
      isActive: true,
      username: true,
      pageId: true,
      tokenExpiry: true,
      connectedAt: true,
      updatedAt: true,
    },
  });

  const connected = new Set(creds.map(c => c.platform));
  const result = SUPPORTED_PLATFORMS.map(p => {
    const cred = creds.find(c => c.platform === p);
    return {
      platform: p,
      connected: connected.has(p) && (cred?.isActive ?? false),
      username: cred?.username ?? null,
      pageId: cred?.pageId ?? null,
      tokenExpiry: cred?.tokenExpiry ?? null,
      connectedAt: cred?.connectedAt ?? null,
    };
  });

  return NextResponse.json({ platforms: result });
}

// ─── POST /api/settings/platforms — connect / update a platform ──────────────
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  if (!userId) return NextResponse.json({ error: "No user ID in session" }, { status: 401 });

  let body: Record<string, string | undefined>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { platform, accessToken, refreshToken, pageId, username,
          webhookUrl, botToken, channelId, instanceUrl, apiKey, tokenExpiry } = body;

  if (!platform) return NextResponse.json({ error: "platform is required" }, { status: 400 });
  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    return NextResponse.json({ error: `Unsupported platform: ${platform}` }, { status: 400 });
  }
  if (!accessToken) return NextResponse.json({ error: "accessToken is required" }, { status: 400 });

  const data = {
    accessToken:  encrypt(accessToken),
    refreshToken: refreshToken  ? encrypt(refreshToken)  : undefined,
    botToken:     botToken      ? encrypt(botToken)      : undefined,
    apiKey:       apiKey        ? encrypt(apiKey)        : undefined,
    pageId:       pageId        ?? undefined,
    username:     username      ?? undefined,
    webhookUrl:   webhookUrl    ?? undefined,
    channelId:    channelId     ?? undefined,
    instanceUrl:  instanceUrl   ?? undefined,
    tokenExpiry:  tokenExpiry   ? new Date(tokenExpiry)  : undefined,
    isActive:     true,
    updatedAt:    new Date(),
  };

  const cred = await prisma.platformCredential.upsert({
    where: { userId_platform: { userId, platform } },
    create: { userId, platform, ...data },
    update: data,
  });

  return NextResponse.json({
    message: `${platform} connected successfully`,
    platform: cred.platform,
    username: cred.username,
    connectedAt: cred.connectedAt,
  });
}

// ─── DELETE /api/settings/platforms?platform=xxx — disconnect a platform ─────
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  if (!userId) return NextResponse.json({ error: "No user ID in session" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");

  if (!platform) return NextResponse.json({ error: "platform query param required" }, { status: 400 });

  const existing = await prisma.platformCredential.findUnique({
    where: { userId_platform: { userId, platform } },
  });
  if (!existing) return NextResponse.json({ error: "Platform not connected" }, { status: 404 });

  await prisma.platformCredential.update({
    where: { userId_platform: { userId, platform } },
    data: { isActive: false, updatedAt: new Date() },
  });

  return NextResponse.json({ message: `${platform} disconnected`, platform });
}

// ─── PATCH /api/settings/platforms — test connection (decrypt + validate) ────
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = session.user.id;
  if (!userId) return NextResponse.json({ error: "No user ID in session" }, { status: 401 });

  let body: { platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { platform } = body;
  if (!platform) return NextResponse.json({ error: "platform required" }, { status: 400 });

  const cred = await prisma.platformCredential.findUnique({
    where: { userId_platform: { userId, platform } },
  });
  if (!cred) return NextResponse.json({ connected: false, message: "Not connected" });

  const token = safeDecrypt(cred.accessToken);

  const checks: string[] = [];
  if (!token || token === "[decryption error]") checks.push("Token decryption failed");
  if (cred.tokenExpiry && cred.tokenExpiry < new Date()) checks.push("Token has expired");
  if (!cred.isActive) checks.push("Platform is marked inactive");

  if (checks.length > 0) {
    return NextResponse.json({ connected: false, issues: checks });
  }

  return NextResponse.json({
    connected: true,
    platform,
    username: cred.username,
    tokenExpiry: cred.tokenExpiry,
    message: "Credentials look valid. Live API test requires platform OAuth flow.",
  });
}