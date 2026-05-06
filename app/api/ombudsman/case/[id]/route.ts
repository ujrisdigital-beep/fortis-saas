import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: { id: string };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    const caseData = await prisma.ombudsmanCase.findFirst({
      where: {
        OR: [{ caseNumber: id }, { id }],
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // For anonymous cases, don't reveal complainant identity
    let safeCase = { ...caseData };

    if (caseData.isAnonymous) {
      safeCase = {
        ...caseData,
        complainantName: null,
        complainantPhone: null,
        complainantEmail: null,
      };
    }

    return NextResponse.json(safeCase);
  } catch (error) {
    console.error('Error fetching case:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case details' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;
    const updates = await request.json();

    // Find the case first
    const existingCase = await prisma.ombudsmanCase.findFirst({
      where: {
        OR: [{ caseNumber: id }, { id }],
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Create audit log entry for this update
    const auditEntry = {
      action: 'UPDATED',
      timestamp: new Date().toISOString(),
      performedBy: updates.performedBy || 'investigator',
      details: updates,
    };

    // Update the case
    const updated = await prisma.ombudsmanCase.update({
      where: { id: existingCase.id },
      data: {
        ...updates,
        auditLog: {
          push: auditEntry,
        } as any,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating case:', error);
    return NextResponse.json(
      { error: 'Failed to update case' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = params;

    const existingCase = await prisma.ombudsmanCase.findFirst({
      where: {
        OR: [{ caseNumber: id }, { id }],
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }

    // Soft delete - just change status to CLOSED
    await prisma.ombudsmanCase.update({
      where: { id: existingCase.id },
      data: {
        status: 'CLOSED',
        auditLog: {
          push: {
            action: 'CLOSED',
            timestamp: new Date().toISOString(),
            performedBy: 'system',
            details: { reason: 'Admin deletion' },
          },
        } as any,
      },
    });

    return NextResponse.json({ success: true, message: 'Case closed' });
  } catch (error) {
    console.error('Error deleting case:', error);
    return NextResponse.json(
      { error: 'Failed to delete case' },
      { status: 500 }
    );
  }
}
