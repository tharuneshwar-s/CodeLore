'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type RepositoryStructureItem = {
  name: string;
  type: string;
  description?: string;
  children?: RepositoryStructureItem[];
};

type LanguageData = {
  name: string;
  percentage: number;
};

type DependencyData = {
  name: string;
  version: string;
};

type FileTypeData = {
  type: string;
  count: number;
};

type ApiRepositoryDetailProps = {
  data: {
    repo_info: {
      name: string;
      full_name: string;
      description: string;
      html_url: string;
      stars: number;
      forks: number;
      last_updated: string;
      owner: {
        login: string;
        avatar_url: string;
        html_url: string;
      };
    };
    narrative: {
      summary: string;
      key_features: string[];
      insights: string;
    };
    analysis_details: {
      languages: LanguageData[];
      unique_classes: number;
      unique_functions: number;
      analyzed_files: number;
      complexity_score: number;
      maintainability_score: number;
      dependencies: DependencyData[];
    };
    file_type_distribution: FileTypeData[];
    repository_structure: RepositoryStructureItem[];
  };
};

const ApiRepositoryDetail: React.FC<ApiRepositoryDetailProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Repository Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <Image 
              src={data.repo_info.owner.avatar_url} 
              alt={data.repo_info.owner.login}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{data.repo_info.name}</h1>
            <p className="text-gray-600">{data.repo_info.full_name}</p>
            <div className="flex mt-2">
              <span className="mr-4 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <span>{data.repo_info.stars} stars</span>
              </span>
              <span className="mr-4 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>
                <span>{data.repo_info.forks} forks</span>
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                  <path fillRule="evenodd" d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"></path>
                </svg>
                <span>Updated {formatDate(data.repo_info.last_updated)}</span>
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-700">{data.repo_info.description}</p>
        <div className="mt-4">
          <Link href={data.repo_info.html_url} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                target="_blank" rel="noopener noreferrer">
            View on GitHub
          </Link>
        </div>
      </div>

      {/* Repository Narrative */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Repository Analysis</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-700">{data.narrative.summary}</p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Key Features</h3>
          <ul className="list-disc list-inside text-gray-700">
            {data.narrative.key_features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Insights</h3>
          <p className="text-gray-700">{data.narrative.insights}</p>
        </div>
      </div>

      {/* Analysis Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Languages</h2>
          <div className="space-y-4">
            {data.analysis_details.languages.map((language, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{language.name}</span>
                  <span className="text-gray-700">{language.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${language.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Code Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Classes</p>
              <p className="text-2xl font-bold">{data.analysis_details.unique_classes}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Functions</p>
              <p className="text-2xl font-bold">{data.analysis_details.unique_functions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Files Analyzed</p>
              <p className="text-2xl font-bold">{data.analysis_details.analyzed_files}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Complexity</p>
              <p className="text-2xl font-bold">{data.analysis_details.complexity_score}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Types and Dependencies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">File Type Distribution</h2>
          <div className="space-y-3">
            {data.file_type_distribution.map((fileType, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{fileType.type}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {fileType.count} files
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Dependencies</h2>
          <div className="divide-y divide-gray-200">
            {data.analysis_details.dependencies.map((dependency, index) => (
              <div key={index} className="py-3 flex justify-between items-center">
                <span className="text-gray-700">{dependency.name}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  v{dependency.version}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repository Structure */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Repository Structure</h2>
        <div className="space-y-4">
          {data.repository_structure.map((item, index) => (
            <div key={index} className="border-l-2 border-gray-200 pl-4">
              <div className="font-semibold flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                {item.name}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 ml-7">{item.description}</p>
              )}
              {item.children && item.children.length > 0 && (
                <div className="ml-4 mt-2 space-y-2">
                  {item.children.map((child, childIndex) => (
                    <div key={childIndex} className="border-l-2 border-gray-200 pl-4">
                      <div className="font-medium flex items-center">
                        <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        {child.name}
                      </div>
                      {child.description && (
                        <p className="text-sm text-gray-600 ml-7">{child.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiRepositoryDetail; 