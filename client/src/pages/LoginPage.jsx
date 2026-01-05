// client/src/pages/LoginPage.jsx
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-xl shadow-lg p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-gray-900'>Welcome Back</h1>
            <p className='text-gray-600 mt-2'>
              Sign in to continue to ProjectFlow
            </p>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6'>
              {error}
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
            />

            <Input
              label='Password'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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

          <p className='text-center mt-6 text-gray-600'>
            Don't have an account?{' '}
            <Link to='/signup' className='text-blue-600 hover:underline'>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
