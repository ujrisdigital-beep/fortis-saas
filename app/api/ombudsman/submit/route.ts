import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyDocumentWithUJRIS, UJRISRedFlag } from '@/lib/ombudsman/ujris';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      isAnonymous,
      complainantName,
      complainantPhone,
      complainantEmail,
      mdaId,
      mdaName,
      complaintText,
      complaintLanguage = 'en',
      evidenceUrls = [],
    } = body;

    // Validate required fields
    if (!mdaId || !mdaName || !complaintText) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: mdaId, mdaName, complaintText' },
        { status: 400 }
      );
    }

    // Generate case number: OMB-YYYY-XXXX
    const year = new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const count = await prisma.ombudsmanCase.count({
      where: { createdAt: { gte: startOfYear } },
    });
    const caseNumber = `OMB-${year}-${String(count + 1).padStart(4, '0')}`;

    // Run UJRIS verification on complaint text and evidence
    const ujrisResult = await verifyDocumentWithUJRIS(complaintText, evidenceUrls);

    // Create audit log entry
    const auditEntry = {
      action: 'CREATED',
      timestamp: new Date().toISOString(),
      performedBy: isAnonymous ? 'anonymous' : (complainantName || 'citizen'),
      details: { mdaId, mdaName, complaintLanguage },
    };

    // Create the case
    const newCase = await prisma.ombudsmanCase.create({
      data: {
        caseNumber,
        isAnonymous,
        complainantName: isAnonymous ? null : complainantName || null,
        complainantPhone: isAnonymous ? null : complainantPhone || null,
        complainantEmail: isAnonymous ? null : complainantEmail || null,
        mdaId,
        mdaName,
        complaintText,
        complaintLanguage,
        evidenceUrls,
        ujrisIntegrityScore: ujrisResult.score,
        ujrisRedFlags: JSON.stringify(ujrisResult.redFlags),
        ujrisAnalysis: ujrisResult.analysis,
        status: 'RECEIVED',
        auditLog: JSON.stringify([auditEntry]),
      },
    });

    // Send SMS notification to complainant (if not anonymous)
    if (!isAnonymous && complainantPhone) {
      await sendSMSNotification(complainantPhone, caseNumber);
    }

    return NextResponse.json({
      success: true,
      caseNumber,
      trackingUrl: `/ombudsman/track/${caseNumber}`,
      integrityScore: ujrisResult.score,
      redFlags: ujrisResult.redFlags,
      caseId: newCase.id,
    });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit complaint. Please try again.' },
      { status: 500 }
    );
  }
}

async function sendSMSNotification(phone: string, caseNumber: string) {
  try {
    // Integrate with your SMS provider (Twilio, Africa's Talking, etc.)
    const message = `FortisOS Ombudsman: Your complaint ${caseNumber} has been received. Track status at: https://fortisos.cloud/ombudsman/track/${caseNumber}`;

    // Example with Africa's Talking API (uncomment and configure)
    /*
    const axios = require('axios');
    await axios.post('https://api.africastalking.com/version1/messaging', {
      username: process.env.SMS_USERNAME,
      message,
      to: phone,
    }, {
      headers: {
        'apiKey': process.env.SMS_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    */

    console.log(`SMS to ${phone}: ${message}`);
  } catch (error) {
    console.error('SMS sending failed:', error);
    // Don't fail the whole request if SMS fails
  }
}
