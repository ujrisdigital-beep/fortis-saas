"use client";
// app/settings/platforms/page.tsx
// Platform Credentials — Connect 18 social/messaging platforms
import { useState, useEffect } from "react";

const PRIMARY = "#1B4D3E";
const GOLD    = "#D4AF37";
const TEXT    = "#0A1C2E";
const BG      = "#F8F9FA";
const WHITE   = "#FFFFFF";
const BORDER  = "#E2E8F0";
const RED     = "#DC2626";
const GREEN   = "#16A34A";
const AMBER   = "#D97706";

// ─── Platform metadata ────────────────────────────────────────────────────────
interface PlatformMeta {
  id: string;
  name: string;
  icon: string;
  color: string;
  fields: FieldDef[];
  helpText: string;
}

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "password" | "url";
  required?: boolean;
  placeholder: string;
}

const PLATFORMS: PlatformMeta[] = [
  {
    id: "instagram", name: "Instagram", icon: "📸", color: "#E1306C",
    helpText: "Requires Instagram Business account. Get your Access Token from Meta for Developers.",
    fields: [
      { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "EAAxxxxxxx…" },
      { key: "pageId",      label: "Instagram Account ID", type: "text", placeholder: "17841xxxxxx" },
      { key: "username",    label: "Username (optional)", type: "text", placeholder: "@yourhandle" },
    ],
  },
  {
    id: "facebook", name: "Facebook", icon: "📘", color: "#1877F2",
    helpText: "Use a Page Access Token from Meta for Developers with pages_manage_posts permission.",
    fields: [
      { key: "accessToken", label: "Page Access Token", type: "password", required: true, placeholder: "EAAxxxxxxx…" },
      { key: "pageId",      label: "Page ID", type: "text", required: true, placeholder: "123456789" },
      { key: "username",    label: "Page Name", type: "text", placeholder: "Your Page Name" },
    ],
  },
  {
    id: "twitter", name: "X (Twitter)", icon: "𝕏", color: "#000000",
    helpText: "Create a Twitter Developer App and generate OAuth 2.0 Bearer Token or API Keys.",
    fields: [
      { key: "accessToken",  label: "Bearer Token / OAuth Token", type: "password", required: true, placeholder: "AAAAAAAAAAxx…" },
      { key: "apiKey",       label: "API Key", type: "password", placeholder: "xxxxxxxxxxxxxx" },
      { key: "username",     label: "Twitter Handle", type: "text", placeholder: "@handle" },
    ],
  },
  {
    id: "linkedin", name: "LinkedIn", icon: "💼", color: "#0A66C2",
    helpText: "Use LinkedIn Marketing API. Get an access token with w_member_social permission.",
    fields: [
      { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "AQxxxxxxxx…" },
      { key: "pageId",      label: "Organisation URN (optional)", type: "text", placeholder: "urn:li:organization:xxx" },
      { key: "username",    label: "Profile Name", type: "text", placeholder: "Your Name" },
    ],
  },
  {
    id: "tiktok", name: "TikTok", icon: "🎵", color: "#010101",
    helpText: "Register a TikTok for Developers app. Use the Content Posting API access token.",
    fields: [
      { key: "accessToken",  label: "Access Token", type: "password", required: true, placeholder: "act.xxxxxxxx" },
      { key: "refreshToken", label: "Refresh Token", type: "password", placeholder: "rft.xxxxxxxx" },
      { key: "username",     label: "TikTok Username", type: "text", placeholder: "@yourusername" },
    ],
  },
  {
    id: "youtube", name: "YouTube", icon: "▶️", color: "#FF0000",
    helpText: "Use Google OAuth 2.0. Requires YouTube Data API v3 enabled in Google Cloud Console.",
    fields: [
      { key: "accessToken",  label: "OAuth Access Token", type: "password", required: true, placeholder: "ya29.xxxxxxxx" },
      { key: "refreshToken", label: "Refresh Token", type: "password", placeholder: "1//xxxxxxxxx" },
      { key: "channelId",    label: "Channel ID", type: "text", placeholder: "UCxxxxxxxxxxxxxxxx" },
    ],
  },
  {
    id: "threads", name: "Threads", icon: "🧵", color: "#000000",
    helpText: "Threads uses the same Meta developer credentials as Instagram.",
    fields: [
      { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "EAAxxxxxxx…" },
      { key: "username",    label: "Threads Username", type: "text", placeholder: "@yourhandle" },
    ],
  },
  {
    id: "pinterest", name: "Pinterest", icon: "📌", color: "#E60023",
    helpText: "Create a Pinterest App and generate an access token with boards:write permission.",
    fields: [
      { key: "accessToken", label: "Access Token", type: "password", required: true, placeholder: "pina_xxxxxxxx" },
      { key: "username",    label: "Pinterest Username", type: "text", placeholder: "yourusername" },
    ],
  },
  {
    id: "telegram", name: "Telegram", icon: "✈️", color: "#26A5E4",
    helpText: "Create a bot via @BotFather on Telegram to get your Bot Token.",
    fields: [
      { key: "botToken",  label: "Bot Token", type: "password", required: true, placeholder: "123456:ABC-DEFxxxxxxxx" },
      { key: "channelId", label: "Channel ID / Username", type: "text", placeholder: "@yourchannel or -100xxxxxxxx" },
    ],
  },
  {
    id: "discord", name: "Discord", icon: "🎮", color: "#5865F2",
    helpText: "Create a Discord Application and Bot. Copy the Bot Token from the Bot settings.",
    fields: [
      { key: "botToken",  label: "Bot Token", type: "password", required: true, placeholder: "MTxxxxxxx.xxxxxx.xxxx" },
      { key: "channelId", label: "Default Channel ID", type: "text", placeholder: "123456789012345678" },
      { key: "webhookUrl", label: "Webhook URL (optional)", type: "url", placeholder: "https://discord.com/api/webhooks/…" },
    ],
  },
  {
    id: "slack", name: "Slack", icon: "💬", color: "#4A154B",
    helpText: "Create a Slack App and install it to your workspace. Copy the Bot User OAuth Token.",
    fields: [
      { key: "accessToken", label: "Bot OAuth Token", type: "password", required: true, placeholder: "xoxb-xxxxxxxxxx-xxxxxxxxxx-xxxxxxxxxxxxxxxx" },
      { key: "channelId",   label: "Default Channel ID", type: "text", placeholder: "C0XXXXXXXX" },
      { key: "webhookUrl",  label: "Incoming Webhook URL (optional)", type: "url", placeholder: "https://hooks.slack.com/services/…" },
    ],
  },
  {
    id: "bluesky", name: "Bluesky", icon: "🦋", color: "#0085FF",
    helpText: "Use your Bluesky handle and an App Password from Settings > App Passwords.",
    fields: [
      { key: "accessToken", label: "App Password", type: "password", required: true, placeholder: "xxxx-xxxx-xxxx-xxxx" },
      { key: "username",    label: "Bluesky Handle", type: "text", required: true, placeholder: "yourhandle.bsky.social" },
    ],
  },
  {
    id: "mastodon", name: "Mastodon", icon: "🐘", color: "#6364FF",
    helpText: "Go to your Mastodon instance → Settings → Applications to create an access token.",
    fields: [
      { key: "accessToken",  label: "Access Token", type: "password", required: true, placeholder: "xxxxxxxxxxxxxxxx" },
      { key: "instanceUrl",  label: "Instance URL", type: "url", required: true, placeholder: "https://mastodon.social" },
      { key: "username",     label: "Username", type: "text", placeholder: "@yourhandle" },
    ],
  },
  {
    id: "substack", name: "Substack", icon: "📰", color: "#FF6719",
    helpText: "Substack API is limited. Use your publication URL and API key from Settings.",
    fields: [
      { key: "apiKey",      label: "API Key", type: "password", required: true, placeholder: "sk_xxxxxxxx" },
      { key: "instanceUrl", label: "Publication URL", type: "url", placeholder: "https://yourpub.substack.com" },
      { key: "username",    label: "Author Name", type: "text", placeholder: "Your Name" },
    ],
  },
  {
    id: "medium", name: "Medium", icon: "✍️", color: "#000000",
    helpText: "Get your Integration Token from Medium Settings → Security → Integration Tokens.",
    fields: [
      { key: "accessToken", label: "Integration Token", type: "password", required: true, placeholder: "xxxxxxxxxxxxxxxxxxxx" },
      { key: "username",    label: "Medium Username", type: "text", placeholder: "@yourusername" },
    ],
  },
  {
    id: "circle", name: "Circle", icon: "⭕", color: "#000000",
    helpText: "Generate an API key from your Circle community Settings → API.",
    fields: [
      { key: "apiKey",      label: "API Key", type: "password", required: true, placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
      { key: "instanceUrl", label: "Community URL", type: "url", placeholder: "https://yourcommunity.circle.so" },
      { key: "username",    label: "Community Name", type: "text", placeholder: "Your Community" },
    ],
  },
  {
    id: "snapchat", name: "Snapchat", icon: "👻", color: "#FFFC00",
    helpText: "Use Snapchat Marketing API. Requires Business Manager access and an OAuth token.",
    fields: [
      { key: "accessToken",  label: "Access Token", type: "password", required: true, placeholder: "xxxxxxxxxx" },
      { key: "refreshToken", label: "Refresh Token", type: "password", placeholder: "xxxxxxxxxx" },
      { key: "pageId",       label: "Ad Account ID", type: "text", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
    ],
  },
  {
    id: "whatsapp", name: "WhatsApp", icon: "📱", color: "#25D366",
    helpText: "Use WhatsApp Business API (Meta). Get your Phone Number ID and permanent token.",
    fields: [
      { key: "accessToken",  label: "Permanent Token", type: "password", required: true, placeholder: "EAAxxxxxxx…" },
      { key: "pageId",       label: "Phone Number ID", type: "text", required: true, placeholder: "123456789012345" },
      { key: "webhookUrl",   label: "Webhook Verify Token", type: "text", placeholder: "your_verify_token" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
interface PlatformStatus {
  platform: string;
  connected: boolean;
  username?: string | null;
  pageId?: string | null;
  tokenExpiry?: string | null;
  connectedAt?: string | null;
}

export default function PlatformSettings() {
  const [statuses,      setStatuses]      = useState<Record<string, PlatformStatus>>({});
  const [loading,       setLoading]       = useState(true);
  const [selected,      setSelected]      = useState<string | null>(null);
  const [form,          setForm]          = useState<Record<string, string>>({});
  const [saving,        setSaving]        = useState(false);
  const [saveResult,    setSaveResult]    = useState<{ ok?: string; err?: string } | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [testing,       setTesting]       = useState<string | null>(null);
  const [testResult,    setTestResult]    = useState<Record<string, { ok?: string; err?: string }>>({});
  const [filter,        setFilter]        = useState<"all" | "connected" | "disconnected">("all");

  useEffect(() => {
    fetch("/api/settings/platforms")
      .then(r => r.json())
      .then(data => {
        const map: Record<string, PlatformStatus> = {};
        (data.platforms ?? []).forEach((p: PlatformStatus) => { map[p.platform] = p; });
        setStatuses(map);
      })
      .finally(() => setLoading(false));
  }, []);

  function selectPlatform(id: string) {
    setSelected(id);
    setForm({});
    setSaveResult(null);
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    setSaveResult(null);
    try {
      const res = await fetch("/api/settings/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: selected, ...form }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaveResult({ ok: data.message });
        setStatuses(prev => ({
          ...prev,
          [selected]: { platform: selected, connected: true, username: data.username, connectedAt: data.connectedAt },
        }));
        setForm({});
      } else {
        setSaveResult({ err: data.error });
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect(platform: string) {
    setDisconnecting(platform);
    try {
      const res = await fetch(`/api/settings/platforms?platform=${platform}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setStatuses(prev => ({
          ...prev,
          [platform]: { ...prev[platform], connected: false },
        }));
        if (selected === platform) { setSelected(null); setSaveResult(null); }
      } else {
        alert(data.error ?? "Disconnect failed");
      }
    } finally {
      setDisconnecting(null);
    }
  }

  async function handleTest(platform: string) {
    setTesting(platform);
    setTestResult(prev => ({ ...prev, [platform]: {} }));
    try {
      const res = await fetch("/api/settings/platforms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (data.connected) {
        setTestResult(prev => ({ ...prev, [platform]: { ok: data.message ?? "Credentials valid" } }));
      } else {
        setTestResult(prev => ({
          ...prev,
          [platform]: { err: (data.issues ?? [data.message ?? "Invalid"]).join(", ") },
        }));
      }
    } finally {
      setTesting(null);
    }
  }

  const selectedMeta = PLATFORMS.find(p => p.id === selected);
  const filteredPlatforms = PLATFORMS.filter(p => {
    if (filter === "connected")    return statuses[p.id]?.connected;
    if (filter === "disconnected") return !statuses[p.id]?.connected;
    return true;
  });

  const connectedCount = PLATFORMS.filter(p => statuses[p.id]?.connected).length;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ background: PRIMARY, padding: "1rem 2rem", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 24 }}>🔗</span>
        <div>
          <div style={{ color: WHITE, fontWeight: 700, fontSize: 18 }}>Platform Connections</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            {connectedCount} of {PLATFORMS.length} platforms connected
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: WHITE, borderBottom: `1px solid ${BORDER}`, padding: "0 2rem" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {(["all", "connected", "disconnected"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.7rem 1.2rem", border: "none", background: "transparent",
                fontWeight: filter === f ? 700 : 400,
                color: filter === f ? PRIMARY : "#6B7280",
                borderBottom: filter === f ? `2px solid ${PRIMARY}` : "2px solid transparent",
                cursor: "pointer", fontSize: 14, textTransform: "capitalize",
              }}
            >
              {f}
              {f === "connected" && (
                <span style={{
                  marginLeft: 6, background: GREEN, color: WHITE,
                  borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700,
                }}>
                  {connectedCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 110px)" }}>
        {/* Grid panel */}
        <div style={{
          width: 420, borderRight: `1px solid ${BORDER}`, background: WHITE,
          overflowY: "auto", padding: "1rem",
        }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#6B7280", paddingTop: "2rem" }}>Loading…</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {filteredPlatforms.map(p => {
                const status  = statuses[p.id];
                const isConn  = status?.connected ?? false;
                const isActive = selected === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => selectPlatform(p.id)}
                    style={{
                      background: isActive ? `${PRIMARY}08` : BG,
                      border: isActive ? `2px solid ${PRIMARY}` : `1.5px solid ${BORDER}`,
                      borderRadius: 10, padding: "0.9rem", cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 20 }}>{p.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: TEXT }}>{p.name}</span>
                    </div>

                    {isConn ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <div style={{ width: 7, height: 7, borderRadius: "50%", background: GREEN }} />
                          <span style={{ fontSize: 12, color: GREEN, fontWeight: 600 }}>Connected</span>
                        </div>
                        {status?.username && (
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                            {status.username}
                          </div>
                        )}
                        {testResult[p.id]?.ok && (
                          <div style={{ fontSize: 11, color: GREEN, marginTop: 3 }}>✓ {testResult[p.id].ok}</div>
                        )}
                        {testResult[p.id]?.err && (
                          <div style={{ fontSize: 11, color: RED, marginTop: 3 }}>✕ {testResult[p.id].err}</div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#D1D5DB" }} />
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>Not connected</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail/form panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
          {!selected && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#9CA3AF" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔗</div>
              <div style={{ fontSize: 15 }}>Select a platform to connect</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Connect your social accounts to enable publishing from IKENGA
              </div>
            </div>
          )}

          {selected && selectedMeta && (
            <div>
              {/* Platform header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "1.5rem" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 28, background: `${selectedMeta.color}15`,
                  border: `2px solid ${selectedMeta.color}30`,
                }}>
                  {selectedMeta.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: TEXT }}>{selectedMeta.name}</div>
                  {statuses[selected]?.connected ? (
                    <div style={{ color: GREEN, fontSize: 13, fontWeight: 600 }}>● Connected</div>
                  ) : (
                    <div style={{ color: "#9CA3AF", fontSize: 13 }}>Not connected</div>
                  )}
                </div>
              </div>

              {/* Help text */}
              <div style={{
                background: `${GOLD}15`, border: `1px solid ${GOLD}40`,
                borderRadius: 8, padding: "0.8rem 1rem", marginBottom: "1.5rem",
                fontSize: 13, color: "#92400E",
              }}>
                💡 {selectedMeta.helpText}
              </div>

              {/* Action bar if connected */}
              {statuses[selected]?.connected && (
                <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
                  <button
                    onClick={() => handleTest(selected)}
                    disabled={testing === selected}
                    style={testBtnStyle}
                  >
                    {testing === selected ? "Testing…" : "🔍 Test Connection"}
                  </button>
                  <button
                    onClick={() => handleDisconnect(selected)}
                    disabled={disconnecting === selected}
                    style={disconnectBtnStyle}
                  >
                    {disconnecting === selected ? "Disconnecting…" : "✕ Disconnect"}
                  </button>
                </div>
              )}

              {/* Test result */}
              {testResult[selected] && (
                <div style={{
                  background: testResult[selected].ok ? "#F0FDF4" : "#FEF2F2",
                  border: `1px solid ${testResult[selected].ok ? "#BBF7D0" : "#FECACA"}`,
                  borderRadius: 8, padding: "0.8rem 1rem", marginBottom: "1.5rem", fontSize: 13,
                  color: testResult[selected].ok ? GREEN : RED,
                }}>
                  {testResult[selected].ok ?? testResult[selected].err}
                </div>
              )}

              {/* Connect form */}
              <form onSubmit={handleConnect}>
                <div style={{ fontWeight: 700, color: TEXT, fontSize: 15, marginBottom: "1rem" }}>
                  {statuses[selected]?.connected ? "Update Credentials" : "Connect Account"}
                </div>

                {selectedMeta.fields.map(field => (
                  <div key={field.key} style={{ marginBottom: "1rem" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 5 }}>
                      {field.label} {field.required && <span style={{ color: RED }}>*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key] ?? ""}
                      onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      required={field.required}
                      style={{
                        width: "100%", padding: "0.6rem 0.85rem",
                        border: `1.5px solid ${BORDER}`, borderRadius: 7,
                        fontSize: 14, color: TEXT, outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}

                {saveResult?.ok && (
                  <div style={{
                    background: "#F0FDF4", border: "1px solid #BBF7D0",
                    borderRadius: 8, padding: "0.7rem 1rem", marginBottom: "1rem",
                    color: GREEN, fontSize: 13, fontWeight: 600,
                  }}>
                    ✓ {saveResult.ok}
                  </div>
                )}
                {saveResult?.err && (
                  <div style={{
                    background: "#FEF2F2", border: "1px solid #FECACA",
                    borderRadius: 8, padding: "0.7rem 1rem", marginBottom: "1rem",
                    color: RED, fontSize: 13,
                  }}>
                    {saveResult.err}
                  </div>
                )}

                <button type="submit" disabled={saving} style={connectBtnStyle}>
                  {saving ? "Saving…" : statuses[selected]?.connected ? "Update Credentials" : `Connect ${selectedMeta.name}`}
                </button>
              </form>

              {/* Security notice */}
              <div style={{
                marginTop: "1.5rem", padding: "0.8rem 1rem",
                background: `${PRIMARY}08`, border: `1px solid ${PRIMARY}30`,
                borderRadius: 8, fontSize: 12, color: "#374151",
              }}>
                🔒 Credentials are encrypted with AES-256 before storage.
                Access tokens are never returned after saving — only connection status is shown.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Button styles ────────────────────────────────────────────────────────────
const connectBtnStyle: React.CSSProperties = {
  padding: "0.65rem 1.6rem", background: PRIMARY, color: WHITE,
  border: "none", borderRadius: 7, fontWeight: 700, fontSize: 14, cursor: "pointer",
};
const disconnectBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem", background: WHITE, color: RED,
  border: `1.5px solid ${RED}`, borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer",
};
const testBtnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem", background: WHITE, color: PRIMARY,
  border: `1.5px solid ${PRIMARY}`, borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer",
};
