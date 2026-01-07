// client/src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/project/ProjectCard';
import Button from '../components/ui/Button';
import {
  HiOutlineFolder,
  HiOutlineUserGroup,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineFilter,
} from 'react-icons/hi';

function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('my'); // 'my' | 'shared' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Separate projects into owned and shared
  const myProjects = projects.filter((p) => {
    const ownerId = p.user?._id || p.user;
    return ownerId === user?.id;
  });

  const sharedProjects = projects.filter((p) => {
    const ownerId = p.user?._id || p.user;
    return ownerId !== user?.id;
  });

  // Get projects based on active tab
  const getTabProjects = () => {
    switch (activeTab) {
      case 'my':
        return myProjects;
      case 'shared':
        return sharedProjects;
      default:
        return projects;
    }
  };

  // Apply filters
  const filteredProjects = getTabProjects()
    .filter((p) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.type.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter((p) => {
      // Status filter
      if (statusFilter === 'all') return true;
      return p.status === statusFilter;
    });

  // Handle project deletion
  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((p) => p._id !== projectId));
  };

  if (isLoading) {
    return (
      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading projects...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='max-w-6xl mx-auto px-4 py-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
            Projects
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1'>
            {projects.length} {projects.length === 1 ? 'project' : 'projects'}{' '}
            total
          </p>
        </div>
        <Link to='/projects/new'>
          <Button variant='primary'>
            <HiOutlinePlus className='w-5 h-5 mr-1' />
            New Project
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className='flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6 w-fit'>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'my'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <HiOutlineFolder className='w-4 h-4' />
          <span>My Projects</span>
          <span className='bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full'>
            {myProjects.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'shared'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <HiOutlineUserGroup className='w-4 h-4' />
          <span>Shared With Me</span>
          {sharedProjects.length > 0 && (
            <span className='bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full'>
              {sharedProjects.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'all'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <span>All</span>
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        {/* Search */}
        <div className='relative flex-1 max-w-md'>
          <HiOutlineSearch className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search projects...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white'
          />
        </div>

        {/* Status Filter */}
        <div className='flex items-center space-x-2'>
          <HiOutlineFilter className='w-5 h-5 text-gray-400' />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm'
          >
            <option value='all'>All Status</option>
            <option value='active'>Active</option>
            <option value='completed'>Completed</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6'>
          {error}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProjectCard
                project={project}
                onDelete={handleDeleteProject}
                isShared={
                  activeTab === 'shared' ||
                  (activeTab === 'all' &&
                    (project.user?._id || project.user) !== user?.id)
                }
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className='text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm'>
          {activeTab === 'shared' ? (
            <>
              <div className='text-6xl mb-4'>👥</div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No shared projects yet
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                When someone invites you to their project, it will appear here
              </p>
            </>
          ) : searchQuery || statusFilter !== 'all' ? (
            <>
              <div className='text-6xl mb-4'>🔍</div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No projects match your filters
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant='secondary'
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <div className='text-6xl mb-4'>📋</div>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                No projects yet
              </h2>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                Create your first project to get started
              </p>
              <Link to='/projects/new'>
                <Button variant='primary'>
                  <HiOutlinePlus className='w-5 h-5 mr-1' />
                  Create First Project
                </Button>
              </Link>
            </>
          )}
        </div>
      )}

      {/* Stats Summary */}
      {projects.length > 0 && (
        <div className='mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 text-center'>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {myProjects.length}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              My Projects
            </p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 text-center'>
            <p className='text-2xl font-bold text-gray-900 dark:text-white'>
              {sharedProjects.length}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Shared</p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 text-center'>
            <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
              {projects.filter((p) => p.status === 'completed').length}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              Completed
            </p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-4 text-center'>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              {projects.filter((p) => p.status === 'active').length}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Active</p>
          </div>
        </div>
      )}
    </main>
  );
}

export default DashboardPage;
