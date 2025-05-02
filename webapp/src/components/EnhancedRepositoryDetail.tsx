'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

// Import tab components
import OverviewTab from './tabs/OverviewTab';
import AnalysisTab from './tabs/AnalysisTab';
import StructureTab from './tabs/StructureTab';
import ImportsTab from './tabs/ImportsTab';
import GraphsTab from './tabs/GraphsTab';

// Types for the API response
import type { RepositoryData, RepoInfo } from '../types/repository';

type EnhancedRepositoryDetailProps = {
  data: RepositoryData;
};

// Add extended interface for component details
type ComponentDetails = {
  description: string;
  usages: string[];
  purpose?: string;
  related_components?: string[];
  parameters?: Array<{name?: string; type?: string; purpose?: string}>;
  return_value?: {type?: string; description?: string};
  complexity?: {level: string; explanation: string};
  best_practices?: {rating: number; suggestions: string[]};
  loading: boolean;
  error: string | null;
};

const EnhancedRepositoryDetail: React.FC<EnhancedRepositoryDetailProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');
  // Add state for component details
  const [classDetails, setClassDetails] = useState<Record<string, ComponentDetails>>({});
  const [functionDetails, setFunctionDetails] = useState<Record<string, ComponentDetails>>({});

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to fetch component details from the API
  const fetchComponentDetails = async (name: string, type: 'class' | 'function') => {
    // Create a state updater based on the component type
    const updateState = type === 'class'
      ? (updater: (prev: Record<string, ComponentDetails>) => Record<string, ComponentDetails>) => setClassDetails(updater)
      : (updater: (prev: Record<string, ComponentDetails>) => Record<string, ComponentDetails>) => setFunctionDetails(updater);

    // Set loading state
    updateState(prev => ({
      ...prev,
      [name]: {
        description: '',
        usages: [],
        loading: true,
        error: null
      }
    }));



    console.log("process.env.NEXT_PUBLIC_API_URL : ",process.env.NEXT_PUBLIC_API_URL )
    console.log("process.env.NEXT_PUBLIC_APP_URL : ",process.env.NEXT_PUBLIC_APP_URL )

    try {
      // Make API call to get component details
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/component-details`,
        {
          component_name: name,
          component_type: type,
          repo_url: data.analysis_details.repo_url,
          context: {
            imports: data.analysis_details.code_analysis.unique_imports,
            file_path: data.analysis_details.code_analysis.analyzed_files_list[0],
            narrative: data.narrative,
            topics: data.repo_info?.topics,
            detected_frameworks: data.detected_frameworks
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log("API Response:", response.data);
      
      // Update state with the response data, preserving the full structure
      updateState(prev => ({
        ...prev,
        [name]: {
          ...response.data,  // This now includes all fields (description, usages, purpose, etc.)
          loading: false,
          error: null
        }
      }));
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      // Update state with error
      updateState(prev => ({
        ...prev,
        [name]: {
          description: '',
          usages: [],
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch component details'
        }
      }));
    }
  };

  // Handler for when details are toggled open
  const handleDetailsToggle = (event: React.SyntheticEvent, name: string, type: 'class' | 'function') => {
    const details = event.currentTarget as HTMLDetailsElement;

    // If opening the details and we don't have data yet, fetch it
    if (details.open === false) {
      const existingDetails = type === 'class' ? classDetails[name] : functionDetails[name];

      if (!existingDetails || (!existingDetails.loading && !existingDetails.description && !existingDetails.error)) {
        fetchComponentDetails(name, type);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6 w-[250px] h-[250px]">
              <Image
                src={data.repo_info?.owner?.avatar_url || ""}
                alt={data.repo_info?.owner?.login || ""}
                width={1000}
                height={1000}
                className="rounded-lg w-full h-full shadow-lg border-2 border-white"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{data.repo_info?.name}</h1>
                  <p className="text-indigo-200 mt-1">{data.repo_info?.full_name}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link
                    href={data.repo_info?.html_url}
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
              <p className="mt-4 text-lg">{data.repo_info?.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {data.detected_frameworks?.map((framework, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-700 text-indigo-100"
                  >
                    {framework}
                  </span>
                ))}
                {data.repo_info?.topics?.map((topic, index) => (
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
              <p className="text-3xl font-bold">{data.repo_info?.stargazers_count?.toLocaleString()}</p>
              <p className="text-indigo-200 mt-1">Stars</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{data.repo_info?.forks_count?.toLocaleString()}</p>
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
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'analysis'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Code Analysis
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'structure'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Repository Structure
            </button>
            <button
              onClick={() => setActiveTab('imports')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'imports'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Imports & Dependencies
            </button>
            <button
              onClick={() => setActiveTab('graphs')}
              className={`whitespace-nowrap py-4 px-6 font-medium text-sm border-b-2 ${activeTab === 'graphs'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Graphs
            </button>
          </nav>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render the appropriate tab component based on activeTab */}
        {activeTab === 'overview' && (
          <OverviewTab data={data} formatDate={formatDate} />
        )}
        
        {activeTab === 'analysis' && (
          <AnalysisTab 
            data={data} 
            classDetails={classDetails} 
            functionDetails={functionDetails} 
            handleDetailsToggle={handleDetailsToggle}
          />
        )}
        
        {activeTab === 'structure' && (
          <StructureTab data={data} />
        )}
        
        {activeTab === 'imports' && (
          <ImportsTab data={data} />
        )}

        {activeTab === 'graphs' && (
          <GraphsTab data={data} />
        )}
      </div>
    </div>
  );
};

export default EnhancedRepositoryDetail;
