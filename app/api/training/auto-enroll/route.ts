// app/api/training/auto-enroll/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireApiAccess } from '@/lib/core/api-guard';

const prisma = new PrismaClient();

const INDUSTRY_PATTERNS: Record<string, { domains: string[]; keywords: string[]; courses: string[]; simulation: string }> = {
  banking_finance: {
    domains: ['@cbg.gm','@bankofgambia.gm','@trustbank.gm','@agib.gm','@ecobank.gm','@gtbank.gm','@accessbank.gm','@bicig.gm','@vistabank.gm','@um.gm','@relbank.gm'],
    keywords: ['bank','finance','financial','microfinance','credit','loan','investment','treasury'],
    courses: ['Digital Payments & Mobile Money','Cybersecurity for Financial Institutions','Data Protection & GDPA Compliance','Fraud Detection & Prevention','AI Tools for Banking Operations'],
    simulation: 'banking_finance',
  },
  telecommunications: {
    domains: ['@africell.gm','@qcell.gm','@comium.gm','@gamcel.gm','@pura.gm'],
    keywords: ['telecom','mobile','network','broadband','fiber'],
    courses: ['Digital Infrastructure Management','Telecom Regulatory Compliance','Mobile Money Operations','Network Security Fundamentals','Customer Data Protection'],
    simulation: 'telecommunications',
  },
  agriculture: {
    domains: ['@moa.gm','@naa.gm'],
    keywords: ['agriculture','farming','agribusiness','crops','livestock'],
    courses: ['Smart Agriculture & AgriTech','Post-Harvest Loss Reduction','Digital Market Access','Climate Resilient Farming','Agricultural Data Analytics'],
    simulation: 'agriculture',
  },
  energy: {
    domains: ['@nawec.gm','@moea.gm'],
    keywords: ['energy','power','electricity','solar','renewable','grid'],
    courses: ['Solar Energy Fundamentals','Smart Grid Management','Energy Efficiency & Auditing','Renewable Energy Policy','Utility Data Analytics'],
    simulation: 'energy',
  },
  health: {
    domains: ['@moh.gm','@efsthomson.gm'],
    keywords: ['health','medical','hospital','clinic','healthcare','nurse','doctor'],
    courses: ['Health Informatics & Telemedicine','Healthcare Data Protection','Digital Health Records Management','Public Health Analytics','AI in Healthcare'],
    simulation: 'health',
  },
  government: {
    domains: ['@gov.gm','@opm.gm','@mofea.gm','@moi.gm','@mobse.gm'],
    keywords: ['government','civil service','public service','ministry','policy'],
    courses: ['E-Government & Digital Services','Public Sector Data Management','Government Compliance & Audit','Digital Transformation Leadership','Open Data & Transparency'],
    simulation: 'government',
  },
  education: {
    domains: ['@utg.edu.gm','@gttc.edu.gm','@edu.gm'],
    keywords: ['education','school','university','college','teaching'],
    courses: ['Digital Learning Platforms','EdTech Tools for Educators','Student Data Privacy','Online Course Design','Educational Analytics'],
    simulation: 'education',
  },
  sme_entrepreneurship: {
    domains: [],
    keywords: ['business','entrepreneur','startup','sme','merchant'],
    courses: ['Business Digitalisation (UJU Cycle)','Social Media Marketing (IKENGA)','E-Commerce & Online Selling','Financial Management for SMEs','Digital Compliance & Legal Basics'],
    simulation: 'sme_entrepreneurship',
  },
  general: {
    domains: [],
    keywords: [],
    courses: ['Digital Literacy Fundamentals','Internet Safety & Cybersecurity','Introduction to AI Tools','Data Analysis for Beginners','Professional Communication Online'],
    simulation: 'general',
  },
};

const SECTOR_MAP: Record<string, string> = {
  banking_finance: 'fintech', telecommunications: 'digital', agriculture: 'agriculture',
  energy: 'energy', health: 'health', government: 'digital', education: 'digital',
  sme_entrepreneurship: 'digital', general: 'digital',
};

export async function POST(req: NextRequest) {
  try {
    const access = await requireApiAccess('training', 'write');
    if (!access.ok) return access.response;
    const body = await req.json();
    const { industry: bodyIndustry, jobRole, department } = body;
    const sessionUser = await prisma.user.findUnique({ where: { id: access.session.userId } });
    const userEmail = sessionUser?.email ?? '';

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized — login required' }, { status: 401 });
    }

    // Detect industry from email domain
    let detectedIndustry = 'general';
    let confidence = 0;

    for (const [key, cfg] of Object.entries(INDUSTRY_PATTERNS)) {
      if (cfg.domains.some((d) => userEmail.toLowerCase().endsWith(d))) {
        detectedIndustry = key; confidence = 95; break;
      }
    }
    if (confidence === 0 && bodyIndustry) {
      const match = Object.entries(INDUSTRY_PATTERNS).find(([, cfg]) =>
        cfg.keywords.some((kw) => bodyIndustry.toLowerCase().includes(kw))
      );
      if (match) { detectedIndustry = match[0]; confidence = 70; }
    }

    const cfg = INDUSTRY_PATTERNS[detectedIndustry];

    // Update user profile
    await prisma.user.update({
      where: { email: userEmail },
      data: { industry: detectedIndustry, jobRole: jobRole ?? null, department: department ?? null },
    }).catch(() => null); // Non-fatal if user doesn't exist yet

    // Enroll in courses
    const enrolled: Array<{ courseId: string; title: string; enrollmentId: string }> = [];
    for (const title of cfg.courses) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let program = await prisma.trainingProgram.findFirst({ where: { slug } });
      if (!program) {
        program = await prisma.trainingProgram.create({
          data: {
            title,
            slug,
            description: `${title} — tailored for ${detectedIndustry.replace('_', ' ')} professionals`,
            sector: SECTOR_MAP[detectedIndustry] ?? 'digital',
            level: 'beginner',
            durationWeeks: 4,
            modulesJson: [],
            aiGenerated: true,
            status: 'PUBLISHED',
          },
        });
      }

      // Check for existing enrollment
      const user = await prisma.user.findUnique({ where: { email: userEmail }, select: { id: true } });
      if (!user) continue;

      const existing = await prisma.enrollment.findUnique({ where: { userId_programId: { userId: user.id, programId: program.id } } });
      if (!existing) {
        const enrollment = await prisma.enrollment.create({
          data: { userId: user.id, programId: program.id, status: 'ACTIVE', progress: 0 },
        });
        enrolled.push({ courseId: program.id, title: program.title, enrollmentId: enrollment.id });
      }
    }

    return NextResponse.json({
      success: true,
      detectedIndustry,
      confidence,
      enrolledCourses: enrolled,
      learningPath: {
        totalCourses: cfg.courses.length,
        simulationUrl: `/training/simulate/${cfg.simulation}`,
        recommendedOrder: cfg.courses,
      },
      nextSteps: {
        startLearning: '/training/my-learning',
        trySimulation: `/training/simulate/${cfg.simulation}`,
        message: `Enrolled in ${enrolled.length} new ${detectedIndustry.replace('_', ' ')} courses.`,
      },
    });
  } catch (err) {
    console.error('auto-enroll error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
