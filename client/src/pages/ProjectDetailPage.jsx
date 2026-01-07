// client/src/pages/ProjectDetailPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsAPI } from '../services/api';
import {
  joinProject,
  leaveProject,
  onPhaseUpdate,
  onProjectUpdate,
  onProjectDeleted,
  offPhaseUpdate,
  offProjectUpdate,
  offProjectDeleted,
} from '../services/socket';
import { useAuth } from '../context/AuthContext';
import PhaseTracker from '../components/project/PhaseTracker';
import CollaboratorPanel from '../components/project/CollaboratorPanel';
import AIChat from '../components/project/AICHAT';
import PRDModal from '../components/project/PRDModal';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import {
  HiOutlineArrowLeft,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineGlobeAlt,
  HiOutlineLightningBolt,
  HiOutlineServer,
  HiOutlineBriefcase,
  HiOutlineShoppingCart,
  HiOutlineDeviceMobile,
  HiOutlineCode,
  HiOutlineCube,
} from 'react-icons/hi';

const typeIcons = {
  'landing-page': HiOutlineGlobeAlt,
  portfolio: HiOutlineSparkles,
  spa: HiOutlineLightningBolt,
  fullstack: HiOutlineServer,
  saas: HiOutlineBriefcase,
  ecommerce: HiOutlineShoppingCart,
  'mobile-app': HiOutlineDeviceMobile,
  api: HiOutlineCode,
  custom: HiOutlineCube,
};

const typeNames = {
  'landing-page': 'Landing Page',
  portfolio: 'Portfolio',
  spa: 'Single Page App',
  fullstack: 'Full-Stack App',
  saas: 'SaaS Product',
  ecommerce: 'E-Commerce',
  'mobile-app': 'Mobile App',
  api: 'API/Backend',
  custom: 'Custom',
};

