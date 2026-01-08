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
  HiOutlineTemplate,
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineX,
  HiOutlineInformationCircle,
  HiOutlineSwitchHorizontal,
  HiOutlineClipboardCheck,
  HiOutlineBan,
} from 'react-icons/hi';
import GitHubConnect from '../github/GitHubConnect';
import RepoSelector from '../github/RepoSelector';

const getGradeColor = (grade) => {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'text-green-500 bg-green-100 dark:bg-green-900/30';
    case 'B':
      return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    case 'C':
      return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
    case 'D':
      return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
    case 'F':
      return 'text-red-500 bg-red-100 dark:bg-red-900/30';
    default:
      return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30';
  }
};

const getFileIcon = (name, type) => {
  if (type === 'tree') return '📁';
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return '🟨';
    case 'ts':
    case 'tsx':
      return '🔷';
    case 'css':
    case 'scss':
      return '🎨';
    case 'html':
      return '🌐';
    case 'json':
      return '📋';
    case 'md':
      return '📝';
    case 'png':
    case 'jpg':
    case 'svg':
      return '🖼️';
    default:
      return '📄';
  }
};

function FileTree({ files, onFileSelect, level = 0 }) {
  const [expanded, setExpanded] = useState({});

  const toggleFolder = (path) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

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
            onClick={() =>
              file.type === 'tree'
                ? toggleFolder(file.path)
                : onFileSelect(file)
            }
            className='w-full flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left text-sm'
          >
            {file.type === 'tree' && (
              <HiOutlineChevronRight
                className={`w-3 h-3 mr-1 transition-transform ${
                  expanded[file.path] ? 'rotate-90' : ''
                }`}
              />
            )}
            <span className='mr-2'>{getFileIcon(file.name, file.type)}</span>
            <span className='truncate text-gray-700 dark:text-gray-300'>
              {file.name}
            </span>
          </button>
          {file.type === 'tree' && expanded[file.path] && file.children && (
            <FileTree
              files={file.children}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FileViewerModal({ projectId, file, onClose }) {
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
  }, [projectId, file.path]);

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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <span>{getFileIcon(file.name, 'blob')}</span>
            <span className='font-medium text-gray-900 dark:text-white'>
              {file.path}
            </span>
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
                <HiOutlineInformationCircle className='w-4 h-4 mr-1' />
              )}
              {showExplanation ? 'Hide Analysis' : 'Analyze'}
            </button>
            <button
              onClick={onClose}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
            >
              <HiOutlineX className='w-5 h-5' />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showExplanation && explanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='border-b border-gray-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20'
            >
              <div className='p-4 space-y-3'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      File Analysis
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {explanation.purpose}
                    </p>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        explanation.complexity === 'High'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : explanation.complexity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {explanation.complexity} Complexity
                    </span>
                    <span className='text-xs text-gray-500'>
                      {explanation.lineCount} lines
                    </span>
                  </div>
                </div>

                {explanation.keyElements?.length > 0 && (
                  <div>
                    <h5 className='text-xs font-semibold text-gray-500 uppercase mb-1'>
                      Key Elements
                    </h5>
                    <div className='flex flex-wrap gap-1'>
                      {explanation.keyElements.map((el, idx) => (
                        <span
                          key={idx}
                          className='text-xs px-2 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700'
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className='flex-1 overflow-auto'>
          {loading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : (
            <pre className='p-4 text-sm text-gray-800 dark:text-gray-200 overflow-x-auto'>
              <code>{content}</code>
            </pre>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function TaskComparisonModal({ projectId, onClose }) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        const data = await githubAPI.compareWithCode(projectId);
        setComparison(data);
      } catch (error) {
        console.error('Failed to compare:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [projectId]);

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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <HiOutlineClipboardCheck className='w-5 h-5 text-blue-500' />
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Task vs Code Comparison
            </h3>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
          >
            <HiOutlineX className='w-5 h-5' />
          </button>
        </div>

        <div className='flex-1 overflow-auto p-4'>
          {loading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            </div>
          ) : comparison && comparison.length > 0 ? (
            <div className='space-y-6'>
              {comparison.map((phase) => (
                <div key={phase.phaseId} className='space-y-2'>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    {phase.phaseTitle}
                  </h4>
                  <div className='space-y-2'>
                    {phase.tasks.map((task) => (
                      <div
                        key={task.taskId}
                        className={`p-3 rounded-lg border ${
                          task.status === 'likely-done'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : task.status === 'in-progress'
                            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-2'>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                task.status === 'likely-done'
                                  ? 'bg-green-500'
                                  : task.status === 'in-progress'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                              }`}
                            />
                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                              {task.taskTitle}
                            </span>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              task.status === 'likely-done'
                                ? 'bg-green-100 text-green-700'
                                : task.status === 'in-progress'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {task.matchScore}% match
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500'>
              No comparison data available
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GitHubPanel({ project, onUpdate }) {
  const [commits, setCommits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [pullRequests, setPullRequests] = useState([]);
  const [issues, setIssues] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [fileTree, setFileTree] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showRepoSelector, setShowRepoSelector] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTaskComparison, setShowTaskComparison] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    codeQuality: true,
    designPatterns: true,
    architecture: true,
    techStack: true,
    detected: true,
    missing: false,
    suggestions: true,
    structure: false,
    commits: true,
    files: false,
    prs: false,
    issues: false,
    contributors: false,
  });

  const isConnected = project.github?.isConnected;
  const analysis = project.github?.analysis;

  useEffect(() => {
    if (isConnected) {
      fetchAllData();
    }
  }, [isConnected, project._id]);

  const fetchAllData = async () => {
    try {
      const [commitsData, branchesData, prsData, issuesData, contributorsData] =
        await Promise.all([
          githubAPI.getCommits(project._id).catch(() => []),
          githubAPI.getBranches(project._id).catch(() => []),
          githubAPI.getPullRequests(project._id).catch(() => []),
          githubAPI.getIssues(project._id).catch(() => []),
          githubAPI.getContributors(project._id).catch(() => []),
        ]);
      setCommits(commitsData);
      setBranches(branchesData);
      setPullRequests(prsData);
      setIssues(issuesData);
      setContributors(contributorsData);
    } catch (error) {
      console.error('Failed to fetch GitHub data:', error);
    }
  };

  const fetchFileTree = async () => {
    try {
      const data = await githubAPI.getFileTree(project._id);
      setFileTree(data);
    } catch (error) {
      console.error('Failed to fetch file tree:', error);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const data = await githubAPI.syncProject(project._id);
      if (onUpdate) onUpdate(data.project);
      await fetchAllData();
    } catch (error) {
      alert('Sync failed');
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
      alert('Failed to connect repository');
    }
  };

  const handleDisconnectRepo = async () => {
    if (!window.confirm('Disconnect this repository?')) return;
    try {
      const data = await githubAPI.disconnectRepo(project._id);
      if (onUpdate) onUpdate(data.project);
    } catch (error) {
      alert('Failed to disconnect');
    }
  };

  const handleCreateRepo = async () => {
    if (!window.confirm('Create a new private repository?')) return;
    try {
      const data = await githubAPI.createRepo(project._id, true);
      if (onUpdate) onUpdate(data.project);
      alert('Repository created!');
    } catch (error) {
      alert('Failed to create repository');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({
    section,
    icon: Icon,
    title,
    count,
    color = 'gray',
    badge = null,
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
        {count !== undefined && count > 0 && (
          <span className='text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
            {count}
          </span>
        )}
        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${badge.className}`}
          >
            {badge.text}
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
          Connect a GitHub repository to analyze your codebase and get
          suggestions.
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

  return (
    <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'>
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
              onClick={handleSync}
              disabled={isSyncing}
              className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              title='Re-analyze'
            >
              <HiOutlineRefresh
                className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`}
              />
            </button>
            <button
              onClick={() => setShowRepoSelector(true)}
              className='p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
              title='Switch repository'
            >
              <HiOutlineSwitchHorizontal className='w-5 h-5' />
            </button>
            <button
              onClick={handleDisconnectRepo}
              className='p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'
              title='Disconnect'
            >
              <HiOutlineBan className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='flex items-center space-x-4 mt-3 text-xs text-gray-500'>
          {branches.length > 0 && <span>{branches.length} branches</span>}
          {pullRequests.length > 0 && (
            <span className='text-green-600'>
              {pullRequests.length} open PRs
            </span>
          )}
          {issues.length > 0 && (
            <span className='text-yellow-600'>{issues.length} open issues</span>
          )}
        </div>

        <button
          onClick={() => setShowTaskComparison(true)}
          className='mt-3 w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center'
        >
          <HiOutlineClipboardCheck className='w-4 h-4 mr-2' />
          Compare Tasks with Code
        </button>
      </div>

      <div className='p-4 space-y-4'>
        {analysis?.codeQuality && (
          <div>
            <SectionHeader
              section='codeQuality'
              icon={HiOutlineShieldCheck}
              title='Code Quality'
              color='blue'
              badge={{
                text: analysis.codeQuality.grade || 'N/A',
                className: getGradeColor(analysis.codeQuality.grade),
              }}
            />
            <AnimatePresence>
              {expandedSections.codeQuality && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                >
                  <div className='mb-4'>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='text-gray-600 dark:text-gray-400'>
                        Score
                      </span>
                      <span className='font-bold'>
                        {analysis.codeQuality.score || 0}/100
                      </span>
                    </div>
                    <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3'>
                      <div
                        className={`h-3 rounded-full ${
                          (analysis.codeQuality.score || 0) >= 80
                            ? 'bg-green-500'
                            : (analysis.codeQuality.score || 0) >= 60
                            ? 'bg-blue-500'
                            : (analysis.codeQuality.score || 0) >= 40
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${analysis.codeQuality.score || 0}%` }}
                      />
                    </div>
                  </div>

                  {analysis.codeQuality.recommendations?.length > 0 && (
                    <div className='space-y-1'>
                      {analysis.codeQuality.recommendations
                        .slice(0, 3)
                        .map((rec, idx) => (
                          <div
                            key={idx}
                            className='flex items-start space-x-2 text-sm'
                          >
                            <HiOutlineLightBulb className='w-4 h-4 text-yellow-500 mt-0.5' />
                            <span className='text-gray-600 dark:text-gray-400'>
                              {rec}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {analysis?.designPatterns && (
          <div>
            <SectionHeader
              section='designPatterns'
              icon={HiOutlineTemplate}
              title='Design Patterns'
              color='purple'
              badge={{
                text:
                  analysis.designPatterns.primary === 'object-oriented'
                    ? 'OOP'
                    : analysis.designPatterns.primary === 'functional'
                    ? 'FP'
                    : analysis.designPatterns.primary === 'procedural'
                    ? 'Procedural'
                    : 'Mixed',
                className:
                  'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
              }}
            />
            <AnimatePresence>
              {expandedSections.designPatterns && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                >
                  <p className='text-sm text-gray-600 dark:text-gray-400 mb-3'>
                    {analysis.designPatterns.description}
                  </p>
                  {analysis.designPatterns.patterns?.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {analysis.designPatterns.patterns.map((pattern, idx) => (
                        <span
                          key={idx}
                          className='text-xs px-2 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-full'
                        >
                          {pattern}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {analysis?.architecture && (
          <div>
            <SectionHeader
              section='architecture'
              icon={HiOutlineCube}
              title='Architecture'
              color='indigo'
              badge={{
                text:
                  (analysis.architecture.style || 'Unknown')
                    .charAt(0)
                    .toUpperCase() +
                  (analysis.architecture.style || 'unknown').slice(1),
                className:
                  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600',
              }}
            />
            <AnimatePresence>
              {expandedSections.architecture && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mt-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                >
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {analysis.architecture.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
                      <div className='flex flex-wrap gap-1'>
                        {analysis.techStack.frontend.map((tech) => (
                          <span
                            key={tech}
                            className='text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.techStack.backend?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineServer className='w-4 h-4 text-green-500 mt-0.5' />
                      <div className='flex flex-wrap gap-1'>
                        {analysis.techStack.backend.map((tech) => (
                          <span
                            key={tech}
                            className='text-xs px-2 py-0.5 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-full'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {analysis.techStack.database?.length > 0 && (
                    <div className='flex items-start space-x-2'>
                      <HiOutlineDatabase className='w-4 h-4 text-purple-500 mt-0.5' />
                      <div className='flex flex-wrap gap-1'>
                        {analysis.techStack.database.map((tech) => (
                          <span
                            key={tech}
                            className='text-xs px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-full'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

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
                      <HiOutlineCheckCircle className='w-4 h-4 text-green-500' />
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

        {analysis?.suggestions?.length > 0 && (
          <div>
            <SectionHeader
              section='suggestions'
              icon={HiOutlineLightBulb}
              title='Suggestions'
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
                      <HiOutlineLightBulb className='w-4 h-4 text-purple-500 mt-0.5' />
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

        <div>
          <SectionHeader
            section='files'
            icon={HiOutlineDocument}
            title='File Browser'
            color='gray'
          />
          <AnimatePresence>
            {expandedSections.files && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='mt-2'
              >
                {fileTree.length === 0 ? (
                  <button
                    onClick={fetchFileTree}
                    className='w-full py-3 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg'
                  >
                    Load file tree...
                  </button>
                ) : (
                  <div className='max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2'>
                    <FileTree files={fileTree} onFileSelect={setSelectedFile} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                    No commits found.
                  </p>
                ) : (
                  commits.slice(0, 5).map((commit) => (
                    <a
                      key={commit.sha}
                      href={commit.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-start text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-lg'
                    >
                      <span className='font-mono text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded mr-2'>
                        {commit.sha}
                      </span>
                      <div className='flex-1 min-w-0'>
                        <p className='truncate text-gray-900 dark:text-gray-200'>
                          {commit.message}
                        </p>
                        <p className='text-xs text-gray-500'>{commit.author}</p>
                      </div>
                    </a>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <FileViewerModal
            projectId={project._id}
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTaskComparison && (
          <TaskComparisonModal
            projectId={project._id}
            onClose={() => setShowTaskComparison(false)}
          />
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

export default GitHubPanel;
