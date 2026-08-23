import { NextRequest, NextResponse } from 'next/server'
import { analyzeText, calculateStrengthScore, generateWarnings, getCategorySummary } from '@/lib/ujris/gambia-anchor-detection'
import { runForensicAnalysis, getCaseStrengthScore, type ForensicContext } from '@/lib/ujris/forensic-patterns'
import { analyseCorrespondence } from '@/lib/ujris/email-monitor'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, claimType, incidentDate, forensicContext, emailBody } = body

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for analysis' },
        { status: 400 }
      )
    }

    const anchors = analyzeText(text)
    const strengthScore = calculateStrengthScore(anchors)
    const warnings = generateWarnings(anchors)
    const categorySummary = getCategorySummary(anchors)

    // 37-pattern forensic analysis (runs when structured context supplied, or from text-derived context)
    const ctx: ForensicContext = forensicContext || {
      incidents: incidentDate ? [{ incidentDate, reportDate: incidentDate, reportedTo: 'Employer', description: text, outcome: '' }] : [],
      documents: [],
      timeline: [],
      communications: [],
      evidenceItems: [],
      witnessStatements: [],
      financialRecords: [],
      emails: emailBody ? [{ from: '', to: '', date: '', subject: '', body: emailBody, readReceipt: false, hasAttachments: false }] : [],
      letters: [],
    }
    const forensicPatterns = runForensicAnalysis(ctx)
    const forensicAlerts = forensicPatterns.map(p => {
      const r = p.detect(ctx)
      return { ruleId: p.id, category: p.category, label: p.label, severity: r.severity || 'low', explanation: r.explanation, counterAction: r.counterAction }
    })
    const forensicStrength = getCaseStrengthScore(ctx)

    // Email correspondence analysis (if email text provided)
    const correspondenceAnalysis = emailBody ? analyseCorrespondence({ body: emailBody }) : null

    let deadlineResult: { claimType: string; statutoryDeadline: string; discretionaryDeadline: string; daysRemaining: number; status: string } | null = null
    if (claimType && incidentDate) {
      const incident = new Date(incidentDate)
      const statutoryDeadline = new Date(incident)
      statutoryDeadline.setDate(statutoryDeadline.getDate() + 30)
      const discretionaryDeadline = new Date(incident)
      discretionaryDeadline.setDate(discretionaryDeadline.getDate() + 90)
      const today = new Date()
      const daysRemaining = Math.ceil((statutoryDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      deadlineResult = {
        claimType,
        statutoryDeadline: statutoryDeadline.toISOString().split('T')[0],
        discretionaryDeadline: discretionaryDeadline.toISOString().split('T')[0],
        daysRemaining,
        status: daysRemaining < 0 ? 'expired' : daysRemaining <= 7 ? 'critical' : daysRemaining <= 14 ? 'warning' : 'valid'
      }
    }

    return NextResponse.json({
      success: true,
      analysis: {
        textLength: text.length,
        anchorDetected: anchors.length,
        strengthScore,
        severity: strengthScore >= 80 ? 'strong' : strengthScore >= 60 ? 'moderate' : 'weak',
        warnings,
        categorySummary,
        deadline: deadlineResult
      },
      benchmarkTargets: {
        legalAccuracy: 90,
        deadlinePrediction: 85,
        contradictionDetection: 88
      },
      processedAt: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    name: 'UJRIS Gambia Analyze API',
    version: '1.0',
    features: [
      'anchor-detection',
      'strength-scoring',
      'deadline-calculation',
      'category-summary'
    ],
    benchmark: {
      legalAccuracy: 90,
      deadlinePrediction: 85,
      contradictionDetection: 88,
      documentGeneration: 95
    },
    gambianLaw: {
      primaryAct: 'Labour Act 2007',
      court: 'Industrial Court Banjul',
      filingFee: 'D100',
      statutoryDeadline: '30 days',
      discretionaryDeadline: '90 days'
    }
  })
}