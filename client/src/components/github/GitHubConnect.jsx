// client/src/components/github/GitHubConnect.jsx

import { useState, useEffect } from 'react';
import { githubAPI } from '../../services/api';
import { HiOutlineCode } from 'react-icons/hi';

function GitHubConnect({ onConnect, className = '' }) {
  const [status, setStatus] = useState({ connected: false, username: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const data = await githubAPI.getStatus();
      setStatus(data);
      if (onConnect) onConnect(data.connected);
    } catch (error) {
      console.error('Failed to check GitHub status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      // Save current path to return to
      sessionStorage.setItem('github_redirect', window.location.pathname);

      const { url } = await githubAPI.getAuthUrl();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get auth URL:', error);
      alert('Failed to initiate GitHub connection');
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect GitHub?')) return;

    try {
      await githubAPI.disconnect();
      setStatus({ connected: false });
      if (onConnect) onConnect(false);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (loading) return null;

  return (
    <div
      className={`flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className='flex items-center space-x-3'>
        <div className='p-2 bg-gray-900 text-white rounded-lg'>
          <HiOutlineCode className='w-5 h-5' />
        </div>
        <div>
          <h3 className='font-medium text-gray-900 dark:text-white'>
            GitHub Integration
          </h3>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            {status.connected
              ? `Connected as ${status.username}`
              : 'Connect to import repos and sync progress'}
          </p>
        </div>
      </div>

      {status.connected ? (
        <button
          onClick={handleDisconnect}
          className='text-sm text-red-600 hover:text-red-700 hover:underline'
        >
          Disconnect
        </button>
      ) : (
        <button
          onClick={handleConnect}
          className='px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors'
        >
          Connect GitHub
        </button>
      )}
    </div>
  );
}

export default GitHubConnect;
