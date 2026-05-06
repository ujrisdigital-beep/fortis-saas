import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/ombudsman/dashboard';

export async function GET() {
  try {
    const dashboardData = await getDashboardData();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Dashboard data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
