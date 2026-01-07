// client/src/pages/GitHubCallbackPage.jsx

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { githubAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function GitHubCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Refresh user context if needed
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setStatus('error');
      setError('No authorization code received from GitHub.');
      return;
    }

    const connectGitHub = async () => {
      try {
        await githubAPI.handleCallback(code);
        setStatus('success');

        // Redirect back to where they came from, or dashboard
        const redirect =
          sessionStorage.getItem('github_redirect') || '/dashboard';
        sessionStorage.removeItem('github_redirect');

        setTimeout(() => {
          navigate(redirect);
        }, 1500);
      } catch (err) {
        console.error('GitHub connection failed:', err);
        setStatus('error');
        setError(err.response?.data?.message || 'Failed to connect to GitHub.');
      }
    };

    connectGitHub();
  }, [searchParams, navigate]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center'>
        {status === 'processing' && (
          <>
            <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
              Connecting GitHub...
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Please wait while we link your account.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl'>
              🎉
            </div>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
              Connected!
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Redirecting you back...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl'>
              ❌
            </div>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
              Connection Failed
            </h2>
            <p className='text-red-600 dark:text-red-400 mt-2'>{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className='mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-white hover:bg-gray-300 transition-colors'
            >
              Return to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default GitHubCallbackPage;
