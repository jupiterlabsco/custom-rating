'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StarRating from '@/components/StarRating';
import AverageRating from '@/components/AverageRating';

function EmbedContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>;
  }

  const serviceProviderId = searchParams.get('serviceProviderId');
  const type = searchParams.get('type') || 'both'; // 'rating', 'average', or 'both'
  const size = (searchParams.get('size') as 'small' | 'medium' | 'large') || 'medium';
  const showCount = searchParams.get('showCount') !== 'false';

  if (!serviceProviderId) {
    return (
      <div className="p-4 text-center text-red-500 text-sm">
        Error: serviceProviderId parameter is required
      </div>
    );
  }

  return (
    <div className="p-4 bg-white">
      {(type === 'average' || type === 'both') && (
        <div className="mb-3">
          <AverageRating 
            serviceProviderId={serviceProviderId} 
            size={size}
            showCount={showCount}
          />
        </div>
      )}
      
      {(type === 'rating' || type === 'both') && (
        <div>
          <StarRating 
            serviceProviderId={serviceProviderId} 
            size={size}
            onRatingSubmit={() => {
              // Refresh the parent window if possible
              if (typeof window !== 'undefined' && window.parent) {
                window.parent.postMessage('rating-submitted', '*');
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-gray-500 text-sm">Loading...</div>}>
      <EmbedContent />
    </Suspense>
  );
}