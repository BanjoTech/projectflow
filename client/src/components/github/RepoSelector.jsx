// client/src/components/github/RepoSelector.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { githubAPI } from '../../services/api';
import { HiSearch, HiLockClosed, HiX } from 'react-icons/hi';

function RepoSelector({ onSelect, onClose }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await githubAPI.getRepos();
        setRepos(data);
      } catch (err) {
        setError('Failed to load repositories');
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    repo.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]'
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 dark:text-white'>
            Select a Repository
          </h3>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          >
            <HiX className='w-5 h-5' />
          </button>
        </div>

        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <div className='relative'>
            <HiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
            <input
              type='text'
              placeholder='Search repositories...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 outline-none dark:text-white'
            />
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-2'>
          {loading ? (
            <div className='flex justify-center p-8'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
            </div>
          ) : error ? (
            <div className='text-center p-8 text-red-500'>{error}</div>
          ) : filteredRepos.length === 0 ? (
            <div className='text-center p-8 text-gray-500'>
              No repositories found
            </div>
          ) : (
            <div className='space-y-1'>
              {filteredRepos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => onSelect(repo)}
                  className='w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group transition-colors'
                >
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center'>
                      <span className='font-medium text-gray-900 dark:text-white truncate'>
                        {repo.name}
                      </span>
                      {repo.isPrivate && (
                        <HiLockClosed className='w-3 h-3 ml-2 text-gray-400' />
                      )}
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                      {repo.description || 'No description'}
                    </p>
                  </div>
                  <span className='text-xs text-gray-400'>
                    {new Date(repo.updatedAt).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default RepoSelector;
