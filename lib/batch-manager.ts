export const BATCH_THRESHOLDS = {
  YELLOW: 50,
  ORANGE: 75,
  RED: 90,
} as const;

export type WarningLevel = "yellow" | "orange" | "red";

export interface BatchUser {
  id: string;
  email: string;
  name?: string;
  creditsUsed: number;
  creditsLimit: number;
  warning50Sent?: boolean;
  warning75Sent?: boolean;
  warning90Sent?: boolean;
  lastWarningAt?: string;
}

export interface BatchWarning {
  user: BatchUser;
  level: WarningLevel;
  percentage: number;
  message: string;
}

export function calculateBatchPercentage(user: BatchUser): number {
  if (!user.creditsLimit) return 0;
  return Math.round((user.creditsUsed / user.creditsLimit) * 100);
}

export function getWarningLevel(percentage: number): WarningLevel | null {
  if (percentage >= BATCH_THRESHOLDS.RED) return "red";
  if (percentage >= BATCH_THRESHOLDS.ORANGE) return "orange";
  if (percentage >= BATCH_THRESHOLDS.YELLOW) return "yellow";
  return null;
}

export function generateWarningMessage(level: WarningLevel, percentage: number): string {
  const messages: Record<WarningLevel, string> = {
    yellow: `You've used ${percentage}% of your batch credits. Consider upgrading your plan.`,
    orange: `Warning: ${percentage}% of batch credits used. Upgrade recommended to avoid service interruption.`,
    red: `CRITICAL: ${percentage}% of batch credits used. Your account will be limited soon. Upgrade immediately.`,
  };
  return messages[level];
}

export function shouldSendWarning(user: BatchUser, level: WarningLevel): boolean {
  switch (level) {
    case "yellow": return !user.warning50Sent;
    case "orange": return !user.warning75Sent;
    case "red": return !user.warning90Sent;
  }
}

export async function checkUserBatch(user: BatchUser): Promise<BatchWarning | null> {
  const percentage = calculateBatchPercentage(user);
  const level = getWarningLevel(percentage);
  if (!level || !shouldSendWarning(user, level)) return null;
  return {
    user,
    level,
    percentage,
    message: generateWarningMessage(level, percentage),
  };
}

export async function checkAllUserBatches(users: BatchUser[]): Promise<BatchWarning[]> {
  const warnings: BatchWarning[] = [];
  for (const user of users) {
    const warning = await checkUserBatch(user);
    if (warning) warnings.push(warning);
  }
  return warnings;
}

export function getSeverityColor(level: WarningLevel): string {
  const colors: Record<WarningLevel, string> = {
    yellow: "#EAB308",
    orange: "#F97316",
    red: "#EF4444",
  };
  return colors[level];
}

export function getNextThreshold(level: WarningLevel): number {
  const next: Record<WarningLevel, number> = {
    yellow: BATCH_THRESHOLDS.ORANGE,
    orange: BATCH_THRESHOLDS.RED,
    red: 100,
  };
  return next[level];
}