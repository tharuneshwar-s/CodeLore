# tasks/llm_handler.py
import os
import sys
import google.generativeai as genai
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()
print("[WALKTHROUGH] llm_handler.py: Loading environment variables...")

print("[WALKTHROUGH] llm_handler.py: Loading...")
sys.stdout.flush()

# Configure Gemini API
gemini_model = None
try:
    print("[WALKTHROUGH] llm_handler.py: Configuring Gemini API...")
    sys.stdout.flush()
    # os.getenv("GEMINI_API_KEY")
    api_key = "AIzaSyDFzeEo9dTyyEWzAD_KB-mXLP7Uh0s4PDM"
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')
    print("[WALKTHROUGH] llm_handler.py: Gemini API configured successfully.")
    sys.stdout.flush()
except Exception as e:
    print(
        f"[WALKTHROUGH] llm_handler.py: ERROR - Failed to configure Gemini API: {e}")
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
        raise RuntimeError(
            "Gemini API key not configured or model initialization failed.")

    # Extract data
    latest_commit = analysis_data.get('latest_commit', {})
    code_analysis = analysis_data.get('code_analysis', {})
    owner = analysis_data.get('owner', 'N/A')
    repo_name = analysis_data.get('repo_name', 'N/A')
    detected_frameworks = analysis_data.get('detected_frameworks', [])
    MAX_ITEMS = 300000  # Consistent limit

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

    safety_settings = [{"category": c, "threshold": "BLOCK_MEDIUM_AND_ABOVE"} for c in [
        "HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]]
    generation_config = genai.types.GenerationConfig(
        max_output_tokens=600, temperature=0)

    try:
        response = gemini_model.generate_content(
            prompt, generation_config=generation_config, safety_settings=safety_settings)
        print("[WALKTHROUGH] llm_handler.py: Received response from Gemini.")
        sys.stdout.flush()

        # --- Robust Response Processing ---
        if not response.candidates:
            raise ValueError(
                f"Gemini response was empty or blocked. Feedback: {getattr(response, 'prompt_feedback', 'N/A')}")
        first_candidate = response.candidates[0]

        narrative_result = first_candidate.content.parts[
            0].text if first_candidate.content.parts else "Gemini returned empty content."

        print("[WALKTHROUGH] llm_handler.py: Narrative extracted successfully.")
        sys.stdout.flush()
        return narrative_result

    except Exception as e:
        print(f"[WALKTHROUGH] llm_handler.py: ERROR during Gemini call: {e}")
        sys.stdout.flush()
        raise e  # Re-raise


def generate_component_description(component_name: str, component_type: str, repo_url: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Generate a detailed description and usage information for a specific code component.

    Args:
        component_name: Name of the class or function
        component_type: Type of component ('class' or 'function')
        repo_url: URL of the repository
        context: Optional additional context about the component

    Returns:
        Dictionary with structured information about the component including:
        - description: Overall description of the component
        - usages: List of ways the component is used
        - purpose: Primary purpose/responsibility of the component
        - related_components: List of related classes/functions
        - complexity: Estimation of component complexity
        - best_practices: Adherence to coding best practices
    """
    print(
        f"[WALKTHROUGH] llm_handler.py: Generating structured description for {component_type} '{component_name}'...")
    sys.stdout.flush()

    if not gemini_model:
        print("[WALKTHROUGH] llm_handler.py: ERROR - Gemini model not configured.")
        sys.stdout.flush()
        raise RuntimeError(
            "Gemini API key not configured or model initialization failed.")

    # Prepare context data
    context_data = context or {}
    imports = context_data.get('imports', [])
    file_path = context_data.get('file_path', 'Unknown')

    # Construct the prompt for the model with structured output requirements
    if component_type.lower() == 'class':
        prompt = f"""
        You are a code analysis expert examining a class from a codebase. Provide a detailed analysis of this class.
        
        Class Name: {component_name}
        Repository: {repo_url}
        File Path: {file_path}
        
        Available context information:
        - Imports in the repository: {', '.join(imports[:20]) if imports else 'No import information available'}
        
        Return a comprehensive analysis as a structured JSON object with these fields:
        
        1. "description": A detailed HTML-formatted description of what this class likely does, its responsibilities, and its role in the system
        2. "usages": An array of strings describing different ways this class is likely used in the codebase
        3. "purpose": A concise statement of the primary purpose of this class (1-2 sentences)
        4. "related_components": An array of likely related classes or functions based on naming conventions and common patterns
        5. "complexity": An object with "level" (string: "low", "medium", or "high") and "explanation" (string explaining the reasoning)
        6. "best_practices": An object with "rating" (1-5 scale) and "suggestions" (array of improvement suggestions if applicable)
        7. make all response concise and short.
        
        Format the description field with HTML styling to highlight important elements:
        - Use <span class="font-medium text-teal-700">ClassName</span> for class names
        - Use <span class="font-mono text-sm text-purple-700 bg-purple-100 px-1 rounded">methodName()</span> for methods
        - Use <span class="font-semibold text-blue-600">important concepts</span> for important terms
        
        Based ONLY on the information provided, infer these details. If you're uncertain, make educated guesses but indicate when you're doing so.
        
        Format your response as valid JSON only (no explanation text outside the JSON).
        """
    else:  # function
        prompt = f"""
        You are a code analysis expert examining a function from a codebase. Provide a detailed analysis of this function.
        
        Function Name: {component_name}
        Repository: {repo_url}
        File Path: {file_path}
        
        Available context information:
        - Imports in the repository: {', '.join(imports[:20]) if imports else 'No import information available'}
        
        Return a comprehensive analysis as a structured JSON object with these fields:
        
        1. "description": A detailed HTML-formatted description of what this function likely does, its parameters, return values, and overall purpose
        2. "usages": An array of strings describing different ways this function is likely called and used in the codebase
        3. "purpose": A concise statement of the primary purpose of this function (1-2 sentences)
        4. "parameters": An array of likely parameters with their types and purposes (inferred from the name)
        5. "return_value": An object with "type" (likely return type) and "description" (what the return value represents)
        6. "complexity": An object with "level" (string: "low", "medium", or "high") and "explanation" (string explaining the reasoning)
        7. "best_practices": An object with "rating" (1-5 scale) and "suggestions" (array of improvement suggestions if applicable)
        8. make all response concise and short.

        Format the description field with HTML styling to highlight important elements:
        - Use <span class="font-medium text-teal-700">ClassName</span> for class names
        - Use <span class="font-mono text-sm text-purple-700 bg-purple-100 px-1 rounded">functionName()</span> for functions
        - Use <span class="font-semibold text-blue-600">important concepts</span> for important terms
        
        Based ONLY on the information provided, infer these details. If you're uncertain, make educated guesses but indicate when you're doing so.
        
        Format your response as valid JSON only (no explanation text outside the JSON).
        """

    print("[WALKTHROUGH] llm_handler.py: Sending structured component analysis prompt to Gemini...")
    sys.stdout.flush()

    safety_settings = [
        {"category": c, "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
        for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
    ]
    generation_config = genai.types.GenerationConfig(
        max_output_tokens=800, temperature=0.2)

    try:
        response = gemini_model.generate_content(
            prompt, generation_config=generation_config, safety_settings=safety_settings)
        print(
            "[WALKTHROUGH] llm_handler.py: Received structured component analysis from Gemini.")
        sys.stdout.flush()

        if not response.candidates:
            raise ValueError(
                f"Gemini response was empty or blocked. Feedback: {getattr(response, 'prompt_feedback', 'N/A')}")

        first_candidate = response.candidates[0]
        result_text = first_candidate.content.parts[0].text if first_candidate.content.parts else "{}"

        # Strip any markdown formatting if present
        result_text = result_text.strip('`').replace(
            'json\n', '').replace('```', '')

        # Parse the JSON response
        import json
        result_json = json.loads(result_text)

        print(
            "[WALKTHROUGH] llm_handler.py: Structured component analysis extracted successfully.")
        sys.stdout.flush()

        # Return the complete structured response
        return result_json

    except Exception as e:
        print(
            f"[WALKTHROUGH] llm_handler.py: ERROR during structured component analysis: {e}")
        sys.stdout.flush()
        # Return a default structured response on error
        return {
            "description": f"Error analyzing {component_type} {component_name}: {str(e)}",
            "usages": ["Could not determine usage patterns."],
            "purpose": "Unable to determine purpose due to an error.",
            "related_components": [],
            "complexity": {"level": "unknown", "explanation": "Analysis failed."},
            "best_practices": {"rating": 0, "suggestions": ["Unable to provide suggestions due to analysis error."]}
        }


print("[WALKTHROUGH] llm_handler.py: Finished loading.")
sys.stdout.flush()
