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
  HiOutlineChevronRight,
  HiOutlinePlus,
  HiOutlineLink,
  HiOutlineDatabase,
  HiOutlineColorSwatch,
  HiOutlineBeaker,
  HiOutlineServer,
  HiOutlineDesktopComputer,
  HiOutlineDocument,
  HiOutlineDocumentText,
  HiOutlineCube,
  HiOutlineShieldCheck,
  HiOutlineSwitchHorizontal,
  HiOutlineX,
  HiOutlineCloudUpload,
  HiOutlineEye,
  HiOutlineScale,
} from 'react-icons/hi';
import GitHubConnect from '../github/GitHubConnect';
import RepoSelector from '../github/RepoSelector';

// File Icon Component
function FileIcon({ name, type }) {
  if (type === 'tree') {
    return <HiOutlineFolder className='w-4 h-4 text-yellow-500' />;
  }

  const ext = name.split('.').pop()?.toLowerCase();
  const iconMap = {
    js: 'text-yellow-400',
    jsx: 'text-blue-400',
    ts: 'text-blue-600',
    tsx: 'text-blue-500',
    json: 'text-yellow-600',
    md: 'text-gray-500',
    css: 'text-pink-500',
    scss: 'text-pink-600',
    html: 'text-orange-500',
    py: 'text-green-500',
    go: 'text-cyan-500',
    rs: 'text-orange-600',
    java: 'text-red-500',
  };

  return (
    <HiOutlineDocument
      className={`w-4 h-4 ${iconMap[ext] || 'text-gray-400'}`}
    />
  );
}

