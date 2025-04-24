#!/usr/bin/env python3
"""
GitHub API Testing Script

This script provides comprehensive examples of using the GitHub API functions
from github_api.py with detailed examples and error handling.
"""

import os
import sys
import json
from pprint import pprint
from dotenv import load_dotenv
import time

# Add print statements to see when functions are called
def print_sep(title):
    print(f"\n{'='*50}\n{title}\n{'='*50}")
    sys.stdout.flush()

print_sep("Loading Environment and Libraries")

# Load environment variables from .env file
load_dotenv()

# Import all functions from github_api.py
try:
    from tasks.github_api import (
        get_owner_repo,
        get_default_branch,
        get_repo_tree,
        get_file_content,
        get_latest_commit_info,
        GITHUB_API_BASE,
        HEADERS
    )
    print("✅ Successfully imported GitHub API functions")
except ImportError as e:
    print(f"❌ Error importing GitHub API functions: {e}")
    print("Make sure you're running this script from the project root directory")
    sys.exit(1)

# Check if GitHub token is set
github_token = os.getenv('GITHUB_TOKEN')
if github_token:
    print(f"GitHub token is set: {github_token[:4]}...{github_token[-4:]}")
else:
    print("⚠️ No GitHub token found. API rate limits will be restricted.")
    print("Consider adding a GITHUB_TOKEN to your .env file for better results.")

def test_url_parsing():
    """Test the URL parsing functionality"""
    print_sep("Testing URL Parsing")

    # Define test repositories
    test_repos = [
        "https://github.com/pallets/flask",           # Flask (Python web framework)
        "https://github.com/tensorflow/tensorflow",   # TensorFlow (ML framework)
        "https://github.com/microsoft/vscode",        # VSCode (Editor)
        "https://github.com/torvalds/linux"           # Linux kernel
    ]

    # Test different URL formats
    test_urls = [
        test_repos[0],                               # Standard URL
        "https://github.com/pallets/flask.git",      # With .git extension
        "http://github.com/pallets/flask",           # HTTP protocol
        "https://github.com/pallets/flask/",         # Trailing slash
        "https://github.com/pallets/flask/tree/main", # Branch reference
        "https://github.com/pallets/flask/blob/main/README.md", # File reference
        "not-a-github-url"                           # Invalid URL
    ]

    # Parse each URL and display results
    for url in test_urls:
        result = get_owner_repo(url)
        print(f"URL: {url}\nResult: {result}\n")
    
    return test_repos[0]  # Return the main repo URL for further tests

def test_default_branch(test_repos):
    """Test getting default branches for repositories"""
    print_sep("Getting Default Branches")

    # Parse owner and repo from our test repositories
    repo_info = []
    for url in test_repos if isinstance(test_repos, list) else [test_repos]:
        owner_repo = get_owner_repo(url)
        if owner_repo:
            owner, repo = owner_repo
            repo_info.append({
                "url": url,
                "owner": owner,
                "repo": repo
            })
            
    # Get default branch for each repository
    for info in repo_info:
        try:
            default_branch = get_default_branch(info["owner"], info["repo"])
            info["default_branch"] = default_branch
            print(f"Repository: {info['owner']}/{info['repo']}")
            print(f"Default branch: {default_branch}\n")
        except Exception as e:
            print(f"Error getting default branch for {info['owner']}/{info['repo']}: {e}\n")

    # Return info for the first repository
    if repo_info:
        return repo_info[0]
    return None

