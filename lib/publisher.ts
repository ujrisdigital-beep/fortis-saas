// lib/publisher.ts — IKENGA V2.0 Platform Publishers

export interface PostPayload {
  caption: string;
  hashtags: string[];
  mediaUrls?: string[];
  videoId?: string;
  link?: string;
  audienceId?: string;
}

export interface PublishResult {
  postId: string;
  url: string;
}

interface Credentials {
  accessToken?: string;
  refreshToken?: string;
  pageId?: string;
  userId?: string;
  botToken?: string;
  channelId?: string;
  channelUsername?: string;
  webhookUrl?: string;
  botName?: string;
  avatarUrl?: string;
  username?: string;
  password?: string;
  instanceUrl?: string;
  apiKey?: string;
  publicationId?: string;
  publicationUrl?: string;
  spaceId?: string;
  communitySlug?: string;
}

type Publisher = {
  name: string;
  publish(post: PostPayload, credentials: Credentials): Promise<PublishResult>;
  validate(credentials: Credentials): Promise<boolean>;
};

function postText(post: PostPayload): string {
  return `${post.caption}\n\n${post.hashtags.map(t => `#${t}`).join(" ")}`;
}

// ── WhatsApp Business API ────────────────────────────────────────────
const WhatsAppPublisher: Publisher = {
  name: "WhatsApp",
  async publish(post, credentials) {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${credentials.pageId}/messages`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: post.audienceId || "",
          type: "text",
          text: { body: postText(post) },
        }),
      }
    );
    const data = await response.json();
    return { postId: data.messages?.[0]?.id || "", url: "" };
  },
  async validate(credentials) {
    const r = await fetch(`https://graph.facebook.com/v18.0/${credentials.pageId}`, {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Instagram Graph API ──────────────────────────────────────────────
const InstagramPublisher: Publisher = {
  name: "Instagram",
  async publish(post, credentials) {
    const container = await fetch(
      `https://graph.facebook.com/v18.0/${credentials.pageId}/media`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: post.mediaUrls?.[0] || "",
          caption: postText(post),
        }),
      }
    );
    const { id: creationId } = await container.json();

    const publish = await fetch(
      `https://graph.facebook.com/v18.0/${credentials.pageId}/media_publish`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ creation_id: creationId }),
      }
    );
    const data = await publish.json();
    return { postId: data.id, url: `https://instagram.com/p/${data.code || data.id}` };
  },
  async validate(credentials) {
    const r = await fetch(`https://graph.facebook.com/v18.0/${credentials.pageId}`, {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Facebook Pages API ───────────────────────────────────────────────
const FacebookPublisher: Publisher = {
  name: "Facebook",
  async publish(post, credentials) {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${credentials.pageId}/feed`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ message: postText(post), link: post.link }),
      }
    );
    const data = await response.json();
    return { postId: data.id, url: `https://facebook.com/${data.id}` };
  },
  async validate(credentials) {
    const r = await fetch(`https://graph.facebook.com/v18.0/${credentials.pageId}`, {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── LinkedIn API ─────────────────────────────────────────────────────
const LinkedInPublisher: Publisher = {
  name: "LinkedIn",
  async publish(post, credentials) {
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${credentials.accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${credentials.pageId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: postText(post) },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });
    const data = await response.json();
    return { postId: data.id, url: `https://linkedin.com/feed/update/${data.id}` };
  },
  async validate(credentials) {
    const r = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Twitter / X API v2 ───────────────────────────────────────────────
const TwitterPublisher: Publisher = {
  name: "Twitter",
  async publish(post, credentials) {
    const text = `${post.caption.substring(0, 230)}\n\n${post.hashtags.map(t => `#${t}`).join(" ")}`;
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    return { postId: data.data.id, url: `https://twitter.com/i/web/status/${data.data.id}` };
  },
  async validate(credentials) {
    const r = await fetch("https://api.twitter.com/2/users/me", {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── TikTok API ───────────────────────────────────────────────────────
const TikTokPublisher: Publisher = {
  name: "TikTok",
  async publish(post, credentials) {
    const response = await fetch("https://open-api.tiktok.com/share/video/upload/", {
      method: "POST",
      headers: { "Access-Token": credentials.accessToken || "", "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: post.videoId, text: postText(post) }),
    });
    const data = await response.json();
    return {
      postId: data.data?.share_id || "",
      url: `https://tiktok.com/@${credentials.username}/video/${data.data?.video_id || ""}`,
    };
  },
  async validate(credentials) {
    const r = await fetch("https://open-api.tiktok.com/user/info/", {
      headers: { "Access-Token": credentials.accessToken || "" },
    });
    return r.ok;
  },
};

// ── Threads (Meta) ───────────────────────────────────────────────────
const ThreadsPublisher: Publisher = {
  name: "Threads",
  async publish(post, credentials) {
    const response = await fetch(
      `https://graph.threads.net/v1.0/${credentials.userId}/threads`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ media_type: "TEXT", text: postText(post) }),
      }
    );
    const data = await response.json();
    return { postId: data.id, url: `https://threads.net/t/${data.id}` };
  },
  async validate(credentials) {
    const r = await fetch(`https://graph.threads.net/v1.0/${credentials.userId}`, {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── YouTube Data API ─────────────────────────────────────────────────
const YouTubePublisher: Publisher = {
  name: "YouTube",
  async publish(post, credentials) {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/videos?part=snippet,status",
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          snippet: {
            title: post.caption.substring(0, 100),
            description: postText(post),
            tags: post.hashtags,
            categoryId: "22",
          },
          status: { privacyStatus: "public" },
        }),
      }
    );
    const data = await response.json();
    return { postId: data.id, url: `https://youtube.com/watch?v=${data.id}` };
  },
  async validate(credentials) {
    const r = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=id&mine=true",
      { headers: { "Authorization": `Bearer ${credentials.accessToken}` } }
    );
    return r.ok;
  },
};

// ── Pinterest API ────────────────────────────────────────────────────
const PinterestPublisher: Publisher = {
  name: "Pinterest",
  async publish(post, credentials) {
    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        title: post.caption.substring(0, 100),
        description: post.caption,
        link: post.link,
        media_source: { source_type: "image_url", url: post.mediaUrls?.[0] || "" },
      }),
    });
    const data = await response.json();
    return { postId: data.id, url: `https://pinterest.com/pin/${data.id}` };
  },
  async validate(credentials) {
    const r = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Telegram Bot API ─────────────────────────────────────────────────
const TelegramPublisher: Publisher = {
  name: "Telegram",
  async publish(post, credentials) {
    const response = await fetch(
      `https://api.telegram.org/bot${credentials.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: credentials.channelId,
          text: postText(post),
          parse_mode: "HTML",
        }),
      }
    );
    const data = await response.json();
    return {
      postId: String(data.result?.message_id || ""),
      url: `https://t.me/${credentials.channelUsername}/${data.result?.message_id || ""}`,
    };
  },
  async validate(credentials) {
    const r = await fetch(`https://api.telegram.org/bot${credentials.botToken}/getMe`);
    return r.ok;
  },
};

// ── Discord Webhook ──────────────────────────────────────────────────
const DiscordPublisher: Publisher = {
  name: "Discord",
  async publish(post, credentials) {
    await fetch(credentials.webhookUrl || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: postText(post),
        username: credentials.botName || "IKENGA",
        avatar_url: credentials.avatarUrl || "",
      }),
    });
    return { postId: Date.now().toString(), url: credentials.webhookUrl || "" };
  },
  async validate(credentials) {
    const r = await fetch(credentials.webhookUrl || "", { method: "GET" });
    return r.ok;
  },
};

// ── Slack Webhook ────────────────────────────────────────────────────
const SlackPublisher: Publisher = {
  name: "Slack",
  async publish(post, credentials) {
    await fetch(credentials.webhookUrl || "", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: postText(post),
        username: credentials.botName || "IKENGA",
        icon_emoji: ":robot_face:",
      }),
    });
    return { postId: Date.now().toString(), url: credentials.webhookUrl || "" };
  },
  async validate(credentials) {
    const r = await fetch(credentials.webhookUrl || "", { method: "GET" });
    return r.ok;
  },
};

// ── Bluesky (AT Protocol) ────────────────────────────────────────────
const BlueskyPublisher: Publisher = {
  name: "Bluesky",
  async publish(post, credentials) {
    const session = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: credentials.username, password: credentials.password }),
    });
    const { accessJwt, did } = await session.json();

    const response = await fetch("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      method: "POST",
      headers: { "Authorization": `Bearer ${accessJwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        repo: did,
        collection: "app.bsky.feed.post",
        record: {
          $type: "app.bsky.feed.post",
          text: postText(post).substring(0, 300),
          createdAt: new Date().toISOString(),
        },
      }),
    });
    const data = await response.json();
    const rkey = data.uri?.split("/").pop() || "";
    return {
      postId: data.uri,
      url: `https://bsky.app/profile/${credentials.username}/post/${rkey}`,
    };
  },
  async validate(credentials) {
    const r = await fetch("https://bsky.social/xrpc/com.atproto.server.createSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: credentials.username, password: credentials.password }),
    });
    return r.ok;
  },
};

