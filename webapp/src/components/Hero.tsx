'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function Hero() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { user, session, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated, if not redirect to auth flow
    if (!user) {
      signIn();
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');

    // Basic validation for GitHub URL
    if (!repoUrl.startsWith('https://github.com/')) {
      setRepoUrl('');
      const errorMessage = 'Please enter a valid GitHub repository URL.';
      // Display error message in UI
      const errorElement = document.getElementById('repo-url-error');
      if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.remove('hidden');
      }
      setIsLoading(false);
      return;
    }

    try {
      // Use axios for the API call and handle CORS
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      // Include GitHub token from session if available
      const requestData = { 
        repo_url: repoUrl,
        user_token: session?.provider_token || undefined,
        user_id: session?.user.id || undefined,
      };
      
      const response = await axios.post(
        `${apiUrl}/analyze`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          timeout: 30000, // 30 second timeout
        }
      );
      const data = response.data;
      console.log('Response data:', data);

      if (data && data.task_id) {
        router.push(`/repositories/${data.task_id}`);
      } else {
        setErrorMessage('Analysis complete, but no repository ID returned.');
      }
    } catch (err: any) {
      // Handle CORS error specifically
      if (err.response && err.response.status === 403) {
        setErrorMessage('CORS error: Unable to reach the backend. Please ensure CORS is enabled on the server.');
      } else if (err.code === 'ERR_NETWORK') {
        setErrorMessage('Network error: Unable to reach the backend. Please check your connection or CORS settings.');
      } else {
        setErrorMessage('Error analyzing repository: ' + (err?.message || 'Unknown error'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 isolate">
      {/* Background decorations */}
      <div aria-hidden="true" className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div aria-hidden="true" className="absolute inset-x-0 top-28 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-600 to-cyan-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="py-16 sm:py-24 md:py-28 lg:py-32 px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-display">
                <span className="block text-white">Decode Repositories</span>
                <span className="block mt-2 text-gradient">with AI Narrative</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">
                Understand any codebase instantly with AI-powered insights. 
                Codelore analyzes repositories and generates comprehensive, 
                human-readable narratives to make code exploration effortless.
              </p>
              
              <div className="mt-8">
                <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-0 sm:flex">
                  <div className="relative rounded-md shadow-sm flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 18c-4.51 2-5-2-7-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <input 
                      id="repo-url"
                      type="text" 
                      placeholder="https://github.com/username/repo" 
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      required
                      className="block w-full pl-5 pr-4 py-4 border-none outline-none  text-slate-800 ring-1 ring-inset ring-slate-300 bg-white/90 backdrop-blur-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-lg sm:rounded-r-none sm:text-sm"
                    />
                  </div>
                  <div>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className={`relative sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center px-6 py-[14px] text-sm font-medium sm:text-base text-white 
                        ${user ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700' : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700'}
                        rounded-lg sm:rounded-l-none shadow-md shadow-indigo-900/20 hover:shadow-lg hover:shadow-indigo-600/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-indigo-800 disabled:hover:shadow-md`}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </span>
                      ) : (
                        <>
                          <span>{user ? 'Analyze' : 'Sign in to analyze'}</span>
                          <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
                <p id="repo-url-error" className={`${errorMessage ? '' : 'hidden'} mt-2 text-sm text-red-500`}>
                  {errorMessage || 'Please enter a valid GitHub repository URL.'}
                </p>
                <p className="mt-3 text-sm text-slate-400">
                  {user 
                    ? "Enter a GitHub repository URL to start the analysis. Public repositories only." 
                    : "Sign in with GitHub to analyze repositories. GitHub authentication is required."}
                </p>
              </div>
              
              <div className="mt-10 flex items-center gap-x-6">
                <a href="#features" className="group inline-flex items-center text-sm font-medium text-indigo-300 hover:text-indigo-200 transition-colors">
                  Learn how it works
                  <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                {/* Glow behind the code window */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur-sm opacity-50"></div>
                
                {/* Code window */}
                <div className="relative rounded-lg bg-slate-800/90 backdrop-blur-sm shadow-2xl overflow-hidden border border-slate-700">
                  <div className="flex items-center border-b border-slate-700/80 px-4 py-2">
                    <div className="flex space-x-1.5">
                      <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-amber-400 rounded-full"></div>
                      <div className="h-3 w-3 bg-emerald-400 rounded-full"></div>
                    </div>
                    <div className="mx-auto flex items-center font-mono text-xs text-slate-400">
                      <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>repository-explorer.tsx</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-slate-300 p-4 max-h-[24rem] overflow-y-auto">
                    <pre className="whitespace-pre-wrap language-typescript">
                      <code>
                        <span className="text-cyan-400">// CodeLore AI-Generated Repository Analysis</span>{'\n'}
                        <span className="text-pink-400">import</span> {' type '}<span className="text-yellow-400">Repository</span>{' from '}<span className="text-green-400">'./types'</span>;{'\n'}
                        {'\n'}
                        <span className="text-pink-400">async function</span> <span className="text-blue-400">analyzeRepository</span>(url: <span className="text-yellow-400">string</span>): <span className="text-pink-400">Promise</span>{'<'}<span className="text-yellow-400">Repository</span>{'>'} {'{'}{'\n'}
                        {'  '}<span className="text-slate-500">// Fetch repository data from GitHub API</span>{'\n'}
                        {'  '}<span className="text-pink-400">const</span> repoData = <span className="text-pink-400">await</span> fetchRepository(url);{'\n'}
                        {'\n'}
                        {'  '}<span className="text-slate-500">// Extract code structure using AST parsing</span>{'\n'}
                        {'  '}<span className="text-pink-400">const</span> structure = <span className="text-pink-400">await</span> parseCodeStructure(repoData);{'\n'}
                        {'\n'}
                        {'  '}<span className="text-slate-500">// Analyze dependencies and relationships</span>{'\n'}
                        {'  '}<span className="text-pink-400">const</span> dependencies = analyzeDependencies(structure);{'\n'}
                        {'\n'}
                        {'  '}<span className="text-slate-500">// Generate narrative using LLM</span>{'\n'}
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
                
                {/* Decorative elements */}
                <div className="absolute top-1/2 -right-12 w-40 h-40 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 border-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path fill="#f9fafb" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(20px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}