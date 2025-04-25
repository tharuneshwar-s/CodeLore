import Link from 'next/link';
import { Repository } from '@/data/dummyData';

export default function RepositoryCard({ repository }: { repository: Repository }) {
  return (
    <Link 
      href={`/repositories/${repository.id}`} 
      className="group block relative overflow-hidden rounded-xl card-hover bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <div className="mr-3 flex-shrink-0">
                <div className="relative w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center text-indigo-700 font-bold text-lg overflow-hidden">
                  {repository.name.charAt(0).toUpperCase()}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 opacity-60"></div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors duration-300">{repository.name}</h3>
                <p className="text-sm text-slate-500 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
                  </svg>
                  {repository.owner}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
              {repository.language}
            </span>
          </div>
        </div>
        
        <p className="text-slate-600 mt-4 text-sm line-clamp-2 leading-relaxed">{repository.description}</p>
        
        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="flex space-x-5">
            <div className="flex items-center text-slate-600">
              <svg className="h-4 w-4 text-amber-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{repository.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <svg className="h-4 w-4 text-slate-400 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
              </svg>
              <span>{repository.forks.toLocaleString()}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center">
            <svg className="h-3.5 w-3.5 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{repository.lastCommit}</span>
          </div>
        </div>
        
        {/* Analysis Indicator */}
        {repository.analysis && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center text-indigo-600">
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Analysis Available</span>
              
              <svg className="ml-2 w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
} 