# services/uml_generator.py
import sys
import os
from typing import Dict, Any, List
import google.generativeai as genai
import base64
from io import BytesIO
import plantuml
import tempfile

print("[WALKTHROUGH] uml_generator.py: Loading...")
sys.stdout.flush()

# Configure Gemini API - reuse the same configuration as llm_handler
gemini_model = None
try:
    print("[WALKTHROUGH] uml_generator.py: Configuring Gemini API...")
    sys.stdout.flush()
    # os.getenv("GEMINI_API_KEY")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash-latest')
    print("[WALKTHROUGH] uml_generator.py: Gemini API configured successfully.")
    sys.stdout.flush()
except Exception as e:
    print(
        f"[WALKTHROUGH] uml_generator.py: ERROR - Failed to configure Gemini API: {e}")
    sys.stdout.flush()

# Create a PlantUML instance using the default public server
# If you have a local PlantUML server, you can specify its URL here
plantuml_instance = plantuml.PlantUML(
    url='http://www.plantuml.com/plantuml/png/')


def generate_uml_class_diagram(classes_data: List[str], functions_data: List[str], imports_data: List[str], file_type_distribution: Dict[str, int]) -> Dict[str, Any]:
    """
    Generate a UML class diagram description using Gemini LLM.
    Returns the PlantUML diagram code.
    """
    print("[WALKTHROUGH] uml_generator.py: Generating UML class diagram...")
    sys.stdout.flush()

    if not gemini_model:
        print("[WALKTHROUGH] uml_generator.py: ERROR - Gemini model not configured.")
        sys.stdout.flush()
        raise RuntimeError(
            "Gemini API key not configured or model initialization failed.")

    # Prepare data for the prompt
    class_list = "\n".join([f"- {cls}" for cls in classes_data[:15]])
    function_list = "\n".join([f"- {func}" for func in functions_data[:15]])
    import_list = "\n".join([f"- {imp}" for imp in imports_data[:15]])
    file_types = ", ".join(
        [f"{k} ({v} files)" for k, v in list(file_type_distribution.items())[:10]])

    # Create prompt for Gemini
    prompt = f"""
    You are a software engineering expert specializing in UML diagrams. 
    Create a PlantUML class diagram for a software project based on the following information.
    
    Please infer relationships between classes based on naming conventions and common patterns.
    
    Classes in the project:
    {class_list}
    
    Top functions in the project:
    {function_list}
    
    Key imports:
    {import_list}
    
    File types in the repository: {file_types}
    
    Create a PlantUML diagram that:
    1. Shows the main classes with appropriate attributes and methods
    2. Shows relationships (inheritance, composition, association) between classes
    3. Organizes classes in a logical way
    4. Is well-formatted and readable
    
    Return ONLY the PlantUML code without any other explanations. The code must begin with @startuml and end with @enduml.
    """

    try:
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=1024,
            temperature=0.2
        )

        safety_settings = [
            {"category": c, "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH",
                      "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
        ]

        response = gemini_model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        if not response.candidates:
            raise ValueError(
                f"Gemini response was empty or blocked. Feedback: {getattr(response, 'prompt_feedback', 'N/A')}")

        uml_code = response.candidates[0].content.parts[0].text.strip()

        # Ensure the code starts and ends correctly
        if not uml_code.startswith('@startuml'):
            uml_code = '@startuml\n' + uml_code
        if not uml_code.endswith('@enduml'):
            uml_code = uml_code + '\n@enduml'

        # Generate the diagram image using the plantuml package
        diagram_image = generate_plantuml_image(uml_code)

        return {
            "uml_code": uml_code,
            "image": diagram_image,
            "format": "png",
            "encoding": "base64"
        }

    except Exception as e:
        print(
            f"[WALKTHROUGH] uml_generator.py: ERROR generating UML class diagram: {e}")
        sys.stdout.flush()
        return {
            "error": str(e),
            "uml_code": "@startuml\nnote \"Error generating diagram\" as N1\n@enduml"
        }


def generate_uml_sequence_diagram(classes_data: List[str], functions_data: List[str]) -> Dict[str, Any]:
    """
    Generate a UML sequence diagram description using Gemini LLM.
    Returns the PlantUML diagram code.
    """
    print("[WALKTHROUGH] uml_generator.py: Generating UML sequence diagram...")
    sys.stdout.flush()

    if not gemini_model:
        print("[WALKTHROUGH] uml_generator.py: ERROR - Gemini model not configured.")
        sys.stdout.flush()
        raise RuntimeError(
            "Gemini API key not configured or model initialization failed.")

    # Prepare data for the prompt
    class_list = "\n".join([f"- {cls}" for cls in classes_data[:10]])
    function_list = "\n".join([f"- {func}" for func in functions_data[:10]])

    # Create prompt for Gemini
    prompt = f"""
    You are a software engineering expert specializing in UML diagrams. 
    Create a PlantUML sequence diagram for a software project based on the following information.
    
    Classes in the project:
    {class_list}
    
    Top functions in the project:
    {function_list}
    
    Create a PlantUML sequence diagram that:
    1. Shows a typical workflow or use case in this system
    2. Demonstrates interactions between major classes
    3. Includes relevant method calls
    4. Is well-formatted and readable
    
    Infer a sensible main sequence flow based on the class and function names.
    
    Return ONLY the PlantUML code without any other explanations. The code must begin with @startuml and end with @enduml.
    """

    try:
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=1024,
            temperature=0.2
        )

        safety_settings = [
            {"category": c, "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH",
                      "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
        ]

        response = gemini_model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        if not response.candidates:
            raise ValueError(
                f"Gemini response was empty or blocked. Feedback: {getattr(response, 'prompt_feedback', 'N/A')}")

        uml_code = response.candidates[0].content.parts[0].text.strip()

        # Ensure the code starts and ends correctly
        if not uml_code.startswith('@startuml'):
            uml_code = '@startuml\n' + uml_code
        if not uml_code.endswith('@enduml'):
            uml_code = uml_code + '\n@enduml'

        # Generate the diagram image using the plantuml package
        diagram_image = generate_plantuml_image(uml_code)

        return {
            "uml_code": uml_code,
            "image": diagram_image,
            "format": "png",
            "encoding": "base64"
        }

    except Exception as e:
        print(
            f"[WALKTHROUGH] uml_generator.py: ERROR generating UML sequence diagram: {e}")
        sys.stdout.flush()
        return {
            "error": str(e),
            "uml_code": "@startuml\nnote \"Error generating diagram\" as N1\n@enduml"
        }


def generate_uml_activity_diagram(functions_data: List[str]) -> Dict[str, Any]:
    """
    Generate a UML activity diagram description using Gemini LLM.
    Returns the PlantUML diagram code.
    """
    print("[WALKTHROUGH] uml_generator.py: Generating UML activity diagram...")
    sys.stdout.flush()

    if not gemini_model:
        print("[WALKTHROUGH] uml_generator.py: ERROR - Gemini model not configured.")
        sys.stdout.flush()
        raise RuntimeError(
            "Gemini API key not configured or model initialization failed.")

    # Prepare data for the prompt
    function_list = "\n".join([f"- {func}" for func in functions_data[:20]])

    # Create prompt for Gemini
    prompt = f"""
    You are a software engineering expert specializing in UML diagrams. 
    Create a PlantUML activity diagram for a software project based on the following information.
    
    Top functions in the project:
    {function_list}
    
    Create a PlantUML activity diagram that:
    1. Shows a main workflow or process in this system
    2. Includes decision points and parallel activities where appropriate
    3. Organizes activities in a logical flow
    4. Is well-formatted and readable
    
    Infer a sensible main activity flow based on the function names.
    
    Return ONLY the PlantUML code without any other explanations. The code must begin with @startuml and end with @enduml.
    """

    try:
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=1024,
            temperature=0.2
        )

        safety_settings = [
            {"category": c, "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
            for c in ["HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH",
                      "HARM_CATEGORY_SEXUALLY_EXPLICIT", "HARM_CATEGORY_DANGEROUS_CONTENT"]
        ]

        response = gemini_model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        if not response.candidates:
            raise ValueError(
                f"Gemini response was empty or blocked. Feedback: {getattr(response, 'prompt_feedback', 'N/A')}")

        uml_code = response.candidates[0].content.parts[0].text.strip()

        # Ensure the code starts and ends correctly
        if not uml_code.startswith('@startuml'):
            uml_code = '@startuml\n' + uml_code
        if not uml_code.endswith('@enduml'):
            uml_code = uml_code + '\n@enduml'

        # Generate the diagram image using the plantuml package
        diagram_image = generate_plantuml_image(uml_code)
        print(diagram_image)

        return {
            "uml_code": uml_code,
            "image": diagram_image,
            "format": "png",
            "encoding": "base64"
        }

    except Exception as e:
        print(
            f"[WALKTHROUGH] uml_generator.py: ERROR generating UML activity diagram: {e}")
        sys.stdout.flush()
        return {
            "error": str(e),
            "uml_code": "@startuml\nnote \"Error generating diagram\" as N1\n@enduml"
        }


def generate_plantuml_image(uml_code: str) -> str:
    """
    Generate a PNG image from PlantUML code using the plantuml package.
    Returns the image as a base64 encoded string.
    """
    try:
        print("[WALKTHROUGH] uml_generator.py: Generating PlantUML image...")
        sys.stdout.flush()

        # Create a temporary file for the PlantUML source code
        with tempfile.NamedTemporaryFile(suffix='.puml', mode='w', delete=False) as source_file:
            source_file.write(uml_code)
            source_filename = source_file.name

        # Create a temporary filename for the output image
        output_filename = tempfile.mktemp(suffix='.png')

        # Generate the image using plantuml
        # Note: We use the plantuml_instance that was created at module level
        success = plantuml_instance.processes_file(
            source_filename, outfile=output_filename)

        if not success:
            print("[WALKTHROUGH] uml_generator.py: Failed to generate PlantUML image")
            sys.stdout.flush()
            return ""

        # Read the generated image and encode to base64
        with open(output_filename, 'rb') as image_file:
            encoded_string = base64.b64encode(
                image_file.read()).decode('utf-8')

        # Clean up temporary files
        try:
            os.unlink(source_filename)
            os.unlink(output_filename)
        except Exception as e:
            print(
                f"[WALKTHROUGH] uml_generator.py: Warning - Could not delete temporary files: {e}")
            sys.stdout.flush()

        return encoded_string

    except Exception as e:
        print(
            f"[WALKTHROUGH] uml_generator.py: ERROR generating PlantUML image: {e}")
        sys.stdout.flush()

        # Return empty string on error
        return ""


def generate_all_uml_diagrams(repo_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate all UML diagrams for a repository.
    Returns a dictionary with all diagram data.
    """
    print("[WALKTHROUGH] uml_generator.py: Generating all UML diagrams for repository...")
    sys.stdout.flush()

    result = {}

    # Extract required data from repo_data
    try:
        imports = repo_data["analysis_details"]["code_analysis"]["unique_imports"]
        classes = repo_data["analysis_details"]["code_analysis"]["unique_classes"]
        functions = repo_data["analysis_details"]["code_analysis"]["unique_functions"]
        file_type_distribution = repo_data.get("file_type_distribution", {})

        # Generate diagrams
        result["class_diagram"] = generate_uml_class_diagram(
            classes, functions, imports, file_type_distribution)
        result["sequence_diagram"] = generate_uml_sequence_diagram(
            classes, functions)
        result["activity_diagram"] = generate_uml_activity_diagram(functions)

        print("[WALKTHROUGH] uml_generator.py: Successfully generated all UML diagrams.")
        sys.stdout.flush()

    except Exception as e:
        print(
            f"[WALKTHROUGH] uml_generator.py: ERROR generating UML diagrams: {e}")
        sys.stdout.flush()
        result["error"] = str(e)

    return result


print("[WALKTHROUGH] uml_generator.py: Finished loading.")
sys.stdout.flush()
