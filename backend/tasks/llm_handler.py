# tasks/llm_handler.py
import os
import sys
import google.generativeai as genai
from typing import Dict, Any

print("[WALKTHROUGH] llm_handler.py: Loading...")
sys.stdout.flush()

# Configure Gemini API
gemini_model = None
try:
    print("[WALKTHROUGH] llm_handler.py: Configuring Gemini API...")
    sys.stdout.flush()
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')
    print("[WALKTHROUGH] llm_handler.py: Gemini API configured successfully.")
    sys.stdout.flush()
except Exception as e:
    print(f"[WALKTHROUGH] llm_handler.py: ERROR - Failed to configure Gemini API: {e}")
    sys.stdout.flush()
    # Let tasks fail if they try to use the None model

def generate_narrative(analysis_data: Dict[str, Any], repo_url: str) -> str:
    """
    Generate a narrative about the repository using Google Gemini.
    analysis_data should contain keys like 'latest_commit', 'code_analysis', 'owner', 'repo_name'.
    Raises exceptions on failure.
    """
    print("[WALKTHROUGH] llm_handler.py: Generating narrative...")
    sys.stdout.flush()

    if not gemini_model:
        print("[WALKTHROUGH] llm_handler.py: ERROR - Gemini model not configured.")
        sys.stdout.flush()
        raise RuntimeError("Gemini API key not configured or model initialization failed.")

    # Extract data for prompt
    latest_commit = analysis_data.get('latest_commit', {})
    code_analysis = analysis_data.get('code_analysis', {})
    owner = analysis_data.get('owner', 'N/A')
    repo_name = analysis_data.get('repo_name', 'N/A')

    MAX_ITEMS = 15 # Limit samples in prompt
    prompt = f"""
    Analyze the following information extracted *via API* from the GitHub repository {owner}/{repo_name} ({repo_url})
    and generate an engaging narrative (around 150-250 words, like a mini-documentary intro)
    about its likely purpose, key components, and current state based on the latest commit.
    Note: Full commit history and contributor analysis were not performed.

    Extracted Data:
    - Latest Commit Author: {latest_commit.get('author', 'N/A')}
    - Latest Commit Date: {latest_commit.get('date', 'N/A')}
    - Latest Commit Message Snippet: {latest_commit.get('message', 'N/A')}
    - Python Files Analyzed (via API): {code_analysis.get('files_analyzed_count', 0)}
    - Total Python Lines Analyzed (approx): {code_analysis.get('lines_analyzed_count', 0)}
    - Key Functions Identified (sample): {', '.join(code_analysis.get('unique_functions', [])[:MAX_ITEMS])}{'...' if len(code_analysis.get('unique_functions', [])) > MAX_ITEMS else ''} ({len(code_analysis.get('unique_functions', []))} total)
    - Key Classes Identified (sample): {', '.join(code_analysis.get('unique_classes', [])[:MAX_ITEMS])}{'...' if len(code_analysis.get('unique_classes', [])) > MAX_ITEMS else ''} ({len(code_analysis.get('unique_classes', []))} total)
    - Notable Libraries/Imports (sample): {', '.join(code_analysis.get('unique_imports', [])[:MAX_ITEMS])}{'...' if len(code_analysis.get('unique_imports', [])) > MAX_ITEMS else ''} ({len(code_analysis.get('unique_imports', []))} total)

    Narrative:
    """
    # print(f"[WALKTHROUGH] llm_handler.py: Prompt:\n{prompt}") # DEBUG

    print("[WALKTHROUGH] llm_handler.py: Sending prompt to Gemini...")
    sys.stdout.flush()

    safety_settings=[ {"category": c, "threshold": "BLOCK_MEDIUM_AND_ABOVE"} for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]]
    generation_config = genai.types.GenerationConfig(max_output_tokens=600, temperature=0.7)

    try:
        response = gemini_model.generate_content(prompt, generation_config=generation_config, safety_settings=safety_settings)
        print("[WALKTHROUGH] llm_handler.py: Received response from Gemini.")
        sys.stdout.flush()

        # --- Robust Response Processing ---
        if not response.candidates: raise ValueError(f"Gemini response was empty or blocked. Feedback: {getattr(response, 'prompt_feedback', 'N/A')}")
        first_candidate = response.candidates[0]
     
        narrative_result = first_candidate.content.parts[0].text if first_candidate.content.parts else "Gemini returned empty content."

        print("[WALKTHROUGH] llm_handler.py: Narrative extracted successfully.")
        sys.stdout.flush()
        return narrative_result

    except Exception as e:
        print(f"[WALKTHROUGH] llm_handler.py: ERROR during Gemini call: {e}")
        sys.stdout.flush()
        raise e # Re-raise

print("[WALKTHROUGH] llm_handler.py: Finished loading.")
sys.stdout.flush()