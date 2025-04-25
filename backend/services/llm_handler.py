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

    # Extract data
    latest_commit = analysis_data.get('latest_commit', {})
    code_analysis = analysis_data.get('code_analysis', {})
    owner = analysis_data.get('owner', 'N/A')
    repo_name = analysis_data.get('repo_name', 'N/A')
    detected_frameworks = analysis_data.get('detected_frameworks', [])
    MAX_ITEMS = 300000 # Consistent limit

    # --- Construct the detailed prompt with styling instructions ---
    prompt = f"""
    You are 'CodeLore', a digital storyteller crafting an engaging narrative about a GitHub repository based on API data. Your output MUST be a single block of text containing embedded HTML `<span>` tags with Tailwind CSS classes for styling specific keywords.

    **The Subject:** The repository '{repo_name}' by '{owner}' ({repo_url}).

    **The Clues (API Snapshot):**
    *   Latest Dispatch: Commit by '{latest_commit.get('author', 'N/A')}' on {latest_commit.get('date', 'N/A')} ("{latest_commit.get('message', 'N/A')}")
    *   Tech Toolkit Hints: Frameworks/Libraries detected include: {', '.join(detected_frameworks) if detected_frameworks else 'None detected'}.
    *   Code Blueprint (Python Sample):
        - Analyzed {code_analysis.get('files_analyzed_count', 0)} files (~{code_analysis.get('lines_analyzed_count', 0)} lines).
        - Key Functions (sample): {', '.join(code_analysis.get('unique_functions', [])[:MAX_ITEMS])}{'...' if len(code_analysis.get('unique_functions', [])) > MAX_ITEMS else ''}
        - Key Classes (sample): {', '.join(code_analysis.get('unique_classes', [])[:MAX_ITEMS])}{'...' if len(code_analysis.get('unique_classes', [])) > MAX_ITEMS else ''}
        - Notable Imports (sample): {', '.join(code_analysis.get('unique_imports', [])[:MAX_ITEMS])}{'...' if len(code_analysis.get('unique_imports', [])) > MAX_ITEMS else ''}

    **Your Storytelling & Styling Task:**
    Based *only* on these clues:
    1.  **Infer Purpose:** Start with the project's likely mission.
    2.  **Describe Tech:** Discuss the technical landscape suggested by imports/frameworks.
    3.  **Reveal Logic:** Hint at the core logic using function/class names.
    4.  **Show Status:** Mention the latest commit activity.
    5.  **Weave Narrative:** Create a smooth, engaging story flow (150-250 words).

    **Styling Rules (Apply within the narrative text):**
    *   Wrap detected **frameworks/libraries** (from 'Tech Toolkit Hints') in: `<span class="font-semibold text-blue-600 dark:text-blue-400">FrameworkName</span>`
    *   Wrap key **function names** (from 'Key Functions' sample) mentioned in the narrative in: `<span class="font-mono text-sm text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 px-1 rounded">function_name()</span>` (add parentheses if appropriate)
    *   Wrap key **class names** (from 'Key Classes' sample) mentioned in the narrative in: `<span class="font-medium text-teal-700 dark:text-teal-300">ClassName</span>`
    *   Wrap the inferred **project purpose/domain** (first sentence or key phrase) in: `<span class="font-bold text-gray-800 dark:text-gray-200">Purpose Phrase</span>`
    *   Wrap the **latest commit message snippet** if mentioned in: `<span class="italic text-gray-600 dark:text-gray-400">"Commit message..."</span>`

    **Output Format:** A single block of narrative text containing the embedded HTML `<span>` tags as specified. Do NOT output markdown formatting like backticks or asterisks. Ensure HTML is valid.

    **Keywords for Potential Styling:**
    - Frameworks/Libraries: {detected_frameworks}
    - Functions: {code_analysis.get('unique_functions', [])[:MAX_ITEMS]}
    - Classes: {code_analysis.get('unique_classes', [])[:MAX_ITEMS]}
    """

    
    

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