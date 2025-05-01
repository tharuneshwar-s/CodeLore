# services/graph_generator.py
import json
from io import BytesIO
import base64
import matplotlib.pyplot as plt
import sys
from typing import Dict, Any, List, Set, Optional
import re
import os
import networkx as nx
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

print("[WALKTHROUGH] graph_generator.py: Loading...")
sys.stdout.flush()


def generate_dependency_graph(imports_data: List[str], classes_data: List[str], functions_data: List[str]) -> Dict[str, Any]:
    """
    Generate a dependency graph visualization from import statements, classes and functions.
    Returns the graph as a base64 encoded image.
    """
    print("[WALKTHROUGH] graph_generator.py: Generating dependency graph...")
    sys.stdout.flush()

    # Create a directed graph
    G = nx.DiGraph()

    # Add nodes for imports
    for imp in imports_data[:20]:  # Limit to prevent overcrowding
        G.add_node(imp, type='import')

    # Add nodes for classes
    for cls in classes_data[:10]:  # Limit to prevent overcrowding
        G.add_node(cls, type='class')

    # Create some edges based on naming conventions
    for imp in imports_data[:20]:
        for cls in classes_data[:10]:
            # If class name appears in import name or vice versa
            if imp.lower() in cls.lower() or cls.lower() in imp.lower():
                G.add_edge(imp, cls)

    # Create a figure
    plt.figure(figsize=(12, 8))

    # Get node positions
    pos = nx.spring_layout(G, k=0.5, iterations=50)

    # Draw nodes
    node_colors = ['skyblue' if G.nodes[n]['type'] ==
                   'import' else 'lightgreen' for n in G.nodes()]

    nx.draw_networkx_nodes(G, pos, node_size=500,
                           node_color=node_colors, alpha=0.8)
    nx.draw_networkx_edges(G, pos, width=1.0, alpha=0.5,
                           arrows=True, arrowsize=15)

    # Draw labels with smaller font
    labels = {n: n for n in G.nodes()}
    nx.draw_networkx_labels(G, pos, labels, font_size=8)

    # Save to BytesIO object
    buf = BytesIO()
    plt.tight_layout()
    plt.axis('off')
    plt.savefig(buf, format='png', dpi=100)
    plt.close()

    # Encode the image to base64
    buf.seek(0)
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        "image": img_str,
        "format": "png",
        "encoding": "base64"
    }


def generate_class_hierarchy(classes_data: List[str], repo_files_content: Dict[str, str] = None) -> Dict[str, Any]:
    """
    Generate a class hierarchy visualization.
    Returns the graph as a base64 encoded image.
    """
    print("[WALKTHROUGH] graph_generator.py: Generating class hierarchy...")
    sys.stdout.flush()

    # Create a directed graph
    G = nx.DiGraph()

    # Add nodes for all classes
    for cls in classes_data[:15]:  # Limit to prevent overcrowding
        G.add_node(cls)

    # If we have file contents, try to extract inheritance relationships
    if repo_files_content:
        # Simple regex pattern for inheritance in Python (not comprehensive)
        pattern = r'class\s+(\w+)\s*\(\s*(\w+)\s*\)'

        for file_content in repo_files_content.values():
            matches = re.findall(pattern, file_content)
            for match in matches:
                child, parent = match
                if child in classes_data and parent in classes_data:
                    G.add_edge(parent, child)  # Direction: parent -> child

    # Create a figure
    plt.figure(figsize=(10, 8))

    # Try hierarchical layout for class hierarchy
    try:
        pos = nx.nx_agraph.graphviz_layout(G, prog='dot')
    except:
        # Fallback to spring layout if graphviz is not available
        pos = nx.spring_layout(G, k=0.5, iterations=50)

    # Draw nodes and edges
    nx.draw_networkx_nodes(G, pos, node_size=600,
                           node_color='lightgreen', alpha=0.8)
    nx.draw_networkx_edges(G, pos, width=1.0, alpha=0.5,
                           arrows=True, arrowsize=15)

    # Draw labels
    labels = {n: n for n in G.nodes()}
    nx.draw_networkx_labels(G, pos, labels, font_size=9)

    # Save to BytesIO object
    buf = BytesIO()
    plt.tight_layout()
    plt.axis('off')
    plt.savefig(buf, format='png', dpi=100)
    plt.close()

    # Encode the image to base64
    buf.seek(0)
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        "image": img_str,
        "format": "png",
        "encoding": "base64"
    }


