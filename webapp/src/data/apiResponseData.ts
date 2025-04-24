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
export const sampleApiResponse: ApiResponse = {
  status: "completed",
  narrative: "This repository is a modern React application built with Next.js that provides an AI-powered tool for analyzing and understanding code repositories. The application uses a combination of GitHub API integration and large language models to parse code and generate human-readable narratives about the codebase structure, components, and architecture. \n\nThe frontend is built with TypeScript, React, and Tailwind CSS, featuring a responsive design with various components for displaying repository information, analysis results, and visual representations of code statistics. The application follows a component-based architecture with clear separation of concerns between data fetching, presentation, and state management.\n\nThe repository contains well-organized components for navigation, displaying repository details, and presenting code analysis in various formats including structured overviews, technical narratives, and component breakdowns. The UI is polished with attention to detail in styling and user experience.",
  analysis_details: {
    repo_url: "https://github.com/codelore-dev/codelore",
    source: "github",
    latest_commit: {
      date: "2023-11-15T14:32:18Z",
      message: "Update repository analysis component with improved data visualization",
      author: "Sarah Johnson"
    },
    code_analysis: {
      files_analyzed_count: 42,
      lines_analyzed_count: 3726,
      unique_classes: [
        "Repository", "Analysis", "StructureItem", "KeyComponent", 
        "Technology", "Narrative", "RepositoryHeader", "RepositoryAnalysis",
        "Hero", "Navbar", "Footer"
      ],
      unique_functions: [
        "analyzeRepository", "fetchRepository", "parseCodeStructure", 
        "analyzeDependencies", "generateNarrative", "renderStructure",
        "setActiveTab", "handleSubmit", "RepositoryPage", "RepositoriesPage"
      ],
      unique_imports: [
        "react", "next/link", "next/navigation", "react-dom",
        "@/data/dummyData", "@/components/Navbar", "@/components/Footer",
        "@/components/Hero", "@/components/RepositoryCard", "@/components/RepositoryHeader"
      ],
      analyzed_files_list: [
        "src/app/page.tsx",
        "src/app/layout.tsx",
        "src/app/repositories/page.tsx",
        "src/app/repositories/[id]/page.tsx",
        "src/app/about/page.tsx",
        "src/components/Navbar.tsx",
        "src/components/Hero.tsx",
        "src/components/RepositoryCard.tsx",
        "src/components/RepositoryHeader.tsx",
        "src/components/RepositoryAnalysis.tsx",
        "src/components/Footer.tsx",
        "src/data/dummyData.ts",
        "tailwind.config.ts"
      ]
    }
  },
  task_id: "task_20231115_a7f939e2",
  repo_tree: [
    {
      path: "webapp",
      mode: "040000",
      type: "tree",
      sha: "7b9e0c8f9c8e6d7b6a5b4c3b2a1b0a9f8e7d6c5b",
      size: 0,
      url: "https://api.github.com/repos/codelore-dev/codelore/git/trees/7b9e0c8f9c8e6d7b6a5b4c3b2a1b0a9f8e7d6c5b"
    },
    {
      path: "webapp/src",
      mode: "040000",
      type: "tree",
      sha: "6a5b4c3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b",
      size: 0,
      url: "https://api.github.com/repos/codelore-dev/codelore/git/trees/6a5b4c3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b"
    },
    {
      path: "webapp/src/app",
      mode: "040000",
      type: "tree",
      sha: "5b4c3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a",
      size: 0,
      url: "https://api.github.com/repos/codelore-dev/codelore/git/trees/5b4c3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a"
    },
    {
      path: "webapp/src/app/page.tsx",
      mode: "100644",
      type: "blob",
      sha: "4c3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a5b",
      size: 8645,
      url: "https://api.github.com/repos/codelore-dev/codelore/git/blobs/4c3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a5b"
    },
    {
      path: "webapp/src/app/layout.tsx",
      mode: "100644",
      type: "blob",
      sha: "3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a5b4c",
      size: 576,
      url: "https://api.github.com/repos/codelore-dev/codelore/git/blobs/3b2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a5b4c"
    },
    {
      path: "webapp/src/components",
      mode: "040000",
      type: "tree",
      sha: "2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a5b4c3b",
      size: 0,
      url: "https://api.github.com/repos/codelore-dev/codelore/git/trees/2a1b0a9f8e7d6c5b4a3b2c1d0e9f8a7b6a5b4c3b"
    }
  ],
  file_type_distribution: {
    "tsx": 12,
    "ts": 5,
    "css": 1,
    "json": 2,
    "md": 1
  },
  title: "Codelore: AI-Powered Code Repository Analysis Platform",
  repo_info: {
    id: 123456789,
    node_id: "R_kgDOG1a2xQ",
    name: "codelore",
    full_name: "codelore-dev/codelore",
    private: false,
    owner: {
      login: "codelore-dev",
      id: 98765432,
      node_id: "MDQ6VXNlcjk4NzY1NDMy",
      avatar_url: "https://avatars.githubusercontent.com/u/98765432?v=4",
      gravatar_id: "",
      url: "https://api.github.com/users/codelore-dev",
      html_url: "https://github.com/codelore-dev",
      followers_url: "https://api.github.com/users/codelore-dev/followers",
      following_url: "https://api.github.com/users/codelore-dev/following{/other_user}",
      gists_url: "https://api.github.com/users/codelore-dev/gists{/gist_id}",
      starred_url: "https://api.github.com/users/codelore-dev/starred{/owner}{/repo}",
      subscriptions_url: "https://api.github.com/users/codelore-dev/subscriptions",
      organizations_url: "https://api.github.com/users/codelore-dev/orgs",
      repos_url: "https://api.github.com/users/codelore-dev/repos",
      events_url: "https://api.github.com/users/codelore-dev/events{/privacy}",
      received_events_url: "https://api.github.com/users/codelore-dev/received_events",
      type: "Organization",
      user_view_type: "Organization",
      site_admin: false
    },
    html_url: "https://github.com/codelore-dev/codelore",
    description: "AI-powered platform for analyzing and generating narratives about code repositories",
    fork: false,
    url: "https://api.github.com/repos/codelore-dev/codelore",
    forks_url: "https://api.github.com/repos/codelore-dev/codelore/forks",
    keys_url: "https://api.github.com/repos/codelore-dev/codelore/keys{/key_id}",
    collaborators_url: "https://api.github.com/repos/codelore-dev/codelore/collaborators{/collaborator}",
    teams_url: "https://api.github.com/repos/codelore-dev/codelore/teams",
    hooks_url: "https://api.github.com/repos/codelore-dev/codelore/hooks",
    issue_events_url: "https://api.github.com/repos/codelore-dev/codelore/issues/events{/number}",
    events_url: "https://api.github.com/repos/codelore-dev/codelore/events",
    assignees_url: "https://api.github.com/repos/codelore-dev/codelore/assignees{/user}",
    branches_url: "https://api.github.com/repos/codelore-dev/codelore/branches{/branch}",
    tags_url: "https://api.github.com/repos/codelore-dev/codelore/tags",
    blobs_url: "https://api.github.com/repos/codelore-dev/codelore/git/blobs{/sha}",
    git_tags_url: "https://api.github.com/repos/codelore-dev/codelore/git/tags{/sha}",
    git_refs_url: "https://api.github.com/repos/codelore-dev/codelore/git/refs{/sha}",
    trees_url: "https://api.github.com/repos/codelore-dev/codelore/git/trees{/sha}",
    statuses_url: "https://api.github.com/repos/codelore-dev/codelore/statuses/{sha}",
    languages_url: "https://api.github.com/repos/codelore-dev/codelore/languages",
    stargazers_url: "https://api.github.com/repos/codelore-dev/codelore/stargazers",
    contributors_url: "https://api.github.com/repos/codelore-dev/codelore/contributors",
    subscribers_url: "https://api.github.com/repos/codelore-dev/codelore/subscribers",
    subscription_url: "https://api.github.com/repos/codelore-dev/codelore/subscription",
    commits_url: "https://api.github.com/repos/codelore-dev/codelore/commits{/sha}",
    git_commits_url: "https://api.github.com/repos/codelore-dev/codelore/git/commits{/sha}",
    comments_url: "https://api.github.com/repos/codelore-dev/codelore/comments{/number}",
    issue_comment_url: "https://api.github.com/repos/codelore-dev/codelore/issues/comments{/number}",
    contents_url: "https://api.github.com/repos/codelore-dev/codelore/contents/{+path}",
    compare_url: "https://api.github.com/repos/codelore-dev/codelore/compare/{base}...{head}",
    merges_url: "https://api.github.com/repos/codelore-dev/codelore/merges",
    archive_url: "https://api.github.com/repos/codelore-dev/codelore/{archive_format}{/ref}",
    downloads_url: "https://api.github.com/repos/codelore-dev/codelore/downloads",
    issues_url: "https://api.github.com/repos/codelore-dev/codelore/issues{/number}",
    pulls_url: "https://api.github.com/repos/codelore-dev/codelore/pulls{/number}",
    milestones_url: "https://api.github.com/repos/codelore-dev/codelore/milestones{/number}",
    notifications_url: "https://api.github.com/repos/codelore-dev/codelore/notifications{?since,all,participating}",
    labels_url: "https://api.github.com/repos/codelore-dev/codelore/labels{/name}",
    releases_url: "https://api.github.com/repos/codelore-dev/codelore/releases{/id}",
    deployments_url: "https://api.github.com/repos/codelore-dev/codelore/deployments",
    created_at: "2023-08-15T10:24:32Z",
    updated_at: "2023-11-15T14:32:18Z",
    pushed_at: "2023-11-15T14:32:18Z",
    git_url: "git://github.com/codelore-dev/codelore.git",
    ssh_url: "git@github.com:codelore-dev/codelore.git",
    clone_url: "https://github.com/codelore-dev/codelore.git",
    svn_url: "https://github.com/codelore-dev/codelore",
    homepage: "https://codelore.dev",
    size: 2456,
    stargazers_count: 187,
    watchers_count: 187,
    language: "TypeScript",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    has_discussions: true,
    forks_count: 23,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 15,
    license: "MIT",
    allow_forking: true,
    is_template: false,
    web_commit_signoff_required: false,
    topics: [
      "ai",
      "code-analysis",
      "documentation",
      "github-api",
      "nextjs",
      "react",
      "typescript"
    ],
    visibility: "public",
    forks: 23,
    open_issues: 15,
    watchers: 187,
    default_branch: "main",
    permissions: {
      admin: false,
      maintain: false,
      push: false,
      triage: false,
      pull: true
    },
    temp_clone_token: "",
    allow_squash_merge: true,
    allow_merge_commit: true,
    allow_rebase_merge: true,
    allow_auto_merge: false,
    delete_branch_on_merge: true,
    allow_update_branch: true,
    use_squash_pr_title_as_default: false,
    squash_merge_commit_message: "COMMIT_MESSAGES",
    squash_merge_commit_title: "COMMIT_OR_PR_TITLE",
    merge_commit_message: "PR_TITLE",
    merge_commit_title: "MERGE_MESSAGE",
    security_and_analysis: {
      secret_scanning: {
        status: "enabled"
      },
      secret_scanning_push_protection: {
        status: "enabled"
      },
      dependabot_security_updates: {
        status: "enabled"
      }
    },
    network_count: 23,
    subscribers_count: 12
  }
}; 