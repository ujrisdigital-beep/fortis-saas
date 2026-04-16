/**
 * VideoGenerator — Replicate + ElevenLabs Integration
 * Generates short-form video scripts, voiceovers, and b-roll prompts
 * for social media content.
 *
 * Dependencies (add to package.json when ready to deploy):
 *   npm install replicate @elevenlabs/sdk
 *
 * Env vars required:
 *   REPLICATE_API_TOKEN
 *   ELEVENLABS_API_KEY
 *   ELEVENLABS_VOICE_ID  (default: Rachel)
 */

export interface VideoScriptScene {
  order: number;
  visualPrompt: string;   // sent to image/video model
  voiceoverText: string;  // sent to ElevenLabs TTS
  durationSeconds: number;
  captionText?: string;   // on-screen caption overlay
}

export interface VideoScript {
  title: string;
  platform: "TIKTOK" | "INSTAGRAM" | "YOUTUBE" | "FACEBOOK";
  totalDuration: number;
  scenes: VideoScriptScene[];
  backgroundMusic?: string;
  hashtags: string[];
}

export interface GeneratedAsset {
  type: "image" | "video" | "audio";
  url: string;
  sceneOrder: number;
  modelUsed: string;
}

export interface VideoJob {
  jobId: string;
  scriptTitle: string;
  status: "queued" | "generating" | "complete" | "failed";
  assets: GeneratedAsset[];
  createdAt: string;
  completedAt?: string;
  error?: string;
}

const REPLICATE_IMAGE_MODEL = "stability-ai/sdxl:39ed52f2319f9..."; // pin to a stable version
const REPLICATE_VIDEO_MODEL = "anotherjesse/zeroscope-v2-xl:9f747...";

/**
 * Build a system prompt to generate a short-form video script.
 */
export function buildVideoScriptPrompt(
  topic: string,
  tone: string,
  platform: VideoScript["platform"],
  targetLengthSeconds: number,
): string {
  const platformRules: Record<VideoScript["platform"], string> = {
    TIKTOK: "Hook in first 2s. Fast cuts. Text overlays. Max 60s.",
    INSTAGRAM: "Visually clean. Aesthetic B-roll. 15–30s reels optimized.",
    YOUTUBE: "Slightly longer (30–60s shorts). Strong hooks. Card-style captions.",
    FACEBOOK: "More informative. Subtitles essential. 30–60s works well.",
  };

  return `You are a short-form video director and copywriter.

Topic: ${topic}
Tone: ${tone}
Platform: ${platform} — ${platformRules[platform]}
Target Length: ${targetLengthSeconds} seconds

Write a video script broken into scenes. Each scene should have:
- A visual direction (what to show / B-roll description for AI image gen)
- Voiceover text (natural, conversational, no filler)
- Estimated duration in seconds
- An optional caption overlay (keep under 8 words)

Return ONLY valid JSON:
{
  "title": "...",
  "platform": "${platform}",
  "totalDuration": ${targetLengthSeconds},
  "hashtags": ["..."],
  "scenes": [
    {
      "order": 1,
      "visualPrompt": "...",
      "voiceoverText": "...",
      "durationSeconds": 5,
      "captionText": "..."
    }
  ]
}`;
}

/**
 * Generate a voice-over audio file for a single scene using ElevenLabs.
 * Returns a URL to the generated audio.
 *
 * In production: replace the mock return with actual ElevenLabs SDK call.
 */
export async function generateVoiceover(
  text: string,
  _voiceId?: string,
): Promise<{ audioUrl: string; durationSeconds: number }> {
  const voiceId = _voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    // Return placeholder in dev/preview
    return { audioUrl: "", durationSeconds: estimateSpeechDuration(text) };
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`ElevenLabs error: ${response.status} ${response.statusText}`);
  }

  // In production upload the audio blob to your storage provider
  // and return the public URL. Placeholder response here:
  return { audioUrl: "", durationSeconds: estimateSpeechDuration(text) };
}

/**
 * Generate a B-roll image for a scene prompt using Replicate SDXL.
 * Returns a URL to the generated image.
 */
export async function generateBRollImage(
  visualPrompt: string,
): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    return ""; // placeholder in dev
  }

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: REPLICATE_IMAGE_MODEL,
      input: {
        prompt: visualPrompt,
        width: 1024,
        height: 576,  // 16:9 for landscape, swap to 576x1024 for portrait (Reels/TikTok)
        num_inference_steps: 25,
        guidance_scale: 7.5,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Replicate error: ${response.status}`);
  }

  const prediction = await response.json() as { id: string; urls: { get: string } };
  return prediction.urls?.get ?? "";
}

/**
 * Rough estimate of speech duration (words per minute = ~150).
 */
function estimateSpeechDuration(text: string): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil((wordCount / 150) * 60);
}

/**
 * Create a new video job record (in-memory stub).
 * Swap this for a DB insert in production.
 */
export function createVideoJob(script: VideoScript): VideoJob {
  return {
    jobId: `vj_${Date.now()}`,
    scriptTitle: script.title,
    status: "queued",
    assets: [],
    createdAt: new Date().toISOString(),
  };
}
