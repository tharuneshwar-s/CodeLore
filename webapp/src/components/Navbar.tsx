'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, isLoading, signIn, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLoginClick = () => {
    signIn();
  };

  const handleLogoutClick = () => {
    signOut();
    setProfileMenuOpen(false);
  };

  return (
    <nav 
      className={`sticky top-0 z-50 text-white transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-md text-slate-800 border-b border-slate-200/50' 
          : 'bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-sm ${scrolled ? 'bg-indigo-200/50 group-hover:bg-indigo-300/50' : 'bg-indigo-500/30 group-hover:bg-indigo-400/40'} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                <svg 
                  className={`h-9 w-9 relative ${scrolled ? 'text-indigo-600' : 'text-indigo-300'} transition-colors duration-300`}
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    d="M8 3H4C3.44772 3 3 3.44772 3 4V8C3 8.55228 3.44772 9 4 9H8C8.55228 9 9 8.55228 9 8V4C9 3.44772 8.55228 3 8 3Z" 
                    fill="currentColor" 
                    fillOpacity="0.8"
                  />
                  <path 
                    d="M20 3H16C15.4477 3 15 3.44772 15 4V8C15 8.55228 15.4477 9 16 9H20C20.5523 9 21 8.55228 21 8V4C21 3.44772 20.5523 3 20 3Z" 
                    fill="currentColor" 
                    fillOpacity="0.4"
                  />
                  <path 
                    d="M8 15H4C3.44772 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21H8C8.55228 21 9 20.5523 9 20V16C9 15.4477 8.55228 15 8 15Z" 
                    fill="currentColor" 
                    fillOpacity="0.4"
                  />
                  <path 
                    d="M20 15H16C15.4477 15 15 15.4477 15 16V20C15 20.5523 15.4477 21 16 21H20C20.5523 21 21 20.5523 21 20V16C21 15.4477 20.5523 15 20 15Z" 
                    fill="currentColor" 
                    fillOpacity="0.8"
                  />
                  <path 
                    d="M13 7.5C13 8.88071 11.8807 10 10.5 10C9.11929 10 8 8.88071 8 7.5C8 6.11929 9.11929 5 10.5 5C11.8807 5 13 6.11929 13 7.5Z" 
                    fill="currentColor" 
                    fillOpacity="0.6"
                  />
                  <path 
                    d="M16 16.5C16 15.1193 17.1193 14 18.5 14C19.8807 14 21 15.1193 21 16.5C21 17.8807 19.8807 19 18.5 19C17.1193 19 16 17.8807 16 16.5Z" 
                    fill="currentColor" 
                    fillOpacity="0.6"
                  />
                  <path 
                    d="M10 15.5C10 14.1193 11.1193 13 12.5 13C13.8807 13 15 14.1193 15 15.5C15 16.8807 13.8807 18 12.5 18C11.1193 18 10 16.8807 10 15.5Z" 
                    fill="currentColor" 
                    fillOpacity="0.2"
                  />
                  <path 
                    d="M12 7.5L18 16.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                  <path 
                    d="M8 16.5L15 9.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="ml-2 flex flex-col">
                <span className={`text-xl font-semibold tracking-tight ${scrolled ? 'text-indigo-600' : 'text-white'} transition-colors duration-300 leading-none`}>
                  Code<span className="font-bold">Lore</span>
                </span>
                <span className={`text-xs tracking-wider ${scrolled ? 'text-indigo-400' : 'text-indigo-300'} transition-colors duration-300`}>
                  AI Repository Analysis
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              <Link 
                href="/" 
                className={`relative group px-2 py-2 rounded-md text-sm font-medium ${
                  scrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-white'
                } transition-colors duration-300`}
              >
                <span className="relative z-10">Home</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
              
              <Link 
                href="/repositories" 
                className={`relative group px-2 py-2 rounded-md text-sm font-medium ${
                  scrolled ? 'text-slate-700 hover:text-indigo-600' : 'text-slate-200 hover:text-white'
                } transition-colors duration-300`}
              >
                <span className="relative z-10">Repositories</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    {user.user_metadata?.avatar_url ? (
                      <Image
                        src={user.user_metadata.avatar_url}
                        alt={user.user_metadata.preferred_username || 'User'}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-indigo-500 flex items-center justify-center text-white">
                        {(user.email || user.user_metadata.preferred_username || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className={`ml-2 font-medium text-sm ${scrolled ? 'text-slate-700' : 'text-slate-200'}`}>
                    {user.user_metadata?.preferred_username || user.email?.split('@')[0] || 'User'}
                  </span>
                  <svg
                    className={`ml-1 h-4 w-4 ${scrolled ? 'text-slate-500' : 'text-slate-400'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={handleLoginClick}
                className="btn-primary border-none outline-none flex items-center group relative overflow-hidden"
              >
                <span className="absolute right-0 w-8 h-8 -mt-8 -mr-5 transition-all duration-1000 bg-white opacity-10 rotate-45 group-hover:-mr-2 ease-out"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign in with GitHub
              </button>
            )}
            
            <button 
              onClick={() => {
                const input = document.getElementById('repo-url') as HTMLInputElement;
                if (input) input.focus();
              }}
              className="btn-primary border-none outline-none flex items-center group relative overflow-hidden"
            >
              <span className="absolute right-0 w-8 h-8 -mt-8 -mr-5 transition-all duration-1000 bg-white opacity-10 rotate-45 group-hover:-mr-2 ease-out"></span>
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Repository
            </button>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled 
                  ? 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50' 
                  : 'text-white hover:text-white hover:bg-indigo-700/50'
              } focus:outline-none`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link 
              href="/" 
              className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/repositories" 
              className="block px-3 py-2.5 rounded-md text-base font-medium text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Repositories
            </Link>
         
            <div className="mt-4 pt-4 border-t border-slate-200">
              {isLoading ? (
                <div className="flex items-center px-3 py-2.5">
                  <div className="h-6 w-24 bg-slate-200 animate-pulse rounded"></div>
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center px-3 py-2.5">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      {user.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt={user.user_metadata.preferred_username || 'User'}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-indigo-500 flex items-center justify-center text-black">
                          {(user.email || user.user_metadata.preferred_username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span className="ml-3 font-medium text-black">
                      {user.user_metadata?.preferred_username || user.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-3 py-2.5 rounded-md text-base font-medium text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/70 transition-all"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign in with GitHub
                </button>
              )}
              
              <button 
                className="mt-3 w-full flex items-center justify-center px-4 py-2.5 text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all"
                onClick={() => {
                  setIsMenuOpen(false);
                  const input = document.getElementById('repo-url') as HTMLInputElement;
                  if (input) {
                    setTimeout(() => input.focus(), 300);
                  }
                }}
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Analyze Repository
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}