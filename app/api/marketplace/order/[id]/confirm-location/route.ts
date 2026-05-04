// app/api/marketplace/order/[id]/confirm-location/route.ts
// POST: record buyer/seller consent. GET: validate token.
// GDPA 2018 compliant — no location data stored, consent only.
import { NextRequest, NextResponse } from 'next/server';
import { recordConsent, validateLocationToken, revokeConsent } from '@/lib/geolocation-guard';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const body = await req.json();
    const { party } = body as { party: 'buyer' | 'seller' };

    if (!party || !['buyer', 'seller'].includes(party)) {
      return NextResponse.json({ error: 'party must be "buyer" or "seller"' }, { status: 400 });
    }

    const { mutualConsent, token } = recordConsent(orderId, party);

    return NextResponse.json({
      orderId,
      party,
      consentRecorded: true,
      mutualConsent,
      token: mutualConsent ? token : null,
      message: mutualConsent
        ? 'Both parties have consented. Location sharing is now active for 24 hours.'
        : `${party === 'buyer' ? 'Seller' : 'Buyer'} consent still pending. Location sharing will activate when both parties agree.`,
      gdpaNote: 'Consent recorded under GDPA 2018 / UK GDPR Article 6(1)(a). Revocable at any time.',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orderId = params.id;
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 });
  }

  const valid = validateLocationToken(orderId, token);
  if (!valid) {
    return NextResponse.json({ valid: false, error: 'Token invalid or expired' }, { status: 403 });
  }

  return NextResponse.json({ valid: true, orderId, message: 'Token valid — location sharing authorised' });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  revokeConsent(params.id);
  return NextResponse.json({ revoked: true, orderId: params.id, message: 'Location consent revoked successfully.' });
}