def test_repo_tree(repo_info):
    """Test retrieving the repository file tree"""
    print_sep("Getting Repository Tree")

    if not repo_info:
        print("No repository info available")
        return None, None
    
    try:
        # Get the complete file tree
        owner = repo_info["owner"]
        repo = repo_info["repo"]
        branch = repo_info["default_branch"]
        
        print(f"Getting tree for {owner}/{repo} on branch {branch}")
        tree = get_repo_tree(owner, repo, branch)
        
        # Count files by type
        file_types = {}
        for item in tree:
            if item.get('type') == 'blob':
                path = item.get('path', '')
                ext = path.split('.')[-1] if '.' in path else 'no_extension'
                file_types[ext] = file_types.get(ext, 0) + 1
        
        # Print summary
        print(f"Total items in tree: {len(tree)}")
        print("\nFile types distribution:")
        for ext, count in sorted(file_types.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"{ext}: {count} files")
        
        # Find Python files
        python_files = [item for item in tree if item.get('type') == 'blob' and item.get('path', '').endswith('.py')]
        print(f"\nFound {len(python_files)} Python files.")
        print("\nSample Python files:")
        for file in python_files[:5]:
            print(f"- {file['path']}")
        
        # Return the tree and a sample Python file
        sample_file = python_files[0]['path'] if python_files else None
        return tree, sample_file
        
    except Exception as e:
        print(f"Error getting repository tree: {e}")
        return None, None

def test_file_content(repo_info, tree, sample_file):
    """Test retrieving file content"""
    print_sep("Getting File Content")

    if not repo_info or not tree:
        print("Repository information or tree not available")
        return
    
    owner = repo_info["owner"]
    repo = repo_info["repo"]
    branch = repo_info["default_branch"]
    
    # List of interesting files to check
    files_to_check = []

    # Try to find specific files of interest
    interesting_filenames = ['__init__.py', 'setup.py', 'README.md', 'requirements.txt']
    for filename in interesting_filenames:
        matching_files = [item for item in tree if item.get('type') == 'blob' and item.get('path', '').endswith(filename)]
        if matching_files:
            files_to_check.append(matching_files[0]['path'])

    # Add our sample Python file as well
    if sample_file:
        files_to_check.append(sample_file)

    # Get and display content for each file
    for file_path in files_to_check:
        try:
            content = get_file_content(owner, repo, file_path, branch)
            if content:
                # Truncate content for display
                display_content = content[:500] + '...' if len(content) > 500 else content
                print(f"\nFile: {file_path}")
                print(f"Size: {len(content)} characters")
                print("Content (first 500 chars):")
                print("---")
                print(display_content)
                print("---")
            else:
                print(f"\nFile: {file_path} - No content available")
        except Exception as e:
            print(f"\nError getting content for {file_path}: {e}")

def test_commit_info(repo_info_list):
    """Test retrieving commit information"""
    print_sep("Getting Latest Commit Info")

    if not repo_info_list:
        print("No repository information available")
        return
    
    if not isinstance(repo_info_list, list):
        repo_info_list = [repo_info_list]
    
    # Get commit info for each repository
    for info in repo_info_list:
        try:
            if "owner" not in info or "repo" not in info or "default_branch" not in info:
                print(f"Incomplete repository info for {info.get('url', 'unknown repo')}")
                continue
                
            commit_info = get_latest_commit_info(info["owner"], info["repo"], info["default_branch"])
            print(f"Repository: {info['owner']}/{info['repo']}")
            print(f"Latest commit:")
            print(f"- Date: {commit_info['date']}")
            print(f"- Author: {commit_info['author']}")
            print(f"- Message: {commit_info['message']}\n")
        except Exception as e:
            print(f"Error getting commit info for {info.get('owner', '')}/{info.get('repo', '')}: {e}\n")

def test_error_handling(repo_info):
    """Test error handling with invalid inputs"""
    print_sep("Testing Error Handling")

    if not repo_info:
        print("No repository information available")
        return
    
    owner = repo_info["owner"]
    repo = repo_info["repo"]
    branch = repo_info["default_branch"]
    
    # Test invalid repository
    print("1. Testing with non-existent repository:")
    try:
        result = get_default_branch("nonexistent-user", "nonexistent-repo")
        print(f"Result: {result}")
    except Exception as e:
        print(f"Expected error: {e}")
    
    # Test invalid branch
    print("\n2. Testing with invalid branch:")
    try:
        result = get_repo_tree(owner, repo, "nonexistent-branch")
        print(f"Result: {len(result)} items")
    except Exception as e:
        print(f"Expected error: {e}")
    
    # Test non-existent file
    print("\n3. Testing with non-existent file:")
    result = get_file_content(owner, repo, "non/existent/file.py", branch)
    print(f"Result: {result}")
    
    # Test with invalid URL
    print("\n4. Testing with invalid URL:")
    result = get_owner_repo("https://not-github.com/some/repo")
    print(f"Result: {result}")

