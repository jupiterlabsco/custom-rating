import { NextRequest, NextResponse } from 'next/server';
import { getRatings } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const serviceProviderId = searchParams.get('serviceProviderId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!serviceProviderId) {
      return NextResponse.json(
        { 
          error: 'serviceProviderId parameter is required',
          usage: 'GET /api/public/ratings?serviceProviderId=your-id&limit=50&offset=0'
        },
        { status: 400 }
      );
    }

    if (limit > 100) {
      return NextResponse.json(
        { error: 'Limit cannot exceed 100 ratings per request' },
        { status: 400 }
      );
    }

    // Get ratings with pagination
    const ratings = await getRatings(serviceProviderId, limit);
    
    const response = {
      serviceProviderId,
      ratings: ratings.map(rating => ({
        id: rating.id,
        rating: rating.rating,
        createdAt: rating.created_at,
        // Don't expose IP address or user agent for privacy
      })),
      pagination: {
        limit,
        offset,
        total: ratings.length
      }
    };

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
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ratings: []
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