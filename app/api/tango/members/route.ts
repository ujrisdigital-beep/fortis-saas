// app/api/tango/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TANGO_MEMBERS } from '@/data/tango-members';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase() ?? '';
  const region = searchParams.get('region') ?? '';
  const sector = searchParams.get('sector') ?? '';

  let results = TANGO_MEMBERS;
  if (search) results = results.filter((m) => m.name.toLowerCase().includes(search) || m.description.toLowerCase().includes(search));
  if (region) results = results.filter((m) => m.region.toLowerCase() === region.toLowerCase());
  if (sector) results = results.filter((m) => m.sectors.some((s) => s.toLowerCase().includes(sector.toLowerCase())));

  return NextResponse.json({ total: results.length, members: results });
}
