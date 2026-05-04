// app/api/training/assess/route.ts
// AI-proctored assessment — grades answers, flags anomalies, returns result
import { NextRequest, NextResponse } from "next/server";

interface Answer {
  moduleId: string;
  questionIndex: number;
  selectedOption: number;
}

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Module {
  id: string;
  title: string;
  quiz: QuizQuestion[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      programId,
      modules,         // full modules array with correct answers
      answers,         // array of Answer submitted by learner
      tabSwitches,     // number of tab-switch events detected client-side
      timeSpentSeconds,
    } = body as {
      userId: string;
      programId: string;
      modules: Module[];
      answers: Answer[];
      tabSwitches: number;
      timeSpentSeconds: number;
    };

    if (!userId || !programId || !modules || !answers) {
      return NextResponse.json({ error: "userId, programId, modules, and answers are required" }, { status: 400 });
    }

    // Grade answers
    let correct = 0;
    let total = 0;
    const feedback: { moduleId: string; questionIndex: number; correct: boolean; explanation: string }[] = [];

    for (const mod of modules) {
      for (let qi = 0; qi < (mod.quiz?.length ?? 0); qi++) {
        total++;
        const q = mod.quiz[qi];
        const answer = answers.find((a) => a.moduleId === mod.id && a.questionIndex === qi);
        const isCorrect = answer?.selectedOption === q.correct;
        if (isCorrect) correct++;
        feedback.push({
          moduleId: mod.id,
          questionIndex: qi,
          correct: isCorrect,
          explanation: q.explanation,
        });
      }
    }

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 70;

    // Proctoring analysis
    const flagged = tabSwitches > 3 || timeSpentSeconds < 30;
    let flagReason: string | null = null;
    if (tabSwitches > 3 && timeSpentSeconds < 30) {
      flagReason = `Suspicious activity: ${tabSwitches} tab switches detected and very fast completion (${timeSpentSeconds}s)`;
    } else if (tabSwitches > 3) {
      flagReason = `${tabSwitches} tab switches detected during assessment`;
    } else if (timeSpentSeconds < 30) {
      flagReason = `Assessment completed unusually fast (${timeSpentSeconds}s) — possible skipping`;
    }

    // AI commentary (if OpenAI available and score is borderline)
    let aiComment: string | null = null;
    if (process.env.OPENAI_API_KEY && score >= 50 && score < 70) {
      try {
        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            temperature: 0.5,
            max_tokens: 200,
            messages: [
              {
                role: "system",
                content: "You are a supportive AI tutor for FORTIS Digital Skills Hub. Write 2-3 encouraging sentences for a learner who scored between 50-69%. Acknowledge their effort, identify improvement areas based on their score, and motivate them to retry. Keep it under 100 words.",
              },
              {
                role: "user",
                content: `Learner scored ${score}% on a ${total}-question assessment. ${correct} correct, ${total - correct} incorrect.`,
              },
            ],
          }),
        });
        const aiData = await aiRes.json();
        aiComment = aiData.choices?.[0]?.message?.content ?? null;
      } catch {
        // Non-critical — proceed without AI comment
      }
    }

    return NextResponse.json({
      score,
      correct,
      total,
      passed,
      result: passed ? "PASS" : "FAIL",
      flagged,
      flagReason,
      tabSwitches,
      timeSpentSeconds,
      feedback,
      aiComment,
      passThreshold: 70,
      eligibleForCertificate: passed && !flagged,
      message: passed
        ? flagged
          ? "You passed but your assessment has been flagged for review. A human reviewer will verify before your certificate is issued."
          : "Congratulations! You have passed. Your certificate is being generated."
        : `You scored ${score}%. You need 70% to pass. Please review the modules and try again.`,
    });
  } catch (err) {
    console.error("assess error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
