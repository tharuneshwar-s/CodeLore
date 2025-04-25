// This file is for rendering the repository/[id] page.
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Code,
  Database,
  Server,
  FileText
} from 'lucide-react';
import EnhancedRepositoryDetail from '@/components/EnhancedRepositoryDetail';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for repository data
interface Repository {
  task_id: string;
  repo_url: string;
  status: string;
  result: any;
  error: string | null;
  progress: number;
  state: string;
}

export default function RepositoryPage() {
  const params = useParams();
  const id = params.id as string;

  const [repository, setRepository] = useState<Repository | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (id) {
      // First, get the current state
      const fetchInitialData = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('repo_analysis')
            .select('*')
            .eq('task_id', id)
            .single();

          if (fetchError) throw fetchError;
          if (data) setRepository(data);
          console.log(data)
          console.log(fetchError)
        } catch (err: any) {

          setError(err.message);
        }
      };

      fetchInitialData();

      // Then set up real-time subscription
      const channel = supabase
        .channel('repo-analysis-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'repo_analysis',
            filter: `task_id=eq.${id}`,
          },
          (payload: any) => {
            setRepository(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  // Copy to clipboard handler
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show tooltip handler
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };


  console.log(repository)
  // Main render logic
  if (repository?.result && repository.status.toLocaleLowerCase() === 'success' && repository.progress === 100) {
    return (
      <EnhancedRepositoryDetail data={repository?.result} />
    );
  }

  if (!repository) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-indigo-200 border-opacity-50 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Repository Analysis</h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">Fetching the latest information about your repository analysis. This should only take a moment...</p>
        </motion.div>
      </div>
    );
  }

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
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'queued':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Get state badge styling
  const getStateBadge = (state: string) => {
    switch (state?.toLowerCase()) {
      case 'analyzing':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: <Code className="w-4 h-4 mr-1.5" />
        };
      case 'indexing':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: <Database className="w-4 h-4 mr-1.5" />
        };
      case 'cloning':
        return {
          bg: 'bg-cyan-50',
          text: 'text-cyan-700',
          border: 'border-cyan-200',
          icon: <Server className="w-4 h-4 mr-1.5" />
        };
      case 'summarizing':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200',
          icon: <FileText className="w-4 h-4 mr-1.5" />
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: <Clock className="w-4 h-4 mr-1.5" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8 backdrop-blur-sm backdrop-filter">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="flex items-center">
                    <Github className="w-8 h-8 mr-3 text-indigo-200" />
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{getRepoName(repository.repo_url)}</h1>
                  </div>
                  <p className="mt-3 text-indigo-100 flex items-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a
                      href={repository.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline transition-all duration-200 hover:text-white"
                    >
                      {repository.repo_url}
                    </a>
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${getStatusColor(repository.status)}`}>
                    {repository.status === 'completed' && <CheckCircle className="mr-1.5 w-4 h-4" />}
                    {repository.status}
                  </span>

                  {repository.state && (
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm ${getStateBadge(repository.state).bg} ${getStateBadge(repository.state).text} border ${getStateBadge(repository.state).border}`}>
                      {getStateBadge(repository.state).icon}
                      {repository.state}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              {repository.status.toLowerCase() !== 'success' && (
                <div className="mt-8">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-indigo-100">Analysis progress</span>
                    <span className="font-bold text-white">{repository.progress}%</span>
                  </div>
                  <div className="w-full bg-indigo-900/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="bg-gradient-to-r from-indigo-300 to-purple-300 h-3 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${repository.progress}%` }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
} 