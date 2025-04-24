export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">About Codelore</h1>
            <p className="max-w-xl mt-5 mx-auto text-xl">
              Understand any codebase instantly with AI-powered repository narratives
            </p>
          </div>
        </div>
      </div>
      
      {/* About Content */}
      <div className="max-w-5xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="prose prose-lg prose-primary mx-auto">
          <h2>Our Mission</h2>
          <p>
            Codelore was created to make understanding complex or unfamiliar codebases easier and faster. 
            We believe that code should be accessible to everyone, regardless of their level of expertise or 
            familiarity with a specific codebase.
          </p>
          
          <p>
            Our AI-powered platform analyzes repositories and generates comprehensive, human-readable narratives 
            that explain the code's structure, architecture, and implementation details. This makes it easier for developers 
            to onboard to new projects, understand open-source libraries, or explore unfamiliar codebases.
          </p>
          
          <h2>How It Works</h2>
          
          <p>
            Codelore uses a combination of static code analysis and advanced large language models to understand 
            and explain repositories:
          </p>
          
          <ol>
            <li>
              <strong>Repository Access:</strong> We connect to public repositories through the GitHub API to access their structure and content.
            </li>
            <li>
              <strong>Code Parsing:</strong> Our system parses code files to understand their structure, functions, classes, and dependencies.
            </li>
            <li>
              <strong>Semantic Analysis:</strong> We analyze the code to understand its purpose, patterns, and architecture.
            </li>
            <li>
              <strong>Narrative Generation:</strong> Our AI models generate human-readable narratives that explain the code in plain language.
            </li>
          </ol>
          
          <h2>Use Cases</h2>
          
          <h3>Team Onboarding</h3>
          <p>
            New developers can quickly understand a project's structure and architecture without having to read through 
            thousands of lines of code or extensive documentation.
          </p>
          
          <h3>Open Source Exploration</h3>
          <p>
            Developers looking to use or contribute to open-source projects can get a quick overview of the project's 
            structure and implementation details.
          </p>
          
          <h3>Code Reviews</h3>
          <p>
            Reviewers can use our platform to understand the context and purpose of code changes, making reviews 
            faster and more effective.
          </p>
          
          <h3>Documentation Generation</h3>
          <p>
            Projects can use our AI-generated narratives as a starting point for creating comprehensive documentation.
          </p>
          
          <h2>Our Team</h2>
          
          <p>
            Codelore was created by a team of developers, AI researchers, and technical writers who are passionate about 
            making code more accessible and understandable. We believe that by making code easier to understand, we can help 
            developers be more productive and reduce the barriers to entry for new contributors.
          </p>
          
          <p>
            Our platform is constantly evolving, and we're always looking for ways to improve our code analysis and narrative 
            generation capabilities. If you have feedback or suggestions, we'd love to hear from you!
          </p>
        </div>
      </div>
    </div>
  );
} 