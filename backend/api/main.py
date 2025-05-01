# api/main.py
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel  # Import BaseModel directly
# Import the Celery app instance from the root level
from worker.celery_app import celery
# Import the task function to call .delay/.apply_async
from worker.analysis_task import run_codelore_analysis
# Import supabase client function for polling results
import supabase_client
# Import helpers from services
from services import github_api, llm_handler, code_parser
from services import graph_generator  # Add import for graph generator service
from services import uml_generator  # Add import for UML generator service

from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import sys
import logging
from typing import Optional
import os
import requests

print("[WALKTHROUGH] api/main.py: Loading...")
sys.stdout.flush()

# Define request model here or import from models.py if preferred


class RepoInput(BaseModel):
    repo_url: str
    user_token: Optional[str] = None
    user_id: Optional[str] = None  # Optional user ID for tracking

# Add new model for code component details request


class CodeComponentRequest(BaseModel):
    component_name: str
    component_type: str  # 'class' or 'function'
    repo_url: str
    context: dict = {}  # Optional context about the component with default empty dict

# Add the new request model


class GraphRequest(BaseModel):
    repo_url: str
    task_id: str

# Add the new request model


class UmlRequest(BaseModel):
    repo_url: str
    task_id: str

# Add new model for GitHub OAuth


class GitHubOAuthRequest(BaseModel):
    code: str


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    """ Create and configure the FastAPI application. """
    print("[WALKTHROUGH] api/main.py: Creating FastAPI app...")
    sys.stdout.flush()
    current_app = FastAPI(
        title="CodeLore API", description="API for analyzing Git repos (via API) and generating narratives.")

    current_app.add_middleware(
        CORSMiddleware,
        # Allow all origins for simplicity, restrict in production
        allow_origins=["*"],
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
    print(
        f"[WALKTHROUGH] api/main.py: POST /analyze called with URL: {request.repo_url}")
    sys.stdout.flush()
    repo_url = str(request.repo_url)
    user_token = request.user_token
    user_id = request.user_id

    print("\n\n\n\nuser_id: ", user_id)

    try:
        print(
            f"[WALKTHROUGH] api/main.py: Sending task for {repo_url} to Celery...")
        sys.stdout.flush()
        # Use apply_async for more control or delay as shortcut
        task = run_codelore_analysis.apply_async(args=[repo_url, user_token])

        print("taskid: ", task.id)

        task_id = task.id
        print(
            f"[WALKTHROUGH] api/main.py: Task submitted. Celery Task ID: {task_id}")
        sys.stdout.flush()

        # --- Save initial PENDING state to Supabase ---
        # This allows polling immediately even before the worker picks up the task
        supabase_client.save_analysis_to_supabase({
            "task_id": task_id,
            "repo_url": repo_url,
            "status": "PENDING",  # Or "STARTED" if task_track_started=True
            "result": None,  # Clear previous result if any
            "progress": 0,
            "error": None,
            "user_id": user_id
        })

        return JSONResponse(
            status_code=status.HTTP_202_ACCEPTED,
            content={"message": "Analysis task submitted.",
                     "task_id": task_id, "status": "PENDING"},
        )
    except Exception as e:
        # Handle potential errors during task submission (e.g., broker down)
        print(
            f"[WALKTHROUGH] api/main.py: ERROR submitting task to Celery: {e}")
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
        print(
            f"[WALKTHROUGH] api/main.py: Task {task_id} not found in Supabase.")
        sys.stdout.flush()
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Analysis task with ID {task_id} not found.")

    print(
        f"[WALKTHROUGH] api/main.py: Task {task_id} found in Supabase. Status: {db_record.get('status')}")
    sys.stdout.flush()

    task_status = db_record.get("status")
    # This holds the payload or error info
    task_result_data = db_record.get("result")

    response_data = {
        "task_id": task_id,
        "status": task_status,
        "result": task_result_data  # Return the stored result/error object directly
    }

    # Optionally, you could re-format the error structure here if needed
    # if task_status == 'FAILURE' and isinstance(task_result_data, dict) and 'error' in task_result_data:
    #     response_data["error"] = task_result_data["error"]
    #     del response_data["result"] # Remove result if only showing error

    return JSONResponse(content=response_data)


@app.post("/component-details", tags=["Analysis"])
async def get_component_details(request: CodeComponentRequest):
    """
    Get detailed description and usage information about a specific code component
    (class or function) within a repository.
    """
    print(
        f"[WALKTHROUGH] api/main.py: POST /component-details called for {request.component_type}: {request.component_name}")
    sys.stdout.flush()

    try:
        # Import the LLM handler function here to avoid circular imports
        from services.llm_handler import generate_component_description

        result = generate_component_description(
            component_name=request.component_name,
            component_type=request.component_type,
            repo_url=request.repo_url,
            context=request.context
        )

        # Return the full structured result
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=result
        )

    except Exception as e:
        print(
            f"[WALKTHROUGH] api/main.py: ERROR generating component details: {e}")
        sys.stdout.flush()
        logger.error(
            f"Failed to generate component details: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate component details: {str(e)}"
        )