// File Tree Component
function FileTree({ files, onFileClick, level = 0 }) {
  const [expanded, setExpanded] = useState({});

  const toggleFolder = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  if (!files || files.length === 0) return null;

  return (
    <div
      className={`${
        level > 0
          ? 'ml-4 border-l border-gray-200 dark:border-gray-700 pl-2'
          : ''
      }`}
    >
      {files.map((file) => (
        <div key={file.path}>
          <button
            onClick={() => {
              if (file.type === 'tree') {
                toggleFolder(file.path);
              } else {
                onFileClick(file);
              }
            }}
            className='w-full flex items-center space-x-2 py-1.5 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left text-sm'
          >
            {file.type === 'tree' && (
              <HiOutlineChevronRight
                className={`w-3 h-3 text-gray-400 transition-transform ${
                  expanded[file.path] ? 'rotate-90' : ''
                }`}
              />
            )}
            {file.type !== 'tree' && <span className='w-3' />}
            <FileIcon name={file.name} type={file.type} />
            <span className='truncate text-gray-700 dark:text-gray-300'>
              {file.name}
            </span>
          </button>
          {file.type === 'tree' && expanded[file.path] && file.children && (
            <FileTree
              files={file.children}
              onFileClick={onFileClick}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// File Viewer Modal
function FileViewerModal({ file, projectId, onClose }) {
  const [content, setContent] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await githubAPI.getFileContent(projectId, file.path);
        setContent(data.content);
      } catch (error) {
        console.error('Failed to fetch file:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [file.path, projectId]);

  const handleExplain = async () => {
    if (explanation) {
      setShowExplanation(!showExplanation);
      return;
    }
    setLoadingExplanation(true);
    try {
      const data = await githubAPI.explainFile(projectId, file.path);
      setExplanation(data.explanation);
      setShowExplanation(true);
    } catch (error) {
      console.error('Failed to explain file:', error);
    } finally {
      setLoadingExplanation(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <FileIcon name={file.name} type='blob' />
            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                {file.name}
              </h3>
              <p className='text-xs text-gray-500'>{file.path}</p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={handleExplain}
              disabled={loadingExplanation}
              className='px-3 py-1.5 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center'
            >
              {loadingExplanation ? (
                <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2' />
              ) : (
                <HiOutlineEye className='w-4 h-4 mr-1.5' />
              )}
              {showExplanation ? 'Hide Analysis' : 'Analyze'}
            </button>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
            >
              <HiOutlineX className='w-5 h-5 text-gray-500' />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-hidden flex'>
          {/* Code Content */}
          <div
            className={`flex-1 overflow-auto ${
              showExplanation ? 'w-1/2' : 'w-full'
            }`}
          >
            {loading ? (
              <div className='flex items-center justify-center h-full'>
                <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
              </div>
            ) : (
              <pre className='p-4 text-sm text-gray-800 dark:text-gray-200 overflow-auto h-full'>
                <code>{content}</code>
              </pre>
            )}
          </div>

          {/* Explanation Panel */}
          <AnimatePresence>
            {showExplanation && explanation && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className='border-l border-gray-200 dark:border-gray-700 overflow-auto bg-gray-50 dark:bg-gray-900'
              >
                <div className='p-4 space-y-4'>
                  <div className='flex items-center space-x-2 text-purple-600 dark:text-purple-400'>
                    <HiOutlineLightBulb className='w-5 h-5' />
                    <h4 className='font-semibold'>Code Analysis</h4>
                  </div>

                  {/* Purpose */}
                  <div>
                    <h5 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                      Purpose
                    </h5>
                    <p className='text-sm text-gray-700 dark:text-gray-300'>
                      {explanation.purpose}
                    </p>
                  </div>

                  {/* Type Analysis */}
                  {explanation.typeAnalysis && (
                    <div>
                      <h5 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                        File Type
                      </h5>
                      <p className='text-sm text-gray-700 dark:text-gray-300'>
                        {explanation.typeAnalysis}
                      </p>
                    </div>
                  )}

                  {/* Key Elements */}
                  {explanation.keyElements?.length > 0 && (
                    <div>
                      <h5 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                        Key Elements
                      </h5>
                      <ul className='space-y-1'>
                        {explanation.keyElements.map((el, idx) => (
                          <li
                            key={idx}
                            className='text-sm text-gray-700 dark:text-gray-300 flex items-start'
                          >
                            <span className='text-purple-500 mr-2'>•</span>
                            {el}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Dependencies */}
                  {explanation.dependencies?.length > 0 && (
                    <div>
                      <h5 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                        Dependencies
                      </h5>
                      <div className='flex flex-wrap gap-1'>
                        {explanation.dependencies.map((dep, idx) => (
                          <span
                            key={idx}
                            className='text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded'
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className='grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700'>
                    <div className='text-center p-2 bg-white dark:bg-gray-800 rounded'>
                      <p className='text-lg font-bold text-gray-900 dark:text-white'>
                        {explanation.lineCount}
                      </p>
                      <p className='text-xs text-gray-500'>Lines</p>
                    </div>
                    <div className='text-center p-2 bg-white dark:bg-gray-800 rounded'>
                      <p className='text-lg font-bold text-gray-900 dark:text-white'>
                        {explanation.complexity}
                      </p>
                      <p className='text-xs text-gray-500'>Complexity</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Code Quality Score Component
function CodeQualityScore({ quality }) {
  if (!quality || quality.score === undefined) return null;

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'text-green-500 bg-green-100 dark:bg-green-900/30',
      A: 'text-green-500 bg-green-100 dark:bg-green-900/30',
      B: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
      C: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
      D: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
      F: 'text-red-500 bg-red-100 dark:bg-red-900/30',
      'N/A': 'text-gray-500 bg-gray-100 dark:bg-gray-900/30',
    };
    return colors[grade] || colors['N/A'];
  };

  return (
    <div className='p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center space-x-2'>
          <HiOutlineShieldCheck className='w-5 h-5 text-blue-600' />
          <h4 className='font-semibold text-gray-900 dark:text-white'>
            Code Quality
          </h4>
        </div>
        <div
          className={`px-3 py-1 rounded-full font-bold text-lg ${getGradeColor(
            quality.grade
          )}`}
        >
          {quality.grade}
        </div>
      </div>

      {/* Progress Bar */}
      <div className='mb-3'>
        <div className='flex justify-between text-xs text-gray-500 mb-1'>
          <span>Score</span>
          <span>{quality.score}/100</span>
        </div>
        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
          <div
            className={`h-2 rounded-full transition-all ${
              quality.score >= 70
                ? 'bg-green-500'
                : quality.score >= 50
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${quality.score}%` }}
          />
        </div>
      </div>

      {/* Quality Checklist */}
      <div className='grid grid-cols-2 gap-2 text-xs'>
        {Object.entries(quality.details || {})
          .slice(0, 6)
          .map(([key, value]) => (
            <div key={key} className='flex items-center space-x-1.5'>
              {value ? (
                <HiOutlineCheckCircle className='w-3.5 h-3.5 text-green-500' />
              ) : (
                <div className='w-3.5 h-3.5 rounded-full border border-gray-300' />
              )}
              <span
                className={
                  value ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                }
              >
                {key
                  .replace(/^has/, '')
                  .replace(/([A-Z])/g, ' $1')
                  .trim()}
              </span>
            </div>
          ))}
      </div>

      {/* Top Recommendations */}
      {quality.recommendations?.length > 0 && (
        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <p className='text-xs text-gray-500 mb-2'>Top Recommendations:</p>
          <ul className='space-y-1'>
            {quality.recommendations.slice(0, 2).map((rec, idx) => (
              <li
                key={idx}
                className='text-xs text-gray-600 dark:text-gray-400 flex items-start'
              >
                <HiOutlineLightBulb className='w-3 h-3 text-yellow-500 mr-1.5 mt-0.5 flex-shrink-0' />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Design Patterns Component
function DesignPatternsCard({ patterns }) {
  if (!patterns || !patterns.primary) return null;

  const paradigmIcons = {
    'object-oriented': '🏛️',
    functional: '⚡',
    mixed: '🔀',
    procedural: '📋',
    unknown: '❓',
  };

  const paradigmColors = {
    'object-oriented': 'from-blue-500 to-indigo-500',
    functional: 'from-purple-500 to-pink-500',
    mixed: 'from-green-500 to-teal-500',
    procedural: 'from-orange-500 to-red-500',
    unknown: 'from-gray-400 to-gray-500',
  };

  return (
    <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center space-x-2 mb-3'>
        <HiOutlineCube className='w-5 h-5 text-indigo-600' />
        <h4 className='font-semibold text-gray-900 dark:text-white'>
          Design Approach
        </h4>
      </div>

      {/* Primary Paradigm */}
      <div
        className={`bg-gradient-to-r ${
          paradigmColors[patterns.primary]
        } p-3 rounded-lg text-white mb-3`}
      >
        <div className='flex items-center space-x-2'>
          <span className='text-2xl'>{paradigmIcons[patterns.primary]}</span>
          <div>
            <p className='font-bold capitalize'>
              {patterns.primary.replace('-', ' ')}
            </p>
            <p className='text-xs opacity-90'>Primary Paradigm</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
        {patterns.description}
      </p>

      {/* Detected Patterns */}
      {patterns.patterns?.length > 0 && (
        <div>
          <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>
            Patterns Detected
          </p>
          <div className='flex flex-wrap gap-1'>
            {patterns.patterns.slice(0, 6).map((pattern, idx) => (
              <span
                key={idx}
                className='text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full'
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Architecture Card Component
function ArchitectureCard({ architecture }) {
  if (!architecture || !architecture.style) return null;

  const styleIcons = {
    monolith: '🏢',
    microservices: '🔷',
    serverless: '☁️',
    jamstack: '⚡',
    unknown: '❓',
  };

  return (
    <div className='p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
      <div className='flex items-center space-x-2 mb-3'>
        <HiOutlineScale className='w-5 h-5 text-teal-600' />
        <h4 className='font-semibold text-gray-900 dark:text-white'>
          Architecture
        </h4>
      </div>

      <div className='flex items-center space-x-3 mb-3'>
        <span className='text-3xl'>
          {styleIcons[architecture.style] || '🏗️'}
        </span>
        <div>
          <p className='font-bold text-gray-900 dark:text-white capitalize'>
            {architecture.style}
          </p>
          <p className='text-xs text-gray-500'>Architecture Style</p>
        </div>
      </div>

      <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
        {architecture.description}
      </p>

      {/* Layers */}
      {architecture.layers?.length > 0 && (
        <div>
          <p className='text-xs font-semibold text-gray-500 uppercase mb-2'>
            Layers
          </p>
          <div className='space-y-1'>
            {architecture.layers.map((layer, idx) => (
              <div key={idx} className='flex items-center space-x-2 text-sm'>
                <div className='w-2 h-2 rounded-full bg-teal-500' />
                <span className='text-gray-700 dark:text-gray-300'>
                  {layer}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Deploy Status Component
function DeployStatus({ analysis }) {
  const platform = analysis?.deployPlatform;

  if (!platform) {
    return (
      <div className='p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <HiOutlineCloudUpload className='w-5 h-5 text-gray-400' />
          <span className='text-sm text-gray-500'>
            No deploy config detected
          </span>
        </div>
        <span className='text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded'>
          Not Configured
        </span>
      </div>
    );
  }

  const platformInfo = {
    vercel: { name: 'Vercel', color: 'bg-black text-white', icon: '▲' },
    netlify: { name: 'Netlify', color: 'bg-teal-500 text-white', icon: '◆' },
    railway: { name: 'Railway', color: 'bg-purple-600 text-white', icon: '🚂' },
    render: { name: 'Render', color: 'bg-green-600 text-white', icon: '⚡' },
    fly: { name: 'Fly.io', color: 'bg-violet-600 text-white', icon: '✈️' },
    heroku: { name: 'Heroku', color: 'bg-purple-500 text-white', icon: '⬡' },
    gcp: { name: 'Google Cloud', color: 'bg-blue-500 text-white', icon: '☁️' },
    'aws-amplify': {
      name: 'AWS Amplify',
      color: 'bg-orange-500 text-white',
      icon: '🔶',
    },
  };

  const info = platformInfo[platform] || {
    name: platform,
    color: 'bg-gray-500 text-white',
    icon: '📦',
  };

  return (
    <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-between'>
      <div className='flex items-center space-x-2'>
        <HiOutlineCloudUpload className='w-5 h-5 text-green-600' />
        <span className='text-sm text-gray-700 dark:text-gray-300'>
          Deploy Platform Detected
        </span>
      </div>
      <span className={`text-xs px-2 py-1 rounded font-medium ${info.color}`}>
        {info.icon} {info.name}
      </span>
    </div>
  );
}

// Section Header Component
function SectionHeader({
  section,
  icon: Icon,
  title,
  count,
  color = 'gray',
  expanded,
  onToggle,
}) {
  return (
    <button
      onClick={onToggle}
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
      {expanded ? (
        <HiOutlineChevronUp className='w-4 h-4 text-gray-400' />
      ) : (
        <HiOutlineChevronDown className='w-4 h-4 text-gray-400' />
      )}
    </button>
  );
}

// Main GitHubPanel Component
function GitHubPanel({ project, onUpdate }) {
  const [commits, setCommits] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [fileTree, setFileTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    quality: true,
    patterns: true,
    architecture: false,
    techStack: true,
    detected: false,
    missing: false,
    suggestions: true,
    structure: false,
    files: false,
    commits: false,
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

  const fetchFileTree = async () => {
    if (fileTree.length > 0) return;
    setLoadingFiles(true);
    try {
      const data = await githubAPI.getFileTree(project._id);
      setFileTree(data);
    } catch (error) {
      console.error('Failed to fetch file tree:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const data = await githubAPI.syncProject(project._id);
      if (onUpdate) onUpdate(data.project);
      await fetchCommits();
      setFileTree([]); // Reset to refetch on next expand
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
        'Failed to connect: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const handleCreateRepo = async () => {
    if (!window.confirm('Create a new private repository on GitHub?')) return;
    try {
      const data = await githubAPI.createRepo(project._id, true);
      if (onUpdate) onUpdate(data.project);
      alert(`Repository created! View at: ${data.repoUrl}`);
    } catch (error) {
      alert(
        'Failed to create: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const handleDisconnectRepo = async () => {
    if (
      !window.confirm(
        'Disconnect this repository? Your project data will remain.'
      )
    )
      return;
    try {
      const data = await githubAPI.disconnectRepo(project._id);
      if (onUpdate) onUpdate(data.project);
    } catch (error) {
      alert(
        'Failed to disconnect: ' +
          (error.response?.data?.message || 'Unknown error')
      );
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    if (section === 'files' && !expandedSections.files) {
      fetchFileTree();
    }
  };

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
          and get insights on code quality and architecture.
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

  // Connected State
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
            <button
              onClick={handleDisconnectRepo}
              className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
              title='Switch repository'
            >
              <HiOutlineSwitchHorizontal className='w-4 h-4' />
            </button>
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
        {project.github.lastSyncedAt && (
          <p className='text-xs text-gray-400 mt-2'>
            Last analyzed:{' '}
            {new Date(project.github.lastSyncedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className='p-4 space-y-4'>
        {/* Deploy Status */}
        <DeployStatus analysis={analysis} />

        {/* Code Quality Score */}
        {analysis?.codeQuality && (
          <CodeQualityScore quality={analysis.codeQuality} />
        )}

        {/* Design Patterns & Architecture Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <DesignPatternsCard patterns={analysis?.designPatterns} />
          <ArchitectureCard architecture={analysis?.architecture} />
        </div>

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
                (analysis.techStack.database?.length || 0)
              }
              color='blue'
              expanded={expandedSections.techStack}
              onToggle={() => toggleSection('techStack')}
            />
            <AnimatePresence>
              {expandedSections.techStack && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 space-y-2 pl-6'
                >
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
              title='Recommendations'
              count={analysis.suggestions.length}
              color='purple'
              expanded={expandedSections.suggestions}
              onToggle={() => toggleSection('suggestions')}
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

        {/* Detected Features */}
        {analysis?.detectedFeatures?.length > 0 && (
          <div>
            <SectionHeader
              section='detected'
              icon={HiOutlineCheckCircle}
              title="What's Built"
              count={analysis.detectedFeatures.length}
              color='green'
              expanded={expandedSections.detected}
              onToggle={() => toggleSection('detected')}
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
              expanded={expandedSections.missing}
              onToggle={() => toggleSection('missing')}
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

        {/* File Browser */}
        <div>
          <SectionHeader
            section='files'
            icon={HiOutlineFolder}
            title='File Browser'
            count={analysis?.files?.total}
            color='indigo'
            expanded={expandedSections.files}
            onToggle={() => toggleSection('files')}
          />
          <AnimatePresence>
            {expandedSections.files && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='mt-2 max-h-64 overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg'
              >
                {loadingFiles ? (
                  <div className='flex items-center justify-center p-8'>
                    <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
                  </div>
                ) : fileTree.length > 0 ? (
                  <div className='p-2'>
                    <FileTree
                      files={fileTree}
                      onFileClick={(file) => setSelectedFile(file)}
                    />
                  </div>
                ) : (
                  <p className='text-sm text-gray-500 text-center p-4'>
                    No files found
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Commits */}
        <div>
          <SectionHeader
            section='commits'
            icon={HiOutlineCode}
            title='Recent Commits'
            count={commits.length}
            color='gray'
            expanded={expandedSections.commits}
            onToggle={() => toggleSection('commits')}
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
            </p>
          </div>
        )}
      </div>

      {/* File Viewer Modal */}
      <AnimatePresence>
        {selectedFile && (
          <FileViewerModal
            file={selectedFile}
            projectId={project._id}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default GitHubPanel;
