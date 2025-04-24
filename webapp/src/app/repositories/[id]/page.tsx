'use client';

import { useParams } from 'next/navigation';
import { dummyRepositories } from '@/data/dummyData';
import RepositoryHeader from '@/components/RepositoryHeader';
import RepositoryAnalysis from '@/components/RepositoryAnalysis';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RepositoryPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [repository, setRepository] = useState(dummyRepositories.find(repo => repo.id === id));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!repository) {
      setError('Repository not found');
    }
  }, [repository]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-500 rounded-full border-t-transparent mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Loading repository data...</p>
        </div>
      </div>
    );
  }
  
  if (error || !repository) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Repository Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the repository you're looking for. It might have been removed or you might have followed an incorrect link.
          </p>
          <Link 
            href="/repositories" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Repositories
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <RepositoryHeader repository={repository} />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <RepositoryAnalysis repository={repository} />
      </div>
      
      {/* Related Repositories - Could be expanded in the future */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Repositories</h2>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dummyRepositories
            .filter(repo => repo.id !== id && repo.language === repository.language)
            .slice(0, 3)
            .map(repo => (
              <Link 
                key={repo.id} 
                href={`/repositories/${repo.id}`}
                className="block bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{repo.name}</h3>
                      <p className="text-sm text-gray-500">{repo.owner}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {repo.language}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{repo.description}</p>
                </div>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
} 