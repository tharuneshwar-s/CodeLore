# tasks/celery_app.py
import os
from celery import Celery
from dotenv import load_dotenv
import sys
from kombu import Queue

print("[WALKTHROUGH] celery_app.py: Loading...")
sys.stdout.flush()

load_dotenv()
print("[WALKTHROUGH] celery_app.py: .env loaded.")
sys.stdout.flush()

broker_url = os.getenv("CELERY_BROKER_URL", "amqp://guest:guest@localhost:5672//")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "rpc://")

print(f"[WALKTHROUGH] celery_app.py: Broker URL: {broker_url}")
print(f"[WALKTHROUGH] celery_app.py: Result Backend: {result_backend}")
sys.stdout.flush()

codelore_queue_name = 'codelore_analysis_queue'
codelore_task_queue = Queue(codelore_queue_name)
print(f"[WALKTHROUGH] celery_app.py: Defined queue: {codelore_queue_name}")
sys.stdout.flush()

celery_app = Celery(
    "CodeLoreTasks",
    broker=broker_url,
    backend=result_backend,
    # IMPORTANT: Include points to the *modules* containing tasks
    include=['tasks.analysis_task']
)
print("[WALKTHROUGH] celery_app.py: Celery app instance created.")
sys.stdout.flush()

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
    task_track_started=True,
    worker_prefetch_multiplier=1,
    task_queues=(codelore_task_queue,),
    task_routes={
        # Route the main task (defined in analysis_task.py)
        'tasks.analysis_task.run_codelore_analysis': {'queue': codelore_queue_name},
    },
)
print(f"[WALKTHROUGH] celery_app.py: Celery config updated. Routing task to '{codelore_queue_name}'.")
sys.stdout.flush()

if __name__ == '__main__':
    celery_app.start()

print("[WALKTHROUGH] celery_app.py: Finished loading.")
sys.stdout.flush()