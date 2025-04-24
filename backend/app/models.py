# app/models.py
from pydantic import BaseModel, HttpUrl
import sys

print("[WALKTHROUGH] models.py: Loading...")
sys.stdout.flush()

class AnalyzeRequest(BaseModel):
    """ Defines the expected input for the /analyze endpoint. """
    print("[WALKTHROUGH] models.py: Defining AnalyzeRequest model.")
    sys.stdout.flush()
    repo_url: HttpUrl # Ensures the input is a valid URL format

print("[WALKTHROUGH] models.py: Finished loading.")
sys.stdout.flush()