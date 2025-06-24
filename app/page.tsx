'use client';

import StarRating from '@/components/StarRating';
import AverageRating from '@/components/AverageRating';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Custom Ratings Widget Demo
        </h1>
        
        <div className="space-y-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Service Provider: John's Plumbing
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Current Average Rating:</h3>
                <AverageRating serviceProviderId="johns-plumbing" size="large" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Rate this service provider:</h3>
                <StarRating 
                  serviceProviderId="johns-plumbing" 
                  size="large"
                  onRatingSubmit={(rating) => {
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Service Provider: Sarah's Cleaning
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Current Average Rating:</h3>
                <AverageRating serviceProviderId="sarahs-cleaning" size="large" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Rate this service provider:</h3>
                <StarRating 
                  serviceProviderId="sarahs-cleaning" 
                  size="large"
                  onRatingSubmit={(rating) => {
                    window.location.reload();
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Usage Examples</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Different Sizes:</h3>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Small</p>
                    <AverageRating serviceProviderId="johns-plumbing" size="small" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Medium</p>
                    <AverageRating serviceProviderId="johns-plumbing" size="medium" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Large</p>
                    <AverageRating serviceProviderId="johns-plumbing" size="large" />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Without Count:</h3>
                <AverageRating 
                  serviceProviderId="johns-plumbing" 
                  size="medium" 
                  showCount={false} 
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How to Embed
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">For Rating Input:</h3>
                <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm mt-2">
                  {`<StarRating serviceProviderId="your-provider-id" size="medium" />`}
                </code>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">For Average Display:</h3>
                <code className="block bg-gray-800 text-green-400 p-3 rounded text-sm mt-2">
                  {`<AverageRating serviceProviderId="your-provider-id" size="medium" />`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}