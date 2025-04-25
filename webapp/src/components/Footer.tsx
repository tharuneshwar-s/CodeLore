import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-t border-indigo-500/20 shadow-lg">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <p className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Built by tharuneshwar
          </p>
          
          <div className="flex items-center justify-center space-x-4 order-1 sm:order-2">
            <a 
              href="https://github.com/tharuneshwar-s" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-white transition-all duration-300"
              aria-label="GitHub"
            >
              <div className="group relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                <svg className="h-6 w-6 relative group-hover:scale-110 transform transition-all duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-indigo-800/90 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-indigo-700/50 shadow-lg whitespace-nowrap">GitHub</span>
              </div>
            </a>
            <a 
              href="https://www.linkedin.com/in/tharuneshwar-s/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-300 hover:text-white transition-all duration-300"
              aria-label="LinkedIn"
            >
              <div className="group relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                <svg className="h-6 w-6 relative group-hover:scale-110 transform transition-all duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-blue-800/90 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-blue-700/50 shadow-lg whitespace-nowrap">LinkedIn</span>
              </div>
            </a>
            <span className="h-4 w-px bg-gradient-to-b from-indigo-500/30 to-purple-500/30"></span>
            <span className="text-sm text-gradient bg-gradient-to-r from-indigo-300 to-cyan-300 font-medium">CodeLore</span>
          </div>
        </div>
      </div>
    </footer>
  );
} 