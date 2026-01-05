// client/src/pages/NewProjectPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import {
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
  HiOutlineLightningBolt,
  HiOutlineServer,
  HiOutlineBriefcase,
  HiOutlineShoppingCart,
  HiOutlineDeviceMobile,
  HiOutlineCode,
  HiOutlineCube,
  HiOutlineArrowLeft,
} from 'react-icons/hi';

const projectTypes = [
  {
    id: 'landing-page',
    name: 'Landing Page',
    icon: HiOutlineGlobeAlt,
    description: 'Marketing or product page',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    icon: HiOutlineSparkles,
    description: 'Showcase your work',
  },
  {
    id: 'spa',
    name: 'Single Page App',
    icon: HiOutlineLightningBolt,
    description: 'Interactive frontend app',
  },
  {
    id: 'fullstack',
    name: 'Full-Stack App',
    icon: HiOutlineServer,
    description: 'Frontend + Backend + Database',
  },
  {
    id: 'saas',
    name: 'SaaS Product',
    icon: HiOutlineBriefcase,
    description: 'Software as a service',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    icon: HiOutlineShoppingCart,
    description: 'Online store',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    icon: HiOutlineDeviceMobile,
    description: 'iOS/Android application',
  },
  {
    id: 'api',
    name: 'API/Backend',
    icon: HiOutlineCode,
    description: 'REST or GraphQL API',
  },
  {
    id: 'custom',
    name: 'Custom',
    icon: HiOutlineCube,
    description: 'Other project type',
  },
];

function NewProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!selectedType) {
      setError('Please select a project type');
      return;
    }

    setIsCreating(true);

    try {
      const project = await projectsAPI.create({
        name: name.trim(),
        description: description.trim(),
        type: selectedType,
      });

      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <main className='max-w-3xl mx-auto px-4 py-8'>
      {/* Back Link */}
      <Link
        to='/dashboard'
        className='inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors'
      >
        <HiOutlineArrowLeft className='w-5 h-5 mr-1' />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
          Create New Project
        </h1>
        <p className='text-gray-600 dark:text-gray-400 mt-2'>
          Choose a project type and we'll set up a developer-focused task
          breakdown for you.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center'>
          <span className='mr-2'>⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Project Details */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Project Details
          </h2>

          <Input
            label='Project Name'
            type='text'
            placeholder='e.g., E-commerce Dashboard, Portfolio v2'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className='mt-4'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Description <span className='text-gray-400'>(optional)</span>
            </label>
            <textarea
              placeholder='Brief description of your project goals, features, or tech stack...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
            />
          </div>
        </div>

        {/* Project Type */}
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
            Project Type
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
            This determines the phase template and task suggestions you'll
            receive.
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
            {projectTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  type='button'
                  onClick={() => setSelectedType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedType === type.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`p-2 rounded-lg ${
                        selectedType === type.id
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className='w-5 h-5' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        {type.name}
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800'>
          <div className='flex items-start space-x-3'>
            <HiOutlineSparkles className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0' />
            <div>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>
                What happens next?
              </p>
              <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                We'll create a structured project with developer-focused phases
                and tasks. You can get AI suggestions for each task as you work
                through them.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className='flex items-center justify-end space-x-4 pt-4'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='primary'
            isLoading={isCreating}
            disabled={!name.trim() || !selectedType}
          >
            Create Project
          </Button>
        </div>
      </form>
    </main>
  );
}

export default NewProjectPage;
