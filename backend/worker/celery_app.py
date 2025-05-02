# celery_app.py (Root level)
from celery import Celery
# Import settings FIRST
from config.config import settings  # Make sure this reads .env correctly
import sys

print("[WALKTHROUGH] celery_app.py: Loading...")
sys.stdout.flush()

print(
    f"[WALKTHROUGH] celery_app.py: Using Broker URL from settings: {settings.CELERY_BROKER_URL}")
print(
    f"[WALKTHROUGH] celery_app.py: Using Result Backend from settings: {settings.CELERY_RESULT_BACKEND}")
sys.stdout.flush()

celery = Celery(
    'codelore',
    broker=settings.CELERY_BROKER_URL,  # Read from settings
    backend=settings.CELERY_RESULT_BACKEND,  # Read from settings
    include=['worker.analysis_task']
)
# ----------------------------------------------------

print("[WALKTHROUGH] celery_app.py: Celery instance created.")
sys.stdout.flush()

# Optional: You could explicitly update conf AFTER creation too,
# but initializing with settings is cleaner.
# celery.conf.broker_url = settings.CELERY_BROKER_URL
# celery.conf.result_backend = settings.CELERY_RESULT_BACKEND

celery.conf.update(
    task_track_started=True,
    worker_concurrency=100,  # Allow up to 100 parallel tasks
    # Add other configs if needed
)
print("[WALKTHROUGH] celery_app.py: Celery config updated.")
sys.stdout.flush()

celery.set_default()
print("[WALKTHROUGH] celery_app.py: Set as default Celery app.")
sys.stdout.flush()

print("[WALKTHROUGH] celery_app.py: Finished loading.")
sys.stdout.flush()
