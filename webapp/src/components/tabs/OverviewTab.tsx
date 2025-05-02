import React from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Import types from a new types file (we'll create this later)
import { RepositoryData } from '@/types/repository';

const COLORS = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#06B6D4'];

interface OverviewTabProps {
  data: RepositoryData;
  formatDate: (dateString: string) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data, formatDate } : any) => {
  // Prepare data for PieChart
  const pieData = Object.entries(data.file_type_distribution).map(([type, count]) => ({
    name: type,
    value: count,
  }));

  const totalFiles = Object.values(data.file_type_distribution).reduce((a: any, b: any) => a + b, 0);

  return (
    <div className="space-y-6 text-white">
      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Files</p>
          <p className="text-2xl font-bold text-indigo-600">{totalFiles}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
          <p className="text-2xl font-bold text-indigo-600">{formatDate(data.analysis_details.latest_commit.date)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-gray-500 mb-1">Contributors</p>
          <p className="text-2xl font-bold text-indigo-600">{data.analysis_details.contributors?.length || 1}</p>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repository Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold  flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Repository Overview
            </h2>
            <div
              className="prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: data.narrative }}
            />

            {/* Latest Commit Info */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4 hover:bg-indigo-50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <svg className="h-5 w-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-gray-800">Latest Commit</h3>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-10 w-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full">
                    {data.analysis_details.latest_commit.author?.substring(0, 1).toUpperCase() || "U"}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-indigo-600 font-medium">
                    {data.analysis_details.latest_commit.author}
                  </p>
                  <p className="font-medium mt-1 text-gray-800">{data.analysis_details.latest_commit.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{formatDate(data.analysis_details.latest_commit.date)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Distribution Chart */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              File Type Distribution
            </h2>

            {/* Pie Chart for file type distribution */}
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} files`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* File type distribution bars */}
            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {Object.entries(data.file_type_distribution)
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([type, count], index: any) => (
                  <div key={index} className="group hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-800 font-medium flex items-center">
                        <span className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        {type}
                      </span>
                      <div className="flex items-center">
                        <span className="text-gray-700 mr-2 font-medium">{count}</span>
                        <span className="text-indigo-600 text-xs font-semibold px-1.5 py-0.5 bg-indigo-50 rounded-full">
                          {((count / totalFiles) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / Math.max(...Object.values(data.file_type_distribution))) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default OverviewTab;
