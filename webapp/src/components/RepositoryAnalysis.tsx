'use client';

import { useState } from 'react';
import { Repository, StructureItem, KeyComponent, Technology, Narrative } from '@/data/dummyData';

export default function RepositoryAnalysis({ repository }: { repository: Repository }) {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!repository.analysis) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <h3 className="text-xl font-semibold text-gray-900">No analysis available</h3>
        <p className="mt-2 text-gray-500">This repository hasn't been analyzed yet.</p>
      </div>
    );
  }

  const { analysis } = repository;

  return (
    <div className="bg-white shadow-sm">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-baseline">
            <h3 className="text-lg leading-6 font-medium text-gray-900 py-4 sm:py-0">Analysis</h3>
            <div className="mt-4 sm:mt-0 sm:ml-10">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'structure'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Structure
                </button>
                <button
                  onClick={() => setActiveTab('components')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'components'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Key Components
                </button>
                <button
                  onClick={() => setActiveTab('technologies')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'technologies'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Technologies
                </button>
                <button
                  onClick={() => setActiveTab('narratives')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'narratives'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Narratives
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div className="prose lg:prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Repository Overview</h2>
            <p className="text-gray-700">{analysis.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Structure</h3>
                <p className="text-sm text-gray-600 mb-4">Main directories and files</p>
                <div className="text-sm text-primary-600">
                  {analysis.structure[0].children?.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <span className={`mr-2 ${item.type === 'directory' ? 'text-yellow-500' : 'text-blue-500'}`}>
                        {item.type === 'directory' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                      </span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                  <div className="text-primary-600 text-sm font-medium mt-2">
                    <button onClick={() => setActiveTab('structure')} className="hover:underline">
                      View full structure →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Components</h3>
                <p className="text-sm text-gray-600 mb-4">Main architectural components</p>
                <div className="text-sm text-gray-700">
                  {analysis.keyComponents.slice(0, 3).map((component, i) => (
                    <div key={i} className="mb-3">
                      <div className="font-medium text-primary-700">{component.name}</div>
                      <div className="text-xs text-gray-500">{component.purpose}</div>
                    </div>
                  ))}
                  <div className="text-primary-600 text-sm font-medium mt-2">
                    <button onClick={() => setActiveTab('components')} className="hover:underline">
                      View all components →
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Technologies</h3>
                <p className="text-sm text-gray-600 mb-4">Tech stack and languages</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.technologies.map((tech, i) => (
                    <div key={i} className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${tech.category === 'frontend' ? 'bg-blue-100 text-blue-800' : ''}
                      ${tech.category === 'backend' ? 'bg-indigo-100 text-indigo-800' : ''}
                      ${tech.category === 'database' ? 'bg-green-100 text-green-800' : ''}
                      ${tech.category === 'devops' ? 'bg-orange-100 text-orange-800' : ''}
                      ${tech.category === 'other' ? 'bg-gray-100 text-gray-800' : ''}
                    `}>
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'structure' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Repository Structure</h2>
            <div className="bg-secondary-50 rounded-lg p-6 border border-secondary-100">
              <div className="font-mono text-sm">
                {renderStructure(analysis.structure, 0)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.keyComponents.map((component, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${component.complexity === 'low' ? 'bg-green-100 text-green-800' : ''}
                        ${component.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${component.complexity === 'high' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {component.complexity} complexity
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{component.path}</p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-sm text-gray-700">{component.purpose}</p>
                    {component.dependencies.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dependencies</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {component.dependencies.map((dep, j) => (
                            <span key={j} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {dep}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'technologies' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 mb-2">
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setActiveTab('technologies')} 
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-white`}>
                    All
                  </button>
                  <button 
                    onClick={() => setActiveTab('technologies')} 
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800`}>
                    Frontend
                  </button>
                  <button 
                    onClick={() => setActiveTab('technologies')} 
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800`}>
                    Backend
                  </button>
                  <button 
                    onClick={() => setActiveTab('technologies')} 
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}>
                    Database
                  </button>
                  <button 
                    onClick={() => setActiveTab('technologies')} 
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800`}>
                    DevOps
                  </button>
                </div>
              </div>
              
              {analysis.technologies.map((tech, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`px-4 py-2 border-b
                    ${tech.category === 'frontend' ? 'bg-blue-50 border-blue-100' : ''}
                    ${tech.category === 'backend' ? 'bg-indigo-50 border-indigo-100' : ''}
                    ${tech.category === 'database' ? 'bg-green-50 border-green-100' : ''}
                    ${tech.category === 'devops' ? 'bg-orange-50 border-orange-100' : ''}
                    ${tech.category === 'other' ? 'bg-gray-50 border-gray-100' : ''}
                  `}>
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-semibold text-gray-900">{tech.name}</h3>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${tech.category === 'frontend' ? 'bg-blue-100 text-blue-800' : ''}
                        ${tech.category === 'backend' ? 'bg-indigo-100 text-indigo-800' : ''}
                        ${tech.category === 'database' ? 'bg-green-100 text-green-800' : ''}
                        ${tech.category === 'devops' ? 'bg-orange-100 text-orange-800' : ''}
                        ${tech.category === 'other' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {tech.category}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm text-gray-700">{tech.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'narratives' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Narratives</h2>
            <div className="space-y-6">
              {analysis.narratives.map((narrative, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{narrative.title}</h3>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${narrative.type === 'overview' ? 'bg-purple-100 text-purple-800' : ''}
                        ${narrative.type === 'technical' ? 'bg-blue-100 text-blue-800' : ''}
                        ${narrative.type === 'architecture' ? 'bg-indigo-100 text-indigo-800' : ''}
                        ${narrative.type === 'history' ? 'bg-amber-100 text-amber-800' : ''}
                      `}>
                        {narrative.type}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{narrative.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function renderStructure(items: StructureItem[], level: number) {
  return (
    <div className="pl-4 border-l border-dashed border-gray-300">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex items-center my-1">
            <span className={`mr-2 ${item.type === 'directory' ? 'text-yellow-500' : 'text-blue-500'}`}>
              {item.type === 'directory' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </span>
            <span className="text-gray-800">{item.name}</span>
            <span className="ml-2 text-xs text-gray-500">{item.path}</span>
          </div>
          {item.children && item.children.length > 0 && (
            <div className="ml-6 mt-1">
              {renderStructure(item.children, level + 1)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 