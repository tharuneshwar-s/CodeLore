import Hero from '@/components/Hero';
import Link from 'next/link';
import { dummyRepositories } from '@/data/dummyData';
import RepositoryCard from '@/components/RepositoryCard';

export default function Home() {
  // Get the repositories with analysis for featured section
  const featuredRepos = dummyRepositories.filter(repo => repo.analysis).slice(0, 3);

  return (
    <div>
      <Hero />
      
      {/* Features Section */}
      <section id='features' className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-slate-900 sm:text-4xl">
              Decode any codebase with AI
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Codelore analyzes repositories and generates comprehensive, human-readable narratives to make code exploration effortless.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8">
              <div className="relative">
                <div className="h-full group card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                    <h3 className="text-xl font-semibold text-slate-900">AI Narrative Generation</h3>
                    <p className="mt-3 text-slate-600">
                    Leverages state-of-the-art large language models to create human-readable stories about any codebase.
                  </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-full group card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-indigo-700"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>
                  </div>
                    <h3 className="text-xl font-semibold text-slate-900">Intelligent Code Structure Analysis</h3>
                    <p className="mt-3 text-slate-600">
                    Parses and analyzes repository structure, key components, and dependencies to create a comprehensive map of the codebase.
                  </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-full group card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-700 to-indigo-800"></div>
                  <div className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>
                  </div>
                    <h3 className="text-xl font-semibold text-slate-900">Technology Stack Identification</h3>
                    <p className="mt-3 text-slate-600">
                    Automatically identifies and categorizes the technologies, frameworks, and languages used in any repository.
                  </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Repositories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Featured Repositories</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-slate-900 sm:text-4xl">
              Explore analyzed repositories
            </p>
            <div className="mt-4 max-w-2xl mx-auto">
              <p className="text-xl text-slate-600">
                Discover insights from popular open-source repositories through our AI-powered analysis
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredRepos.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
          
          <div className="mt-14 text-center">
            <Link 
              href="/repositories" 
              className="inline-flex items-center px-6 py-3 rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 font-medium transition-all duration-300"
            >
              View All Repositories
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-slate-900 sm:text-4xl">
              From repository to narrative in minutes
            </p>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 mx-auto">
              Our AI-powered system analyzes code repositories and generates comprehensive, human-readable narratives.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-16">
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 transition-all duration-300">
                  <span className="text-lg font-bold">1</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300">GitHub API Integration</h3>
                  <p className="mt-2 text-slate-600">
                    Enter a GitHub repository URL and we'll fetch the repository structure, files, and metadata through the GitHub API.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 transition-all duration-300">
                  <span className="text-lg font-bold">2</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300">Code Parsing & Analysis</h3>
                  <p className="mt-2 text-slate-600">
                    Our system parses code files to understand their structure, functions, classes, dependencies, and relationships.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 transition-all duration-300">
                  <span className="text-lg font-bold">3</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300">AI Processing</h3>
                  <p className="mt-2 text-slate-600">
                    The parsed data is sent to advanced Large Language Models that understand code semantics and can interpret complex patterns.
                  </p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200 transition-all duration-300">
                  <span className="text-lg font-bold">4</span>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors duration-300">Narrative Generation</h3>
                  <p className="mt-2 text-slate-600">
                    A comprehensive narrative is created that explains the repository's purpose, structure, key components, and technologies.
                  </p>
                </div>
              </div>
        </div>
      </div>
        </div>
      </section>
    </div>
  );
} 