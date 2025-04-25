import os
from dotenv import load_dotenv

load_dotenv()

print("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\\nconfig/config.py: Loading environment variables.")
print(os.environ.get("RABBITMQ_BROKER_URL"))

class Settings:
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    RABBITMQ_BROKER_URL = os.getenv("RABBITMQ_BROKER_URL")
    CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL")
    SUPABASE_ANALYSIS_TABLE = "repo_analysis"
    CELERY_RESULT_BACKEND = 'rpc://'

settings = Settings()