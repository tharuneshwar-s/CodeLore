'use client';

import { Repository } from '@/data/dummyData';
import Link from 'next/link';

export default function RepositoryHeader({ repository }: { repository: Repository }) {
  return (
    <div className="bg-gradient-to-tr from-primary-900 via-primary-800 to-primary-700 text-white px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/repositories" className="text-sm font-medium text-primary-200 hover:text-white">
                    Repositories
                  </Link>
                </li>
                <li className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-primary-200 truncate">{repository.name}</span>
                </li>
              </ol>
            </nav>

            <div className="flex items-center">
              <h1 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl line-clamp-1">
                {repository.name}
              </h1>
              <div className="ml-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-700 text-white border border-primary-500">
                  {repository.language}
                </span>
              </div>
            </div>
            <div className="mt-1 flex items-center">
              <a href={repository.url} target="_blank" rel="noopener noreferrer" className="text-primary-200 hover:text-white flex items-center">
                <svg 
                  className="mr-1 h-4 w-4" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="truncate">{repository.owner}/{repository.name}</span>
              </a>
            </div>
          </div>
          
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="px-4 py-2 sm:px-6 bg-primary-800/50 rounded-lg">
                <dt className="text-sm font-medium text-primary-200 truncate">Stars</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{repository.stars.toLocaleString()}</dd>
              </div>
              <div className="px-4 py-2 sm:px-6 bg-primary-800/50 rounded-lg">
                <dt className="text-sm font-medium text-primary-200 truncate">Forks</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{repository.forks.toLocaleString()}</dd>
              </div>
              <div className="px-4 py-2 sm:px-6 bg-primary-800/50 rounded-lg">
                <dt className="text-sm font-medium text-primary-200 truncate">Updated</dt>
                <dd className="mt-1 text-xl font-semibold text-white">{repository.lastCommit}</dd>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-6 text-xl text-primary-100 max-w-3xl">
          {repository.description}
        </p>
      </div>
    </div>
  );
} 