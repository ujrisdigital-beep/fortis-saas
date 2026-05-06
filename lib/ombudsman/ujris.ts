// UJRIS Document Verification Engine
// Universal Justice & Rights Integrity Scanner

export interface UJRISRedFlag {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  clause?: string;
}

export interface UJRISResult {
  score: number;          // 0-100 integrity score
  redFlags: UJRISRedFlag[];
  analysis: string;
}

export async function verifyDocumentWithUJRIS(
  text: string,
  documentUrls: string[] = []
): Promise<UJRISResult> {
  // Initialize with default score
  let score = 50;
  const redFlags: UJRISRedFlag[] = [];
  let analysis = '';

  // Check for common fraud and violation indicators
  const redFlagPatterns = [
    {
      pattern: /forged|fake|alter|tampered/i,
      severity: 'high' as const,
      type: 'Forgery Indicator',
      desc: 'Document may have been altered or forged'
    },
    {
      pattern: /without notice|immediate dismissal|summary dismissal/i,
      severity: 'high' as const,
      type: 'Unlawful Dismissal',
      desc: 'Dismissal may violate Labour Act 2007 Section 65-67'
    },
    {
      pattern: /no reason given|no explanation|arbitrary/i,
      severity: 'medium' as const,
      type: 'Lack of Due Process',
      desc: 'No reason provided for adverse action - violates natural justice'
    },
    {
      pattern: /unpaid|salary withheld|payment delayed|wage theft/i,
      severity: 'high' as const,
      type: 'Wage Violation',
      desc: 'Potential breach of employment contract and Labour Act 2007'
    },
    {
      pattern: /threat|intimidat|harass|victimis/i,
      severity: 'high' as const,
      type: 'Coercion & Harassment',
      desc: 'Complainant may have been threatened or harassed'
    },
    {
      pattern: /signature missing|unsigned|no stamp|no seal/i,
      severity: 'medium' as const,
      type: 'Invalid Document',
      desc: 'Document lacks proper execution or authentication'
    },
    {
      pattern: /expired|outdated|invalid date|backdated/i,
      severity: 'low' as const,
      type: 'Outdated Reference',
      desc: 'Document references expired regulations or backdated'
    },
    {
      pattern: /discriminat|bias|favouritism|tribalism|nepotism/i,
      severity: 'high' as const,
      type: 'Discrimination',
      desc: 'Potential violation of equal opportunity provisions'
    },
    {
      pattern: /no hearing|denied appeal|no opportunity to respond/i,
      severity: 'high' as const,
      type: 'Denial of Fair Hearing',
      desc: 'Violates constitutional right to fair hearing'
    },
    {
      pattern: /corrupt|bribe|kickback|under table/i,
      severity: 'high' as const,
      type: 'Corruption Indicator',
      desc: 'Potential corruption or bribery involved'
    },
  ];

  // Apply pattern matching on complaint text
  for (const pattern of redFlagPatterns) {
    if (pattern.pattern.test(text)) {
      const match = text.match(pattern.pattern);
      redFlags.push({
        type: pattern.type,
        severity: pattern.severity,
        description: pattern.desc,
        clause: match ? match[0] : undefined,
      });

      // Reduce score based on severity
      if (pattern.severity === 'high') score -= 15;
      if (pattern.severity === 'medium') score -= 8;
      if (pattern.severity === 'low') score -= 3;
    }
  }

  // Check document URLs for additional analysis
  if (documentUrls && documentUrls.length > 0) {
    // In production, this would scan actual documents
    // For now, we note that documents were provided
    score += 5; // Slight boost for providing evidence
  }

  // Ensure score is within 0-100
  score = Math.max(0, Math.min(100, score));

  // Generate analysis summary
  if (redFlags.length === 0) {
    analysis = 'Document appears legitimate. No red flags detected. Complaint appears genuine and well-substantiated.';
    score = Math.max(score, 70); // Boost score if no red flags
  } else if (score >= 70) {
    analysis = `Document has minor issues: ${redFlags.map(f => f.type).join(', ')}. Recommend standard review process.`;
  } else if (score >= 40) {
    analysis = `Document has medium-risk issues: ${redFlags.map(f => f.type).join(', ')}. Further investigation recommended before action.`;
  } else {
    analysis = `Document has high-risk issues: ${redFlags.map(f => f.type).join(', ')}. Urgent investigation required. Potential for serious administrative injustice.`;
  }

  return { score, redFlags, analysis };
}
