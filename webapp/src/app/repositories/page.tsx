'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Clock, AlertCircle, CheckCircle, Info, RefreshCcw, Loader2 } from 'lucide-react';
import Link from 'next/link';
import supabase from '@/utils/supabase'
import { useAuth } from '@/context/AuthContext';

// Define types for repository data
interface Repository {
    task_id: string;
    repo_url: string;
    status: string;
    result: any;
    error: string | null;
    progress: number;
    state: string;
    created_at: string;
    user_id?: string;
}

interface User {
    id: string;
    email?: string;
}

export default function RepositoriesPage() {
    const router = useRouter();
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [userRepositories, setUserRepositories] = useState<Repository[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('common'); // 'common' or 'yours'
    const [user, setUser] = useState<User | null>(null);

      const {  signIn, signOut } = useAuth();

    // Check if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        
        checkUser();
    }, []);

    // Fetch repositories
    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                // Fetch common repositories
                const { data: commonData, error: commonError } = await supabase
                    .from('repo_analysis')
                    .select('*')
                    .in('task_id', ['05085ac6-10a2-4fef-905c-747fedbab88b', '74c55749-5cae-486a-bc0d-1cdea9b6a1a5'])

                if (commonError) {
                    throw commonError;
                }

                setRepositories(commonData || []);

                // If user is logged in, fetch their repositories
                if (user) {
                    console.log(user)
                    const { data: userData, error: userError } = await supabase
                        .from('repo_analysis')
                        .select('*')
                        .eq('user_id', user.id)

                    if (userError) {
                        throw userError;
                    }

                    setUserRepositories(userData || []);
                }
            } catch (error) {
                console.error('Error fetching repositories:', error);
                // Handle the error state appropriately
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepositories();
    }, [user]);

    // Function to handle card click
    const handleCardClick = (taskId: string) => {
        router.push(`/repositories/${taskId}`);
    };

    // Format repo URL to show just the repository name
    const getRepoName = (url: string) => {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.length >= 2) {
                return `${pathParts[0]}/${pathParts[1]}`;
            }
            return url;
        } catch {
            return url;
        }
    };

    // Get status color based on status
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
            case 'completed':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100';
            case 'failed':
                return 'bg-red-50 text-red-700 border-red-200 ring-red-100';
            case 'running':
                return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
            case 'queued':
                return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-100';
        }
    };

    // Get status icon based on status
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success':
            case 'completed':
                return <CheckCircle className="mr-1.5 h-3.5 w-3.5" />;
            case 'failed':
                return <AlertCircle className="mr-1.5 h-3.5 w-3.5" />;
            case 'running':
                return <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />;
            case 'queued':
                return <Clock className="mr-1.5 h-3.5 w-3.5" />;
            default:
                return null;
        }
    };

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Render repository cards
    const renderRepositoryCards = (repos: Repository[]) => {
        return (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {repos.map((repo, index) => (
                    <motion.div
                        key={repo.task_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)"
                        }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                        onClick={() => handleCardClick(repo.task_id)}
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    <Github className="h-5 w-5 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-800 truncate">
                                    {getRepoName(repo.repo_url)}
                                </h3>
                            </div>

                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${getStatusColor(repo.status)}`}>
                                {getStatusIcon(repo.status)}
                                {repo.status}
                            </span>

                            <p className="mt-4 text-sm text-zinc-500 flex items-center">
                                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                                <a
                                    href={repo.repo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate hover:text-indigo-600 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {repo.repo_url}
                                </a>
                            </p>

                            {
                                repo.progress < 100 && (
                                    <div className="mt-5">
                                        <div className="flex justify-between mb-1.5 text-xs text-zinc-500">
                                            <span>Analysis Progress</span>
                                            <span>{repo.progress}%</span>
                                        </div>
                                        <div className="w-full bg-zinc-100 rounded-full h-2.5">
                                            <div
                                                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                                                style={{ width: `${repo.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="mt-5 flex justify-between items-center text-sm">
                                <div className="font-medium text-indigo-600 group flex items-center">
                                    View details
                                    <span className="ml-1 group-hover:ml-2 transition-all duration-200">→</span>
                                </div>
                            </div>
                        </div >
                    </motion.div >
                ))}
            </div >
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center px-4 py-10"
                >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-800 mb-2">Loading Repositories</h2>
                    <p className="text-zinc-500">Preparing repository analyses...</p>
                </motion.div>
            </div>
        );
    }

    console.log(userRepositories)

    // Function to handle login click
    const handleLoginClick = async () => {
        try {
            setIsLoading(true);
            await signIn();
            // After successful sign-in, we don't need to redirect
            // as the useEffect with user dependency will reload the repositories
        } catch (error) {
            console.error("Login error:", error);
            // Optionally show an error notification to the user
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-extrabold text-zinc-900 sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        Repository Analysis
                    </h1>
                    <p className="max-w-2xl mx-auto mt-5 text-xl text-zinc-500">
                        Explore how CodeLore analyzes repositories
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 flex items-start gap-4"
                >
                    <div className="bg-indigo-100 rounded-full p-2 mt-0.5">
                        <Info className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-indigo-900 mb-1">Repository Analysis</h3>
                        <p className="text-indigo-700 text-sm">
                            This page showcases repository analyses. You can interact with common examples or your own repositories. To analyze a new repository, <Link href="/signup" className="font-medium underline hover:text-indigo-900">sign up</Link> for an account.
                        </p>
                    </div>
                </motion.div>

                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center"
                    >
                        <Github className="h-4 w-4 mr-2" />
                        Analyze New Repository
                    </Link>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('common')}
                            className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'common'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Common Repositories
                        </button>
                        <button
                            onClick={() => setActiveTab('yours')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'yours'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Your Repositories
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'common' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {repositories.length > 0 ? (
                            renderRepositoryCards(repositories)
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No common repositories available</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'yours' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {user ? (
                            userRepositories.length > 0 ? (
                                renderRepositoryCards(userRepositories)
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 mb-4">You haven't analyzed any repositories yet</p>
                                    <Link
                                        href="/"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Analyze a Repository
                                    </Link>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 mb-4">You need to log in to view your repositories</p>
                                <button 
                  onClick={handleLoginClick}
                  className="w-full flex items-center justify-center px-4 py-2.5 text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Sign in with GitHub
                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
