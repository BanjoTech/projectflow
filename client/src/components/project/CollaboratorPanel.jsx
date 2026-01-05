// client/src/components/project/CollaboratorPanel.jsx

import { useState } from 'react';
import { projectsAPI } from '../../services/api';
import Button from '../ui/Button';

function CollaboratorPanel({ project, currentUserId, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const isOwner =
    project.user._id === currentUserId || project.user === currentUserId;

  // Add collaborator
  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError('');
    setIsAdding(true);

    try {
      const updatedProject = await projectsAPI.addCollaborator(
        project._id,
        email,
        role
      );
      onUpdate(updatedProject);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setIsAdding(false);
    }
  };

  // Remove collaborator
  const handleRemoveCollaborator = async (userId) => {
    try {
      const updatedProject = await projectsAPI.removeCollaborator(
        project._id,
        userId
      );
      onUpdate(updatedProject);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  // Copy invite code
  const handleCopyInviteCode = () => {
    navigator.clipboard.writeText(project.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy invite link
  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/join/${project.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm'>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full p-4 flex items-center justify-between text-left'
      >
        <div className='flex items-center space-x-3'>
          <span className='text-xl'>👥</span>
          <div>
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Team
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {1 + (project.collaborators?.length || 0)} member(s)
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div className='px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-4'>
          {/* Error */}
          {error && (
            <div className='bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg mb-4'>
              {error}
            </div>
          )}

          {/* Owner */}
          <div className='mb-4'>
            <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
              OWNER
            </p>
            <div className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium'>
                  {(project.user.name || 'O')[0].toUpperCase()}
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>
                    {project.user.name || 'Owner'}
                  </p>
                  <p className='text-xs text-gray-500 dark:text-gray-400'>
                    {project.user.email}
                  </p>
                </div>
              </div>
              <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded'>
                Owner
              </span>
            </div>
          </div>

          {/* Collaborators */}
          {project.collaborators && project.collaborators.length > 0 && (
            <div className='mb-4'>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
                COLLABORATORS
              </p>
              <div className='space-y-2'>
                {project.collaborators.map((collab) => (
                  <div
                    key={collab.user._id || collab.user}
                    className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-medium'>
                        {(collab.user.name || 'C')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          {collab.user.name || 'Collaborator'}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {collab.user.email}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span className='text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded'>
                        {collab.role}
                      </span>
                      {isOwner && (
                        <button
                          onClick={() =>
                            handleRemoveCollaborator(
                              collab.user._id || collab.user
                            )
                          }
                          className='text-red-500 hover:text-red-700'
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
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Collaborator (Owner only) */}
          {isOwner && (
            <>
              <div className='mb-4'>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
                  ADD BY EMAIL
                </p>
                <form
                  onSubmit={handleAddCollaborator}
                  className='flex space-x-2'
                >
                  <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='colleague@email.com'
                    className='flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className='px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white'
                  >
                    <option value='editor'>Editor</option>
                    <option value='viewer'>Viewer</option>
                  </select>
                  <Button type='submit' size='sm' isLoading={isAdding}>
                    Add
                  </Button>
                </form>
              </div>

              {/* Invite Code */}
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-2'>
                  INVITE LINK
                </p>
                <div className='flex items-center space-x-2'>
                  <div className='flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg'>
                    <code className='text-sm text-gray-900 dark:text-white'>
                      {project.inviteCode}
                    </code>
                  </div>
                  <button
                    onClick={handleCopyInviteCode}
                    className='px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500'
                  >
                    {copied ? '✓ Copied' : 'Copy Code'}
                  </button>
                </div>
                <button
                  onClick={handleCopyInviteLink}
                  className='mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline'
                >
                  📋 Copy full invite link
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CollaboratorPanel;
