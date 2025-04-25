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

export interface AnalysisDetails {
  repo_url: string;
  source: string;
  latest_commit: LatestCommit;
  code_analysis: CodeAnalysis;
}

export interface RepoTreeItem {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
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
  user_view_type: string;
  site_admin: boolean;
}

export interface RepoPermissions {
  admin: boolean;
  maintain: boolean;
  push: boolean;
  triage: boolean;
  pull: boolean;
}

export interface SecurityAnalysis {
  secret_scanning?: {
    status: string;
  };
  secret_scanning_push_protection?: {
    status: string;
  };
  dependabot_security_updates?: {
    status: string;
  };
  secret_scanning_non_provider_patterns?: {
    status: string;
  };
  secret_scanning_validity_checks?: {
    status: string;
  };
}

export interface RepoInfo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: RepoOwner;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: string | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  permissions: RepoPermissions;
  temp_clone_token: string;
  allow_squash_merge: boolean;
  allow_merge_commit: boolean;
  allow_rebase_merge: boolean;
  allow_auto_merge: boolean;
  delete_branch_on_merge: boolean;
  allow_update_branch: boolean;
  use_squash_pr_title_as_default: boolean;
  squash_merge_commit_message: string;
  squash_merge_commit_title: string;
  merge_commit_message: string;
  merge_commit_title: string;
  security_and_analysis: SecurityAnalysis;
  network_count: number;
  subscribers_count: number;
}

export interface ApiResponse {
  status: string;
  narrative: string;
  analysis_details: AnalysisDetails;
  task_id: string;
  repo_tree: RepoTreeItem[];
  file_type_distribution: Record<string, number>;
  title: string;
  repo_info: RepoInfo;
}

// Sample API response data
export const sampleApiResponse = {
  repo_info: {
    name: "sample-repository",
    full_name: "organization/sample-repository",
    description: "A sample repository demonstrating various programming concepts and patterns",
    html_url: "https://github.com/organization/sample-repository",
    stars: 1250,
    forks: 320,
    last_updated: "2023-11-15T12:34:56Z",
    owner: {
      login: "organization",
      avatar_url: "https://avatars.githubusercontent.com/u/12345678",
      html_url: "https://github.com/organization"
    }
  },
  narrative: {
    summary: "This repository contains a comprehensive web application that demonstrates modern software architecture and design patterns. It features a React frontend with TypeScript, a Python backend using FastAPI, and includes thorough documentation and testing.",
    key_features: [
      "Component-based frontend architecture",
      "RESTful API with OpenAPI documentation",
      "Automated testing suite with 90% coverage",
      "CI/CD pipeline with GitHub Actions",
      "Containerized deployment with Docker"
    ],
    insights: "The codebase demonstrates good separation of concerns and follows SOLID principles. There's a strong emphasis on type safety and documentation. The project structure is well-organized, making it easy for new contributors to understand the codebase."
  },
  analysis_details: {
    languages: [
      { name: "TypeScript", percentage: 45 },
      { name: "Python", percentage: 35 },
      { name: "CSS", percentage: 12 },
      { name: "HTML", percentage: 8 }
    ],
    unique_classes: 34,
    unique_functions: 128,
    analyzed_files: 76,
    complexity_score: 3.2,
    maintainability_score: 4.1,
    dependencies: [
      { name: "React", version: "18.2.0" },
      { name: "FastAPI", version: "0.95.1" },
      { name: "TypeScript", version: "5.0.4" },
      { name: "Tailwind CSS", version: "3.3.2" }
    ]
  },
  file_type_distribution: [
    { type: "Component", count: 28 },
    { type: "Utility", count: 15 },
    { type: "API Route", count: 12 },
    { type: "Test", count: 18 },
    { type: "Configuration", count: 8 },
    { type: "Documentation", count: 5 }
  ],
  repository_structure: [
    {
      name: "src",
      type: "directory",
      children: [
        {
          name: "components",
          type: "directory",
          description: "React components for the UI"
        },
        {
          name: "pages",
          type: "directory",
          description: "Next.js page components"
        },
        {
          name: "utils",
          type: "directory",
          description: "Utility functions and helpers"
        }
      ]
    },
    {
      name: "api",
      type: "directory",
      children: [
        {
          name: "routes",
          type: "directory",
          description: "API endpoint definitions"
        },
        {
          name: "models",
          type: "directory",
          description: "Data models and schemas"
        }
      ]
    },
    {
      name: "tests",
      type: "directory",
      description: "Unit and integration tests"
    },
    {
      name: "docs",
      type: "directory",
      description: "Project documentation"
    }
  ]
}; 