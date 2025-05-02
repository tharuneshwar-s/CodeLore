import React, { useState } from 'react';
import {  ComponentDetails } from '@/types/repository';

interface AnalysisTabProps {
  data: any;
  classDetails: Record<string, ComponentDetails>;
  functionDetails: Record<string, ComponentDetails>;
  handleDetailsToggle: (event: React.SyntheticEvent, name: string, type: 'class' | 'function') => void;
}

const AnalysisTab: React.FC<AnalysisTabProps> = ({ data, classDetails, functionDetails, handleDetailsToggle }: any) => {
  // Get top classes and functions for display
  const classesData = data.analysis_details.code_analysis.unique_classes.slice(0, 10);
  const functionsData = data.analysis_details.code_analysis.unique_functions.slice(0, 10);

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Code Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Unique Classes Section with Accordions */}
            <div>
              <h3 className="text-lg  text-white font-semibold mb-3">Top Classes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {classesData.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {classesData.map((className : any, index : any) => (
                      <div key={index} className="py-3">
                        <details
                          className="group"
                          onToggle={(event) => handleDetailsToggle(event, className, 'class')}
                        >
                          <summary className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center">
                              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                                C
                              </span>
                              <span className="font-mono text-sm">{className}</span>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="mt-3 pl-9 text-sm text-gray-600">
                            {classDetails[className]?.loading ? (
                              <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                                <span className="ml-2">Loading...</span>
                              </div>
                            ) : classDetails[className]?.error ? (
                              <p className="text-red-500">{classDetails[className].error}</p>
                            ) : classDetails[className]?.description ? (
                              <div className="bg-gray-100 p-3 rounded-md">
                                {/* Primary purpose section */}
                                {classDetails[className]?.purpose && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-gray-900 mb-1">Purpose</h4>
                                    <p className="px-3 py-1 bg-indigo-50 rounded border-l-2 border-indigo-500"
                                      dangerouslySetInnerHTML={{ __html: classDetails[className].purpose }}></p>
                                  </div>
                                )}

                                {/* Description section */}
                                <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                                <div className="mb-3" dangerouslySetInnerHTML={{ __html: classDetails[className]?.description }}></div>

                                {/* Usage patterns */}
                                <h4 className="font-medium text-gray-900 mb-1">Usage in codebase</h4>
                                <ul className="list-disc pl-4 space-y-1 text-sm mb-3">
                                  {classDetails[className]?.usages.map((usage:any, usageIndex:any) => (
                                    <li key={usageIndex} dangerouslySetInnerHTML={{ __html: usage }}></li>
                                  ))}
                                </ul>

                                {/* Related components section */}
                                {classDetails[className]?.related_components && classDetails[className].related_components.length > 0 && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-gray-900 mb-1">Related Components</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {classDetails[className].related_components.map((component:any, idx:any) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                                          {component}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Complexity info */}
                                {classDetails[className]?.complexity && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-gray-900 mb-1">Complexity</h4>
                                    <div className="flex items-center">
                                      <span className={`inline-block w-20 text-center px-2 py-1 text-xs font-medium rounded-full
                                        ${classDetails[className].complexity.level === 'high' ? 'bg-red-100 text-red-800' :
                                          classDetails[className].complexity.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'}`}>
                                        {classDetails[className].complexity.level}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-600">
                                        {classDetails[className].complexity.explanation}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Best practices section */}
                                {classDetails[className]?.best_practices && (
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Best Practices</h4>
                                    <div className="flex items-center mb-1">
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                          <svg key={star} className={`w-4 h-4 ${star <= (classDetails[className]?.best_practices?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                      <span className="ml-1 text-xs text-gray-500">Rating</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-500">No details available.</p>
                            )}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No classes found.</p>
                )}
              </div>
            </div>

            {/* Unique Functions Section with Accordions */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-white">Top Functions</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {functionsData.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {functionsData.map((functionName : any, index : any) => (
                      <div key={index} className="py-3">
                        <details
                          className="group"
                          onToggle={(event) => handleDetailsToggle(event, functionName, 'function')}
                        >
                          <summary className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                                F
                              </span>
                              <span className="font-mono text-sm">{functionName}</span>
                            </div>
                            <svg
                              className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="mt-3 pl-9 text-sm text-gray-600">
                            {functionDetails[functionName]?.loading ? (
                              <div className="flex items-center justify-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                                <span className="ml-2">Loading...</span>
                              </div>
                            ) : functionDetails[functionName]?.error ? (
                              <p className="text-red-500">{functionDetails[functionName].error}</p>
                            ) : functionDetails[functionName]?.description ? (
                              <div className="bg-gray-100 p-3 rounded-md">
                                {/* Primary purpose section */}
                                {functionDetails[functionName]?.purpose && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-gray-900 mb-1">Purpose</h4>
                                    <p className="px-3 py-1 bg-green-50 rounded border-l-2 border-green-500"
                                      dangerouslySetInnerHTML={{ __html: functionDetails[functionName].purpose }}></p>
                                  </div>
                                )}

                                {/* Description section */}
                                <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                                <div className="mb-3" dangerouslySetInnerHTML={{ __html: functionDetails[functionName]?.description }}></div>

                                {/* Usage patterns */}
                                <h4 className="font-medium text-gray-900 mb-1">Usage in codebase</h4>
                                <ul className="list-disc pl-4 space-y-1 text-sm mb-3">
                                  {functionDetails[functionName]?.usages.map((usage:any, usageIndex:any) => (
                                    <li key={usageIndex} dangerouslySetInnerHTML={{ __html: usage }}></li>
                                  ))}
                                </ul>

                                {/* Related components section */}
                                {functionDetails[functionName]?.related_components && functionDetails[functionName].related_components.length > 0 && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-gray-900 mb-1">Related Components</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {functionDetails[functionName].related_components.map((component:any, idx:any) => (
                                        <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                                          {component}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Complexity info */}
                                {functionDetails[functionName]?.complexity && (
                                  <div className="mb-3">
                                    <h4 className="font-medium text-gray-900 mb-1">Complexity</h4>
                                    <div className="flex items-center">
                                      <span className={`inline-block w-20 text-center px-2 py-1 text-xs font-medium rounded-full
                                        ${functionDetails[functionName].complexity.level === 'high' ? 'bg-red-100 text-red-800' :
                                          functionDetails[functionName].complexity.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'}`}>
                                        {functionDetails[functionName].complexity.level}
                                      </span>
                                      <span className="ml-2 text-xs text-gray-600">
                                        {functionDetails[functionName].complexity.explanation}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Best practices section */}
                                {functionDetails[functionName]?.best_practices && (
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-1">Best Practices</h4>
                                    <div className="flex items-center mb-1">
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                          <svg key={star} className={`w-4 h-4 ${star <= (functionDetails[functionName]?.best_practices?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                      <span className="ml-1 text-xs text-gray-500">Rating</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-500">No details available.</p>
                            )}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No functions found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTab;