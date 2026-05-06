import { NextResponse } from 'next/server';
import { verifyDocumentWithUJRIS } from '@/lib/ombudsman/ujris';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, documentUrls = [] } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Complaint text is required' },
        { status: 400 }
      );
    }

    const result = await verifyDocumentWithUJRIS(text, documentUrls);

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('UJRIS verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
