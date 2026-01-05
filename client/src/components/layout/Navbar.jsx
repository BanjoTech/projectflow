// client/src/components/layout/Navbar.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationDropdown from '../ui/NotificationDropdown';
import {
  HiOutlineViewGrid,
  HiOutlinePlus,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLightningBolt,
} from 'react-icons/hi';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
              <HiOutlineLightningBolt className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>
              ProjectFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-4'>
            {isAuthenticated ? (
              <>
                <Link
                  to='/dashboard'
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <HiOutlineViewGrid className='w-5 h-5' />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to='/projects/new'
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/projects/new')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <HiOutlinePlus className='w-5 h-5' />
                  <span>New Project</span>
                </Link>

                {/* Notification Bell */}
                <NotificationDropdown />

                <ThemeToggle />

                <div className='flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm'>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className='p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors'
                    title='Logout'
                  >
                    <HiOutlineLogout className='w-5 h-5' />
                  </button>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link
                  to='/login'
                  className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all'
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden flex items-center space-x-2'>
            {isAuthenticated && <NotificationDropdown />}
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              {isMobileMenuOpen ? (
                <HiOutlineX className='w-6 h-6' />
              ) : (
                <HiOutlineMenu className='w-6 h-6' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200 dark:border-gray-800'>
            {isAuthenticated ? (
              <div className='space-y-2'>
                <Link
                  to='/dashboard'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  <HiOutlineViewGrid className='w-5 h-5' />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to='/projects/new'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  <HiOutlinePlus className='w-5 h-5' />
                  <span>New Project</span>
                </Link>
                <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center space-x-3 px-3 py-2'>
                    <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm'>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {user?.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className='flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 w-full'
                >
                  <HiOutlineLogout className='w-5 h-5' />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className='space-y-2'>
                <Link
                  to='/login'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='block px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='block px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-center'
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
