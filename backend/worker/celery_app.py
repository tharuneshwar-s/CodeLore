# celery_app.py (Root level)
from celery import Celery
from config.config import settings
import sys

print("[WALKTHROUGH] celery_app.py: Loading...")
sys.stdout.flush()

celery = Celery(
    'codelore',
    broker=settings.RABBITMQ_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=['worker.analysis_task']
)
print("[WALKTHROUGH] celery_app.py: Celery instance created.")
sys.stdout.flush()

celery.conf.update(
    task_track_started=True,
    # Add other configs if needed
)
print("[WALKTHROUGH] celery_app.py: Celery config updated.")
sys.stdout.flush()

# --- ADD THIS LINE ---
celery.set_default()
print("[WALKTHROUGH] celery_app.py: Set as default Celery app.")
# ---------------------
sys.stdout.flush()

print("[WALKTHROUGH] celery_app.py: Finished loading.")
sys.stdout.flush()