def analyze_github_repo(repo_url):
    """
    Perform a comprehensive analysis of a GitHub repository.
    """
    print_sep(f"Analyzing Repository: {repo_url}")
    result = {}
    
    # 1. Parse URL
    owner_repo = get_owner_repo(repo_url)
    if not owner_repo:
        print("❌ Failed to parse repository URL")
        return None
    
    owner, repo = owner_repo
    result["repo_info"] = {
        "url": repo_url,
        "owner": owner,
        "repo": repo
    }
    print(f"✅ Repository parsed: {owner}/{repo}")
    
    # 2. Get default branch
    try:
        default_branch = get_default_branch(owner, repo)
        result["default_branch"] = default_branch
        print(f"✅ Default branch: {default_branch}")
    except Exception as e:
        print(f"❌ Failed to get default branch: {e}")
        return result
    
    # 3. Get latest commit info
    try:
        commit_info = get_latest_commit_info(owner, repo, default_branch)
        result["latest_commit"] = commit_info
        print(f"✅ Latest commit by {commit_info['author']} on {commit_info['date']}")
    except Exception as e:
        print(f"❌ Failed to get commit info: {e}")
        result["latest_commit"] = None
    
    # 4. Get file tree
    try:
        tree = get_repo_tree(owner, repo, default_branch)
        result["tree_size"] = len(tree)
        
        # Analyze file types
        file_types = {}
        for item in tree:
            if item.get('type') == 'blob':
                path = item.get('path', '')
                ext = path.split('.')[-1] if '.' in path else 'no_extension'
                file_types[ext] = file_types.get(ext, 0) + 1
        
        result["file_types"] = file_types
        print(f"✅ Repository tree: {len(tree)} items, {sum(file_types.values())} files")
        
        # Find important files
        important_files = {}
        for filename in ['README.md', 'setup.py', 'requirements.txt', '.gitignore']:
            matches = [item for item in tree if item.get('type') == 'blob' and item.get('path', '').endswith(filename)]
            if matches:
                important_files[filename] = matches[0]['path']
        
        result["important_files"] = important_files
        print(f"✅ Found {len(important_files)} important files")
    except Exception as e:
        print(f"❌ Failed to get file tree: {e}")
        result["tree_size"] = 0
        result["file_types"] = {}
        result["important_files"] = {}
    
    # 5. Get README content if available
    if 'important_files' in result and 'README.md' in result["important_files"]:
        readme_path = result["important_files"]['README.md']
        try:
            readme_content = get_file_content(owner, repo, readme_path, default_branch)
            if readme_content:
                result["readme_size"] = len(readme_content)
                # Get first 100 chars as summary
                readme_summary = readme_content.strip().split('\n')[0][:100]
                result["readme_summary"] = readme_summary
                print(f"✅ README.md: {len(readme_content)} chars")
        except Exception as e:
            print(f"❌ Failed to get README content: {e}")
    
    print("\nAnalysis complete!")
    return result

def main():
    """Main test function"""
    print_sep("GitHub API Testing Script")
    print("This script demonstrates all functions in github_api.py")
    
    start_time = time.time()
    
    # Run all tests in sequence
    main_repo_url = test_url_parsing()
    
    print("\nWill use Flask repository for detailed tests...")
    
    repo_info = test_default_branch(main_repo_url)
    
    tree, sample_file = test_repo_tree(repo_info)
    
    test_file_content(repo_info, tree, sample_file)
    
    test_commit_info(repo_info)
    
    # Run a full analysis
    print("\nNow running a full repository analysis...")
    analysis_result = analyze_github_repo(main_repo_url)
    if analysis_result:
        print_sep("Analysis Results Summary")
        pprint(analysis_result)
    
    # Test error handling
    test_error_handling(repo_info)
    
    end_time = time.time()
    print_sep("Testing Complete")
    print(f"Total runtime: {end_time - start_time:.2f} seconds")

if __name__ == "__main__":
    main() 