def generate_function_call_graph(functions_data: List[str], repo_files_content: Dict[str, str] = None) -> Dict[str, Any]:
    """
    Generate a function call graph visualization.
    Returns the graph as a base64 encoded image.
    """
    print("[WALKTHROUGH] graph_generator.py: Generating function call graph...")
    sys.stdout.flush()

    # Create a directed graph
    G = nx.DiGraph()

    # Add nodes for all functions
    for func in functions_data[:20]:  # Limit to prevent overcrowding
        G.add_node(func)

    # If we have file contents, try to extract function calls
    if repo_files_content:
        for func1 in functions_data[:20]:
            for func2 in functions_data[:20]:
                if func1 != func2:
                    for content in repo_files_content.values():
                        # Check if func1 contains a call to func2
                        # This is a simplistic approach; a proper parser would be better
                        pattern = fr'def\s+{re.escape(func1)}\s*\([^)]*\)[^:]*:.*?{re.escape(func2)}\s*\('
                        if re.search(pattern, content, re.DOTALL):
                            G.add_edge(func1, func2)  # func1 calls func2
    else:
        # If no content, create a sample graph based on naming patterns
        for i, func1 in enumerate(functions_data[:20]):
            for j, func2 in enumerate(functions_data[:20]):
                # Just some pattern to create a reasonable graph
                if i != j and (i % 3 == 0 or j % 5 == 0):
                    if func1.lower() in func2.lower() or func2.lower() in func1.lower():
                        G.add_edge(func1, func2)

    # Create a figure
    plt.figure(figsize=(12, 10))

    # Get positions - use a different layout for call graphs
    pos = nx.shell_layout(G)

    # Draw nodes and edges
    nx.draw_networkx_nodes(G, pos, node_size=500,
                           node_color='lightcoral', alpha=0.8)
    nx.draw_networkx_edges(G, pos, width=1.0, alpha=0.5,
                           arrows=True, arrowsize=15)

    # Draw labels with smaller font
    labels = {n: n for n in G.nodes()}
    nx.draw_networkx_labels(G, pos, labels, font_size=8)

    # Save to BytesIO object
    buf = BytesIO()
    plt.tight_layout()
    plt.axis('off')
    plt.savefig(buf, format='png', dpi=100)
    plt.close()

    # Encode the image to base64
    buf.seek(0)
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        "image": img_str,
        "format": "png",
        "encoding": "base64"
    }


def generate_file_type_pie_chart(file_type_distribution: Dict[str, int]) -> Dict[str, Any]:
    """
    Generate a pie chart of file types.
    Returns the chart as a base64 encoded image.
    """
    print("[WALKTHROUGH] graph_generator.py: Generating file type pie chart...")
    sys.stdout.flush()

    # Create a figure
    plt.figure(figsize=(10, 8))

    # Prepare data
    labels = list(file_type_distribution.keys())
    sizes = list(file_type_distribution.values())

    # Use a qualitative colormap
    colors = plt.cm.Paired(range(len(labels)))

    # Draw the pie chart
    plt.pie(sizes, labels=labels, colors=colors,
            autopct='%1.1f%%', startangle=140, shadow=False)

    # Equal aspect ratio ensures that pie is drawn as a circle
    plt.axis('equal')
    plt.title('File Type Distribution', fontsize=15)

    # Save to BytesIO object
    buf = BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format='png', dpi=100)
    plt.close()

    # Encode the image to base64
    buf.seek(0)
    img_str = base64.b64encode(buf.getvalue()).decode('utf-8')

    return {
        "image": img_str,
        "format": "png",
        "encoding": "base64"
    }


def generate_all_graphs(repo_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generate all graphs for a repository.
    Returns a dictionary with all graph data.
    """
    print("[WALKTHROUGH] graph_generator.py: Generating all graphs for repository...")
    sys.stdout.flush()

    result = {}

    # Extract required data from repo_data
    try:
        imports = repo_data["analysis_details"]["code_analysis"]["unique_imports"]
        classes = repo_data["analysis_details"]["code_analysis"]["unique_classes"]
        functions = repo_data["analysis_details"]["code_analysis"]["unique_functions"]
        file_type_distribution = repo_data.get("file_type_distribution", {})

        # Generate graphs
        result["dependency_graph"] = generate_dependency_graph(
            imports, classes, functions)
        result["class_hierarchy"] = generate_class_hierarchy(classes)
        result["function_call_graph"] = generate_function_call_graph(functions)
        result["file_type_pie_chart"] = generate_file_type_pie_chart(
            file_type_distribution)

        print("[WALKTHROUGH] graph_generator.py: Successfully generated all graphs.")
        sys.stdout.flush()

    except Exception as e:
        print(
            f"[WALKTHROUGH] graph_generator.py: ERROR generating graphs: {e}")
        sys.stdout.flush()
        result["error"] = str(e)

    return result


print("[WALKTHROUGH] graph_generator.py: Finished loading.")
sys.stdout.flush()
