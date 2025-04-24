# app/main.py
from fastapi import FastAPI, HTTPException, status
from celery.result import AsyncResult
import sys
import logging

from .models import AnalyzeRequest
from tasks.celery_app import celery_app # Import the configured app
from tasks.analysis_task import run_codelore_analysis  # Import the task at module level

print("[WALKTHROUGH] main.py: Loading...")
sys.stdout.flush()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CodeLore API", description="API for analyzing Git repos (via API) and generating narratives.")
print("[WALKTHROUGH] main.py: FastAPI app instance created.")
sys.stdout.flush()

@app.get("/", tags=["General"])
async def read_root():
    print("[WALKTHROUGH] main.py: GET / called.")
    sys.stdout.flush()
    return {"message": "CodeLore Backend Running (API Version)"}

@app.post("/analyze", status_code=status.HTTP_202_ACCEPTED, tags=["Analysis"])
async def submit_analysis(request: AnalyzeRequest):
    print(f"[WALKTHROUGH] main.py: POST /analyze called with URL: {request.repo_url}")
    sys.stdout.flush()
    repo_url = str(request.repo_url)
    try:
        print(f"[WALKTHROUGH] main.py: Sending task for {repo_url} to Celery broker...")
        sys.stdout.flush()
        # Call the task directly since it's imported at module level
        task = run_codelore_analysis(repo_url=repo_url)
        print("\n\n\nTask: ",task, task['status'])
        task_id = task['task_id']
        print(f"[WALKTHROUGH] main.py: Task submitted. Celery Task ID: {task_id}")
        sys.stdout.flush()
        return {"message": "Analysis task submitted.", "task_id": task_id}
    except Exception as e:
        print(f"[WALKTHROUGH] main.py: ERROR submitting task to Celery: {e}")
        sys.stdout.flush()
        logger.error(f"Failed to submit task to Celery: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to submit analysis task to the queue.")

@app.get("/result/{task_id}", tags=["Analysis"])
async def get_analysis_result(task_id: str):
    print(f"[WALKTHROUGH] main.py: GET /result/{task_id} called.")
    sys.stdout.flush()
    task_result = AsyncResult(task_id, app=celery_app)
    print(f"[WALKTHROUGH] main.py: Checking status for Task ID: {task_id}. State: {task_result.status}")
    sys.stdout.flush()

    if task_result.ready():
        print(f"[WALKTHROUGH] main.py: Task {task_id} is ready.")
        sys.stdout.flush()
        if task_result.successful():
            print(f"[WALKTHROUGH] main.py: Task {task_id} successful. Getting result...")
            sys.stdout.flush()
            result_data = task_result.get()
            print(f"[WALKTHROUGH] main.py: Task {task_id} result retrieved.")
            sys.stdout.flush()
            # The task now returns the full structure including "status":"SUCCESS"
            return result_data
        else: # Task failed
            print(f"[WALKTHROUGH] main.py: Task {task_id} failed.")
            sys.stdout.flush()
            error_message = "Task failed."
            try:
                # Try to get custom state info set by update_state
                custom_meta = task_result.backend.get(task_result.id)
                if custom_meta and isinstance(custom_meta, dict) and 'exc_message' in custom_meta:
                     error_message = custom_meta.get('exc_message', error_message)
                     print(f"[WALKTHROUGH] main.py: Task {task_id} failure reason (from meta): {error_message}")
                elif task_result.info: # Fallback to basic info
                    error_message = str(task_result.info) if isinstance(task_result.info, Exception) else repr(task_result.info)
                    print(f"[WALKTHROUGH] main.py: Task {task_id} failure reason (from info): {error_message}")
                sys.stdout.flush()
            except Exception as e:
                 print(f"[WALKTHROUGH] main.py: Task {task_id} error retrieving failure details: {e}")
                 sys.stdout.flush()
                 logger.error(f"Error retrieving result for failed task {task_id}: {e}", exc_info=True)
                 error_message = str(e)

            return {"status": task_result.status, "error": error_message}
    else:
        # Task not ready yet
        print(f"[WALKTHROUGH] main.py: Task {task_id} not ready (Status: {task_result.status}).")
        sys.stdout.flush()
        return {"status": task_result.status}

print("[WALKTHROUGH] main.py: Finished loading.")
sys.stdout.flush()