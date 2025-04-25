# api/main.py
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel # Import BaseModel directly
# Import the Celery app instance from the root level
from worker.celery_app import celery
# Import the task function to call .delay/.apply_async
from worker.analysis_task import run_codelore_analysis
# Import supabase client function for polling results
import supabase_client

from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import sys
import logging

print("[WALKTHROUGH] api/main.py: Loading...")
sys.stdout.flush()

# Define request model here or import from models.py if preferred
class RepoInput(BaseModel):
    repo_url: str

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app() -> FastAPI:
    """ Create and configure the FastAPI application. """
    print("[WALKTHROUGH] api/main.py: Creating FastAPI app...")
    sys.stdout.flush()
    current_app = FastAPI(title="CodeLore API", description="API for analyzing Git repos (via API) and generating narratives.")

    current_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Allow all origins for simplicity, restrict in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("[WALKTHROUGH] api/main.py: CORS middleware added.")
    sys.stdout.flush()
    return current_app

app = create_app()
print("[WALKTHROUGH] api/main.py: FastAPI app instance created.")
sys.stdout.flush()

@app.get("/", tags=["General"])
async def read_root():
    """ Basic health check endpoint. """
    print("[WALKTHROUGH] api/main.py: GET / called.")
    sys.stdout.flush()
    return {"message": "CodeLore Backend Running (Modular API Version)"}

@app.post("/analyze", status_code=status.HTTP_202_ACCEPTED, tags=["Analysis"])
async def submit_analysis(request: RepoInput):
    """ Endpoint to submit a Git repository URL for analysis. """
    print(f"[WALKTHROUGH] api/main.py: POST /analyze called with URL: {request.repo_url}")
    sys.stdout.flush()
    repo_url = str(request.repo_url)
    try:
        print(f"[WALKTHROUGH] api/main.py: Sending task for {repo_url} to Celery...")
        sys.stdout.flush()
        # Use apply_async for more control or delay as shortcut
        task = run_codelore_analysis.apply_async(args=[repo_url])
        
        print("taskid: ",task.id)

        task_id = task.id
        print(f"[WALKTHROUGH] api/main.py: Task submitted. Celery Task ID: {task_id}")
        sys.stdout.flush()

        # --- Save initial PENDING state to Supabase ---
        # This allows polling immediately even before the worker picks up the task
        
        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={"message": "Analysis task submitted.", "task_id": task_id, "status": "PENDING"},
        )
    except Exception as e:
        # Handle potential errors during task submission (e.g., broker down)
        print(f"[WALKTHROUGH] api/main.py: ERROR submitting task to Celery: {e}")
        sys.stdout.flush()
        logger.error(f"Failed to submit task to Celery: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Failed to submit analysis task to the queue.")


# Uncommented and adapted for Supabase polling
@app.get("/result/{task_id}", tags=["Analysis"])
async def get_analysis_result(task_id: str):
    """
    Poll this endpoint to get the status and result of an analysis task
    by querying the Supabase database.
    """
    print(f"[WALKTHROUGH] api/main.py: GET /result/{task_id} called.")
    sys.stdout.flush()

    # Query Supabase for the task record
    db_record = supabase_client.get_analysis_from_supabase(task_id)[0]
    
    print(f"[WALKTHROUGH] api/main.py: Supabase query result: {db_record}")

    if not db_record:
        print(f"[WALKTHROUGH] api/main.py: Task {task_id} not found in Supabase.")
        sys.stdout.flush()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Analysis task with ID {task_id} not found.")

    print(f"[WALKTHROUGH] api/main.py: Task {task_id} found in Supabase. Status: {db_record.get('status')}")
    sys.stdout.flush()

    task_status = db_record.get("status")
    task_result_data = db_record.get("result") # This holds the payload or error info

    response_data = {
        "task_id": task_id,
        "status": task_status,
        "result": task_result_data # Return the stored result/error object directly
    }

    # Optionally, you could re-format the error structure here if needed
    # if task_status == 'FAILURE' and isinstance(task_result_data, dict) and 'error' in task_result_data:
    #     response_data["error"] = task_result_data["error"]
    #     del response_data["result"] # Remove result if only showing error

    return JSONResponse(content=response_data)


print("[WALKTHROUGH] api/main.py: Finished loading.")
sys.stdout.flush()