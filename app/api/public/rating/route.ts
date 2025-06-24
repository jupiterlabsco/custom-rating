import { NextRequest, NextResponse } from 'next/server';
import { getAverageRating, getRatings } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const serviceProviderId = searchParams.get('serviceProviderId');
    const includeRecentRatings = searchParams.get('includeRecentRatings') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!serviceProviderId) {
      return NextResponse.json(
        { 
          error: 'serviceProviderId parameter is required',
          usage: 'GET /api/public/rating?serviceProviderId=your-id&includeRecentRatings=true&limit=10'
        },
        { status: 400 }
      );
    }

    // Get average rating and count
    const averageData = await getAverageRating(serviceProviderId);
    
    const response: any = {
      serviceProviderId,
      averageRating: averageData.average,
      totalRatings: averageData.count,
      stars: {
        full: Math.floor(averageData.average),
        partial: averageData.average % 1,
        empty: 5 - Math.ceil(averageData.average)
      }
    };

    // Optionally include recent ratings
    if (includeRecentRatings && averageData.count > 0) {
      const recentRatings = await getRatings(serviceProviderId, Math.min(limit, 50));
      response.recentRatings = recentRatings.map(rating => ({
        rating: rating.rating,
        createdAt: rating.created_at
      }));
    }

    // Add CORS headers for public API
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    return NextResponse.json(response, { 
      status: 200,
      headers 
    });

  } catch (error) {
    console.error('Error fetching rating data:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        serviceProviderId: null,
        averageRating: 0,
        totalRatings: 0
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}