from supabase import create_client, Client
from config.config import settings

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def save_analysis_to_supabase(data: dict):
    task_id = data.get("task_id")
    # Check if a record with this task_id exists
    existing = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).select("task_id").eq("task_id", task_id).execute().data
    if existing and len(existing) > 0:
        # Update the existing record
        response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).update(data).eq("task_id", task_id).execute()
    else:
        # Insert as new record
        response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).insert(data).execute()
    return response

def get_analysis_from_supabase(task_id: str):
    response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).select("*").eq("task_id", task_id).execute().data
    return response

def update_analysis_status(task_id: str, status: str, error: str = None):
    response = supabase.table(settings.SUPABASE_ANALYSIS_TABLE).update({"status": status, "error":error, }).eq("task_id", task_id).execute()
    return response