// ── Mastodon API ─────────────────────────────────────────────────────
const MastodonPublisher: Publisher = {
  name: "Mastodon",
  async publish(post, credentials) {
    const response = await fetch(`${credentials.instanceUrl}/api/v1/statuses`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: postText(post), visibility: "public" }),
    });
    const data = await response.json();
    return { postId: data.id, url: data.url };
  },
  async validate(credentials) {
    const r = await fetch(`${credentials.instanceUrl}/api/v1/accounts/verify_credentials`, {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Substack API ─────────────────────────────────────────────────────
const SubstackPublisher: Publisher = {
  name: "Substack",
  async publish(post, credentials) {
    const response = await fetch("https://api.substack.com/api/v1/posts", {
      method: "POST",
      headers: { "Authorization": `Bearer ${credentials.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        title: post.caption.substring(0, 80),
        body: `<p>${post.caption}</p><p>${post.hashtags.map(t => `#${t}`).join(" ")}</p>`,
        publication_id: credentials.publicationId,
        send_email: true,
      }),
    });
    const data = await response.json();
    return {
      postId: data.id,
      url: `https://${credentials.publicationUrl}/p/${data.slug || data.id}`,
    };
  },
  async validate(credentials) {
    const r = await fetch("https://api.substack.com/api/v1/me", {
      headers: { "Authorization": `Bearer ${credentials.apiKey}` },
    });
    return r.ok;
  },
};

// ── Medium API ───────────────────────────────────────────────────────
const MediumPublisher: Publisher = {
  name: "Medium",
  async publish(post, credentials) {
    const response = await fetch(
      `https://api.medium.com/v1/users/${credentials.userId}/posts`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.caption.substring(0, 100),
          contentFormat: "html",
          content: `<p>${post.caption}</p><p>${post.hashtags.map(t => `#${t}`).join(" ")}</p>`,
          tags: post.hashtags.slice(0, 5),
          publishStatus: "public",
        }),
      }
    );
    const data = await response.json();
    return { postId: data.id, url: data.url || "" };
  },
  async validate(credentials) {
    const r = await fetch("https://api.medium.com/v1/me", {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Circle.so API ────────────────────────────────────────────────────
const CirclePublisher: Publisher = {
  name: "Circle",
  async publish(post, credentials) {
    const response = await fetch(
      `https://app.circle.so/api/v1/spaces/${credentials.spaceId}/posts`,
      {
        method: "POST",
        headers: { "Authorization": `Bearer ${credentials.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.caption.substring(0, 80),
          content: postText(post),
        }),
      }
    );
    const data = await response.json();
    return {
      postId: data.id,
      url: `https://app.circle.so/c/${credentials.communitySlug}/p/${data.slug || data.id}`,
    };
  },
  async validate(credentials) {
    const r = await fetch("https://app.circle.so/api/v1/spaces", {
      headers: { "Authorization": `Bearer ${credentials.apiKey}` },
    });
    return r.ok;
  },
};

// ── Snapchat (placeholder — requires Snapchat Marketing API) ─────────
const SnapchatPublisher: Publisher = {
  name: "Snapchat",
  async publish(_post, credentials) {
    // Snapchat requires video/image media upload; text-only not supported
    // Production: use Snapchat Marketing API with media attachment
    const response = await fetch("https://adsapi.snapchat.com/v1/me", {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    if (!response.ok) throw new Error("Snapchat credentials invalid");
    return { postId: Date.now().toString(), url: "https://snapchat.com" };
  },
  async validate(credentials) {
    const r = await fetch("https://adsapi.snapchat.com/v1/me", {
      headers: { "Authorization": `Bearer ${credentials.accessToken}` },
    });
    return r.ok;
  },
};

// ── Publisher registry ───────────────────────────────────────────────
const PUBLISHERS: Record<string, Publisher> = {
  whatsapp: WhatsAppPublisher,
  instagram: InstagramPublisher,
  facebook: FacebookPublisher,
  linkedin: LinkedInPublisher,
  twitter: TwitterPublisher,
  tiktok: TikTokPublisher,
  threads: ThreadsPublisher,
  youtube: YouTubePublisher,
  pinterest: PinterestPublisher,
  telegram: TelegramPublisher,
  discord: DiscordPublisher,
  slack: SlackPublisher,
  bluesky: BlueskyPublisher,
  mastodon: MastodonPublisher,
  substack: SubstackPublisher,
  medium: MediumPublisher,
  circle: CirclePublisher,
  snapchat: SnapchatPublisher,
};

export async function publishToplatform(
  platform: string,
  post: PostPayload,
  credentials: Credentials
): Promise<PublishResult> {
  const publisher = PUBLISHERS[platform.toLowerCase()];
  if (!publisher) throw new Error(`No publisher registered for platform: ${platform}`);
  return publisher.publish(post, credentials);
}

export async function validateCredentials(
  platform: string,
  credentials: Credentials
): Promise<boolean> {
  const publisher = PUBLISHERS[platform.toLowerCase()];
  if (!publisher) return false;
  return publisher.validate(credentials);
}

export { PUBLISHERS };
