// client/src/pages/VerifyEmailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.message);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  return (
    <main className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4'>
      <div className='text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full'>
        {status === 'verifying' && (
          <>
            <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-6'>
              Verifying Your Email...
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>
              Please wait a moment
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className='w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto'>
              <HiOutlineCheckCircle className='w-10 h-10 text-green-500' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-6'>
              Email Verified! 🎉
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-2'>{message}</p>
            <p className='text-sm text-gray-500 dark:text-gray-400 mt-4'>
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto'>
              <HiOutlineExclamationCircle className='w-10 h-10 text-red-500' />
            </div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white mt-6'>
              Verification Failed
            </h1>
            <p className='text-red-600 dark:text-red-400 mt-2'>{message}</p>
            <div className='mt-6 space-y-3'>
              <Link to='/dashboard'>
                <Button variant='primary' className='w-full'>
                  Go to Dashboard
                </Button>
              </Link>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                You can request a new verification link from your dashboard
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default VerifyEmailPage;
