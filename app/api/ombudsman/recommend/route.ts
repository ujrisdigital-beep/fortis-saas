import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRecommendation } from '@/lib/ombudsman/legal';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { caseId, performedBy = 'investigator' } = body;

    if (!caseId) {
      return NextResponse.json(
        { error: 'caseId is required' },
        { status: 400 }
      );
    }

    const caseData = await prisma.ombudsmanCase.findFirst({
      where: {
        OR: [{ caseNumber: caseId }, { id: caseId }],
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    if (caseData.recommendationIssued) {
      return NextResponse.json(
        { error: 'Recommendation already issued for this case' },
        { status: 400 }
      );
    }

    // Generate recommendation using Legal Hub
    const recommendationText = await generateRecommendation({
      complaintText: caseData.complaintText,
      mdaName: caseData.mdaName,
      mdaId: caseData.mdaId,
      ujrisAnalysis: caseData.ujrisAnalysis,
      redFlags: caseData.ujrisRedFlags,
      caseNumber: caseData.caseNumber,
    });

    // Create recommendation record
    const recommendation = await prisma.ombudsmanRecommendation.create({
      data: {
        caseId: caseData.caseNumber,
        caseNumber: caseData.caseNumber,
        mdaId: caseData.mdaId,
        mdaName: caseData.mdaName,
        recommendationText,
        deadlineDays: 30,
      },
    });

    // Update case with recommendation info
    const updatedCase = await prisma.ombudsmanCase.update({
      where: { id: caseData.id },
      data: {
        recommendationIssued: true,
        recommendationText,
        recommendationDate: new Date(),
        status: 'INVESTIGATING',
        auditLog: {
          push: {
            action: 'RECOMMENDED',
            timestamp: new Date().toISOString(),
            performedBy,
            details: { recommendationId: recommendation.id },
          },
        } as any,
      },
    });

    return NextResponse.json({
      success: true,
      recommendation,
      caseNumber: caseData.caseNumber,
      case: updatedCase,
    });
  } catch (error) {
    console.error('Error generating recommendation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}
