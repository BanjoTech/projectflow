// client/src/pages/SignupPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import {
  HiOutlineLightningBolt,
  HiOutlineExclamationCircle,
  HiOutlineCheck,
} from 'react-icons/hi';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get redirect URL
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

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(name.trim(), email.trim(), password);

      if (result.success) {
        navigate(redirectUrl);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
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
              Create Account
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Start managing your projects today
            </p>
          </div>

          {/* Redirect notice */}
          {searchParams.get('redirect')?.includes('/join/') && (
            <div className='bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg mb-6 text-sm'>
              Create an account to join the project you were invited to
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
              label='Full Name'
              type='text'
              placeholder='John Doe'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete='name'
            />

            <Input
              label='Email'
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete='email'
            />

            <div className='mb-4'>
              <Input
                label='Password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete='new-password'
                className='mb-1'
              />
              {password && (
                <div className='mt-2'>
                  <div className='flex items-center space-x-2'>
                    <div className='flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                      <div
                        className={`h-full ${passwordStrength.color} transition-all`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.score <= 1
                          ? 'text-red-500'
                          : passwordStrength.score <= 2
                          ? 'text-yellow-500'
                          : passwordStrength.score <= 3
                          ? 'text-blue-500'
                          : 'text-green-500'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                    Use 8+ characters with uppercase, numbers & symbols for best
                    security
                  </p>
                </div>
              )}
            </div>

            <Input
              label='Confirm Password'
              type='password'
              placeholder='••••••••'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete='new-password'
              error={
                confirmPassword && password !== confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
            />

            <Button
              type='submit'
              variant='primary'
              className='w-full mt-6'
              isLoading={isLoading}
              disabled={password !== confirmPassword || password.length < 6}
            >
              Create Account
            </Button>
          </form>

          {/* Benefits list */}
          <div className='mt-6 pt-6 border-t border-gray-200 dark:border-gray-700'>
            <p className='text-xs text-gray-500 dark:text-gray-400 mb-3'>
              What you'll get:
            </p>
            <ul className='space-y-2'>
              {[
                'AI-powered task suggestions',
                'Real-time collaboration',
                'Progress tracking',
              ].map((benefit) => (
                <li
                  key={benefit}
                  className='flex items-center text-sm text-gray-600 dark:text-gray-400'
                >
                  <HiOutlineCheck className='w-4 h-4 text-green-500 mr-2' />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <p className='text-center mt-6 text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              to={`/login${
                searchParams.get('redirect')
                  ? `?redirect=${searchParams.get('redirect')}`
                  : ''
              }`}
              className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className='mt-6 text-center'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            🔒 Your data is encrypted and secure • No credit card required
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
