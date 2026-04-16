// app/api/ikenga/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTonePrompt, getTone } from "@/lib/ikenga-tones";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandName, brandNiche, platforms, primaryGoal, contentType, toneId } = body;
    const tone = getTone(toneId ?? "IKENGA");
    const tonePromptInstruction = getTonePrompt(toneId ?? "IKENGA");

    if (!brandName || !platforms?.length) {
      return NextResponse.json({ error: "Brand name and platforms required" }, { status: 400 });
    }

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const optimalTimes: Record<string, string> = {
      instagram: "11:00", facebook: "13:00", twitter: "09:00", linkedin: "08:30",
      tiktok: "19:00", whatsapp: "10:00", youtube: "14:00", threads: "10:00",
      bluesky: "10:00", pinterest: "12:00", telegram: "09:00", discord: "16:00",
      slack: "10:00", circle: "11:00", substack: "08:00", medium: "09:00",
      snapchat: "18:00", mastodon: "09:00",
    };

    const platformNames: Record<string, string> = {
      instagram: "Instagram", facebook: "Facebook", twitter: "Twitter", linkedin: "LinkedIn",
      tiktok: "TikTok", whatsapp: "WhatsApp", youtube: "YouTube", threads: "Threads",
      bluesky: "Bluesky", pinterest: "Pinterest", telegram: "Telegram", discord: "Discord",
      slack: "Slack", circle: "Circle", substack: "Substack", medium: "Medium",
      snapchat: "Snapchat", mastodon: "Mastodon",
    };

    const posts = [];

    for (const platform of platforms) {
      const time = optimalTimes[platform] || "12:00";
      const platformName = platformNames[platform] || platform;

      for (let day = 0; day < daysOfWeek.length; day++) {
        let caption = "";
        let hook = "";
        let hashtags: string[] = [];
        let callToAction = "";

        if (process.env.OPENAI_API_KEY) {
          try {
            const contentPrompt = `${tonePromptInstruction}

Write a ${contentType || "educational"} ${platformName} post for a Gambian business.
Brand: ${brandName}
Niche: ${brandNiche || "General Business"}
Voice Tone: ${tone.name} — ${tone.description}
Primary Goal: ${primaryGoal || "brand_awareness"}
Day: ${daysOfWeek[day]}
Platform: ${platformName} (optimise caption length and style for this platform)

Return ONLY valid JSON (no markdown, no backticks):
{
  "caption": "The full post text optimised for ${platformName}",
  "hook": "The attention-grabbing first line (max 15 words)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4"],
  "callToAction": "Specific action for this platform and goal"
}`;

            const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: contentPrompt }],
                response_format: { type: "json_object" },
                temperature: 0.8,
              }),
            });

            const aiData = await aiResponse.json();
            const content = JSON.parse(aiData.choices[0].message.content);
            caption = content.caption || "";
            hook = content.hook || "";
            hashtags = Array.isArray(content.hashtags) ? content.hashtags : [];
            callToAction = content.callToAction || `Follow ${brandName} for more!`;
          } catch {
            ({ caption, hook, hashtags, callToAction } = buildFallback(brandName, platformName, contentType));
          }
        } else {
          ({ caption, hook, hashtags, callToAction } = buildFallback(brandName, platformName, contentType));
        }

        posts.push({
          id: `${platform}-day${day}-${Date.now()}`,
          platform,
          day: daysOfWeek[day],
          scheduledTime: time,
          caption,
          hook,
          hashtags,
          callToAction,
          previewHtml: `<div><strong>${hook}</strong><p>${caption.substring(0, 150)}...</p><p>${hashtags.map(t => `#${t}`).join(" ")}</p></div>`,
        });
      }
    }

    return NextResponse.json({
      scheduleId: `schedule-${Date.now()}`,
      totalPosts: posts.length,
      posts,
    });
  } catch (error) {
    console.error("IKENGA generate error:", error);
    return NextResponse.json({ error: "Failed to generate content plan" }, { status: 500 });
  }
}

function buildFallback(brandName: string, platform: string, contentType: string) {
  const safeType = (contentType || "educational") as keyof typeof templates;
  const templates = {
    educational: {
      caption: `Here's a valuable insight from ${brandName} on ${platform}! 🎯\n\nEvery great business starts with knowing your customer deeply.\n\nWhat's one thing you've learned about your market this week?\n\nFollow ${brandName} for daily business tips.`,
      hook: `Here's what most businesses get wrong...`,
      hashtags: [brandName.replace(/\s/g, ""), "Gambia", "BusinessTips", "GrowthMindset"],
      callToAction: "Share this with a fellow entrepreneur!",
    },
    inspirational: {
      caption: `Dream big. Start small. Act now. 💪\n\n${brandName} is proof that Gambian businesses can compete globally.\n\nYour breakthrough is one decision away.\n\n#Motivation #Success #Gambia`,
      hook: `Your breakthrough is one decision away.`,
      hashtags: [brandName.replace(/\s/g, ""), "Motivation", "Success", "GambiaRising"],
      callToAction: "Tag someone who needs to see this!",
    },
    promotional: {
      caption: `Big news from ${brandName}! 🚀\n\nWe're transforming how businesses in The Gambia operate.\n\nReady to take your brand to the next level?\n\nDM us today to learn more.`,
      hook: `Big news from ${brandName}!`,
      hashtags: [brandName.replace(/\s/g, ""), "Gambia", "Innovation", "BusinessGrowth"],
      callToAction: "DM us to get started today!",
    },
    entertaining: {
      caption: `POV: You just discovered ${brandName} on ${platform} 👀\n\nWelcome to the community where Gambian businesses level up! 🇬🇲\n\nFollow for more content like this.`,
      hook: `POV: You just found the best business page in Gambia...`,
      hashtags: [brandName.replace(/\s/g, ""), "Gambia", "Funny", "BusinessLife"],
      callToAction: "Follow us for more!",
    },
    interactive: {
      caption: `We want to hear from YOU! 💬\n\nWhat is your biggest business challenge right now?\n\n${brandName} is here to help Gambian entrepreneurs succeed.\n\nDrop your answer in the comments below 👇`,
      hook: `We want to hear from you — what's your biggest challenge?`,
      hashtags: [brandName.replace(/\s/g, ""), "Gambia", "Community", "Entrepreneurs"],
      callToAction: "Drop your answer below!",
    },
  };

  return templates[safeType] || templates.educational;
}
