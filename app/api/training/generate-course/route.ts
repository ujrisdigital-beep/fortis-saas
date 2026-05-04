// app/api/training/generate-course/route.ts
// AI course generator — GPT-4 returns structured JSON course
import { NextRequest, NextResponse } from "next/server";

interface Module {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  quiz: {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  }[];
  durationMin: number;
}

interface CourseJSON {
  title: string;
  description: string;
  level: string;
  durationWeeks: number;
  sector: string;
  modules: Module[];
  certTemplate: string;
}

const SYSTEM_PROMPT = `You are FORTIS AI Course Architect for UJU GROUP LIMITED, Gambia's national digital skills platform.

Generate a structured digital training course as valid JSON only — no prose, no markdown fences.

The JSON must follow this exact shape:
{
  "title": string,
  "description": string (2-3 sentences),
  "level": "beginner" | "intermediate" | "advanced",
  "durationWeeks": number (2-12),
  "sector": string,
  "certTemplate": "standard",
  "modules": [
    {
      "id": "M01",
      "title": string,
      "content": string (300-500 words — practical, Gambia-context aware),
      "videoUrl": null,
      "durationMin": number (15-45),
      "quiz": [
        {
          "q": string,
          "options": ["A", "B", "C", "D"],
          "correct": 0-3 (index),
          "explanation": string
        }
      ]
    }
  ]
}

Rules:
- 4-8 modules per course
- 3 quiz questions per module minimum
- Content must be practical, actionable, and relevant to Gambia's digital economy
- Beginner courses use simple language; advanced courses use technical depth
- Always include a final capstone module with a project-based assessment`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, sector, level, targetAudience } = body;

    if (!topic || !sector) {
      return NextResponse.json({ error: "topic and sector are required" }, { status: 400 });
    }

    const userPrompt = `Generate a complete ${level ?? "beginner"} training course on: "${topic}"
Sector: ${sector}
Target audience: ${targetAudience ?? "Gambian professionals and students"}
Language: English (simple, clear, avoid jargon unless explained)`;

    if (!process.env.OPENAI_API_KEY) {
      // Fallback: return a minimal mock course structure
      const mock: CourseJSON = {
        title: `Introduction to ${topic}`,
        description: `A practical beginner course on ${topic} designed for Gambians entering the ${sector} sector. Covers fundamentals, hands-on exercises, and a final project.`,
        level: level ?? "beginner",
        durationWeeks: 4,
        sector,
        certTemplate: "standard",
        modules: [
          {
            id: "M01",
            title: `What is ${topic}?`,
            content: `This module introduces the core concepts of ${topic}. You will learn the fundamental principles, why they matter in Gambia's growing ${sector} economy, and how to apply them in your daily work. By the end of this module, you'll be able to explain the key ideas to others and identify opportunities to use this knowledge.`,
            videoUrl: null,
            durationMin: 30,
            quiz: [
              { q: `What is the primary purpose of ${topic}?`, options: ["Option A", "Option B", "Option C", "Option D"], correct: 0, explanation: "Explanation for the correct answer." },
              { q: `Which sector most benefits from ${topic} in Gambia?`, options: [sector, "Retail", "Mining", "Fishing"], correct: 0, explanation: `${sector} is the primary beneficiary in the Gambian context.` },
              { q: "What is the first step when applying this knowledge?", options: ["Plan", "Execute immediately", "Skip training", "Hire externally"], correct: 0, explanation: "Planning ensures successful implementation." },
            ],
          },
          {
            id: "M02",
            title: "Practical Application",
            content: `In this hands-on module, you will apply the concepts from Module 1 to real-world scenarios. We will walk through case studies from successful Gambian businesses, practice exercises, and problem-solving techniques. You will complete a short project that demonstrates your understanding.`,
            videoUrl: null,
            durationMin: 45,
            quiz: [
              { q: "What is the most important factor in practical application?", options: ["Context", "Speed", "Cost", "Complexity"], correct: 0, explanation: "Context determines how principles are applied effectively." },
              { q: "How do you measure success in this domain?", options: ["Measurable outcomes", "Effort alone", "Time spent", "Tools used"], correct: 0, explanation: "Measurable outcomes provide objective evidence of success." },
              { q: "What should you do when facing an obstacle?", options: ["Analyse the problem", "Quit", "Ignore it", "Ask someone else immediately"], correct: 0, explanation: "Analysis leads to structured problem-solving." },
            ],
          },
          {
            id: "M03",
            title: "Capstone Project",
            content: `Congratulations on reaching the final module! In this capstone, you will design and present a solution using all the skills you have learned. Your project will be evaluated by FORTIS AI and reviewed for your digital certificate. This project should demonstrate real-world value and reflect your growth as a practitioner.`,
            videoUrl: null,
            durationMin: 60,
            quiz: [
              { q: "What makes a capstone project successful?", options: ["Applying all learned skills", "Using only new tools", "Length of submission", "Number of pages"], correct: 0, explanation: "A capstone demonstrates integrated competency across all modules." },
              { q: "Who reviews your FORTIS certificate submission?", options: ["FORTIS AI + Human reviewer", "No one", "Peers only", "External agency"], correct: 0, explanation: "FORTIS AI grades and a human reviewer spot-checks certificates." },
              { q: "What happens after you pass the capstone?", options: ["Certificate is issued", "Course restarts", "You move to admin", "Nothing"], correct: 0, explanation: "Passing the capstone triggers automatic certificate issuance." },
            ],
          },
        ],
      };
      return NextResponse.json({ course: mock, generated: false, fallback: true });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI error:", err);
      return NextResponse.json({ error: "AI course generation failed", detail: err }, { status: 502 });
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content ?? "{}";
    const course: CourseJSON = JSON.parse(rawContent);

    return NextResponse.json({ course, generated: true, fallback: false, tokens: data.usage?.total_tokens });
  } catch (err) {
    console.error("generate-course error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
