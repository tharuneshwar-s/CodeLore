# tasks/analysis_task.py
import logging
import sys
import time # Optional for adding delays
from typing import Dict, Any, List, Set
import requests # For catching RequestException

# Import Celery app and helpers from sibling modules
from .celery_app import celery_app
from . import github_api
from . import code_parser
from . import llm_handler

import uuid

print("[WALKTHROUGH] analysis_task.py: Loading...")
sys.stdout.flush()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Constants ---
MAX_FILES_TO_PARSE = 200 # Limit API calls for content

# --- Celery Task Definition ---
print("[WALKTHROUGH] analysis_task.py: Defining Celery task 'run_codelore_analysis'...")
sys.stdout.flush()

@celery_app.task(bind=True, name='run_codelore_analysis')
def run_codelore_analysis(self, repo_url: str) -> Dict[str, Any]:
    """
    Celery task to analyze a Git repository *via GitHub API* and generate a narrative.
    Orchestrates API calls, parsing, and LLM interaction.
    """
    task_id = str(uuid.uuid4())
    
    print(f"\n[WALKTHROUGH][TASK {task_id}] Task started for URL: {repo_url} (API Version)")
    sys.stdout.flush()

    # --- Pre-checks ---
    if not llm_handler.gemini_model: # Check if Gemini model loaded in llm_handler
        print(f"[WALKTHROUGH][TASK {task_id}] ERROR: Gemini API not configured. Failing task.")
        sys.stdout.flush()
        self.update_state(state='FAILURE', meta={'exc_type': 'ConfigurationError', 'exc_message': 'Gemini API key not configured or model init failed.'})
        raise RuntimeError("Gemini API key not configured.")

    owner_repo = github_api.get_owner_repo(repo_url)
    if not owner_repo:
        print(f"[WALKTHROUGH][TASK {task_id}] ERROR: Could not parse owner/repo from URL: {repo_url}")
        sys.stdout.flush()
        self.update_state(state='FAILURE', meta={'exc_type': 'ValueError', 'exc_message': f'Invalid GitHub URL format: {repo_url}'})
        raise ValueError(f"Invalid GitHub URL format: {repo_url}")
    owner, repo_name = owner_repo

    try:
        # --- 1. Get Default Branch ---
        print(f"[WALKTHROUGH][TASK {task_id}] Step 1: Getting default branch...")
        sys.stdout.flush()
        default_branch = github_api.get_default_branch(owner, repo_name)

        # --- 2. Get File Tree ---
        print(f"[WALKTHROUGH][TASK {task_id}] Step 2: Getting repository file tree...")
        sys.stdout.flush()
        repo_tree = github_api.get_repo_tree(owner, repo_name, default_branch)
        if not repo_tree:
             print(f"[WALKTHROUGH][TASK {task_id}] WARNING: Repository tree appears empty.")
             # Allow proceeding, analysis will just find nothing
             # raise ValueError("Repository tree is empty or could not be fetched via API.")

        # --- 3. Analyze Code In Memory ---
        print(f"[WALKTHROUGH][TASK {task_id}] Step 3: Analyzing Python files in memory (max {MAX_FILES_TO_PARSE})...")
        sys.stdout.flush()
        all_functions: List[str] = []
        all_classes: List[str] = []
        all_imports: Set[str] = set()
        analyzed_files_paths: List[str] = []
        total_py_lines: int = 0
        parsed_files_count: int = 0

        python_files_in_tree = [item for item in repo_tree if item.get('type') == 'blob' and item.get('path', '').endswith('.py')]
        print(f"[WALKTHROUGH][TASK {task_id}] Found {len(python_files_in_tree)} potential Python files.")
        sys.stdout.flush()

        for file_item in python_files_in_tree:
            if parsed_files_count >= MAX_FILES_TO_PARSE:
                print(f"[WALKTHROUGH][TASK {task_id}] Reached max file parse limit.")
                sys.stdout.flush()
                break

            file_path = file_item.get('path')
            if not file_path: continue

            # Optional: Add a small delay to respect potential secondary rate limits
            # time.sleep(0.1)

            content = github_api.get_file_content(owner, repo_name, file_path, default_branch)
            if content:
                analysis_result = code_parser.analyze_python_content(content, filename=file_path)
                if analysis_result:
                    analyzed_files_paths.append(file_path)
                    all_functions.extend(analysis_result["functions"])
                    all_classes.extend(analysis_result["classes"])
                    all_imports.update(analysis_result["imports"])
                    total_py_lines += analysis_result["line_count"]
                    parsed_files_count += 1
                # else: SyntaxError already logged by parser

        # Aggregate code analysis results
        code_analysis_results = {
            "files_analyzed_count": parsed_files_count,
            "lines_analyzed_count": total_py_lines,
            "unique_classes": sorted(list(set(all_classes))),
            "unique_functions": sorted(list(set(all_functions))),
            "unique_imports": sorted(list(all_imports)),
            "analyzed_files_list": analyzed_files_paths
        }
        print(f"[WALKTHROUGH][TASK {task_id}] In-memory code analysis complete. Parsed {parsed_files_count} files.")
        sys.stdout.flush()

        # --- 4. Get Latest Commit Info ---
        print(f"[WALKTHROUGH][TASK {task_id}] Step 4: Getting latest commit info...")
        sys.stdout.flush()
        latest_commit_info = github_api.get_latest_commit_info(owner, repo_name, default_branch)
        print(f"[WALKTHROUGH][TASK {task_id}] Latest commit info retrieved.")
        sys.stdout.flush()

        # --- 5. Generate Narrative ---
        print(f"[WALKTHROUGH][TASK {task_id}] Step 5: Generating narrative...")
        sys.stdout.flush()
        narrative_input_data = {
            'latest_commit': latest_commit_info,
            'code_analysis': code_analysis_results,
            'owner': owner,
            'repo_name': repo_name
        }
        narrative = llm_handler.generate_narrative(narrative_input_data, repo_url)
        print(f"[WALKTHROUGH][TASK {task_id}] Narrative generation complete.")
        sys.stdout.flush()

        # --- 7. Get Repository Tree and File Type Distribution ---
        repo_tree_full = github_api.get_repo_tree(owner, repo_name, default_branch)
        file_type_distribution = {}
        for item in repo_tree_full:
            if item.get('type') == 'blob':
                ext = item.get('path', '').split('.')[-1] if '.' in item.get('path', '') else 'no_extension'
                file_type_distribution[ext] = file_type_distribution.get(ext, 0) + 1

        # --- 8. Attach repo_info and title dynamically ---
        repo_info = github_api.get_repo_info(owner, repo_name)
        title = repo_info.get("name", repo_name)

        final_result = {
            "status": "SUCCESS",
            "narrative": narrative,
            "analysis_details": {
                 "repo_url": repo_url,
                 "source": "GitHub API",
                 "latest_commit": latest_commit_info,
                 "code_analysis": code_analysis_results,
            },
            "task_id": task_id,
            "repo_tree": repo_tree_full,
            "file_type_distribution": file_type_distribution,
            "title": title,
            "repo_info": repo_info
        }
        print(f"[WALKTHROUGH][TASK {task_id}] Analysis completed successfully (API Version). Returning result.")
        return final_result

    # --- Centralized Error Handling ---
    except (requests.exceptions.RequestException, ValueError, RuntimeError) as e:
        # Catch API errors, ValueErrors (e.g., bad URL), RuntimeErrors (e.g., LLM config)
        error_type_name = type(e).__name__
        error_message = str(e)
        print(f"[WALKTHROUGH][TASK {task_id}] ERROR (Expected - {error_type_name}): Task failed: {error_message}")
        sys.stdout.flush()
        logger.error(f"[{task_id}] Task failed for URL {repo_url} with expected error: {e}", exc_info=True)
        self.update_state(state='FAILURE', meta={'exc_type': error_type_name, 'exc_message': error_message})
        raise e
    except Exception as e:
        # Catch any other unexpected errors during orchestration
        error_type_name = type(e).__name__
        error_message = str(e)
        print(f"[WALKTHROUGH][TASK {task_id}] ERROR (Unexpected - {error_type_name}): Task failed: {error_message}")
        sys.stdout.flush()
        logger.error(f"[{task_id}] Task failed unexpectedly for URL {repo_url}: {e}", exc_info=True)
        self.update_state(state='FAILURE', meta={'exc_type': error_type_name, 'exc_message': 'An unexpected server error occurred during analysis.'})
        raise e
    # No finally block needed as there's no temp dir

print("[WALKTHROUGH] analysis_task.py: Finished loading.")
sys.stdout.flush()