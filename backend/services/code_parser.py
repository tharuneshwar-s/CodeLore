# tasks/code_parser.py
import ast
import sys
from typing import Dict, Any, List, Set, Optional
import re

print("[WALKTHROUGH] code_parser.py: Loading...")
sys.stdout.flush()

class PythonCodeVisitor(ast.NodeVisitor):
    """ Visits AST nodes to extract basic code structure info. """
    def __init__(self):
        self.functions: List[str] = []
        self.classes: List[str] = []
        self.imports: Set[str] = set()

    def visit_FunctionDef(self, node: ast.FunctionDef):
        self.functions.append(node.name)
        self.generic_visit(node)

    def visit_AsyncFunctionDef(self, node: ast.AsyncFunctionDef):
        self.functions.append(node.name)
        self.generic_visit(node)

    def visit_ClassDef(self, node: ast.ClassDef):
        self.classes.append(node.name)
        self.generic_visit(node)

    def visit_Import(self, node: ast.Import):
        for alias in node.names:
            self.imports.add(alias.name.split('.')[0])
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom):
        if node.module and node.level == 0:
             self.imports.add(node.module.split('.')[0])
        self.generic_visit(node)

def analyze_python_content(content: str, filename: str = "<string>") -> Optional[Dict[str, Any]]:
    """
    Parses Python code content using AST.
    Returns dictionary with analysis results or None on SyntaxError.
    Can raise other exceptions on unexpected errors.
    """
    # print(f"[WALKTHROUGH] code_parser.py: Analyzing content for {filename}...") # Verbose
    # sys.stdout.flush()
    visitor = PythonCodeVisitor()
    try:
        tree = ast.parse(content, filename=filename)
        visitor.visit(tree)
        return {
            "functions": visitor.functions,
            "classes": visitor.classes,
            "imports": visitor.imports,
            "line_count": len(content.splitlines())
        }
    except SyntaxError as e:
        print(f"[WALKTHROUGH] code_parser.py: SyntaxError parsing {filename}: {e}")
        sys.stdout.flush()
        return None # Skip files with syntax errors
    except Exception as e:
        print(f"[WALKTHROUGH] code_parser.py: Unexpected Error parsing {filename}: {e}")
        sys.stdout.flush()
        raise # Re-raise unexpected errors to be caught by the task

def detect_frameworks_from_files(file_contents: dict) -> dict:
    """
    Given a dict of {filename: content}, returns a set of detected frameworks/libraries.
    """
    frameworks = set()

    # Python requirements.txt or Pipfile
    reqs = file_contents.get("requirements.txt", "") + "\n" + file_contents.get("Pipfile", "")
    if reqs:
        if re.search(r"\bflask\b", reqs, re.I):
            frameworks.add("Flask")
        if re.search(r"\bdjango\b", reqs, re.I):
            frameworks.add("Django")
        if re.search(r"\bfastapi\b", reqs, re.I):
            frameworks.add("FastAPI")
        if re.search(r"\bcelery\b", reqs, re.I):
            frameworks.add("Celery")
        if re.search(r"\bnumpy\b", reqs, re.I):
            frameworks.add("NumPy")
        if re.search(r"\bpandas\b", reqs, re.I):
            frameworks.add("Pandas")
        if re.search(r"\bscikit-learn\b", reqs, re.I):
            frameworks.add("scikit-learn")
        if re.search(r"\btorch\b", reqs, re.I):
            frameworks.add("PyTorch")
        if re.search(r"\btensorflow\b", reqs, re.I):
            frameworks.add("TensorFlow")

    # Node.js package.json
    package_json = file_contents.get("package.json", "")
    if package_json:
        if re.search(r"react", package_json, re.I):
            frameworks.add("React")
        if re.search(r"next", package_json, re.I):
            frameworks.add("Next.js")
        if re.search(r"express", package_json, re.I):
            frameworks.add("Express")
        if re.search(r"vue", package_json, re.I):
            frameworks.add("Vue.js")
        if re.search(r"angular", package_json, re.I):
            frameworks.add("Angular")

    # JavaScript/TypeScript
    if file_contents.get("tsconfig.json"):
        frameworks.add("TypeScript")

    # Docker
    if file_contents.get("Dockerfile"):
        frameworks.add("Docker")

    # Jupyter
    if any(fname.endswith(".ipynb") for fname in file_contents):
        frameworks.add("Jupyter Notebook")

    return sorted(frameworks)

print("[WALKTHROUGH] code_parser.py: Finished loading.")
sys.stdout.flush()