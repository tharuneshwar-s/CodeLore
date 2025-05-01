import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RepositoryData } from '@/types/repository';

interface GraphsTabProps {
    data: RepositoryData;
}

interface GraphData {
    dependency_graph?: {
        image: string;
        format: string;
        encoding: string;
    };
    class_hierarchy?: {
        image: string;
        format: string;
        encoding: string;
    };
    function_call_graph?: {
        image: string;
        format: string;
        encoding: string;
    };
    file_type_pie_chart?: {
        image: string;
        format: string;
        encoding: string;
    };
    error?: string;
}

interface UmlData {
    class_diagram?: {
        image: string;
        format: string;
        encoding: string;
        uml_code: string;
    };
    sequence_diagram?: {
        image: string;
        format: string;
        encoding: string;
        uml_code: string;
    };
    activity_diagram?: {
        image: string;
        format: string;
        encoding: string;
        uml_code: string;
    };
    error?: string;
}

const GraphsTab: React.FC<GraphsTabProps> = ({ data }) => {
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [umlData, setUmlData] = useState<UmlData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'charts' | 'uml'>('charts');
    const [showCode, setShowCode] = useState<Record<string, boolean>>({});

    // Function to toggle code visibility for a diagram
    const toggleCode = (diagramName: string) => {
        setShowCode(prev => ({
            ...prev,
            [diagramName]: !prev[diagramName]
        }));
    };

    useEffect(() => {
        const fetchGraphs = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch regular graphs
                const graphResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/repo-graphs`,
                    {
                        repo_url: data.analysis_details.repo_url,
                        task_id: data.task_id,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    }
                );

                setGraphData(graphResponse.data);

                // Fetch UML diagrams
                const umlResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/repo-uml`,
                    {
                        repo_url: data.analysis_details.repo_url,
                        task_id: data.task_id,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    }
                );

                setUmlData(umlResponse.data);
            } catch (err) {
                console.error('Error fetching graph data:', err);
                setError('Failed to load graph visualizations. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (data.task_id) {
            fetchGraphs();
        }
    }, [data.task_id, data.analysis_details.repo_url]);

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Repository Graphs & Diagrams</h2>

                    {/* Tab selection */}
                    <div className="flex space-x-4 border-b mb-6">
                        <button
                            onClick={() => setActiveTab('charts')}
                            className={`pb-2 px-4 ${activeTab === 'charts'
                                ? 'border-b-2 border-indigo-500 font-medium text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Standard Graphs
                        </button>
                        <button
                            onClick={() => setActiveTab('uml')}
                            className={`pb-2 px-4 ${activeTab === 'uml'
                                ? 'border-b-2 border-indigo-500 font-medium text-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            UML Diagrams
                        </button>
                    </div>

                    {isLoading && (
                        <div className="space-y-8">
                            {/* Loading states for graphs */}
                            {['Dependency Graph', 'Class Hierarchy', 'Function Call Graph', 'File Type Distribution'].map((title, index) => (
                                <div key={index} className="animate-pulse">
                                    <h3 className="text-lg font-semibold mb-2 bg-gray-200 h-6 w-48 rounded"></h3>
                                    <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center text-gray-400">
                                        <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <p>{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && (
                        <>
                            {activeTab === 'charts' && graphData && (
                                <div className="space-y-8 text-white">
                                    {/* Dependency Graph */}
                                    {graphData.dependency_graph && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Dependency Graph</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${graphData.dependency_graph.format};base64,${graphData.dependency_graph.image}`}
                                                    alt="Dependency Graph"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This graph shows relationships between imports and classes in the repository.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Class Hierarchy */}
                                    {graphData.class_hierarchy && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Class Hierarchy</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${graphData.class_hierarchy.format};base64,${graphData.class_hierarchy.image}`}
                                                    alt="Class Hierarchy"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This graph shows class inheritance relationships in the repository.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Function Call Graph */}
                                    {graphData.function_call_graph && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">Function Call Graph</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${graphData.function_call_graph.format};base64,${graphData.function_call_graph.image}`}
                                                    alt="Function Call Graph"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This graph shows potential function call relationships in the repository.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* File Type Pie Chart */}
                                    {graphData.file_type_pie_chart && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">File Type Distribution</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${graphData.file_type_pie_chart.format};base64,${graphData.file_type_pie_chart.image}`}
                                                    alt="File Type Distribution"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This chart shows the distribution of file types in the repository.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* If there's an error in the graph data */}
                                    {graphData.error && (
                                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                                            <p>Warning: {graphData.error}</p>
                                            <p className="text-sm mt-2">Some graph visualizations may not be available.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'uml' && umlData && (
                                <div className="space-y-8 text-white" >
                                    {/* UML Class Diagram */}
                                    {umlData.class_diagram && (
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-semibold">UML Class Diagram</h3>
                                                <button
                                                    onClick={() => toggleCode('class_diagram')}
                                                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded hover:bg-indigo-100"
                                                >
                                                    {showCode.class_diagram ? 'Hide PlantUML Code' : 'Show PlantUML Code'}
                                                </button>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${umlData.class_diagram.format};base64,${umlData.class_diagram.image}`}
                                                    alt="UML Class Diagram"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This UML class diagram shows the classes and their relationships in the repository.
                                                </p>

                                                {/* PlantUML Code */}
                                                {showCode.class_diagram && (
                                                    <div className="mt-4 w-full">
                                                        <h4 className="text-sm font-medium mb-2 text-gray-700">PlantUML Source Code:</h4>
                                                        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                                                            <pre className="text-xs text-gray-200 whitespace-pre-wrap">
                                                                {umlData.class_diagram.uml_code}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* UML Sequence Diagram */}
                                    {umlData.sequence_diagram && (
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-semibold">UML Sequence Diagram</h3>
                                                <button
                                                    onClick={() => toggleCode('sequence_diagram')}
                                                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded hover:bg-indigo-100"
                                                >
                                                    {showCode.sequence_diagram ? 'Hide PlantUML Code' : 'Show PlantUML Code'}
                                                </button>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${umlData.sequence_diagram.format};base64,${umlData.sequence_diagram.image}`}
                                                    alt="UML Sequence Diagram"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This UML sequence diagram shows typical interactions between components in the repository.
                                                </p>

                                                {/* PlantUML Code */}
                                                {showCode.sequence_diagram && (
                                                    <div className="mt-4 w-full">
                                                        <h4 className="text-sm font-medium mb-2 text-gray-700">PlantUML Source Code:</h4>
                                                        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                                                            <pre className="text-xs text-gray-200 whitespace-pre-wrap">
                                                                {umlData.sequence_diagram.uml_code}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* UML Activity Diagram */}
                                    {umlData.activity_diagram && (
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-lg font-semibold">UML Activity Diagram</h3>
                                                <button
                                                    onClick={() => toggleCode('activity_diagram')}
                                                    className="px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded hover:bg-indigo-100"
                                                >
                                                    {showCode.activity_diagram ? 'Hide PlantUML Code' : 'Show PlantUML Code'}
                                                </button>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center">
                                                <img
                                                    src={`data:image/${umlData.activity_diagram.format};base64,${umlData.activity_diagram.image}`}
                                                    alt="UML Activity Diagram"
                                                    className="max-w-full h-auto rounded-lg shadow-md"
                                                />
                                                <p className="mt-4 text-sm text-gray-600">
                                                    This UML activity diagram shows the main workflow or process in the repository.
                                                </p>

                                                {/* PlantUML Code */}
                                                {showCode.activity_diagram && (
                                                    <div className="mt-4 w-full">
                                                        <h4 className="text-sm font-medium mb-2 text-gray-700">PlantUML Source Code:</h4>
                                                        <div className="bg-gray-900 rounded-md p-4 overflow-x-auto">
                                                            <pre className="text-xs text-gray-200 whitespace-pre-wrap">
                                                                {umlData.activity_diagram.uml_code}
                                                            </pre>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* If there's an error in the UML data */}
                                    {umlData.error && (
                                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                                            <p>Warning: {umlData.error}</p>
                                            <p className="text-sm mt-2">Some UML diagrams may not be available.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GraphsTab;
