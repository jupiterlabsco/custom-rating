'use client';

import { useEffect, useState } from 'react';

interface AverageRatingProps {
  serviceProviderId: string;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  className?: string;
}

interface RatingData {
  average: number;
  count: number;
}

export default function AverageRating({ 
  serviceProviderId, 
  size = 'medium', 
  showCount = true,
  className = ''
}: AverageRatingProps) {
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  useEffect(() => {
    const fetchRatingData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/ratings/average?serviceProviderId=${serviceProviderId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rating data');
        }
        
        const data = await response.json();
        setRatingData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setRatingData(null);
      } finally {
        setLoading(false);
      }
    };

    if (serviceProviderId) {
      fetchRatingData();
    }
  }, [serviceProviderId]);

  if (loading) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <div className="animate-pulse flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className={`${sizeClasses[size]} bg-gray-200 rounded`}
            />
          ))}
        </div>
        <span className={`text-gray-400 ${textSizeClasses[size]}`}>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 ${textSizeClasses[size]} ${className}`}>
        Error loading rating
      </div>
    );
  }

  if (!ratingData || ratingData.count === 0) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            fill="#e5e7eb"
            viewBox="0 0 20 20"
            className={sizeClasses[size]}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className={`text-gray-500 ${textSizeClasses[size]} ml-1`}>
          No ratings yet
        </span>
      </div>
    );
  }

  const { average, count } = ratingData;
  const roundedAverage = Math.round(average);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            fill={star <= roundedAverage ? '#fbbf24' : '#e5e7eb'}
            viewBox="0 0 20 20"
            className={sizeClasses[size]}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <span className={`text-gray-700 ${textSizeClasses[size]} ml-1`}>
        {average.toFixed(1)}
      </span>
      
      {showCount && (
        <span className={`text-gray-500 ${textSizeClasses[size]}`}>
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}
    </div>
  );
}