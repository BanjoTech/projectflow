// client/src/components/project/ProjectCard.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../ui/ProgressBar';
import { projectsAPI } from '../../services/api';
import { HiOutlineUserGroup, HiOutlineSparkles } from 'react-icons/hi';

function ProjectCard({ project, onDelete, isShared = false }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      'landing-page': '🎯',
      portfolio: '🎨',
      spa: '⚡',
      fullstack: '🚀',
      saas: '💼',
      ecommerce: '🛒',
      'mobile-app': '📱',
      api: '🔌',
      web3: '🔗',
      animated: '✨',
      custom: '📦',
    };
    return emojis[type] || '📋';
  };

  const formatType = (type) => {
    const types = {
      'landing-page': 'Landing Page',
      portfolio: 'Portfolio',
      spa: 'Single Page App',
      fullstack: 'Full-Stack',
      saas: 'SaaS',
      ecommerce: 'E-Commerce',
      'mobile-app': 'Mobile App',
      api: 'API/Backend',
      web3: 'Web3',
      animated: 'Animated',
      custom: 'Custom',
    };
    return types[type] || type;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDeleting(true);
    try {
      await projectsAPI.delete(project._id);
      if (onDelete) {
        onDelete(project._id);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div className='relative group'>
      <Link
        to={`/projects/${project._id}`}
        className={`block bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border overflow-hidden ${
          isShared
            ? 'border-blue-200 dark:border-blue-800'
            : 'border-gray-100 dark:border-gray-700'
        }`}
      >
        {/* Shared Indicator Banner */}
        {isShared && (
          <div className='bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 flex items-center justify-between'>
            <span className='text-xs text-blue-600 dark:text-blue-400 flex items-center'>
              <HiOutlineUserGroup className='w-3.5 h-3.5 mr-1' />
              Shared by {project.user?.name || 'Team Member'}
            </span>
          </div>
        )}

        {/* Card Header */}
        <div className='p-6'>
          <div className='flex items-start justify-between mb-3'>
            <span className='text-3xl'>{getTypeEmoji(project.type)}</span>
            <div className='flex items-center space-x-2'>
              {project.metadata?.generatedByAI && (
                <span className='bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-full'>
                  Completed
                </span>
              )}
            </div>
          </div>

          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1'>
            {project.name}
          </h3>

          <span className='inline-block text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded'>
            {formatType(project.type)}
          </span>

          {project.description && (
            <p className='text-gray-600 dark:text-gray-400 text-sm mt-3 line-clamp-2'>
              {project.description}
            </p>
          )}
        </div>

        {/* Card Footer */}
        <div className='px-6 pb-6'>
          <ProgressBar
            progress={project.progress}
            size='sm'
            showLabel={false}
          />

          <div className='flex items-center justify-between mt-3'>
            <span className='text-sm font-medium text-gray-900 dark:text-white'>
              {project.progress}%
            </span>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              Updated {formatDate(project.updatedAt)}
            </span>
          </div>
        </div>
      </Link>

      {/* Delete Button - Only show for owned projects */}
      {!isShared && (
        <button
          onClick={handleDeleteClick}
          className='absolute top-3 right-3 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all opacity-0 group-hover:opacity-100 z-10'
          title='Delete project'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
            />
          </svg>
        </button>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
          onClick={handleCancelDelete}
        >
          <div
            className='bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-sm w-full p-6'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
              Delete Project?
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-4 text-sm'>
              Are you sure you want to delete "{project.name}"? This action
              cannot be undone.
            </p>
            <div className='flex items-center justify-end space-x-3'>
              <button
                onClick={handleCancelDelete}
                className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectCard;
