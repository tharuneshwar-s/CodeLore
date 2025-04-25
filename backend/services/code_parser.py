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

def analyze_java_content(content: str, filename: str = "<string>") -> Optional[Dict[str, Any]]:
    """
    Parses Java code content using regex pattern matching.
    Returns dictionary with analysis results or None on parsing failure.
    """
    try:
        # Initialize return data
        classes = []
        methods = []
        imports = set()
        
        # Clean the content of comments to avoid false positives
        # Remove multi-line comments
        content = re.sub(r'/\*[\s\S]*?\*/', '', content)
        # Remove single-line comments
        content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
        
        # Find package declaration
        package_match = re.search(r'package\s+([^;]+);', content)
        package_name = package_match.group(1).strip() if package_match else None
        
        # Find import statements
        import_pattern = r'import\s+([^;]+);'
        for match in re.finditer(import_pattern, content):
            import_name = match.group(1).strip()
            # Extract the base package
            base_package = import_name.split('.')[0]
            imports.add(base_package)
        
        # Find class declarations
        class_pattern = r'(?:public|private|protected)?\s*(?:abstract|final)?\s*(?:class|interface|enum)\s+(\w+)'
        for match in re.finditer(class_pattern, content):
            class_name = match.group(1)
            classes.append(class_name)
        
        # Find method declarations (simplified, doesn't handle all cases)
        method_pattern = r'(?:public|private|protected)?\s*(?:static|final|abstract)?\s*(?:<[\w\s,<>]+>\s*)?(?:[\w<>\[\]]+)\s+(\w+)\s*\([^)]*\)\s*(?:throws\s+[\w,\s]+)?\s*(?:\{|;)'
        for match in re.finditer(method_pattern, content):
            method_name = match.group(1)
            # Skip if the method name is a Java keyword or looks like a constructor
            if method_name not in ['if', 'for', 'while', 'switch'] and method_name not in classes:
                methods.append(method_name)
        
        return {
            "classes": classes,
            "functions": methods,  # Use "functions" to maintain same structure as Python analysis
            "imports": imports,
            "line_count": len(content.splitlines()),
            "package": package_name
        }
    except Exception as e:
        print(f"[WALKTHROUGH] code_parser.py: Error parsing Java file {filename}: {e}")
        sys.stdout.flush()
        return None  # Skip files with parsing errors

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

    # Java frameworks detection from dependency files
    pom_xml = file_contents.get("pom.xml", "")
    build_gradle = file_contents.get("build.gradle", "")
    java_deps = pom_xml + "\n" + build_gradle
    
    if java_deps:
        if re.search(r"spring-boot|spring-web|spring-context", java_deps, re.I):
            frameworks.add("Spring")
        if re.search(r"hibernate|jpa", java_deps, re.I):
            frameworks.add("Hibernate")
        if re.search(r"junit", java_deps, re.I):
            frameworks.add("JUnit")
        if re.search(r"jakarta.ee|javax.ee|javaee", java_deps, re.I):
            frameworks.add("Jakarta EE")
        if re.search(r"micronaut", java_deps, re.I):
            frameworks.add("Micronaut")
        if re.search(r"quarkus", java_deps, re.I):
            frameworks.add("Quarkus")
    
    # Detect Java frameworks from Java file contents
    java_files_content = ""
    for filename, content in file_contents.items():
        if filename.endswith(".java"):
            java_files_content += content + "\n"
    
    if java_files_content:
        # Spring Framework detection from imports or annotations
        if re.search(r'import\s+org\.springframework|@Controller|@Service|@Repository|@Component|@RestController|@Autowired', java_files_content):
            frameworks.add("Spring")
        
        # Hibernate/JPA detection
        if re.search(r'import\s+javax\.persistence|import\s+jakarta\.persistence|import\s+org\.hibernate|@Entity|@Table|@Column|@Id|EntityManager', java_files_content):
            frameworks.add("Hibernate")
        
        # JUnit detection
        if re.search(r'import\s+org\.junit|@Test|@Before|@After|Assert\.|@RunWith', java_files_content):
            frameworks.add("JUnit")
        
        # Jakarta EE / Java EE
        if re.search(r'import\s+javax\.|import\s+jakarta\.|@EJB|@Stateless|@Stateful|@MessageDriven|@WebServlet', java_files_content):
            frameworks.add("Jakarta EE")
        
        # Android detection
        if re.search(r'import\s+android\.|extends\s+Activity|extends\s+AppCompatActivity|R\.layout|findViewById|setContentView', java_files_content):
            frameworks.add("Android")
        
        # Java FX
        if re.search(r'import\s+javafx\.|extends\s+Application|@FXML', java_files_content):
            frameworks.add("JavaFX")
        
        # Micronaut
        if re.search(r'import\s+io\.micronaut\.|@Controller|@Inject', java_files_content):
            frameworks.add("Micronaut")
        
        # Quarkus
        if re.search(r'import\s+io\.quarkus\.|@QuarkusTest', java_files_content):
            frameworks.add("Quarkus")
            
        # Struts
        if re.search(r'import\s+org\.apache\.struts|extends\s+Action|extends\s+ActionSupport', java_files_content):
            frameworks.add("Struts")
            
        # Guice
        if re.search(r'import\s+com\.google\.inject|@Inject|@Singleton', java_files_content):
            frameworks.add("Guice")
            
        # GWT
        if re.search(r'import\s+com\.google\.gwt|extends\s+RemoteServiceServlet|implements\s+EntryPoint', java_files_content):
            frameworks.add("GWT")

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