// client/src/App.jsx

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NewProjectPage from './pages/NewProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import JoinProjectPage from './pages/JoinProjectPage';

function App() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors'>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/join/:code' element={<JoinProjectPage />} />

        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/projects/new'
          element={
            <ProtectedRoute>
              <NewProjectPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/projects/:id'
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
