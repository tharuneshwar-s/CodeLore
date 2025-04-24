export interface Repository {
  id: string;
  name: string;
  owner: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  lastCommit: string;
  language: string;
  analysis?: Analysis;
}

export interface Analysis {
  summary: string;
  structure: StructureItem[];
  keyComponents: KeyComponent[];
  technologies: Technology[];
  flowChart?: string;
  narratives: Narrative[];
}

export interface StructureItem {
  name: string;
  type: 'directory' | 'file';
  path: string;
  children?: StructureItem[];
}

export interface KeyComponent {
  name: string;
  path: string;
  purpose: string;
  complexity: 'low' | 'medium' | 'high';
  dependencies: string[];
}

export interface Technology {
  name: string;
  purpose: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

export interface Narrative {
  title: string;
  content: string;
  type: 'overview' | 'technical' | 'architecture' | 'history';
}

export const dummyRepositories: Repository[] = [
  {
    id: '1',
    name: 'tensorflow',
    owner: 'tensorflow',
    url: 'https://github.com/tensorflow/tensorflow',
    description: 'An open-source machine learning framework for everyone',
    stars: 178000,
    forks: 88500,
    lastCommit: '2023-10-15',
    language: 'C++',
    analysis: {
      summary: 'TensorFlow is an end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries, and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML-powered applications.',
      structure: [
        {
          name: 'tensorflow',
          type: 'directory',
          path: '/',
          children: [
            { name: 'core', type: 'directory', path: '/core' },
            { name: 'python', type: 'directory', path: '/python' },
            { name: 'compiler', type: 'directory', path: '/compiler' },
            { name: 'LICENSE', type: 'file', path: '/LICENSE' },
            { name: 'README.md', type: 'file', path: '/README.md' },
          ]
        }
      ],
      keyComponents: [
        {
          name: 'Graph Execution',
          path: '/core/graph',
          purpose: 'Manages computational graph operations and execution',
          complexity: 'high',
          dependencies: ['kernels', 'runtime']
        },
        {
          name: 'Kernels',
          path: '/core/kernels',
          purpose: 'Provides hardware-specific implementations of operations',
          complexity: 'high',
          dependencies: ['platform']
        },
        {
          name: 'Python API',
          path: '/python',
          purpose: 'Provides Python bindings for TensorFlow',
          complexity: 'medium',
          dependencies: ['core', 'kernels']
        }
      ],
      technologies: [
        { name: 'C++', purpose: 'Core implementation language', category: 'backend' },
        { name: 'Python', purpose: 'API and user-facing code', category: 'frontend' },
        { name: 'CUDA', purpose: 'GPU acceleration', category: 'backend' },
        { name: 'Bazel', purpose: 'Build system', category: 'devops' }
      ],
      narratives: [
        {
          title: 'Project Overview',
          type: 'overview',
          content: 'TensorFlow was originally developed by researchers and engineers from the Google Brain team within Google\'s AI organization. It comes with strong support for machine learning and deep learning and the flexible numerical computation core is used across many other scientific domains.'
        },
        {
          title: 'Technical Architecture',
          type: 'technical',
          content: 'At its core, TensorFlow is built around a computational graph abstraction, where nodes represent operations and edges represent tensors (multi-dimensional arrays). This design allows for flexible execution across a variety of platforms (CPUs, GPUs, TPUs), and enables automatic differentiation - a key feature for training machine learning models.'
        },
        {
          title: 'Development History',
          type: 'history',
          content: 'TensorFlow was initially released as an open-source project in November 2015. Since then, it has undergone significant evolution, with TensorFlow 2.0 (released in 2019) marking a major shift toward eager execution and a more Pythonic interface, making it more accessible to developers without sacrificing performance.'
        }
      ]
    }
  },
  {
    id: '2',
    name: 'react',
    owner: 'facebook',
    url: 'https://github.com/facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces',
    stars: 210000,
    forks: 43500,
    lastCommit: '2023-10-20',
    language: 'JavaScript',
    analysis: {
      summary: 'React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components that efficiently update when data changes, following a declarative paradigm that makes code more predictable and easier to debug.',
      structure: [
        {
          name: 'react',
          type: 'directory',
          path: '/',
          children: [
            { name: 'packages', type: 'directory', path: '/packages' },
            { name: 'fixtures', type: 'directory', path: '/fixtures' },
            { name: 'scripts', type: 'directory', path: '/scripts' },
            { name: 'LICENSE', type: 'file', path: '/LICENSE' },
            { name: 'README.md', type: 'file', path: '/README.md' },
          ]
        }
      ],
      keyComponents: [
        {
          name: 'React Core',
          path: '/packages/react',
          purpose: 'Core React functionality and APIs',
          complexity: 'high',
          dependencies: []
        },
        {
          name: 'React DOM',
          path: '/packages/react-dom',
          purpose: 'DOM-specific rendering logic',
          complexity: 'high',
          dependencies: ['react']
        },
        {
          name: 'React Reconciler',
          path: '/packages/react-reconciler',
          purpose: 'Algorithm for calculating UI updates',
          complexity: 'high',
          dependencies: ['react']
        }
      ],
      technologies: [
        { name: 'JavaScript', purpose: 'Primary implementation language', category: 'frontend' },
        { name: 'TypeScript', purpose: 'Type checking and interfaces', category: 'frontend' },
        { name: 'Flow', purpose: 'Static type checking', category: 'frontend' },
        { name: 'Jest', purpose: 'Testing framework', category: 'devops' }
      ],
      narratives: [
        {
          title: 'Project Overview',
          type: 'overview',
          content: 'React was initially created by Jordan Walke, a software engineer at Facebook. It was first deployed on Facebook\'s News Feed in 2011 and later open-sourced in May 2013. React has revolutionized front-end development with its component-based architecture and virtual DOM approach.'
        },
        {
          title: 'Technical Architecture',
          type: 'technical',
          content: 'React\'s core innovation is the virtual DOM, which provides a lightweight representation of the real DOM. When a component\'s state changes, React first updates the virtual DOM, computes the differences (diffing), and then efficiently updates only the necessary parts of the actual DOM. This approach significantly improves performance for interactive UIs.'
        },
        {
          title: 'Development History',
          type: 'history',
          content: 'React has evolved significantly since its initial release. Hooks, introduced in React 16.8 (2019), revolutionized how developers manage state and side effects in functional components. React 18 (2022) introduced automatic batching, concurrent rendering, and other performance improvements that enhance the developer and user experience.'
        }
      ]
    }
  },
  {
    id: '3',
    name: 'django',
    owner: 'django',
    url: 'https://github.com/django/django',
    description: 'The Web framework for perfectionists with deadlines',
    stars: 72000,
    forks: 30100,
    lastCommit: '2023-10-18',
    language: 'Python',
    analysis: {
      summary: 'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. It takes care of much of the hassle of web development, enabling developers to focus on writing their app without needing to reinvent the wheel.',
      structure: [
        {
          name: 'django',
          type: 'directory',
          path: '/',
          children: [
            { name: 'django', type: 'directory', path: '/django' },
            { name: 'docs', type: 'directory', path: '/docs' },
            { name: 'tests', type: 'directory', path: '/tests' },
            { name: 'LICENSE', type: 'file', path: '/LICENSE' },
            { name: 'README.rst', type: 'file', path: '/README.rst' },
          ]
        }
      ],
      keyComponents: [
        {
          name: 'ORM',
          path: '/django/db/models',
          purpose: 'Object-Relational Mapping for database interactions',
          complexity: 'high',
          dependencies: ['db']
        },
        {
          name: 'Template Engine',
          path: '/django/template',
          purpose: 'Rendering HTML templates with context data',
          complexity: 'medium',
          dependencies: []
        },
        {
          name: 'URL Dispatcher',
          path: '/django/urls',
          purpose: 'Routes URLs to view functions',
          complexity: 'medium',
          dependencies: ['views']
        }
      ],
      technologies: [
        { name: 'Python', purpose: 'Core implementation language', category: 'backend' },
        { name: 'SQL', purpose: 'Database queries through ORM', category: 'database' },
        { name: 'HTML/CSS', purpose: 'Template rendering', category: 'frontend' },
        { name: 'JavaScript', purpose: 'Client-side functionality', category: 'frontend' }
      ],
      narratives: [
        {
          title: 'Project Overview',
          type: 'overview',
          content: 'Django was created in 2003 at the Lawrence Journal-World newspaper to meet the fast-paced deadlines of journalism. It was released publicly in 2005 and has since become one of the most popular Python web frameworks, known for its "batteries-included" philosophy.'
        },
        {
          title: 'Technical Architecture',
          type: 'technical',
          content: 'Django follows the Model-View-Template (MVT) architectural pattern, a variation of MVC. Models define the data structure, Views contain the business logic, and Templates handle the presentation. This separation of concerns promotes code organization and reusability while maintaining Django\'s emphasis on DRY (Don\'t Repeat Yourself) principles.'
        },
        {
          title: 'Development History',
          type: 'history',
          content: 'Django has maintained a steady development pace with predictable releases. Major milestones include Django 1.0 (2008), which established API stability; Django 2.0 (2017), which dropped Python 2 support; and Django 3.0 (2019), which added ASGI support for asynchronous Python. The framework continues to evolve while maintaining backward compatibility.'
        }
      ]
    }
  }
]; 