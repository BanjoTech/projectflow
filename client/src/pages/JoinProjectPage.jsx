// client/src/pages/JoinProjectPage.jsx

import { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { HiOutlineUserGroup, HiOutlineExclamationCircle } from 'react-icons/hi';

function JoinProjectPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();

  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  // Store invite code in sessionStorage so it persists through login/signup
  useEffect(() => {
    if (code) {
      sessionStorage.setItem('pendingInviteCode', code);
    }
  }, [code]);

  // Auto-join if authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && code) {
      handleJoin();
    }
  }, [isAuthenticated, authLoading, code]);

  const handleJoin = async () => {
    setError('');
    setIsJoining(true);

    try {
      const project = await projectsAPI.joinProject(code);
      setSuccess(project);
      // Clear the stored invite code
      sessionStorage.removeItem('pendingInviteCode');

      setTimeout(() => {
        navigate(`/projects/${project._id}`);
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to join project';
      setError(errorMessage);

      // If already a member, redirect to project
      if (errorMessage.includes('already')) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } finally {
      setIsJoining(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
        <div className='text-center'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>Loading...</p>
        </div>
      </main>
    );
  }

  // Not authenticated - show signup/login options
  if (!isAuthenticated) {
    return (
      <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
        <div className='text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full'>
          <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
            <HiOutlineUserGroup className='w-8 h-8 text-blue-600 dark:text-blue-400' />
          </div>

          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            You're Invited!
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Someone invited you to collaborate on a project.
          </p>

          <div className='mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Invite Code
            </p>
            <p className='text-lg font-mono font-bold text-gray-900 dark:text-white'>
              {code}
            </p>
          </div>

          <p className='text-sm text-gray-500 dark:text-gray-400 mt-4'>
            Sign in or create an account to join this project
          </p>

          <div className='mt-6 space-y-3'>
            <Link to={`/login?redirect=/join/${code}`} className='block'>
              <Button variant='primary' className='w-full'>
                Sign In to Join
              </Button>
            </Link>
            <Link to={`/signup?redirect=/join/${code}`} className='block'>
              <Button variant='secondary' className='w-full'>
                Create Account
              </Button>
            </Link>
          </div>

          <p className='text-xs text-gray-400 dark:text-gray-500 mt-6'>
            After signing in, you'll automatically join the project
          </p>
        </div>
      </main>
    );
  }

  // Authenticated - show join status
  return (
    <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
      <div className='text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full'>
        {success ? (
          <>
            <div className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>🎉</span>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Joined Successfully!
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Welcome to "{success.name}"
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-4'>
              Redirecting to project...
            </p>
          </>
        ) : error ? (
          <>
            <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
              <HiOutlineExclamationCircle className='w-8 h-8 text-red-600 dark:text-red-400' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Couldn't Join
            </h1>
            <p className='text-red-600 dark:text-red-400 mt-2'>{error}</p>
            <div className='mt-6 space-y-3'>
              <Button onClick={handleJoin} variant='primary' className='w-full'>
                Try Again
              </Button>
              <Link to='/dashboard' className='block'>
                <Button variant='secondary' className='w-full'>
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
              Joining Project...
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Please wait while we add you to the team
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default JoinProjectPage;
