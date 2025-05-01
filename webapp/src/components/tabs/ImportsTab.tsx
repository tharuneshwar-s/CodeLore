// filepath: f:\projects\codelore\webapp\src\components\tabs\ImportsTab.tsx
import React from 'react';
import { RepositoryData } from '@/types/repository';

interface ImportsTabProps {
    data: RepositoryData;
}

const ImportsTab: React.FC<ImportsTabProps> = ({ data }) => {
    return (
        <div className="p-4 md:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Imports & Dependencies
                    </h2>
                    
                    {/* Imports Section */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Unique Imports</h3>
                            <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {data.analysis_details.code_analysis.unique_imports.length}
                            </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 max-h-[500px] overflow-y-auto border border-gray-100 dark:border-gray-700">
                            {data.analysis_details.code_analysis.unique_imports.length > 0 ? (
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {data.analysis_details.code_analysis.unique_imports.map((importItem, index) => (
                                        <li key={index} className="py-2 px-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center hover:shadow-md transition-shadow duration-200">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center mr-3">
                                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="font-mono text-sm text-gray-800 dark:text-gray-200 truncate">{importItem}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    No imports found in this repository
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Frameworks Section */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Frameworks & Libraries</h3>
                            <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {data.detected_frameworks?.length || 0}
                            </span>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            {data.detected_frameworks && data.detected_frameworks.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {data.detected_frameworks.map((framework, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-md flex items-center justify-center mr-3">
                                                    <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-800 dark:text-white">{framework}</div>
                                                   
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    No frameworks detected in this repository
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportsTab;