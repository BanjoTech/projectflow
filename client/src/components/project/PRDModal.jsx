// client/src/components/project/PRDModal.jsx

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '../../services/api';
import {
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineClipboardCopy,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
  HiOutlineBookOpen,
} from 'react-icons/hi';

function PRDModal({ project, onClose }) {
  const [activeTab, setActiveTab] = useState('planning'); // 'planning' | 'documentation'
  const [planningPRD, setPlanningPRD] = useState(project.planningPRD || null);
  const [documentationPRD, setDocumentationPRD] = useState(
    project.documentationPRD || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Determine which PRD to show based on project progress
  useEffect(() => {
    if (project.progress >= 50 && !planningPRD) {
      // If project is advanced but no planning PRD, suggest documentation
      setActiveTab('documentation');
    }
  }, [project.progress, planningPRD]);

  const generatePRD = async (type) => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'planning') {
        const response = await aiAPI.generatePlanningPRD(project._id);
        setPlanningPRD(response.prd);
      } else {
        const response = await aiAPI.generateDocumentationPRD(project._id);
        setDocumentationPRD(response.prd);
      }
    } catch (err) {
      console.error(`Failed to generate ${type} PRD:`, err);
      setError(
        `Failed to generate ${
          type === 'planning' ? 'Planning PRD' : 'Documentation'
        }. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPRD = () => {
    return activeTab === 'planning' ? planningPRD : documentationPRD;
  };

  const handleCopy = () => {
    const prd = getCurrentPRD();
    if (prd) {
      navigator.clipboard.writeText(prd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const prd = getCurrentPRD();
    if (prd) {
      const blob = new Blob([prd], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename =
        activeTab === 'planning'
          ? `${project.name.replace(/\s+/g, '-').toLowerCase()}-planning-prd.md`
          : `${project.name
              .replace(/\s+/g, '-')
              .toLowerCase()}-documentation.md`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const currentPRD = getCurrentPRD();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <HiOutlineDocumentText className='w-6 h-6 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-white text-lg'>
                  Project Documents
                </h3>
                <p className='text-sm text-blue-100'>{project.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='p-2 hover:bg-white/20 rounded-lg transition-colors'
            >
              <HiOutlineX className='w-5 h-5 text-white' />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
          <button
            onClick={() => setActiveTab('planning')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'planning'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <HiOutlineLightBulb className='w-4 h-4' />
            <span>Planning PRD</span>
            <span className='text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded'>
              Before Dev
            </span>
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'documentation'
                ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-800'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <HiOutlineBookOpen className='w-4 h-4' />
            <span>Documentation</span>
            <span className='text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded'>
              After Dev
            </span>
          </button>
        </div>

        {/* Tab Description */}
        <div className='px-4 py-3 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700'>
          {activeTab === 'planning' ? (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              <strong>Planning PRD:</strong> A comprehensive requirements
              document to guide development. Generate this <em>before</em> you
              start coding to have a clear roadmap. Feed this to AI coding
              assistants like Claude or Cursor.
            </p>
          ) : (
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              <strong>Documentation:</strong> Technical documentation of what
              was built. Generate this <em>after</em> completing tasks to create
              project documentation. Uses your task notes and descriptions to
              capture implementation details.
            </p>
          )}
        </div>

        {/* Action Bar */}
        {currentPRD && !isLoading && (
          <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0'>
            <div className='flex items-center space-x-2'>
              <button
                onClick={handleCopy}
                className='inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm'
              >
                {copied ? (
                  <>
                    <HiOutlineCheckCircle className='w-4 h-4 text-green-500' />
                    <span className='text-green-600 dark:text-green-400'>
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <HiOutlineClipboardCopy className='w-4 h-4 text-gray-500' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      Copy
                    </span>
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className='inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm'
              >
                <HiOutlineDownload className='w-4 h-4 text-gray-500' />
                <span className='text-gray-700 dark:text-gray-300'>
                  Download .md
                </span>
              </button>
            </div>
            <button
              onClick={() => generatePRD(activeTab)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                activeTab === 'planning'
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
              }`}
            >
              <HiOutlineRefresh className='w-4 h-4' />
              <span>Regenerate</span>
            </button>
          </div>
        )}

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {isLoading && (
            <div className='flex flex-col items-center justify-center py-16'>
              <div
                className={`w-16 h-16 border-4 ${
                  activeTab === 'planning'
                    ? 'border-blue-600'
                    : 'border-purple-600'
                } border-t-transparent rounded-full animate-spin`}
              />
              <p className='mt-6 text-gray-600 dark:text-gray-400 text-lg'>
                Generating{' '}
                {activeTab === 'planning' ? 'Planning PRD' : 'Documentation'}...
              </p>
              <p className='mt-2 text-gray-500 dark:text-gray-500 text-sm'>
                This may take 15-30 seconds
              </p>
            </div>
          )}

          {error && (
            <div className='text-center py-16'>
              <div className='text-5xl mb-4'>😕</div>
              <p className='text-red-600 dark:text-red-400 mb-4'>{error}</p>
              <button
                onClick={() => generatePRD(activeTab)}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Try Again
              </button>
            </div>
          )}

          {!currentPRD && !isLoading && !error && (
            <div className='text-center py-16'>
              <div
                className={`w-16 h-16 ${
                  activeTab === 'planning'
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-purple-100 dark:bg-purple-900/30'
                } rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {activeTab === 'planning' ? (
                  <HiOutlineLightBulb className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                ) : (
                  <HiOutlineBookOpen className='w-8 h-8 text-purple-600 dark:text-purple-400' />
                )}
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                {activeTab === 'planning'
                  ? 'Generate Planning PRD'
                  : 'Generate Documentation'}
              </h3>
              <p className='text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto'>
                {activeTab === 'planning'
                  ? 'Create a comprehensive Product Requirements Document based on your project phases and tasks. Perfect for feeding to AI coding assistants.'
                  : `Document what you've built based on completed tasks (${project.progress}% complete). Include task descriptions for better documentation.`}
              </p>
              <button
                onClick={() => generatePRD(activeTab)}
                className={`px-6 py-3 text-white rounded-lg transition-colors ${
                  activeTab === 'planning'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                Generate{' '}
                {activeTab === 'planning' ? 'Planning PRD' : 'Documentation'}
              </button>
            </div>
          )}

          {currentPRD && !isLoading && (
            <div className='prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-2xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-2 prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-pre:bg-gray-900 prose-pre:text-gray-100'>
              <div className='whitespace-pre-wrap text-gray-700 dark:text-gray-300'>
                {currentPRD}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center'>
              <HiOutlineDocumentText className='w-3.5 h-3.5 mr-1' />
              AI-generated • Review before using
            </p>
            <button
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm'
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default PRDModal;
