// client/src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import {
  HiOutlineLightningBolt,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get redirect URL from query params or sessionStorage
  const redirectUrl =
    searchParams.get('redirect') || sessionStorage.getItem('pendingInviteCode')
      ? `/join/${sessionStorage.getItem('pendingInviteCode')}`
      : '/dashboard';

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        navigate(redirectUrl);
      } else {
        setError(
          result.error || 'Login failed. Please check your credentials.'
        );
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8'>
      <div className='w-full max-w-md'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4'>
              <HiOutlineLightningBolt className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
              Welcome Back
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Sign in to continue to ProjectFlow
            </p>
          </div>

          {/* Redirect notice */}
          {searchParams.get('redirect') && (
            <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg mb-6 text-sm'>
              Sign in to continue to your destination
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-start'>
              <HiOutlineExclamationCircle className='w-5 h-5 mr-2 flex-shrink-0 mt-0.5' />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label='Email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />

            <Input
              label='Password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />

            <Button
              type='submit'
              variant='primary'
              className='w-full mt-6'
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-gray-600 dark:text-gray-400'>
              Don't have an account?{' '}
              <Link
                to={`/signup${
                  searchParams.get('redirect')
                    ? `?redirect=${searchParams.get('redirect')}`
                    : ''
                }`}
                className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
