import { NextRequest, NextResponse } from 'next/server';
import { addRating } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceProviderId, rating } = body;

    if (!serviceProviderId || !rating) {
      return NextResponse.json(
        { error: 'Service provider ID and rating are required' },
        { status: 400 }
      );
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const ratingId = await addRating({
      service_provider_id: serviceProviderId,
      rating,
      ip_address: clientIP,
      user_agent: userAgent,
    });

    return NextResponse.json(
      { success: true, id: ratingId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}