// client/src/components/project/GitHubPanel.jsx

import { useState, useEffect } from 'react';
import { githubAPI } from '../../services/api';
import {
  HiOutlineCode,
  HiOutlineRefresh,
  HiExternalLink,
} from 'react-icons/hi';
import GitHubConnect from '../github/GitHubConnect';
import RepoSelector from '../github/RepoSelector';

function GitHubPanel({ project, onUpdate }) {
  const [commits, setCommits] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showRepoSelector, setShowRepoSelector] = useState(false);

  const isConnected = project.github?.isConnected;

  useEffect(() => {
    if (isConnected) {
      fetchCommits();
    }
  }, [isConnected, project._id]);

  const fetchCommits = async () => {
    try {
      const data = await githubAPI.getCommits(project._id);
      setCommits(data);
    } catch (error) {
      console.error('Failed to fetch commits:', error);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const data = await githubAPI.syncProject(project._id);
      // Notify parent to update project state with new analysis
      if (onUpdate) onUpdate(data.project); // Assuming API returns updated project or you fetch it
      alert('Project analysis updated based on repository changes.');
    } catch (error) {
      alert('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnectRepo = async (repo) => {
    try {
      const data = await githubAPI.connectProject(
        project._id,
        repo.fullName.split('/')[0],
        repo.name
      );
      if (onUpdate) onUpdate(data.project);
      setShowRepoSelector(false);
      setShowConnect(false);
    } catch (error) {
      alert('Failed to connect repository');
    }
  };

  const handleCreateRepo = async () => {
    if (!window.confirm('Create a new private repository on GitHub?')) return;
    try {
      const data = await githubAPI.createRepo(project._id, true);
      if (onUpdate) onUpdate(data.project);
      alert('Repository created successfully!');
    } catch (error) {
      alert('Failed to create repository');
    }
  };

  if (!isConnected) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 dark:text-white flex items-center'>
            <HiOutlineCode className='mr-2' /> GitHub Integration
          </h3>
          <button
            onClick={() => setShowConnect(!showConnect)}
            className='text-sm text-blue-600 hover:underline'
          >
            Connect Repository
          </button>
        </div>

        {showConnect && (
          <div className='mt-4 space-y-4 border-t pt-4 dark:border-gray-700'>
            <GitHubConnect />
            <div className='flex gap-3'>
              <button
                onClick={() => setShowRepoSelector(true)}
                className='flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-white'
              >
                Link Existing Repo
              </button>
              <button
                onClick={handleCreateRepo}
                className='flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors'
              >
                Create New Repo
              </button>
            </div>
          </div>
        )}

        {showRepoSelector && (
          <RepoSelector
            onSelect={handleConnectRepo}
            onClose={() => setShowRepoSelector(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6'>
      <div className='flex justify-between items-start mb-4'>
        <div>
          <h3 className='font-bold text-gray-900 dark:text-white flex items-center'>
            <HiOutlineCode className='mr-2' />
            {project.github.repoName}
          </h3>
          <a
            href={project.github.repoUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-blue-500 hover:underline flex items-center mt-1'
          >
            View on GitHub <HiExternalLink className='ml-1' />
          </a>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          title='Analyze Repo & Sync'
        >
          <HiOutlineRefresh
            className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className='space-y-3'>
        <h4 className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>
          Recent Activity
        </h4>
        {commits.length === 0 ? (
          <p className='text-sm text-gray-500 italic'>
            No recent commits found.
          </p>
        ) : (
          <div className='space-y-2'>
            {commits.slice(0, 3).map((commit) => (
              <div key={commit.sha} className='flex items-start text-sm'>
                <span className='font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded mr-2 text-gray-600 dark:text-gray-300'>
                  {commit.sha.substring(0, 6)}
                </span>
                <div className='flex-1 min-w-0'>
                  <p className='truncate text-gray-900 dark:text-gray-200'>
                    {commit.message}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {commit.author} •{' '}
                    {new Date(commit.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tech Stack Badge from Analysis */}
      {project.github.analysis?.techStack && (
        <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex flex-wrap gap-2'>
            {project.github.analysis.techStack.frontend?.map((t) => (
              <span
                key={t}
                className='text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full'
              >
                {t}
              </span>
            ))}
            {project.github.analysis.techStack.backend?.map((t) => (
              <span
                key={t}
                className='text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full'
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GitHubPanel;
