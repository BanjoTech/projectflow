// client/src/pages/SignupPage.jsx
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const result = await signup(name, email, password);

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
            <h1 className='text-2xl font-bold text-gray-900'>Create Account</h1>
            <p className='text-gray-600 mt-2'>
              Start managing your projects today
            </p>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6'>
              {error}
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
            />

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
            <p className='text-sm text-gray-500 -mt-2 mb-4'>
              Must be at least 6 characters
            </p>

            <Button
              type='submit'
              variant='primary'
              className='w-full mt-6'
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className='text-center mt-6 text-gray-600'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600 hover:underline'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
