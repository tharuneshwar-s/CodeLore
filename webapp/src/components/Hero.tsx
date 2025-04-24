'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/repositories/1');
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-tr from-primary-900 via-primary-800 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28 lg:max-w-2xl lg:w-full mx-auto text-center lg:text-left px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
            <span className="block">Decode Repositories</span>
            <span className="block text-accent-400">with AI Narrative</span>
          </h1>
          <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            Understand any codebase instantly with AI-powered insights. 
            Codelore analyzes repositories and generates comprehensive, 
            human-readable narratives to make code exploration effortless.
          </p>
          
          <div className="mt-8 sm:mt-12">
            <form onSubmit={handleSubmit} className="sm:max-w-lg sm:mx-auto lg:mx-0">
              <div className="sm:flex">
                <div className="min-w-0 flex-1">
                  <label htmlFor="repo-url" className="sr-only">Repository URL</label>
                  <input 
                    id="repo-url"
                    type="text" 
                    placeholder="https://github.com/username/repo" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                    className="block w-full px-4 py-3 rounded-md text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-primary-500 border-gray-300"
                  />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="block w-full py-3 px-4 rounded-md shadow bg-accent-600 text-white font-medium hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      'Analyze'
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-xs text-gray-300 sm:mt-4">
                Enter a GitHub repository URL to start the analysis. Public repositories only.
              </p>
            </form>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-l from-primary-900/90 via-primary-800/40 to-transparent z-10"></div>
        <div className="h-full w-full bg-primary-900 flex items-center justify-center p-8">
          <div className="w-full max-w-lg h-96 rounded-lg bg-primary-800 shadow-code overflow-hidden relative">
            <div className="flex items-center border-b border-primary-700 px-4 py-2">
              <div className="flex space-x-1">
                <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="mx-auto font-mono text-xs text-gray-400">repository-explorer.tsx</div>
            </div>
            <div className="font-mono text-xs text-gray-300 p-4 overflow-hidden">
              <pre className="whitespace-pre-wrap">
                <code>
                  <span className="text-accent-400">// CodeLore AI-Generated Repository Analysis</span>{'\n'}
                  <span className="text-pink-400">import</span> {' type '}<span className="text-yellow-400">Repository</span>{' from '}<span className="text-green-400">'./types'</span>;{'\n'}
                  {'\n'}
                  <span className="text-pink-400">async function</span> <span className="text-blue-400">analyzeRepository</span>(url: <span className="text-yellow-400">string</span>): <span className="text-pink-400">Promise</span>{'<'}<span className="text-yellow-400">Repository</span>{'>'} {'{'}{'\n'}
                  {'  '}<span className="text-gray-400">// Fetch repository data from GitHub API</span>{'\n'}
                  {'  '}<span className="text-pink-400">const</span> repoData = <span className="text-pink-400">await</span> fetchRepository(url);{'\n'}
                  {'\n'}
                  {'  '}<span className="text-gray-400">// Extract code structure using AST parsing</span>{'\n'}
                  {'  '}<span className="text-pink-400">const</span> structure = <span className="text-pink-400">await</span> parseCodeStructure(repoData);{'\n'}
                  {'\n'}
                  {'  '}<span className="text-gray-400">// Analyze dependencies and relationships</span>{'\n'}
                  {'  '}<span className="text-pink-400">const</span> dependencies = analyzeDependencies(structure);{'\n'}
                  {'\n'}
                  {'  '}<span className="text-gray-400">// Generate narrative using LLM</span>{'\n'}
                  {'  '}<span className="text-pink-400">const</span> narrative = <span className="text-pink-400">await</span> generateNarrative(structure, dependencies);{'\n'}
                  {'\n'}
                  {'  '}<span className="text-pink-400">return</span> {'{'}{'\n'}
                  {'    '}...repoData,{'\n'}
                  {'    '}structure,{'\n'}
                  {'    '}dependencies,{'\n'}
                  {'    '}narrative{'\n'}
                  {'  '}{'}'};{'\n'}
                  {'}'}{'\n'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 