function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPRDModal, setShowPRDModal] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState(null);

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsAPI.getOne(id);
        setProject(data);
        setError('');
      } catch (err) {
        console.error('Error fetching project:', err);
        if (err.response?.status === 404) {
          setError('Project not found');
        } else if (err.response?.status === 401) {
          setError('You do not have access to this project');
        } else {
          setError('Failed to load project');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  // Real-time sync
  useEffect(() => {
    if (!id) return;

    joinProject(id);

    const handlePhaseUpdate = (data) => {
      if (data.projectId === id && data.project) {
        setProject(data.project);
      }
    };

    const handleProjectUpdate = (updatedProject) => {
      if (updatedProject._id === id) {
        setProject(updatedProject);
      }
    };

    const handleProjectDeleted = (data) => {
      if (data.projectId === id) {
        navigate('/dashboard');
      }
    };

    onPhaseUpdate(handlePhaseUpdate);
    onProjectUpdate(handleProjectUpdate);
    onProjectDeleted(handleProjectDeleted);

    return () => {
      leaveProject(id);
      offPhaseUpdate(handlePhaseUpdate);
      offProjectUpdate(handleProjectUpdate);
      offProjectDeleted(handleProjectDeleted);
    };
  }, [id, navigate]);

  const handlePhaseUpdate = useCallback(
    async (phaseId, updates) => {
      if (!project) return;
      setIsUpdating(true);
      try {
        const updated = await projectsAPI.updatePhase(
          project._id,
          phaseId,
          updates
        );
        setProject(updated);
        setError('');
      } catch (err) {
        console.error('Error updating phase:', err);
        setError('Failed to update phase');
      } finally {
        setIsUpdating(false);
      }
    },
    [project]
  );

  const handlePhaseSelect = useCallback((phaseId) => {
    setCurrentPhaseId(phaseId);
  }, []);

  const handleDelete = async () => {
    try {
      await projectsAPI.delete(project._id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
    }
  };

  const handleProjectUpdateCallback = (updatedProject) => {
    setProject(updatedProject);
  };

  const isOwner = () => {
    if (!project || !user) return false;
    const projectUserId = project.user?._id || project.user;
    return projectUserId === user.id;
  };

  const TypeIcon = project
    ? typeIcons[project.type] || HiOutlineCube
    : HiOutlineCube;

  if (isLoading) {
    return (
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-400'>
            Loading project...
          </p>
        </div>
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm'>
          <div className='text-5xl mb-4'>😕</div>
          <p className='text-red-600 dark:text-red-400 mb-4'>{error}</p>
          <Link to='/dashboard'>
            <Button variant='primary'>Back to Dashboard</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (!project) return null;

  return (
    <main className='max-w-4xl mx-auto px-4 py-8'>
      {/* Back Button */}
      <Link
        to='/dashboard'
        className='inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors'
      >
        <HiOutlineArrowLeft className='w-5 h-5 mr-1' />
        Back to Dashboard
      </Link>

      {/* Project Header */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start space-x-4'>
            <div className='p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl'>
              <TypeIcon className='w-8 h-8 text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {project.name}
              </h1>
              <div className='flex items-center space-x-3 mt-2 flex-wrap gap-2'>
                <span className='text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded'>
                  {typeNames[project.type] || project.type}
                </span>
                {project.status === 'completed' && (
                  <span className='bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm px-2 py-0.5 rounded flex items-center'>
                    <HiOutlineSparkles className='w-3 h-3 mr-1' />
                    Completed
                  </span>
                )}
                {!isOwner() && (
                  <span className='bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm px-2 py-0.5 rounded'>
                    Collaborator
                  </span>
                )}
              </div>
              {project.description && (
                <p className='text-gray-600 dark:text-gray-400 mt-3'>
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            {/* Generate PRD Button - Always show */}
            <button
              onClick={() => setShowPRDModal(true)}
              className='inline-flex items-center space-x-1.5 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors'
              title='Generate PRD / Documentation'
            >
              <HiOutlineDocumentText className='w-5 h-5' />
              <span className='hidden sm:inline text-sm font-medium'>
                {project.progress < 50 ? 'Planning PRD' : 'Documents'}
              </span>
            </button>

            {isOwner() && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'
                title='Delete project'
              >
                <HiOutlineTrash className='w-5 h-5' />
              </button>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className='mt-6 pt-6 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Progress
            </span>
            <span className='text-2xl font-bold text-gray-900 dark:text-white'>
              {project.progress}%
            </span>
          </div>
          <ProgressBar
            progress={project.progress}
            size='lg'
            showLabel={false}
          />
          <div className='flex items-center justify-between mt-2'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {project.phases.filter((p) => p.isComplete).length} of{' '}
              {project.phases.length} phases completed
            </p>
            {project.progress === 100 && (
              <motion.p
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className='text-sm text-green-600 dark:text-green-400 flex items-center'
              >
                <HiOutlineSparkles className='w-4 h-4 mr-1' />
                Project complete! Generate your PRD
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className='bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between'>
          <span>{error}</span>
          <button
            onClick={() => setError('')}
            className='hover:text-red-800 dark:hover:text-red-300'
          >
            ✕
          </button>
        </div>
      )}

      {/* Collaborators Panel */}
      <div className='mb-6'>
        <CollaboratorPanel
          project={project}
          currentUserId={user?.id}
          onUpdate={handleProjectUpdateCallback}
        />
      </div>

      {/* Phase Tracker */}
      <PhaseTracker
        project={project}
        phases={project.phases}
        onPhaseUpdate={handlePhaseUpdate}
        onPhaseSelect={handlePhaseSelect}
        isUpdating={isUpdating}
      />

      {/* AI Chat */}
      <AIChat project={project} currentPhaseId={currentPhaseId} />

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6'
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                Delete Project?
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6'>
                This will permanently delete "{project.name}" and all its data.
                This action cannot be undone.
              </p>
              <div className='flex justify-end space-x-3'>
                <Button
                  variant='ghost'
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button variant='danger' onClick={handleDelete}>
                  Delete Project
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRD Modal */}
      <AnimatePresence>
        {showPRDModal && (
          <PRDModal project={project} onClose={() => setShowPRDModal(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}

export default ProjectDetailPage;
