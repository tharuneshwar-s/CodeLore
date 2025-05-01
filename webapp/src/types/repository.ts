export interface Repository {
  task_id: string;
  repo_url: string;
  status: string;
  result: RepositoryResult | null;
  error: string | null;
  progress: number;
  state: string;
}

export interface RepositoryResult {
  narrative: string;
  analysis_details: {
    repo_url: string;
    source: string;
    latest_commit: LatestCommit;
    code_analysis: CodeAnalysis;
  };
  task_id: string;
  repo_tree: RepoTreeItem[];
  file_type_distribution: Record<string, number>;
  title: string;
  repo_info: RepoInfo;
  detected_frameworks: string[];
}

export interface LatestCommit {
  date: string;
  message: string;
  author: string;
}

export interface CodeAnalysis {
  files_analyzed_count: number;
  lines_analyzed_count: number;
  unique_classes: string[];
  unique_functions: string[];
  unique_imports: string[];
  analyzed_files_list: string[];
}

export interface RepoTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

export interface RepoInfo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: RepoOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  forks: number;
  open_issues: number;
  open_issues_count: number;
  default_branch: string;
  topics?: string[];
}

export interface RepoOwner {
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
  site_admin: boolean;
}

// For AnalysisTab details
export interface ComponentDetails {
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
}
