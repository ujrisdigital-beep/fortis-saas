// Legal Hub — Gambia Labour Act 2007 & Ombudsman Act Compliance

export interface RecommendationParams {
  complaintText: string;
  mdaName: string;
  mdaId: string;
  ujrisAnalysis: string | null;
  redFlags: any;
  caseNumber: string;
}

export interface LegalReference {
  act: string;
  section: string;
  description: string;
}

// Gambia Labour Act 2007 key provisions
const LABOUR_ACT_REFERENCES: LegalReference[] = [
  { act: 'Labour Act 2007', section: '65', description: 'Notice of termination required' },
  { act: 'Labour Act 2007', section: '66', description: 'Severance pay entitlement' },
  { act: 'Labour Act 2007', section: '67', description: 'Summary dismissal only for gross misconduct' },
  { act: 'Labour Act 2007', section: '68', description: 'Right to be heard before dismissal' },
  { act: 'Labour Act 2007', section: '70', description: 'Certificate of service upon termination' },
  { act: 'Labour Act 2007', section: '80', description: 'Payment of wages on time' },
  { act: 'Labour Act 2007', section: '81', description: 'Deductions from wages prohibited except as provided' },
  { act: 'Ombudsman Act', section: '8', description: 'Powers of investigation' },
  { act: 'Ombudsman Act', section: '12', description: 'Recommendations and reports' },
  { act: 'Constitution 1997', section: '24', description: 'Right to fair hearing' },
  { act: 'Constitution 1997', section: '28', description: 'Right to work and fair labour practices' },
];

export async function generateRecommendation(params: RecommendationParams): Promise<string> {
  const { complaintText, mdaName, mdaId, ujrisAnalysis, redFlags, caseNumber } = params;

  const today = new Date();
  const deadline = new Date();
  deadline.setDate(today.getDate() + 30);

  // Identify relevant legal provisions based on complaint
  const relevantLaws = identifyRelevantLaws(complaintText, redFlags);

  let recommendation = `╔══════════════════════════════════════════════════════════════════════╗
║              OFFICE OF THE OMBUDSMAN — THE GAMBIA                   ║
║                    RECOMMENDATION LETTER                            ║
╚══════════════════════════════════════════════════════════════════════╝

Case Reference: ${caseNumber}
Date: ${today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
To: Permanent Secretary, ${mdaName}
From: The Ombudsman
Subject: COMPLAINT OF ADMINISTRATIVE INJUSTICE

────────────────────────────────────────────────────────────────────────

1. EXECUTIVE SUMMARY

The Office of the Ombudsman has received and investigated a complaint against
${mdaName} (${mdaId}) regarding alleged administrative injustice.

COMPLAINT SUMMARY:
${complaintText.substring(0, 600)}${complaintText.length > 600 ? '...' : ''}

`;

  // Add UJRIS findings if available
  if (ujrisAnalysis) {
    recommendation += `
────────────────────────────────────────────────────────────────────────

2. FORENSIC ANALYSIS (UJRIS FINDINGS)

${ujrisAnalysis}

`;
  }

  // Add red flags identified
  if (redFlags && redFlags.length > 0) {
    recommendation += `
KEY ISSUES IDENTIFIED:
`;
    redFlags.forEach((flag: any, idx: number) => {
      recommendation += `   ${idx + 1}. ${flag.type} (${flag.severity} risk)
      ${flag.description}
`;
    });
    recommendation += `\n`;
  }

  // Add relevant legal provisions
  recommendation += `
────────────────────────────────────────────────────────────────────────

3. LEGAL ANALYSIS & APPLICABLE LAW

Based on the complaint and our investigation, the following legal provisions
are relevant to this matter:

`;
  relevantLaws.forEach((law, idx) => {
    recommendation += `   ${idx + 1}. ${law.act}, Section ${law.section}
      ${law.description}

`;
  });

  recommendation += `
────────────────────────────────────────────────────────────────────────

4. FINDINGS

Based on our investigation and applicable law, we find that:

   a) The complainant has prima facie grounds for this complaint;

   b) The procedures followed by ${mdaName} appear to be inconsistent
      with the requirements of the Labour Act 2007 and natural justice;

   c) The complainant was not afforded adequate opportunity to be heard
      before adverse action was taken;

   d) There is evidence of procedural irregularity and/or administrative
      injustice as defined under the Ombudsman Act.

────────────────────────────────────────────────────────────────────────

5. RECOMMENDATIONS

Pursuant to Section 12 of the Ombudsman Act, the Office of the Ombudsman
hereby recommends the following:

   1. IMMEDIATE REVIEW
      ${mdaName} shall review the matter and all related documentation
      within 14 days of receipt of this recommendation.

   2. CORRECTIVE ACTION
      If the complaint is substantiated, ${mdaName} shall:
      a) Rectify the procedural irregularities identified;
      b) Provide appropriate remedy to the complainant;
      c) Ensure compliance with the Labour Act 2007.

   3. WRITTEN RESPONSE
      ${mdaName} shall provide a comprehensive written response to this
      Office within ${deadline.toLocaleDateString('en-GB')} (30 days).

   4. IMPLEMENTATION REPORT
      A report on actions taken shall be submitted within 45 days,
      including evidence of compliance.

────────────────────────────────────────────────────────────────────────

6. COMPLIANCE & ESCALATION

   • This recommendation is issued under the authority of the Ombudsman Act
   • Failure to respond within 30 days will result in escalation to:
     - The Minister responsible for ${mdaName}
     - Public Accounts Committee of the National Assembly
     - Attorney General's Office

   • Non-compliance may result in:
     - Adverse report to the National Assembly
     - Judicial review proceedings
     - Public disclosure of non-compliance

────────────────────────────────────────────────────────────────────────

CONCLUSION

The Office of the Ombudsman remains committed to ensuring fairness,
transparency, and accountability in public administration. We look forward
to your cooperation in resolving this matter expeditiously.

Yours in public service,

_________________________
THE OMBUDSMAN
Office of the Ombudsman
The Gambia

────────────────────────────────────────────────────────────────────────

COPIES TO:
- Minister responsible for ${mdaName}
- Secretary to the Cabinet
- Public Accounts Committee, National Assembly
- Complainant (via secure channel)

────────────────────────────────────────────────────────────────────────
This document is issued under the seal of the Office of the Ombudsman.
Document ID: OMB-REC-${caseNumber}
Generated: ${today.toISOString()}
╚══════════════════════════════════════════════════════════════════════╝
`;

  return recommendation;
}

