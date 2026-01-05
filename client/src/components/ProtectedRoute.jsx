// client/src/components/ProtectedRoute.jsx
// ═══════════════════════════════════════════════════════════════

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  // If authenticated, show the protected content
  return children;
}

export default ProtectedRoute;

/*
EXPLANATION:

- We wrap protected pages with this component
- It checks if user is logged in
- If not, redirects to /login
- If yes, renders the page (children)

Usage:
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    } 
  />
*/
