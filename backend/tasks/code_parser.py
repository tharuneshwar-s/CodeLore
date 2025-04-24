# tasks/code_parser.py
import ast
import sys
from typing import Dict, Any, List, Set, Optional

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

print("[WALKTHROUGH] code_parser.py: Finished loading.")
sys.stdout.flush()