// prisma/seed-laws.js
// Seeds Gambian laws and compliance rules into the database
// Run with: node prisma/seed-laws.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GAMBIAN_LAWS = [
  {
    title: "Gambia Data Protection Act 2018",
    shortTitle: "GDPA 2018",
    actNumber: "Act No. 3 of 2018",
    year: 2018,
    category: "Data Protection",
    summary: "Regulates the processing of personal data, establishes rights for data subjects, and creates enforcement mechanisms under the supervision of PURA.",
    keySections: [
      { section: "2", title: "Interpretation", summary: "Definitions of personal data, processing, and consent" },
      { section: "8", title: "Conditions for Processing", summary: "Lawful bases for data processing including consent and legitimate interest" },
      { section: "12", title: "Data Subject Rights", summary: "Rights of access, rectification, erasure, and data portability" },
      { section: "22", title: "Data Security", summary: "Technical and organisational security measures" },
      { section: "28", title: "Data Breach Notification", summary: "72-hour notification requirement to PURA and affected individuals" },
      { section: "35", title: "Offences and Penalties", summary: "Criminal and civil penalties for violations" }
    ],
    keywords: ["data", "privacy", "protection", "personal data", "consent", "GDPA", "PII", "PURA", "breach"],
    rules: [
      {
        ruleText: "Personal data cannot be processed without explicit consent or other lawful basis under GDPA 2018 §8",
        condition: "personal_data_detected AND no_consent",
        action: "Request user consent before processing personal data",
        penalty: "Fine up to GMD 500,000",
        toolContext: "all",
        severity: "critical"
      },
      {
        ruleText: "Data breach must be reported to PURA within 72 hours of discovery",
        condition: "data_breach_detected",
        action: "Trigger breach notification workflow immediately",
        penalty: "Fine up to GMD 250,000",
        toolContext: "all",
        severity: "critical"
      }
    ]
  },
  {
    title: "Gambia Copyright Act 2004",
    shortTitle: "Copyright Act 2004",
    actNumber: "Act No. 8 of 2004",
    year: 2004,
    category: "Intellectual Property",
    summary: "Protects original literary, artistic, musical, and scientific works. Provides for fair use exceptions for research, education, and criticism.",
    keySections: [
      { section: "5", title: "Protected Works", summary: "Categories of copyrightable works" },
      { section: "12", title: "Economic Rights", summary: "Exclusive rights including reproduction, distribution, and adaptation" },
      { section: "18", title: "Moral Rights", summary: "Rights of attribution and integrity" },
      { section: "25", title: "Fair Use", summary: "Exceptions for research, education, and criticism" },
      { section: "48", title: "Infringement Remedies", summary: "Civil damages and criminal sanctions for infringement" }
    ],
    keywords: ["copyright", "intellectual property", "fair use", "attribution", "infringement", "reproduction"],
    rules: [
      {
        ruleText: "Generated content must not reproduce copyrighted works without licence or fair use justification",
        condition: "content_generation",
        action: "Review generated content against copyright database before publishing",
        penalty: "Civil damages plus criminal prosecution",
        toolContext: "ikenga",
        severity: "high"
      },
      {
        ruleText: "Third-party content reproduced under fair use must include proper attribution and citation",
        condition: "third_party_content_detected",
        action: "Add attribution: Source, year, title, URL. Reproduced under Copyright Act 2004 fair use.",
        penalty: "Moral rights violation — civil liability",
        toolContext: "ask-ujris,ikenga",
        severity: "medium"
      }
    ]
  },
  {
    title: "Cybercrime Act 2021",
    shortTitle: "Cybercrime Act 2021",
    actNumber: "Act No. 12 of 2021",
    year: 2021,
    category: "Cybercrime",
    summary: "Criminalises computer fraud, unauthorised access, identity theft, cyber harassment, and the distribution of prohibited online content.",
    keySections: [
      { section: "3", title: "Unauthorised Access", summary: "Illegal access to computer systems" },
      { section: "6", title: "Identity Theft", summary: "Misrepresentation and impersonation online" },
      { section: "11", title: "Cyber Harassment", summary: "Online harassment and intimidation" },
      { section: "15", title: "Prohibited Content", summary: "Content that incites violence, hatred, or discrimination" },
      { section: "20", title: "Computer Fraud", summary: "Fraudulent manipulation of computer systems" }
    ],
    keywords: ["cybercrime", "hacking", "fraud", "identity theft", "harassment", "prohibited content", "incitement"],
    rules: [
      {
        ruleText: "Generated content must not incite violence, hatred, or discrimination against any person or group",
        condition: "harmful_content_detected",
        action: "Block content generation and flag for review",
        penalty: "Criminal prosecution — up to 5 years imprisonment and/or GMD 1,000,000 fine",
        toolContext: "ikenga,ask-ujris",
        severity: "critical"
      },
      {
        ruleText: "Content must not facilitate identity theft, impersonation, or fraudulent misrepresentation",
        condition: "impersonation_detected",
        action: "Block content generation",
        penalty: "Criminal prosecution — up to 7 years imprisonment",
        toolContext: "all",
        severity: "critical"
      }
    ]
  },
  {
    title: "Consumer Protection Act 2014",
    shortTitle: "Consumer Protection Act 2014",
    actNumber: "Act No. 1 of 2014",
    year: 2014,
    category: "Consumer",
    summary: "Protects consumer rights in commercial transactions, prohibits unfair trade practices, and establishes dispute resolution mechanisms.",
    keySections: [
      { section: "4", title: "Right to Information", summary: "Consumers right to accurate product and service information" },
      { section: "8", title: "Unfair Trade Practices", summary: "Prohibited deceptive and unconscionable practices" },
      { section: "12", title: "Implied Guarantees", summary: "Implied warranties of fitness for purpose" },
      { section: "18", title: "Dispute Resolution", summary: "Consumer complaint and resolution mechanisms" }
    ],
    keywords: ["consumer", "consumer rights", "unfair trade", "guarantee", "warranty", "refund", "dispute"],
    rules: [
      {
        ruleText: "Marketplace listings must not contain false, deceptive, or misleading product information",
        condition: "misleading_claims_detected",
        action: "Flag listing for review before publication",
        penalty: "Fine up to GMD 100,000 per offence",
        toolContext: "marketplace",
        severity: "high"
      },
      {
        ruleText: "Buyers have the right to a cooling-off period and must be informed of refund/return policy",
        condition: "ecommerce_transaction",
        action: "Display clear cancellation and return policy before checkout",
        penalty: "Civil liability for undisclosed terms",
        toolContext: "marketplace",
        severity: "medium"
      }
    ]
  },
  {
    title: "Electronic Transactions Act 2019",
    shortTitle: "ETA 2019",
    actNumber: "Act No. 6 of 2019",
    year: 2019,
    category: "Commerce",
    summary: "Provides legal framework for electronic transactions, digital signatures, and e-commerce in The Gambia.",
    keySections: [
      { section: "5", title: "Legal Recognition", summary: "Electronic records and signatures have full legal effect" },
      { section: "10", title: "Digital Signatures", summary: "Technical requirements for valid electronic signatures" },
      { section: "15", title: "E-Contracts", summary: "Formation and validity of contracts concluded electronically" },
      { section: "22", title: "E-Commerce Disclosure", summary: "Information merchants must provide online" }
    ],
    keywords: ["e-commerce", "digital signature", "electronic contract", "electronic transaction", "online commerce"],
    rules: [
      {
        ruleText: "Electronic contracts formed on the platform must meet ETA 2019 validity requirements",
        condition: "contract_formation",
        action: "Ensure offer, acceptance, and consideration are clearly documented electronically",
        penalty: "Contract may be unenforceable",
        toolContext: "marketplace",
        severity: "medium"
      }
    ]
  }
];

