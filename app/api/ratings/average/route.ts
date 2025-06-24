import { NextRequest, NextResponse } from 'next/server';
import { getAverageRating } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const serviceProviderId = searchParams.get('serviceProviderId');

    if (!serviceProviderId) {
      return NextResponse.json(
        { error: 'Service provider ID is required' },
        { status: 400 }
      );
    }

    const ratingData = await getAverageRating(serviceProviderId);

    return NextResponse.json(ratingData);
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}