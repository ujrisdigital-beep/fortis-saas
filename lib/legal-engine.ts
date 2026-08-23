// lib/legal-engine.ts
// Gambian Legal Compliance Engine — evaluates AI tool outputs against embedded laws
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface LegalContext {
  toolName: string;
  userId: string;
  content: string;
  contentType: "post" | "document" | "business_plan" | "marketplace_listing" | "user_message";
  metadata?: Record<string, unknown>;
}

export interface LegalViolation {
  law: string;
  rule: string;
  severity: "critical" | "high" | "medium" | "low";
  action: string;
  suggestion: string;
}

export interface LegalWarning {
  message: string;
  suggestedAction: string;
}

export interface LegalVerdict {
  compliant: boolean;
  violations: LegalViolation[];
  warnings: LegalWarning[];
  complianceStatus: "compliant" | "warning" | "violation";
}

function detectPII(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("national id") ||
    lower.includes("passport number") ||
    lower.includes("ssn") ||
    lower.includes("id number") ||
    /\b\d{6,12}\b/.test(text) // long numeric sequences that may be ID numbers
  );
}

function detectHarmfulContent(text: string): boolean {
  const lower = text.toLowerCase();
  const harmfulPatterns = [
    "kill ", "attack ", "bomb ", "terrorism", "incite", "hate speech",
    "racial slur", "ethnic cleansing", "massacre",
  ];
  return harmfulPatterns.some(p => lower.includes(p));
}

function detectThirdPartyContent(text: string): boolean {
  return (
    text.includes("©") ||
    text.toLowerCase().includes("all rights reserved") ||
    text.toLowerCase().includes("reproduced from") ||
    text.toLowerCase().includes("originally published by")
  );
}

function detectMisleadingClaims(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes("guaranteed returns") ||
    lower.includes("risk-free investment") ||
    lower.includes("100% profit") ||
    lower.includes("no risk") ||
    lower.includes("certified organic") // without verification
  );
}

async function evaluateRuleAgainstContent(
  rule: { ruleText: string; action: string; penalty: string | null; severity: string; law: { shortTitle: string } },
  context: LegalContext
): Promise<{ violation?: boolean; warning?: string; suggestion?: string }> {
  const content = context.content;

  if (rule.ruleText.toLowerCase().includes("personal data") && detectPII(content)) {
    return {
      violation: true,
      suggestion: "Remove personal identifiable information (PII). If required, obtain explicit consent under GDPA 2018 §8 before processing.",
    };
  }

  if (rule.ruleText.toLowerCase().includes("incite violence") && detectHarmfulContent(content)) {
    return {
      violation: true,
      suggestion: "Content detected that may incite violence or hatred. This violates the Cybercrime Act 2021 §15. Remove before publishing.",
    };
  }

  if (rule.ruleText.toLowerCase().includes("copyright") && detectThirdPartyContent(content)) {
    return {
      warning: "Third-party copyrighted content may be referenced. Ensure proper attribution per Copyright Act 2004.",
      suggestion: `Add citation: [Source Name] (${new Date().getFullYear()}). Retrieved from [URL]. Reproduced under fair use provisions of the Gambia Copyright Act 2004.`,
    };
  }

  if (rule.ruleText.toLowerCase().includes("false or misleading") && detectMisleadingClaims(content)) {
    return {
      violation: rule.severity === "critical" || rule.severity === "high",
      warning: "Potentially misleading claims detected. Review against Consumer Protection Act 2014 §8.",
      suggestion: "Remove or substantiate claims like 'guaranteed returns' or 'risk-free' to comply with Consumer Protection Act 2014.",
    };
  }

  return {};
}

export async function evaluateLegalCompliance(context: LegalContext): Promise<LegalVerdict> {
  const violations: LegalViolation[] = [];
  const warnings: LegalWarning[] = [];

  try {
    const rules = await prisma.legalRule.findMany({
      where: {
        isActive: true,
        OR: [
          { toolContext: context.toolName },
          { toolContext: "all" },
        ],
      },
      include: { law: { select: { shortTitle: true } } },
    });

    for (const rule of rules) {
      const evaluation = await evaluateRuleAgainstContent(rule, context);

      if (evaluation.violation) {
        violations.push({
          law: rule.law.shortTitle,
          rule: rule.ruleText,
          severity: rule.severity as LegalViolation["severity"],
          action: rule.action,
          suggestion: evaluation.suggestion ?? rule.action,
        });
      } else if (evaluation.warning) {
        warnings.push({
          message: evaluation.warning,
          suggestedAction: evaluation.suggestion ?? rule.action,
        });
      }
    }
  } catch {
    // If DB unavailable, fall back to local rule checks
    if (detectHarmfulContent(context.content)) {
      violations.push({
        law: "Cybercrime Act 2021",
        rule: "Generated content must not incite violence or hatred",
        severity: "critical",
        action: "Block generation",
        suggestion: "Remove content that incites violence or hatred (Cybercrime Act 2021, §15).",
      });
    }
    if (detectPII(context.content)) {
      warnings.push({
        message: "Potential PII detected in content",
        suggestedAction: "Review GDPA 2018 §8 consent requirements before processing personal data.",
      });
    }
  }

  const hasCritical = violations.some(v => v.severity === "critical");
  const complianceStatus = violations.length > 0
    ? (hasCritical ? "violation" : "warning")
    : "compliant";

  // Log to DB (non-blocking)
  prisma.legalComplianceLog.create({
    data: {
      toolName: context.toolName,
      userId: context.userId,
      query: context.content.slice(0, 500),
      rulesTriggered: violations as unknown as never,
      complianceStatus,
    },
  }).catch(() => { /* non-blocking */ });

  return {
    compliant: !hasCritical,
    violations,
    warnings,
    complianceStatus,
  };
}
