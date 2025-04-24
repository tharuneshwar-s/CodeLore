# tasks/github_api.py
import os
import requests
import base64
import sys
from urllib.parse import urlparse
from typing import Dict, Any, List, Optional, Tuple

print("[WALKTHROUGH] github_api.py: Loading...")
sys.stdout.flush()

GITHUB_API_BASE = "https://api.github.com"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
HEADERS = {"Accept": "application/vnd.github.v3+json"}
if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"token {GITHUB_TOKEN}"
    print("[WALKTHROUGH] github_api.py: Using GitHub API Token.")
else:
    print("[WALKTHROUGH] github_api.py: No GitHub API Token found (lower rate limits).")
sys.stdout.flush()

def get_owner_repo(repo_url: str) -> Optional[Tuple[str, str]]:
    """ Parses owner and repo name from GitHub URL. """
    print(f"[WALKTHROUGH] github_api.py: Parsing URL: {repo_url}")
    sys.stdout.flush()
    try:
        parsed = urlparse(repo_url)
        if parsed.netloc.lower() == 'github.com':
            path_parts = [part for part in parsed.path.strip('/').split('/') if part]
            if len(path_parts) >= 2:
                owner, repo = path_parts[0], path_parts[1].replace('.git', '')
                print(f"[WALKTHROUGH] github_api.py: Parsed owner={owner}, repo={repo}")
                sys.stdout.flush()
                return owner, repo
    except Exception as e:
        print(f"[WALKTHROUGH] github_api.py: Error parsing repo URL {repo_url}: {e}")
        sys.stdout.flush()
    print(f"[WALKTHROUGH] github_api.py: Failed to parse owner/repo from URL.")
    sys.stdout.flush()
    return None

def get_default_branch(owner: str, repo: str) -> str:
    """ Gets the default branch name via GitHub API. Raises ValueError on failure. """
    print(f"[WALKTHROUGH] github_api.py: Getting default branch for {owner}/{repo}...")
    sys.stdout.flush()
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        # response.raise_for_status()
        repo_info = response.json()
        # print("repo_info: ", repo_info)
        default_branch = repo_info.get('default_branch', 'main')
        print(f"[WALKTHROUGH] github_api.py: Default branch is '{default_branch}'.")
        sys.stdout.flush()
        return default_branch
    except requests.exceptions.RequestException as e:
        print(f"[WALKTHROUGH] github_api.py: ERROR fetching repo info: {e}")
        sys.stdout.flush()
        raise ValueError(f"Failed to fetch repo info for {owner}/{repo}. Is it public? Error: {e}") from e

def get_repo_tree(owner: str, repo: str, branch: str) -> List[Dict[str, Any]]:
    """ Gets the recursive file tree via GitHub API. Raises ValueError on failure. """
    print(f"[WALKTHROUGH] github_api.py: Getting file tree for {owner}/{repo} (branch: {branch})...")
    sys.stdout.flush()
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{branch}?recursive=1"
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        tree_data = response.json()
        if tree_data.get("truncated"):
            print(f"[WALKTHROUGH] github_api.py: WARNING - File tree was truncated by API.")
            sys.stdout.flush()
        file_list = tree_data.get("tree", [])
        print(f"[WALKTHROUGH] github_api.py: Found {len(file_list)} items in tree.")
        sys.stdout.flush()
        return file_list
    except requests.exceptions.RequestException as e:
        print(f"[WALKTHROUGH] github_api.py: ERROR fetching file tree: {e}")
        sys.stdout.flush()
        raise ValueError(f"Failed to fetch file tree for {owner}/{repo}. Error: {e}") from e

def get_file_content(owner: str, repo: str, file_path: str, branch: str) -> Optional[str]:
    """ Gets file content via GitHub API (decodes Base64). Returns None on failure. """
    # print(f"[WALKTHROUGH] github_api.py: Getting content for {file_path}...") # Verbose
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{file_path}?ref={branch}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=15)
        response.raise_for_status()
        file_info = response.json()
        content_b64 = file_info.get('content')
        if content_b64:
            decoded_bytes = base64.b64decode(content_b64)
            return decoded_bytes.decode('utf-8', errors='ignore')
        return None # No content field
    except requests.exceptions.HTTPError as e:
        if e.response.status_code != 404: # Log errors other than Not Found
             print(f"[WALKTHROUGH] github_api.py: ERROR fetching content for {file_path} (Status {e.response.status_code}): {e}")
             sys.stdout.flush()
        # else: print(f"[WALKTHROUGH] github_api.py: File not found: {file_path}") # Verbose
        return None
    except Exception as e: # Catch other errors like decoding
        print(f"[WALKTHROUGH] github_api.py: ERROR processing content for {file_path}: {e}")
        sys.stdout.flush()
        return None

def get_latest_commit_info(owner: str, repo: str, branch: str) -> Dict[str, Any]:
    """ Gets info for the latest commit on a branch via GitHub API. """
    print(f"[WALKTHROUGH] github_api.py: Getting latest commit for {owner}/{repo} (branch: {branch})...")
    sys.stdout.flush()
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/commits?sha={branch}&per_page=1"
    commit_info = {"date": "N/A", "message": "Could not fetch commit info", "author": "N/A"}
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        commits_data = response.json()
        if commits_data:
            latest = commits_data[0]
            commit_info["date"] = latest.get("commit", {}).get("author", {}).get("date", "N/A")
            commit_info["message"] = latest.get("commit", {}).get("message", "N/A").strip().splitlines()[0][:150]
            commit_info["author"] = latest.get("commit", {}).get("author", {}).get("name", "N/A")
        else:
            commit_info["message"] = "No commits found for the branch via API"
    except requests.exceptions.RequestException as e:
        print(f"[WALKTHROUGH] github_api.py: ERROR fetching commit info: {e}")
        sys.stdout.flush()
        # Keep default error message

    print(f"[WALKTHROUGH] github_api.py: Latest commit info retrieved.")
    sys.stdout.flush()
    return commit_info

def get_repo_info(owner: str, repo: str) -> dict:
    """Fetches the full repository info from the GitHub API."""
    print(f"[WALKTHROUGH] github_api.py: Fetching full repo info for {owner}/{repo}...")
    sys.stdout.flush()
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}"
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        repo_info = response.json()
        print(f"[WALKTHROUGH] github_api.py: Repo info fetched.")
        sys.stdout.flush()
        return repo_info
    except Exception as e:
        print(f"[WALKTHROUGH] github_api.py: ERROR fetching repo info: {e}")
        sys.stdout.flush()
        return {}

print("[WALKTHROUGH] github_api.py: Finished loading.")
sys.stdout.flush()