async function seedLaws() {
  console.log('🌱 Seeding Gambian laws into database...\n');

  for (const lawData of GAMBIAN_LAWS) {
    const { rules, ...lawFields } = lawData;

    const law = await prisma.gambianLaw.upsert({
      where: { shortTitle: lawFields.shortTitle },
      update: {
        ...lawFields,
        keySections: lawFields.keySections,
        keywords: lawFields.keywords,
      },
      create: {
        ...lawFields,
        keySections: lawFields.keySections,
        keywords: lawFields.keywords,
      },
    });

    let ruleCount = 0;
    for (const rule of rules) {
      await prisma.legalRule.upsert({
        where: {
          id: `${lawFields.shortTitle.replace(/\s/g, '_')}_rule_${ruleCount}`,
        },
        update: { ...rule, lawId: law.id },
        create: {
          id: `${lawFields.shortTitle.replace(/\s/g, '_')}_rule_${ruleCount}`,
          ...rule,
          lawId: law.id,
        },
      });
      ruleCount++;
    }

    console.log(`✅ ${law.shortTitle} — ${ruleCount} rules seeded`);
  }

  const totalLaws = await prisma.gambianLaw.count();
  const totalRules = await prisma.legalRule.count();
  console.log(`\n🏛️  Seeding complete: ${totalLaws} laws, ${totalRules} compliance rules embedded.`);
}

seedLaws()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
