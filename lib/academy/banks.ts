import type { ServerQuestion } from "./assess";
import { DEMO_BANK } from "./assess";

const BY_PROGRAM: Record<string, ServerQuestion[]> = {
  default: DEMO_BANK,
  "digital-literacy": DEMO_BANK,
};

export function bankForProgram(programId: string): ServerQuestion[] {
  return BY_PROGRAM[programId] ?? BY_PROGRAM.default;
}

export function publicQuestions(programId: string) {
  return bankForProgram(programId).map(({ id, prompt, options }) => ({ id, prompt, options }));
}
