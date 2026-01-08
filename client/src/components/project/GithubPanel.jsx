// client/src/components/project/GitHubPanel.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { githubAPI } from '../../services/api';
import {
  HiOutlineCode,
  HiOutlineRefresh,
  HiExternalLink,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineLightBulb,
  HiOutlineFolder,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePlus,
  HiOutlineLink,
  HiOutlineDatabase,
  HiOutlineColorSwatch,
  HiOutlineBeaker,
  HiOutlineServer,
  HiOutlineDesktopComputer,
} from 'react-icons/hi';
import GitHubConnect from '../github/GitHubConnect';
import RepoSelector from '../github/RepoSelector';

function GitHubPanel({ project, onUpdate }) {
  const [commits, setCommits] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    techStack: true,
    detected: true,
    missing: true,
    suggestions: true,
    structure: false,
    commits: true,
  });

  const isConnected = project.github?.isConnected;
  const analysis = project.github?.analysis;

  useEffect(() => {
    if (isConnected) {
      fetchCommits();
    }
  }, [isConnected, project._id]);

  const fetchCommits = async () => {
    try {
      const data = await githubAPI.getCommits(project._id);
      setCommits(data);
    } catch (error) {
      console.error('Failed to fetch commits:', error);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const data = await githubAPI.syncProject(project._id);
      if (onUpdate) onUpdate(data.project);
      await fetchCommits();
    } catch (error) {
      alert(
        'Sync failed: ' + (error.response?.data?.message || 'Unknown error')
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnectRepo = async (repo) => {
    try {
      const data = await githubAPI.connectProject(
        project._id,
        repo.fullName.split('/')[0],
        repo.name
      );
      if (onUpdate) onUpdate(data.project);
      setShowRepoSelector(false);
      setShowConnect(false);
    } catch (error) {
      alert(
        'Failed to connect repository: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const handleCreateRepo = async () => {
    if (
      !window.confirm(
        'Create a new private repository on GitHub for this project?'
      )
    )
      return;
    try {
      const data = await githubAPI.createRepo(project._id, true);
      if (onUpdate) onUpdate(data.project);
      alert(`Repository created! View at: ${data.repoUrl}`);
    } catch (error) {
      alert(
        'Failed to create repository: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Section Header Component
  const SectionHeader = ({
    section,
    icon: Icon,
    title,
    count,
    color = 'gray',
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className='w-full flex items-center justify-between py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 transition-colors'
    >
      <div className='flex items-center space-x-2'>
        <Icon className={`w-4 h-4 text-${color}-500`} />
        <span className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
          {title}
        </span>
        {count !== undefined && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}
          >
            {count}
          </span>
        )}
      </div>
      {expandedSections[section] ? (
        <HiOutlineChevronUp className='w-4 h-4 text-gray-400' />
      ) : (
        <HiOutlineChevronDown className='w-4 h-4 text-gray-400' />
      )}
    </button>
  );

  // Not Connected State
  if (!isConnected) {
    return (
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-gray-900 dark:text-white flex items-center'>
            <HiOutlineCode className='mr-2' /> GitHub Integration
          </h3>
          <button
            onClick={() => setShowConnect(!showConnect)}
            className='text-sm text-blue-600 hover:underline flex items-center'
          >
            <HiOutlineLink className='w-4 h-4 mr-1' />
            Connect Repository
          </button>
        </div>

        <p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
          Connect a GitHub repository to analyze your codebase, track progress,
          and get AI-powered suggestions.
        </p>

        <AnimatePresence>
          {showConnect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='mt-4 space-y-4 border-t pt-4 dark:border-gray-700'
            >
              <GitHubConnect />
              <div className='flex gap-3'>
                <button
                  onClick={() => setShowRepoSelector(true)}
                  className='flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-white flex items-center justify-center'
                >
                  <HiOutlineLink className='w-4 h-4 mr-2' />
                  Link Existing Repo
                </button>
                <button
                  onClick={handleCreateRepo}
                  className='flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center'
                >
                  <HiOutlinePlus className='w-4 h-4 mr-2' />
                  Create New Repo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showRepoSelector && (
          <RepoSelector
            onSelect={handleConnectRepo}
            onClose={() => setShowRepoSelector(false)}
          />
        )}
      </div>
    );
  }

  // Connected State - Full Analysis View
  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='p-4 border-b border-gray-100 dark:border-gray-700'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-bold text-gray-900 dark:text-white flex items-center'>
              <HiOutlineCode className='mr-2' />
              {project.github.repoName}
            </h3>
            <a
              href={project.github.repoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs text-blue-500 hover:underline flex items-center mt-1'
            >
              {project.github.repoFullName ||
                `${project.github.repoOwner}/${project.github.repoName}`}
              <HiExternalLink className='ml-1 w-3 h-3' />
            </a>
          </div>
          <div className='flex items-center space-x-2'>
            {project.github.lastSyncedAt && (
              <span className='text-xs text-gray-400'>
                Synced{' '}
                {new Date(project.github.lastSyncedAt).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              title='Re-analyze repository'
            >
              <HiOutlineRefresh
                className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className='p-4 space-y-4'>
        {/* Tech Stack Section */}
        {analysis?.techStack && (
          <div>
            <SectionHeader
              section='techStack'
              icon={HiOutlineDesktopComputer}
              title='Tech Stack'
              count={
                (analysis.techStack.frontend?.length || 0) +
                (analysis.techStack.backend?.length || 0) +
                (analysis.techStack.database?.length || 0) +
                (analysis.techStack.styling?.length || 0) +
                (analysis.techStack.testing?.length || 0)
              }
              color='blue'
            />
            <AnimatePresence>
              {expandedSections.techStack && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 space-y-2'
                >
                  {/* Frontend */}
                  {analysis.techStack.frontend?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineDesktopComputer className='w-4 h-4 text-blue-500 mt-0.5' />
                      <div>
                        <span className='text-xs text-gray-500'>Frontend:</span>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {analysis.techStack.frontend.map((tech) => (
                            <span
                              key={tech}
                              className='text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Backend */}
                  {analysis.techStack.backend?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineServer className='w-4 h-4 text-green-500 mt-0.5' />
                      <div>
                        <span className='text-xs text-gray-500'>Backend:</span>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {analysis.techStack.backend.map((tech) => (
                            <span
                              key={tech}
                              className='text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Database */}
                  {analysis.techStack.database?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineDatabase className='w-4 h-4 text-purple-500 mt-0.5' />
                      <div>
                        <span className='text-xs text-gray-500'>Database:</span>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {analysis.techStack.database.map((tech) => (
                            <span
                              key={tech}
                              className='text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Styling */}
                  {analysis.techStack.styling?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineColorSwatch className='w-4 h-4 text-pink-500 mt-0.5' />
                      <div>
                        <span className='text-xs text-gray-500'>Styling:</span>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {analysis.techStack.styling.map((tech) => (
                            <span
                              key={tech}
                              className='text-xs px-2 py-0.5 bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Testing */}
                  {analysis.techStack.testing?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineBeaker className='w-4 h-4 text-yellow-500 mt-0.5' />
                      <div>
                        <span className='text-xs text-gray-500'>Testing:</span>
                        <div className='flex flex-wrap gap-1 mt-1'>
                          {analysis.techStack.testing.map((tech) => (
                            <span
                              key={tech}
                              className='text-xs px-2 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full'
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No tech detected */}
                  {!analysis.techStack.frontend?.length &&
                    !analysis.techStack.backend?.length &&
                    !analysis.techStack.database?.length && (
                      <p className='text-sm text-gray-500 italic pl-6'>
                        No package.json found or empty repository
                      </p>
                    )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Project Structure */}
        {analysis?.structure && (
          <div>
            <SectionHeader
              section='structure'
              icon={HiOutlineFolder}
              title='Project Structure'
              color='indigo'
            />
            <AnimatePresence>
              {expandedSections.structure && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 grid grid-cols-2 gap-2 pl-6'
                >
                  {[
                    { key: 'hasClient', label: 'Client/Frontend folder' },
                    { key: 'hasServer', label: 'Server/Backend folder' },
                    { key: 'hasSrc', label: 'Src folder' },
                    { key: 'hasTests', label: 'Tests' },
                    { key: 'hasDocker', label: 'Docker config' },
                    { key: 'hasCICD', label: 'CI/CD pipeline' },
                    { key: 'hasReadme', label: 'README' },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className='flex items-center space-x-2 text-sm'
                    >
                      {analysis.structure[key] ? (
                        <HiOutlineCheckCircle className='w-4 h-4 text-green-500' />
                      ) : (
                        <div className='w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600' />
                      )}
                      <span
                        className={
                          analysis.structure[key]
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-400'
                        }
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Detected Features */}
        {analysis?.detectedFeatures?.length > 0 && (
          <div>
            <SectionHeader
              section='detected'
              icon={HiOutlineCheckCircle}
              title="What's Built"
              count={analysis.detectedFeatures.length}
              color='green'
            />
            <AnimatePresence>
              {expandedSections.detected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 space-y-1 pl-6'
                >
                  {analysis.detectedFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className='flex items-center space-x-2 text-sm'
                    >
                      <HiOutlineCheckCircle className='w-4 h-4 text-green-500 flex-shrink-0' />
                      <span className='text-gray-700 dark:text-gray-300'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Missing Features */}
        {analysis?.missingFeatures?.length > 0 && (
          <div>
            <SectionHeader
              section='missing'
              icon={HiOutlineExclamationCircle}
              title="What's Missing"
              count={analysis.missingFeatures.length}
              color='yellow'
            />
            <AnimatePresence>
              {expandedSections.missing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 space-y-1 pl-6'
                >
                  {analysis.missingFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className='flex items-center space-x-2 text-sm'
                    >
                      <HiOutlineExclamationCircle className='w-4 h-4 text-yellow-500 flex-shrink-0' />
                      <span className='text-gray-700 dark:text-gray-300'>
                        {feature}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* AI Suggestions */}
        {analysis?.suggestions?.length > 0 && (
          <div>
            <SectionHeader
              section='suggestions'
              icon={HiOutlineLightBulb}
              title='AI Suggestions'
              count={analysis.suggestions.length}
              color='purple'
            />
            <AnimatePresence>
              {expandedSections.suggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 space-y-2 pl-6'
                >
                  {analysis.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className='flex items-start space-x-2 text-sm p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg'
                    >
                      <HiOutlineLightBulb className='w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5' />
                      <span className='text-gray-700 dark:text-gray-300'>
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Recent Commits */}
        <div>
          <SectionHeader
            section='commits'
            icon={HiOutlineCode}
            title='Recent Commits'
            count={commits.length}
            color='gray'
          />
          <AnimatePresence>
            {expandedSections.commits && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='mt-2 space-y-2 pl-6'
              >
                {commits.length === 0 ? (
                  <p className='text-sm text-gray-500 italic'>
                    No recent commits found.
                  </p>
                ) : (
                  commits.slice(0, 5).map((commit) => (
                    <a
                      key={commit.sha}
                      href={commit.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-start text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg transition-colors'
                    >
                      <span className='font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded mr-2 text-gray-600 dark:text-gray-300 flex-shrink-0'>
                        {commit.sha}
                      </span>
                      <div className='flex-1 min-w-0'>
                        <p className='truncate text-gray-900 dark:text-gray-200'>
                          {commit.message}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {commit.author} •{' '}
                          {new Date(commit.date).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* File Stats */}
        {analysis?.files?.total > 0 && (
          <div className='pt-3 border-t border-gray-100 dark:border-gray-700'>
            <p className='text-xs text-gray-500 text-center'>
              📁 {analysis.files.total} files in repository
              {analysis.files.byExtension &&
                Object.keys(analysis.files.byExtension).length > 0 && (
                  <span className='ml-2'>
                    (
                    {Object.entries(analysis.files.byExtension)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([ext, count]) => `.${ext}: ${count}`)
                      .join(', ')}
                    )
                  </span>
                )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GitHubPanel;