function identifyRelevantLaws(complaintText: string, redFlags: any): LegalReference[] {
  const relevant: LegalReference[] = [];
  const text = complaintText.toLowerCase();

  // Check for dismissal-related keywords
  if (text.match(/dismiss|fired|terminat|sack/)) {
    relevant.push(
      LABOUR_ACT_REFERENCES.find(l => l.section === '65')!,
      LABOUR_ACT_REFERENCES.find(l => l.section === '67')!,
      LABOUR_ACT_REFERENCES.find(l => l.section === '68')!
    );
  }

  // Check for wage-related keywords
  if (text.match(/unpaid|salary|wage|payment|delay/)) {
    relevant.push(
      LABOUR_ACT_REFERENCES.find(l => l.section === '80')!,
      LABOUR_ACT_REFERENCES.find(l => l.section === '81')!
    );
  }

  // Check for hearing/fair process keywords
  if (text.match(/hear|appeal|respond|opportunity|fair/)) {
    relevant.push(
      LABOUR_ACT_REFERENCES.find(l => l.section === '68')!,
      LABOUR_ACT_REFERENCES.find(l => l.act === 'Constitution 1997' && l.section === '24')!
    );
  }

  // Always include Ombudsman Act provisions
  relevant.push(
    LABOUR_ACT_REFERENCES.find(l => l.section === '8')!,
    LABOUR_ACT_REFERENCES.find(l => l.section === '12')!
  );

  // Remove duplicates
  return relevant.filter((law, index, self) =>
    index === self.findIndex(l => l.section === law.section && l.act === law.act)
  );
}
