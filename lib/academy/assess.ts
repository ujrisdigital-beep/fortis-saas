export interface ServerQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface SubmittedAnswer {
  questionId: string;
  selectedIndex: number;
}

export const DEMO_BANK: ServerQuestion[] = [
  {
    id: "q1",
    prompt: "Which statement is true of FORTIS credentials?",
    options: ["They are blockchain-backed by default", "They are HMAC-signed registry records", "Any 64-char hash is valid"],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "Who may set a checkout amount?",
    options: ["The browser", "The server catalogue", "The WhatsApp seller"],
    correctIndex: 1,
  },
];

export function gradeAssessment(
  bank: ServerQuestion[],
  answers: SubmittedAnswer[],
  meta: { tabSwitches: number; timeSpentSeconds: number },
) {
  if (!bank.length) throw new Error("empty_bank");
  let correct = 0;
  for (const question of bank) {
    const answer = answers.find((a) => a.questionId === question.id);
    if (answer?.selectedIndex === question.correctIndex) correct += 1;
  }
  const score = Math.round((correct / bank.length) * 100);
  const passed = score >= 70;
  const flagged = meta.tabSwitches > 3 || meta.timeSpentSeconds < 30;
  return {
    score,
    correct,
    total: bank.length,
    passed,
    flagged,
    eligibleForCertificate: passed && !flagged,
    // Never echo the answer key to the client on a live attempt.
    result: passed ? "PASS" : "FAIL",
  };
}
