import Link from 'next/link';
import { Repository } from '@/data/dummyData';

export default function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <Link 
      href={`/repositories/${repository.id}`} 
      className="block bg-white shadow-card rounded-lg overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{repository.name}</h3>
            <p className="text-sm text-gray-500">{repository.owner}</p>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              {repository.language}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mt-3 text-sm line-clamp-2">{repository.description}</p>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <svg className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{repository.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <svg className="h-4 w-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>{repository.forks.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs">
            Last commit: {repository.lastCommit}
          </div>
        </div>
        
        {/* Analysis Indicator */}
        {repository.analysis && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-accent-600">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Analysis Available</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
} 