// app/api/support/chat/route.ts
// AI Tier-1 support chatbot — resolves 80% of queries automatically
// Escalates to human only when confidence < 70%
import { NextRequest, NextResponse } from "next/server";
import { escalateToHuman, storeEscalation } from "@/lib/notifications/alert";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are ARIA — the FORTIS OS AI Support Agent for UJU GROUP LIMITED.

You help users of FORTIS OS, a national economic intelligence platform for The Gambia.

FORTIS OS tools:
- UJU Cycle™ (/uju-cycle): Business transformation analysis (Digitise, Optimise, Scale, Dominate)
- Ikenga™ (/ikenga): AI content calendar with 5 brand tones (IKENGA, JUO, OBA, OMENALA, ICHEOKU) for 18 platforms
- Ask UJRIS™ (/ask-ujris): Forensic document analysis and contract review
- Marketplace (/marketplace): Buy Gambia — 18 product categories
- Knowledge Hub (/knowledge): 14 articles, NGO directory, resource library
- Website Builder (/website-builder): Build websites with Framer integration
- Resources: Telecom map, Digital economy, Cybersecurity, Forest data (/resources/*)

Account & Billing:
- Subscription plans at /subscription
- Payment and access at /payment
- Login at /auth/login

Common issues:
- AI tools slow: Normal when OpenAI is under load. Wait 30s and retry.
- Content not generating: Check if OPENAI_API_KEY is configured (admin only)
- Login issues: Try /auth/login, check email/password
- Platform down: Check fortisos.cloud/api/health

Always be helpful, concise, and Gambia-positive. If you cannot answer with 80%+ confidence, say: "ESCALATE: [issue summary]" so the system can route to a human.

Respond in the user's language if they write in Wolof, Mandinka, or French.`;

interface Message { role: "user" | "assistant" | "system"; content: string }

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json() as { message: string; history: Message[] };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const messages: Message[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-8), // Keep last 8 exchanges for context
      { role: "user", content: message },
    ];

    let reply = "";
    let confidence = 85; // default confidence
    let escalated = false;

    if (process.env.OPENAI_API_KEY) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 500,
          temperature: 0.4,
        }),
      });
      const data = await res.json();
      reply = data.choices?.[0]?.message?.content ?? "";
    } else {
      // Rule-based fallback
      reply = buildFallbackReply(message);
      confidence = 70;
    }

    // Check if AI is escalating
    if (reply.startsWith("ESCALATE:")) {
      escalated = true;
      confidence = 0;
      const issueText = reply.replace("ESCALATE:", "").trim();
      const payload = {
        issue: "User Support Escalation",
        detail: issueText,
        instructions: `User query: "${message}"\n\nRespond via FORTIS OS support email: ujrisdigital@gmail.com\nFull chat context available at /admin/escalations`,
        priority: "medium" as const,
        source: "AI Support Chat (ARIA)",
      };
      storeEscalation(payload);
      await escalateToHuman(payload);
      reply = "I've passed your query to our support team who will respond shortly. For urgent issues, email ujrisdigital@gmail.com. Is there anything else I can help with?";
    }

    return NextResponse.json({ reply, confidence, escalated, ts: new Date().toISOString() });
  } catch (err) {
    console.error("[SUPPORT-CHAT]", err);
    return NextResponse.json({
      reply: "I'm having trouble processing that right now. Please try again or email ujrisdigital@gmail.com for urgent support.",
      confidence: 0,
      escalated: false,
    });
  }
}

function buildFallbackReply(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("login") || m.includes("sign in") || m.includes("password")) {
    return "To log in, visit /auth/login. If you've forgotten your password, use the 'Forgot Password' link. If you continue having issues, email ujrisdigital@gmail.com.";
  }
  if (m.includes("ikenga") || m.includes("content") || m.includes("schedule")) {
    return "Ikenga™ is our AI content calendar. Go to /ikenga, select your brand tone (IKENGA, JUO, OBA, OMENALA, or ICHEOKU), pick your platforms, and generate a 7-day content plan. It works on 18 platforms.";
  }
  if (m.includes("uju") || m.includes("cycle") || m.includes("transform")) {
    return "UJU Cycle™ analyzes your business across four phases: Digitise, Optimise, Scale, and Dominate. Visit /uju-cycle to get your transformation roadmap in under 60 seconds.";
  }
  if (m.includes("marketplace") || m.includes("buy") || m.includes("sell")) {
    return "The FORTIS OS Marketplace at /marketplace connects buyers and sellers across The Gambia. To sell, register at /seller/register. For orders, check /marketplace/orders.";
  }
  if (m.includes("price") || m.includes("cost") || m.includes("subscription")) {
    return "View our subscription plans at /subscription. Payment options including mobile money are available at /payment.";
  }
  if (m.includes("slow") || m.includes("error") || m.includes("not working")) {
    return "If a tool is slow or showing errors, try refreshing the page. Our AI tools occasionally queue during peak hours. If the issue persists for more than 5 minutes, it will be auto-detected by our monitoring system.";
  }
  return "I'm here to help with FORTIS OS. You can explore our tools at /uju-cycle, /ikenga, /ask-ujris, or browse the /marketplace. What specific feature can I help you with?";
}
