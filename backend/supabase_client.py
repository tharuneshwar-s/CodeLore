from supabase import create_client, Client
from config.config import settings
import sys

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


def update_table_data(task_id, data):
    """
    Update the analysis table with new data.
    This function checks if a record with the given task_id exists and updates it.
    If it doesn't exist, it inserts a new record.
    """
    # Check if the record exists
    response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).update(
        data).eq("task_id", task_id).execute()

    return response


def save_analysis_to_supabase(data: dict):
    task_id = data.get("task_id")
    # Check if a record with this task_id exists to prevent duplicates
    existing = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).select(
        "*").eq("task_id", task_id).execute().data

    if existing and len(existing) > 0:
        # If exists, merge with existing data to prevent overwriting important fields
        existing_data = existing[0]

        # Don't overwrite existing result unless explicitly provided
        if data.get("result") is None and existing_data.get("result") is not None:
            data["result"] = existing_data.get("result")

        # If current update is setting final SUCCESS state with empty result but previous has data
        if (data.get("status") == "SUCCESS" and data.get("result") is None and
                existing_data.get("result") is not None):
            data["result"] = existing_data.get("result")

        # Update the record (remove .eq() from upsert, as upsert already handles conflict)
        response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).upsert(
            data, on_conflict=['task_id']).execute()
    else:
        # If not exists, insert as new record
        response = supabase.table(
            settings.SUPABASE_ANALYSIS_TABLE).insert(data).execute()
    return response


def get_analysis_from_supabase(task_id: str):
    response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).select(
        "*").eq("task_id", task_id).execute().data
    return response


def update_analysis_status(task_id: str, status: str, error: str = None):
    response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).update(
        {"status": status, "error": error}).eq("task_id", task_id).execute()
    return response


def get_analysis_data(task_id):
    """
    Get the complete analysis data for a task ID.
    Returns the response object directly so we can check for errors and data.
    """
    print(
        f"[WALKTHROUGH] supabase_client.py: Getting analysis data for task_id: {task_id}")
    sys.stdout.flush()

    try:
        response = supabase.table('repo_analysis').select(
            '*').eq('task_id', task_id).execute()
        return response
    except Exception as e:
        print(
            f"[WALKTHROUGH] supabase_client.py: ERROR fetching analysis data: {e}")
        sys.stdout.flush()
        return None
