'use client';

import { useState } from 'react';

interface StarRatingProps {
  serviceProviderId: string;
  initialRating?: number;
  readonly?: boolean;
  size?: 'small' | 'medium' | 'large';
  onRatingSubmit?: (rating: number) => void;
}

export default function StarRating({ 
  serviceProviderId, 
  initialRating = 0, 
  readonly = false, 
  size = 'medium',
  onRatingSubmit 
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const handleStarClick = async (starRating: number) => {
    if (readonly || isSubmitting || hasSubmitted) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceProviderId,
          rating: starRating,
        }),
      });

      if (response.ok) {
        setRating(starRating);
        setHasSubmitted(true);
        onRatingSubmit?.(starRating);
      } else {
        console.error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly && !hasSubmitted) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly && !hasSubmitted) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div 
      className="flex items-center gap-1" 
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} ${
            readonly || hasSubmitted ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } transition-transform duration-150 ${isSubmitting ? 'opacity-50' : ''} ${hasSubmitted ? 'opacity-75' : ''}`}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readonly || isSubmitting || hasSubmitted}
        >
          <svg
            fill={star <= displayRating ? '#fbbf24' : '#e5e7eb'}
            viewBox="0 0 20 20"
            className="w-full h-full"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {isSubmitting && (
        <span className="ml-2 text-sm text-gray-500">Submitting...</span>
      )}
      {hasSubmitted && !isSubmitting && (
        <span className="ml-2 text-sm text-green-600 font-medium">Thanks!</span>
      )}
    </div>
  );
}