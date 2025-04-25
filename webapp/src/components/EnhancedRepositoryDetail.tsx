'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Types for the API response
type LatestCommit = {
  date: string;
  message: string;
  author: string;
};

type CodeAnalysis = {
  files_analyzed_count: number;
  lines_analyzed_count: number;
  unique_classes: string[];
  unique_functions: string[];
  unique_imports: string[];
  analyzed_files_list: string[];
};

type AnalysisDetails = {
  repo_url: string;
  source: string;
  latest_commit: LatestCommit;
  code_analysis: CodeAnalysis;
};

type RepoOwner = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
};

type RepoInfo = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: RepoOwner;
  html_url: string;
  description: string;
  fork: boolean;
  // Other repo info properties
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  updated_at: string;
  language: string | null;
  topics: string[];
};

type RepoTreeItem = {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
};

type RepositoryData = {
  status: string;
  narrative: string;
  analysis_details: AnalysisDetails;
  task_id: string;
  repo_tree: RepoTreeItem[];
  file_type_distribution: Record<string, number>;
  title: string;
  repo_info: RepoInfo;
  detected_frameworks: string[];
};

type EnhancedRepositoryDetailProps = {
  data: RepositoryData;
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF', '#4BC0C0', '#E75A70', '#2E93C0'];

const EnhancedRepositoryDetail: React.FC<EnhancedRepositoryDetailProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Convert file type distribution to array for charts
  const fileTypeData = Object.entries(data.file_type_distribution).map(([type, count], index) => ({
    name: type,
    value: count,
    color: COLORS[index % COLORS.length]
  }));

  // Format classes and functions for display
  const classesData = data.analysis_details.code_analysis.unique_classes.slice(0, 10);
  const functionsData = data.analysis_details.code_analysis.unique_functions.slice(0, 10);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <Image 
                src={data.repo_info.owner.avatar_url} 
                alt={data.repo_info.owner.login}
                width={96}
                height={96}
                className="rounded-lg shadow-lg border-2 border-white"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{data.repo_info.name}</h1>
                  <p className="text-indigo-200 mt-1">{data.repo_info.full_name}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link 
                    href={data.repo_info.html_url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    View on GitHub
                  </Link>
                </div>
              </div>
              <p className="mt-4 text-lg">{data.repo_info.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {data.detected_frameworks?.map((framework, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-700 text-indigo-100"
                  >
                    {framework}
                  </span>
                ))}
                {data.repo_info.topics?.map((topic, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-700 text-indigo-100"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.repo_info.stargazers_count.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1">Stars</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.repo_info.forks_count.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1">Forks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.analysis_details.code_analysis.files_analyzed_count.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1">Files Analyzed</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.analysis_details.code_analysis.lines_analyzed_count.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1">Lines Analyzed</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'analysis'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Code Analysis
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'structure'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Repository Structure
            </button>
            <button
              onClick={() => setActiveTab('imports')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'imports'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Imports & Dependencies
            </button>
          </nav>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Narrative Section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Repository Overview</h2>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">{data.narrative}</p>
                
                {/* Latest Commit Info */}
                <div className="mt-8 bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Latest Commit</h3>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-10 w-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                          <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        {formatDate(data.analysis_details.latest_commit.date)}
                      </p>
                      <p className="font-medium mt-1">{data.analysis_details.latest_commit.message}</p>
                      <p className="text-indigo-600 text-sm mt-1">by {data.analysis_details.latest_commit.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* File Distribution Chart */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">File Type Distribution</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-80 flex items-center justify-center">
                    <div className="w-full max-w-lg">
                      {fileTypeData.map((entry, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-700 font-medium">{entry.name}</span>
                            <span className="text-gray-700">{entry.value} files</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${(entry.value / Math.max(...fileTypeData.map(item => item.value))) * 100}%`,
                                backgroundColor: entry.color 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Code Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Code Analysis</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Unique Classes Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Top Classes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {classesData.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {classesData.map((className, index) => (
                            <li key={index} className="py-3 flex items-center">
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                                C
                              </span>
                              <span className="font-mono text-sm">{className}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">No class information available</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Unique Functions Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Top Functions</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {functionsData.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {functionsData.map((functionName, index) => (
                            <li key={index} className="py-3 flex items-center">
                              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                                F
                              </span>
                              <span className="font-mono text-sm">{functionName}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">No function information available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Files Analyzed List - Limited to avoid overwhelming display */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Analyzed Files</h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                      {data.analysis_details.code_analysis.analyzed_files_list.slice(0, 20).map((file, index) => (
                        <li key={index} className="py-2 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-mono">{file}</span>
                        </li>
                      ))}
                      {data.analysis_details.code_analysis.analyzed_files_list.length > 20 && (
                        <li className="py-2 text-center text-gray-500">
                          +{data.analysis_details.code_analysis.analyzed_files_list.length - 20} more files
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Repository Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Repository Structure</h2>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="overflow-auto max-h-[600px]">
                    <ul className="space-y-2">
                      {data.repo_tree.map((item, index) => {
                        // Display only top-level items and their immediate children for simplicity
                        const isTopLevel = !item.path.includes('/');
                        const pathParts = item.path.split('/');
                        const depth = pathParts.length - 1;
                        
                        if (depth > 2) return null; // Skip deeply nested files for UI clarity
                        
                        return (
                          <li 
                            key={index} 
                            className={`flex items-start ${depth > 0 ? 'ml-' + (depth * 6) : ''}`}
                          >
                            {item.type === 'tree' ? (
                              <svg className="w-5 h-5 mr-2 text-indigo-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 mr-2 text-gray-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            )}
                            <div>
                              <div className="font-medium">
                                {pathParts[pathParts.length - 1]}
                              </div>
                              {item.type === 'blob' && item.size && (
                                <div className="text-xs text-gray-500">
                                  {(item.size / 1024).toFixed(1)} KB
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Imports & Dependencies Tab */}
        {activeTab === 'imports' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Imports & Dependencies</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Imports Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Unique Imports</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <ul className="divide-y divide-gray-200">
                        {data.analysis_details.code_analysis.unique_imports.map((importItem, index) => (
                          <li key={index} className="py-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-mono text-sm">{importItem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Frameworks Detected */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Detected Frameworks</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.detected_frameworks?.map((framework, index) => (
                        <div key={index} className="bg-indigo-50 rounded-lg p-4 flex items-center shadow-sm">
                          <div className="h-10 w-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full mr-3">
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">{framework}</div>
                          </div>
                        </div>
                      ))}
                      
                      {(!data.detected_frameworks || data.detected_frameworks.length === 0) && (
                        <div className="col-span-2 text-center p-8 text-gray-500 italic">
                          No frameworks detected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRepositoryDetail; 


