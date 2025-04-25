'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedRepositoryDetail from '@/components/EnhancedRepositoryDetail';
import { ApiResponse } from '@/data/apiResponseData';

export default function AnalysePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) {
      setError('Please enter a repository URL');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/analyse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const responseData = await response.json();
      
      // Ensure the response data has all the required properties
      // This helps adapt external API responses to our component's expected format
      const processedData: ApiResponse = {
        status: responseData.status || 'unknown',
        narrative: responseData.narrative || '',
        analysis_details: {
          repo_url: responseData.analysis_details?.repo_url || '',
          source: responseData.analysis_details?.source || '',
          latest_commit: responseData.analysis_details?.latest_commit || {
            date: '',
            message: '',
            author: ''
          },
          code_analysis: responseData.analysis_details?.code_analysis || {
            files_analyzed_count: 0,
            lines_analyzed_count: 0,
            unique_classes: [],
            unique_functions: [],
            unique_imports: [],
            analyzed_files_list: []
          }
        },
        task_id: responseData.task_id || '',
        repo_tree: responseData.repo_tree || [],
        file_type_distribution: responseData.file_type_distribution || {},
        title: responseData.title || '',
        repo_info: responseData.repo_info || {
          id: 0,
          node_id: '',
          name: '',
          full_name: '',
          private: false,
          owner: {
            login: '',
            id: 0,
            node_id: '',
            avatar_url: '',
            gravatar_id: '',
            url: '',
            html_url: '',
            followers_url: '',
            following_url: '',
            gists_url: '',
            starred_url: '',
            subscriptions_url: '',
            organizations_url: '',
            repos_url: '',
            events_url: '',
            received_events_url: '',
            type: '',
            user_view_type: '',
            site_admin: false
          },
          html_url: '',
          description: '',
          fork: false,
          url: '',
          forks_url: '',
          keys_url: '',
          collaborators_url: '',
          teams_url: '',
          hooks_url: '',
          issue_events_url: '',
          events_url: '',
          assignees_url: '',
          branches_url: '',
          tags_url: '',
          blobs_url: '',
          git_tags_url: '',
          git_refs_url: '',
          trees_url: '',
          statuses_url: '',
          languages_url: '',
          stargazers_url: '',
          contributors_url: '',
          subscribers_url: '',
          subscription_url: '',
          commits_url: '',
          git_commits_url: '',
          comments_url: '',
          issue_comment_url: '',
          contents_url: '',
          compare_url: '',
          merges_url: '',
          archive_url: '',
          downloads_url: '',
          issues_url: '',
          pulls_url: '',
          milestones_url: '',
          notifications_url: '',
          labels_url: '',
          releases_url: '',
          deployments_url: '',
          created_at: '',
          updated_at: '',
          pushed_at: '',
          git_url: '',
          ssh_url: '',
          clone_url: '',
          svn_url: '',
          homepage: null,
          size: 0,
          stargazers_count: 0,
          watchers_count: 0,
          language: null,
          has_issues: false,
          has_projects: false,
          has_downloads: false,
          has_wiki: false,
          has_pages: false,
          has_discussions: false,
          forks_count: 0,
          mirror_url: null,
          archived: false,
          disabled: false,
          open_issues_count: 0,
          license: null,
          allow_forking: false,
          is_template: false,
          web_commit_signoff_required: false,
          topics: [],
          visibility: '',
          forks: 0,
          open_issues: 0,
          watchers: 0,
          default_branch: '',
          permissions: {
            admin: false,
            maintain: false,
            push: false,
            triage: false,
            pull: false
          },
          temp_clone_token: '',
          allow_squash_merge: false,
          allow_merge_commit: false,
          allow_rebase_merge: false,
          allow_auto_merge: false,
          delete_branch_on_merge: false,
          allow_update_branch: false,
          use_squash_pr_title_as_default: false,
          squash_merge_commit_message: '',
          squash_merge_commit_title: '',
          merge_commit_message: '',
          merge_commit_title: '',
          security_and_analysis: undefined,
          network_count: 0,
          subscribers_count: 0
        },
        detected_frameworks: responseData.detected_frameworks || []
      };
      
      setData(processedData);
      
      // Log the data for debugging
      console.log('Processed API response:', processedData);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold sm:text-4xl sm:tracking-tight lg:text-5xl">
              Analyze Any Repository
            </h1>
            <p className="max-w-xl mt-5 mx-auto text-xl text-indigo-100">
              Enter a GitHub repository URL to generate comprehensive AI analysis.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700">
                Repository URL
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="repo-url"
                  id="repo-url"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter the full GitHub repository URL you want to analyze
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Repository...
                  </>
                ) : (
                  'Analyze Repository'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {data && <EnhancedRepositoryDetail data={data} />}
    </div>
  );
} 