# worker/analysis_task.py
# Use shared_task as celery instance might not be available here directly
from celery import shared_task
# Import helpers from services
from services import github_api, llm_handler, code_parser
import supabase_client
import sys
from typing import Dict, Any, List, Set
import logging

from worker.celery_app import celery
from celery import shared_task
import requests

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Constants ---
MAX_FILES_TO_PARSE = 500  # Limit API calls for content
IMPORTANT_FILES = [
    # Python
    "requirements.txt", "Pipfile", "pyproject.toml",
    # JavaScript/Node
    "package.json", "tsconfig.json",
    # Java
    "pom.xml", "build.gradle", "settings.gradle", "build.gradle.kts", "gradle.properties", "web.xml",
    # General
    "Dockerfile"
]  # For framework detection

# --- Celery Task Definition ---
print("[WALKTHROUGH] worker/analysis_task.py: Defining Celery task 'run_codelore_analysis'...")
sys.stdout.flush()

# Use shared_task, bind=True to get 'self'


@shared_task(bind=True)
def run_codelore_analysis(self, repo_url: str, user_token: str = None) -> Dict[str, Any]:
    """
    Celery task to analyze a Git repository *via GitHub API* and generate a narrative.
    Orchestrates API calls, parsing, LLM interaction, and saves results to Supabase.

    Args:
        repo_url: URL of the GitHub repository to analyze
        user_token: Optional GitHub user token for authenticated API calls
    """
    task_id = self.request.id  # Get the REAL task ID from Celery
    if not task_id:
        # Should not happen with bind=True, but as a fallback
        import uuid
        task_id = str(uuid.uuid4())
        print(
            f"[WALKTHROUGH][TASK {task_id}] WARNING: Could not get task ID from request, generated UUID.")

    print(
        f"\n[WALKTHROUGH][TASK {task_id}] Task started for URL: {repo_url} (API Version)")
    print(
        f"[WALKTHROUGH][TASK {task_id}] Using {'user-provided' if user_token else 'default'} GitHub token")
    sys.stdout.flush()

    # --- Initial Status Update ---
    supabase_client.update_table_data(
        task_id,
        {
            "repo_url": repo_url,
            "status": "PENDING",  # Or "STARTED" if task_track_started=True
            "state": "Initializing analysis task",
            "result": None,       # Clear previous result if any
            "progress": 10,
            "error": None,        # No error at this point
            "user_id": None,  # Optional user ID if needed
        }
    )
    print(f"[WALKTHROUGH][TASK {task_id}] Initial status saved to Supabase.")
    sys.stdout.flush()

    # --- Pre-checks ---
    if not llm_handler.gemini_model:
        error_msg = "Gemini API key not configured or model init failed."
        print(
            f"[WALKTHROUGH][TASK {task_id}] ERROR: {error_msg} Failing task.")
        sys.stdout.flush()
        supabase_client.update_analysis_status(task_id, 'FAILURE', error_msg)
        raise RuntimeError(error_msg)  # Re-raise to fail Celery task

    owner_repo = github_api.get_owner_repo(repo_url)
    if not owner_repo:
        error_msg = f"Invalid GitHub URL format: {repo_url}"
        print(f"[WALKTHROUGH][TASK {task_id}] ERROR: {error_msg}")
        sys.stdout.flush()
        supabase_client.update_analysis_status(task_id, 'FAILURE', error_msg)
        raise ValueError(error_msg)  # Re-raise
    owner, repo_name = owner_repo

    try:
        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Pre-checks complete, starting default branch fetch",
                "result": None,
                "progress": 15,
                "error": None,
            }
        )
        # --- 1. Get Default Branch ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 1: Getting default branch...")
        sys.stdout.flush()
        default_branch = github_api.get_default_branch(
            owner, repo_name, user_token)

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Fetched default branch, fetching repository file tree",
                "result": None,
                "progress": 25,
                "error": None,
            }
        )

        # --- 2. Get File Tree ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 2: Getting repository file tree...")
        sys.stdout.flush()
        repo_tree = github_api.get_repo_tree(
            owner, repo_name, default_branch, user_token)
        # No need to fail if tree is empty, analysis will just be sparse

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Repository file tree fetched, preparing for code analysis",
                "result": None,
                "progress": 35,
                "error": None,
            }
        )

        # --- 3. Analyze Code In Memory ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 3: Analyzing Python files (max {MAX_FILES_TO_PARSE})...")
        sys.stdout.flush()
        all_functions: List[str] = []
        all_classes: List[str] = []
        all_imports: Set[str] = set()
        analyzed_files_paths: List[str] = []
        total_py_lines: int = 0
        total_java_lines: int = 0
        parsed_files_count: int = 0
        # Store content of important files
        file_contents_for_framework_detection: Dict[str, str] = {}

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Analyzing Python and Java files in repository",
                "result": None,
                "progress": 55,
                "error": None,
            }
        )

        python_files_in_tree = [item for item in repo_tree if item.get(
            'type') == 'blob' and item.get('path', '').endswith('.py')]
        java_files_in_tree = [item for item in repo_tree if item.get(
            'type') == 'blob' and item.get('path', '').endswith('.java')]
        other_important_files = [item for item in repo_tree if item.get(
            'type') == 'blob' and item.get('path', '') in IMPORTANT_FILES]

        print(f"[WALKTHROUGH][TASK {task_id}] Found {len(python_files_in_tree)} Python files, {len(java_files_in_tree)} Java files, and {len(other_important_files)} other important files.")
        sys.stdout.flush()

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Code file list prepared, starting file content analysis",
                "result": None,
                "progress": 65,
                "error": None,
            }
        )

        # Analyze Python files
        for file_item in python_files_in_tree:
            if parsed_files_count >= MAX_FILES_TO_PARSE:
                break
            file_path = file_item.get('path')
            if not file_path:
                continue
            content = github_api.get_file_content(
                owner, repo_name, file_path, default_branch, user_token)
            if content:
                analysis_result = code_parser.analyze_python_content(
                    content, filename=file_path)
                if analysis_result:
                    analyzed_files_paths.append(file_path)
                    all_functions.extend(analysis_result["functions"])
                    all_classes.extend(analysis_result["classes"])
                    all_imports.update(analysis_result["imports"])
                    total_py_lines += analysis_result["line_count"]
                    parsed_files_count += 1
                    # Store content if it's also an important file type
                    if file_path in IMPORTANT_FILES:
                        file_contents_for_framework_detection[file_path] = content

        # Analyze Java files
        for file_item in java_files_in_tree:
            if parsed_files_count >= MAX_FILES_TO_PARSE:
                break
            file_path = file_item.get('path')
            if not file_path:
                continue
            content = github_api.get_file_content(
                owner, repo_name, file_path, default_branch, user_token)
            if content:
                analysis_result = code_parser.analyze_java_content(
                    content, filename=file_path)
                if analysis_result:
                    analyzed_files_paths.append(file_path)
                    all_functions.extend(analysis_result["functions"])
                    all_classes.extend(analysis_result["classes"])
                    all_imports.update(analysis_result["imports"])
                    total_java_lines += analysis_result["line_count"]
                    parsed_files_count += 1
                    # Store Java files for framework detection
                    file_contents_for_framework_detection[file_path] = content

        # Fetch content for other important files (if not already fetched)
        for file_item in other_important_files:
            file_path = file_item.get('path')
            if file_path and file_path not in file_contents_for_framework_detection:
                content = github_api.get_file_content(
                    owner, repo_name, file_path, default_branch, user_token)
                if content:
                    file_contents_for_framework_detection[file_path] = content

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Code analysis complete, aggregating results",
                "result": None,
                "progress": 75,
                "error": None,
            }
        )

        # Aggregate code analysis results
        code_analysis_results = {
            "files_analyzed_count": parsed_files_count,
            "lines_analyzed_count": total_py_lines + total_java_lines,
            "unique_classes": sorted(list(set(all_classes))),
            "unique_functions": sorted(list(set(all_functions))),
            "unique_imports": sorted(list(all_imports)),
            "analyzed_files_list": analyzed_files_paths
        }
        print(f"[WALKTHROUGH][TASK {task_id}] In-memory code analysis complete. Parsed {parsed_files_count} files ({len(python_files_in_tree)} Python, {len(java_files_in_tree)} Java).")
        sys.stdout.flush()

        # --- 3b. Detect Frameworks ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 3b: Detecting frameworks...")
        sys.stdout.flush()
        detected_frameworks = code_parser.detect_frameworks_from_files(
            file_contents_for_framework_detection,
            # imports=all_imports # Pass Python imports for better detection
        )

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Framework detection complete, preparing commit info fetch",
                "result": None,
                "progress": 80,
                "error": None,
            }
        )

        # --- 4. Get Latest Commit Info ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 4: Getting latest commit info...")
        sys.stdout.flush()
        latest_commit_info = github_api.get_latest_commit_info(
            owner, repo_name, default_branch, user_token)

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Latest commit info fetched, preparing repo info fetch",
                "result": None,
                "progress": 85,
                "error": None,
            }
        )

        # --- 5. Get General Repo Info ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 5: Getting general repo info...")
        sys.stdout.flush()
        repo_info = github_api.get_repo_info(owner, repo_name, user_token)
        title = repo_info.get("name", repo_name)  # Use repo name as title

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Repository info fetched, calculating file type distribution",
                "result": None,
                "progress": 90,
                "error": None,
            }
        )

        # --- 6. Calculate File Type Distribution ---
        print(
            f"[WALKTHROUGH][TASK {task_id}] Step 6: Calculating file type distribution...")
        sys.stdout.flush()
        file_type_distribution = {}
        for item in repo_tree:
            if item.get('type') == 'blob':
                path = item.get('path', '')
                ext = path.split(
                    '.')[-1].lower() if '.' in path else 'no_extension'
                file_type_distribution[ext] = file_type_distribution.get(
                    ext, 0) + 1

        # --- 7. Generate Narrative ---
        print(f"[WALKTHROUGH][TASK {task_id}] Step 7: Generating narrative...")
        sys.stdout.flush()
        narrative_input_data = {
            'latest_commit': latest_commit_info,
            'code_analysis': code_analysis_results,
            'owner': owner,
            'repo_name': repo_name,
            'detected_frameworks': detected_frameworks,
        }
        narrative = llm_handler.generate_narrative(
            narrative_input_data, repo_url)
        print(f"[WALKTHROUGH][TASK {task_id}] Narrative generation complete.")
        sys.stdout.flush()

        supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "PENDING",
                "state": "Narrative generated, preparing to save final result",
                "result": None,
                "progress": 95,
                "error": None,
            }
        )

        # --- 8. Format and Save Final Result ---
        final_result_payload = {
            "narrative": narrative,
            "analysis_details": {
                "repo_url": repo_url,
                "source": "GitHub API",
                "latest_commit": latest_commit_info,
                "code_analysis": code_analysis_results,
            },
            "task_id": task_id,
            "repo_tree": repo_tree,
            "file_type_distribution": file_type_distribution,
            "title": title,
            "repo_info": repo_info,
            "detected_frameworks": detected_frameworks,

        }

        print(
            f"[WALKTHROUGH][TASK {task_id}] Analysis completed successfully. Saving final result to Supabase.")
        sys.stdout.flush()
        # Save all data in a single call with the final SUCCESS state
        save_response = supabase_client.update_table_data(
            task_id,
            {
                "repo_url": repo_url,
                "status": "SUCCESS",
                "state": "Analysis finished, all steps complete",
                "result": final_result_payload,
                "progress": 100,
                "error": None,
            }
        )

        if not save_response or not save_response.data:
            print(
                f"[WALKTHROUGH][TASK {task_id}] WARNING: Failed to save final result to Supabase.")
            logger.warning(
                f"Task {task_id} completed but failed to save final result to Supabase.")

        return {"status": "SUCCESS", "task_id": task_id, "message": "Analysis complete. Result stored."}

    # --- Centralized Error Handling ---
    except (requests.exceptions.RequestException, ValueError, RuntimeError) as e:
        error_type_name = type(e).__name__
        error_message = str(e)
        print(
            f"[WALKTHROUGH][TASK {task_id}] ERROR (Expected - {error_type_name}): Task failed: {error_message}")
        sys.stdout.flush()
        logger.error(
            f"[{task_id}] Task failed for URL {repo_url} with expected error: {e}", exc_info=True)
        supabase_client.update_analysis_status(
            task_id, 'FAILURE', error_message)
        raise e  # Re-raise for Celery
    except Exception as e:
        error_type_name = type(e).__name__
        error_message = str(e)
        print(
            f"[WALKTHROUGH][TASK {task_id}] ERROR (Unexpected - {error_type_name}): Task failed: {error_message}")
        sys.stdout.flush()
        logger.error(
            f"[{task_id}] Task failed unexpectedly for URL {repo_url}: {e}", exc_info=True)
        supabase_client.update_analysis_status(
            task_id, 'FAILURE', 'An unexpected server error occurred during analysis.')
        raise e  # Re-raise for Celery


print("[WALKTHROUGH] worker/analysis_task.py: Finished loading.")
sys.stdout.flush()
