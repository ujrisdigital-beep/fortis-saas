import { NextResponse } from "next/server";

// In-memory learning metrics store (replace with Prisma in production)
interface LearningEvent {
  id: string;
  toolName: string;
  queryHash: string; // SHA-256 of original query (PII-safe)
  rating: 1 | 2 | 3 | 4 | 5;
  outputQuality: "poor" | "acceptable" | "good" | "excellent";
  promptVersion: string;
  timestamp: string;
  improvementApplied: boolean;
}

const learningEvents: LearningEvent[] = [];
let promptVersions: Record<string, { version: string; avgRating: number; sampleCount: number }> = {
  "ask-ujris": { version: "v1.2", avgRating: 4.2, sampleCount: 847 },
  "uju-cycle": { version: "v1.1", avgRating: 4.5, sampleCount: 423 },
  "ikenga": { version: "v1.3", avgRating: 4.1, sampleCount: 312 },
  "grant-generator": { version: "v1.0", avgRating: 3.9, sampleCount: 156 },
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tool = searchParams.get("tool");

  const recentEvents = learningEvents.slice(-100);
  const avgRating = recentEvents.length > 0
    ? recentEvents.reduce((s, e) => s + e.rating, 0) / recentEvents.length
    : 0;

  const toolMetrics = tool ? promptVersions[tool] : null;

  // Compute improvement trigger: if avg rating < 3.5 over last 100 samples → flag
  const needsImprovement = avgRating > 0 && avgRating < 3.5;

  return NextResponse.json({
    summary: {
      totalEvents: learningEvents.length,
      recentEvents: recentEvents.length,
      averageRating: avgRating > 0 ? Math.round(avgRating * 10) / 10 : null,
      needsImprovement,
      improvementsApplied: learningEvents.filter(e => e.improvementApplied).length,
    },
    promptVersions: tool ? { [tool]: toolMetrics } : promptVersions,
    qualityDistribution: {
      poor: learningEvents.filter(e => e.outputQuality === "poor").length,
      acceptable: learningEvents.filter(e => e.outputQuality === "acceptable").length,
      good: learningEvents.filter(e => e.outputQuality === "good").length,
      excellent: learningEvents.filter(e => e.outputQuality === "excellent").length,
    },
    lastUpdated: new Date().toISOString(),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { toolName, queryHash, rating, outputQuality, promptVersion } = body;

  if (!toolName || !rating || !outputQuality) {
    return NextResponse.json({ error: "toolName, rating, outputQuality required" }, { status: 400 });
  }

  const event: LearningEvent = {
    id: `LE-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    toolName,
    queryHash: queryHash ?? "anonymous",
    rating,
    outputQuality,
    promptVersion: promptVersion ?? "unknown",
    timestamp: new Date().toISOString(),
    improvementApplied: false,
  };

  learningEvents.push(event);

  // Auto-improvement trigger: after 100 events with avg rating < 3.5
  const toolEvents = learningEvents.filter(e => e.toolName === toolName);
  if (toolEvents.length >= 100 && toolEvents.length % 100 === 0) {
    const recentAvg = toolEvents.slice(-100).reduce((s, e) => s + e.rating, 0) / 100;
    if (recentAvg < 3.5) {
      event.improvementApplied = true;
      if (promptVersions[toolName]) {
        const [major, minor] = promptVersions[toolName].version.replace("v", "").split(".");
        promptVersions[toolName].version = `v${major}.${parseInt(minor) + 1}`;
      }
    }
    if (promptVersions[toolName]) {
      promptVersions[toolName].avgRating = Math.round(toolEvents.slice(-100).reduce((s, e) => s + e.rating, 0) / 100 * 10) / 10;
      promptVersions[toolName].sampleCount += 1;
    }
  }

  return NextResponse.json({
    eventId: event.id,
    recorded: true,
    improvementTriggered: event.improvementApplied,
    currentPromptVersion: promptVersions[toolName]?.version ?? "v1.0",
  });
}
