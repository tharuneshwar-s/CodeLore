'use client';

import { useState, useEffect } from 'react';
import ApiRepositoryDetail from '@/components/ApiRepositoryDetail';
import { sampleApiResponse } from '@/data/apiResponseData';

// Define the type for our data
type RepositoryData = typeof sampleApiResponse;

export default function RepositoryPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RepositoryData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, we would fetch the data from an API
    // For this demo, we're using our sample data
    setTimeout(() => {
      setData(sampleApiResponse);
      setLoading(false);
    }, 500); // Simulate loading
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading repository data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {data && <ApiRepositoryDetail data={data} />}
    </div>
  );
} 