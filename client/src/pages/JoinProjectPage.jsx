// client/src/pages/JoinProjectPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

function JoinProjectPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  // Auto-join if authenticated
  useEffect(() => {
    if (isAuthenticated && code) {
      handleJoin();
    }
  }, [isAuthenticated, code]);

  const handleJoin = async () => {
    setError('');
    setIsJoining(true);

    try {
      const project = await projectsAPI.joinProject(code);
      setSuccess(project);
      setTimeout(() => {
        navigate(`/projects/${project._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join project');
    } finally {
      setIsJoining(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
        <div className='text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md'>
          <span className='text-5xl'>🔗</span>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
            Join Project
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            You need to be logged in to join this project
          </p>
          <div className='mt-6 space-x-4'>
            <Link to={`/login?redirect=/join/${code}`}>
              <Button variant='primary'>Login</Button>
            </Link>
            <Link to={`/signup?redirect=/join/${code}`}>
              <Button variant='secondary'>Sign Up</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
      <div className='text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md'>
        {success ? (
          <>
            <span className='text-5xl'>🎉</span>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
              Joined Successfully!
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              You've joined "{success.name}"
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-4'>
              Redirecting to project...
            </p>
          </>
        ) : error ? (
          <>
            <span className='text-5xl'>❌</span>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-4'>
              Couldn't Join
            </h1>
            <p className='text-red-600 dark:text-red-400 mt-2'>{error}</p>
            <Link to='/dashboard' className='mt-6 inline-block'>
              <Button variant='primary'>Go to Dashboard</Button>
            </Link>
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