@app.post("/repo-graphs", tags=["Analysis"])
async def get_repository_graphs(request: GraphRequest):
    """
    Generate and return various graphs for a repository based on analysis data.
    """
    print(
        f"[WALKTHROUGH] api/main.py: POST /repo-graphs called for task_id: {request.task_id}")
    sys.stdout.flush()

    try:
        # Get the stored analysis data from Supabase
        response = supabase_client.get_analysis_data(request.task_id)
        if not response or not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis data not found for task ID: {request.task_id}"
            )

        # Get the analysis results from the response
        analysis_data = response.data[0].get('result', {})

        if not analysis_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No analysis results found for task ID: {request.task_id}"
            )

        # Generate all graphs
        graph_data = graph_generator.generate_all_graphs(analysis_data)

        # Return the graph data
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=graph_data
        )

    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        print(
            f"[WALKTHROUGH] api/main.py: ERROR generating repository graphs: {e}")
        sys.stdout.flush()
        logger.error(
            f"Failed to generate repository graphs: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate repository graphs: {str(e)}"
        )


@app.post("/repo-uml", tags=["Analysis"])
async def get_repository_uml(request: UmlRequest):
    """
    Generate and return UML diagrams for a repository based on analysis data.
    """
    print(
        f"[WALKTHROUGH] api/main.py: POST /repo-uml called for task_id: {request.task_id}")
    sys.stdout.flush()

    try:
        # Get the stored analysis data from Supabase
        response = supabase_client.get_analysis_data(request.task_id)
        if not response or not response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Analysis data not found for task ID: {request.task_id}"
            )

        # Get the analysis results from the response
        analysis_data = response.data[0].get('result', {})

        if not analysis_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No analysis results found for task ID: {request.task_id}"
            )

        # Generate UML diagrams
        uml_data = uml_generator.generate_all_uml_diagrams(analysis_data)

        # Return the UML diagram data
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content=uml_data
        )

    except HTTPException as e:
        # Re-raise HTTP exceptions
        raise e
    except Exception as e:
        print(f"[WALKTHROUGH] api/main.py: ERROR generating UML diagrams: {e}")
        sys.stdout.flush()
        logger.error(f"Failed to generate UML diagrams: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate UML diagrams: {str(e)}"
        )


@app.post("/auth/github", tags=["Authentication"])
async def github_oauth(request: GitHubOAuthRequest):
    """
    Exchange GitHub OAuth code for access token
    """
    print(f"[WALKTHROUGH] api/main.py: POST /auth/github called")
    sys.stdout.flush()

    try:
        github_client_id = os.getenv("GITHUB_CLIENT_ID")
        github_client_secret = os.getenv("GITHUB_CLIENT_SECRET")

        if not github_client_id or not github_client_secret:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="GitHub OAuth credentials not properly configured on server"
            )

        # Exchange code for token
        token_url = "https://github.com/login/oauth/access_token"
        response = requests.post(
            token_url,
            headers={"Accept": "application/json"},
            data={
                "client_id": github_client_id,
                "client_secret": github_client_secret,
                "code": request.code
            }
        )

        response.raise_for_status()
        token_data = response.json()

        if "error" in token_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GitHub OAuth error: {token_data.get('error_description', 'Unknown error')}"
            )

        return token_data

    except requests.exceptions.RequestException as e:
        print(f"[WALKTHROUGH] api/main.py: ERROR in GitHub OAuth flow: {e}")
        sys.stdout.flush()
        logger.error(f"GitHub OAuth flow error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to complete GitHub OAuth flow: {str(e)}"
        )

print("[WALKTHROUGH] api/main.py: Finished loading.")
sys.stdout.flush()
