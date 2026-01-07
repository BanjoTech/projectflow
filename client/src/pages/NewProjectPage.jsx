// client/src/pages/NewProjectPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI, githubAPI } from '../services/api'; // Added githubAPI
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GitHubConnect from '../components/github/GitHubConnect'; // New Import
import RepoSelector from '../components/github/RepoSelector'; // New Import
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
  HiOutlineChip,
  HiOutlinePlay,
  HiOutlineCheck,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

// Project types
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
    id: 'animated',
    name: 'Animated Website',
    icon: HiOutlinePlay,
    description: 'Rich animations & interactions',
  },
  {
    id: 'web3',
    name: 'Web3 / Blockchain',
    icon: HiOutlineChip,
    description: 'dApps, smart contracts, DeFi',
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
  const [step, setStep] = useState(1); // 1: Details, 2: Type
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  // New GitHub States
  const [isImporting, setIsImporting] = useState(false);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  const navigate = useNavigate();

  const selectedTypeData = projectTypes.find((t) => t.id === selectedType);
  const canProceedToStep2 = name.trim().length > 0;

  // GitHub Import Handler
  const handleImportSelect = async (repo) => {
    setShowRepoSelector(false);
    setIsCreating(true);
    try {
      const data = await githubAPI.importProject({
        owner: repo.fullName.split('/')[0],
        repo: repo.name,
        projectName: repo.name,
        description: repo.description,
      });
      navigate(`/projects/${data.project._id}`);
    } catch (err) {
      setError('Failed to import project');
      setIsCreating(false);
    }
  };

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
          {step === 1 && "Let's start with the basics"}
          {step === 2 && 'What type of project are you building?'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className='flex items-center mb-8'>
        {[1, 2].map((s) => (
          <div key={s} className='flex items-center'>
            <button
              onClick={() => s < step && setStep(s)}
              disabled={s > step}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                s === step
                  ? 'bg-blue-600 text-white'
                  : s < step
                  ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              {s < step ? <HiOutlineCheck className='w-5 h-5' /> : s}
            </button>
            {s < 2 && (
              <div
                className={`w-24 h-1 mx-2 ${
                  s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center'>
          <HiOutlineExclamationCircle className='w-5 h-5 mr-2 flex-shrink-0' />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode='wait'>
          {/* Step 1: Project Details / Import Choice */}
          {step === 1 && (
            <motion.div
              key='step1'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'
            >
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                How do you want to start?
              </h2>

              <div className='grid grid-cols-2 gap-4 mb-6'>
                <button
                  type='button'
                  onClick={() => setIsImporting(false)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    !isImporting
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className='text-2xl mb-2 block'>✨</span>
                  <span className='font-semibold block dark:text-white'>
                    New Project
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    Start from scratch with AI planning
                  </span>
                </button>

                <button
                  type='button'
                  onClick={() => setIsImporting(true)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    isImporting
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <span className='text-2xl mb-2 block'>📦</span>
                  <span className='font-semibold block dark:text-white'>
                    Import Code
                  </span>
                  <span className='text-xs text-gray-500 dark:text-gray-400'>
                    Scan existing GitHub repo
                  </span>
                </button>
              </div>

              {isImporting ? (
                <div className='space-y-4'>
                  <GitHubConnect onConnect={setGithubConnected} />

                  <div className='pt-4 flex justify-end'>
                    <Button
                      type='button'
                      disabled={!githubConnected}
                      onClick={() => setShowRepoSelector(true)}
                      variant='primary'
                    >
                      Select Repository
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Input
                    label='Project Name'
                    type='text'
                    placeholder='e.g., E-commerce Dashboard, My Portfolio, SaaS App'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <div className='mt-4'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                      Description{' '}
                      <span className='text-gray-400'>
                        (recommended for better phases)
                      </span>
                    </label>
                    <textarea
                      placeholder={`Describe your project in detail...`}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                    />
                  </div>

                  <div className='flex justify-end mt-6'>
                    <Button
                      type='button'
                      variant='primary'
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                    >
                      Continue
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Step 2: Project Type */}
          {step === 2 && (
            <motion.div
              key='step2'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-6'
            >
              <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
                <h2 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  Project Type
                </h2>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                  Select the type that best matches your project
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

              {/* Actions */}
              <div className='flex items-center justify-between'>
                <Button
                  type='button'
                  variant='ghost'
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type='submit'
                  variant='primary'
                  isLoading={isCreating}
                  disabled={!selectedType}
                >
                  {isCreating ? 'Creating Project...' : 'Create Project'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Repo Selector Modal */}
      {showRepoSelector && (
        <RepoSelector
          onSelect={handleImportSelect}
          onClose={() => setShowRepoSelector(false)}
        />
      )}
    </main>
  );
}

export default NewProjectPage;
