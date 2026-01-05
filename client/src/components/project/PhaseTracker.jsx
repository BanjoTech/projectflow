// client/src/components/project/PhaseTracker.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../../services/api';
import {
  HiOutlineSparkles,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineLightBulb,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineClipboardCopy,
} from 'react-icons/hi';

// Helper to determine task category for better prompts
function getTaskCategory(taskTitle) {
  const title = taskTitle.toLowerCase();

  if (
    title.includes('design') ||
    title.includes('ui') ||
    title.includes('layout') ||
    title.includes('style') ||
    title.includes('css') ||
    title.includes('tailwind')
  ) {
    return 'design';
  }
  if (
    title.includes('api') ||
    title.includes('endpoint') ||
    title.includes('route') ||
    title.includes('backend') ||
    title.includes('server')
  ) {
    return 'backend';
  }
  if (
    title.includes('database') ||
    title.includes('schema') ||
    title.includes('model') ||
    title.includes('mongodb') ||
    title.includes('postgres')
  ) {
    return 'database';
  }
  if (
    title.includes('auth') ||
    title.includes('login') ||
    title.includes('signup') ||
    title.includes('password') ||
    title.includes('jwt')
  ) {
    return 'authentication';
  }
  if (
    title.includes('component') ||
    title.includes('react') ||
    title.includes('hook') ||
    title.includes('state') ||
    title.includes('context')
  ) {
    return 'frontend';
  }
  if (
    title.includes('test') ||
    title.includes('jest') ||
    title.includes('cypress')
  ) {
    return 'testing';
  }
  if (
    title.includes('deploy') ||
    title.includes('hosting') ||
    title.includes('vercel') ||
    title.includes('netlify') ||
    title.includes('docker')
  ) {
    return 'deployment';
  }
  if (
    title.includes('seo') ||
    title.includes('meta') ||
    title.includes('performance') ||
    title.includes('optimize')
  ) {
    return 'optimization';
  }
  if (
    title.includes('research') ||
    title.includes('plan') ||
    title.includes('define') ||
    title.includes('gather') ||
    title.includes('identify')
  ) {
    return 'planning';
  }

  return 'general';
}

// Generate optimized prompt based on task category
function generateTaskPrompt(task, projectName, projectType, phaseName) {
  const category = getTaskCategory(task.title);
  const currentYear = new Date().getFullYear();

  const categoryPrompts = {
    design: `You are a senior UI/UX developer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete implementation guide:

## 1. Visual Approach
- Describe the visual structure and layout strategy
- Suggest spacing, colors, and typography considerations

## 2. Implementation Steps
Provide numbered steps with specific CSS/Tailwind classes:

## 3. Code Implementation
\`\`\`jsx
// Provide complete, copy-paste ready React component with Tailwind CSS
// Include responsive design (mobile-first)
// Include dark mode support (dark: variants)
// Add hover states and transitions
\`\`\`

## 4. Responsive Breakpoints
- Mobile (default): specific styles
- Tablet (md:): specific styles  
- Desktop (lg:): specific styles

## 5. Accessibility Checklist
- [ ] Specific a11y requirements for this component

Use ${currentYear} best practices. Be specific with class names and values.`,

    backend: `You are a senior backend developer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete implementation guide:

## 1. API Design
- Endpoint: METHOD /api/path
- Request body/params
- Response format

## 2. Implementation Steps
Numbered steps to implement this:

## 3. Code Implementation
\`\`\`javascript
// Complete Express.js route/controller
// Include proper error handling
// Include input validation
// Include authentication middleware if needed
\`\`\`

## 4. Database Interaction
\`\`\`javascript
// Mongoose/SQL queries needed
\`\`\`

## 5. Testing with cURL/Postman
\`\`\`bash
# Example request to test this endpoint
\`\`\`

## 6. Error Handling
- List possible errors and status codes

Use Node.js/Express with ${currentYear} best practices.`,

    database: `You are a senior database architect. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete implementation guide:

## 1. Schema Design
- Describe the data structure and relationships
- Explain field choices

## 2. Implementation
\`\`\`javascript
// Complete Mongoose schema or SQL table definition
// Include validations
// Include indexes for performance
// Include virtuals/methods if needed
\`\`\`

## 3. Relationships
- How this relates to other models
- Population/join strategies

## 4. Sample Data
\`\`\`javascript
// Example document/row
\`\`\`

## 5. Common Queries
\`\`\`javascript
// Queries you'll frequently use with this model
\`\`\`

## 6. Migration Notes
- What to consider when modifying this schema later

Use ${currentYear} best practices for MongoDB/PostgreSQL.`,

    authentication: `You are a senior security engineer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete, SECURE implementation guide:

## 1. Security Overview
- What this authentication feature protects
- Potential vulnerabilities to avoid

## 2. Implementation Steps
Numbered steps with security considerations:

## 3. Backend Code
\`\`\`javascript
// Complete implementation with:
// - Password hashing (bcrypt with proper salt rounds)
// - JWT generation and verification
// - Secure cookie settings if applicable
// - Rate limiting considerations
\`\`\`

## 4. Frontend Code
\`\`\`jsx
// Form with validation
// Secure token storage
// Protected route handling
\`\`\`

## 5. Security Checklist
- [ ] Passwords hashed with bcrypt (salt rounds: 10+)
- [ ] JWT secret in environment variables
- [ ] Token expiration set appropriately
- [ ] HTTPS only in production
- [ ] Input sanitization

## 6. Testing Auth Flow
Step-by-step to verify it works correctly.

Use ${currentYear} security best practices. Never store plain text passwords.`,

    frontend: `You are a senior React developer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete implementation guide:

## 1. Component Overview
- Purpose and responsibilities
- Props interface
- State management approach

## 2. Implementation Steps
Numbered steps to build this:

## 3. Code Implementation
\`\`\`jsx
// Complete React component with:
// - TypeScript types or PropTypes
// - useState/useEffect hooks as needed
// - Proper event handlers
// - Loading and error states
// - Tailwind CSS styling with dark mode
\`\`\`

## 4. Usage Example
\`\`\`jsx
// How to use this component in a parent
\`\`\`

## 5. State Management
- Local state vs context vs props
- When to lift state up

## 6. Performance Tips
- Memoization if needed
- Avoiding unnecessary re-renders

Use React ${currentYear} best practices with hooks and functional components.`,

    testing: `You are a senior QA engineer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete testing guide:

## 1. Test Strategy
- What needs to be tested
- Unit vs integration vs E2E

## 2. Test Cases
List specific scenarios to test:
- [ ] Test case 1
- [ ] Test case 2
- [ ] Edge cases

## 3. Unit Tests
\`\`\`javascript
// Jest/Vitest test file
describe('ComponentName', () => {
  // Complete test implementations
});
\`\`\`

## 4. Integration Tests
\`\`\`javascript
// API or component integration tests
\`\`\`

## 5. Manual Testing Checklist
- [ ] Specific things to manually verify

## 6. Test Data
\`\`\`javascript
// Mock data and fixtures needed
\`\`\`

Use ${currentYear} testing best practices.`,

    deployment: `You are a senior DevOps engineer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete deployment guide:

## 1. Pre-Deployment Checklist
- [ ] Environment variables set
- [ ] Build tested locally
- [ ] Database migrated

## 2. Step-by-Step Deployment
Numbered steps with exact commands:

## 3. Configuration Files
\`\`\`yaml
# vercel.json, netlify.toml, or Dockerfile as appropriate
\`\`\`

## 4. Environment Variables
\`\`\`
# List all required env vars (without actual secrets)
DATABASE_URL=
JWT_SECRET=
\`\`\`

## 5. Post-Deployment Verification
- [ ] Health check endpoints
- [ ] Smoke tests to run

## 6. Rollback Plan
How to revert if something goes wrong.

Use ${currentYear} deployment best practices.`,

    optimization: `You are a senior performance engineer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete optimization guide:

## 1. Current State Analysis
- What to measure before optimizing
- Tools to use (Lighthouse, WebPageTest, etc.)

## 2. Optimization Steps
Numbered steps with expected impact:

## 3. Code Changes
\`\`\`jsx
// Before and after code examples
// Specific optimizations with explanations
\`\`\`

## 4. Configuration
\`\`\`javascript
// Webpack, Vite, or Next.js config changes
\`\`\`

## 5. SEO Implementation
\`\`\`jsx
// Meta tags, structured data, sitemap
\`\`\`

## 6. Metrics to Track
- LCP target: < 2.5s
- FID target: < 100ms
- CLS target: < 0.1

Use ${currentYear} web performance best practices.`,

    planning: `You are a senior technical project manager. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete planning guide:

## 1. Overview
What this planning task accomplishes and why it matters.

## 2. Research Steps
Numbered steps to complete this research/planning:

## 3. Key Questions to Answer
- Question 1?
- Question 2?
- Question 3?

## 4. Deliverable Template
\`\`\`markdown
# [Document Title]

## Section 1
- Point 1
- Point 2

## Section 2
...
\`\`\`

## 5. Resources to Review
- Relevant documentation or examples
- Competitor analysis points

## 6. Decision Framework
How to evaluate options and make decisions.

## 7. Time Estimate
- Research: X hours
- Documentation: X hours
- Review: X hours`,

    general: `You are a senior full-stack developer. I'm working on a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete implementation guide:

## 1. Overview
What this task involves and why it matters (2-3 sentences).

## 2. Step-by-Step Implementation
Numbered, actionable steps:

## 3. Code Implementation
\`\`\`jsx
// Complete, production-ready code
// Include comments explaining key parts
// Use modern ${currentYear} syntax and patterns
\`\`\`

## 4. File Structure
\`\`\`
src/
  └── where-this-code-goes/
\`\`\`

## 5. Pro Tips
- Best practice 1
- Common pitfall to avoid

## 6. Verification
How to test that this works correctly.

## 7. Time Estimate
Approximate time for a mid-level developer.`,
  };

  return categoryPrompts[category] || categoryPrompts.general;
}

// Task AI Help Modal Component
function TaskAIHelp({ task, projectName, projectType, phaseName, onClose }) {
  const [help, setHelp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHelp = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const prompt = generateTaskPrompt(
          task,
          projectName,
          projectType,
          phaseName
        );

        const response = await aiAPI.chat(null, prompt, [], null);

        setHelp(response.response);
      } catch (err) {
        console.error('Failed to get AI help:', err);
        setError('Failed to get AI help. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHelp();
  }, [task.title, projectName, projectType, phaseName]);

  const handleCopyAll = () => {
    if (help) {
      navigator.clipboard.writeText(help);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start space-x-3'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <HiOutlineLightBulb className='w-5 h-5 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>
                  AI Implementation Guide
                </h3>
                <p className='text-sm text-blue-100 mt-1 line-clamp-2'>
                  {task.title}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              {help && (
                <button
                  onClick={handleCopyAll}
                  className='p-2 hover:bg-white/20 rounded-lg transition-colors flex items-center space-x-1'
                  title='Copy all content'
                >
                  <HiOutlineClipboardCopy className='w-5 h-5 text-white' />
                  {copied && (
                    <span className='text-xs text-white'>Copied!</span>
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className='p-2 hover:bg-white/20 rounded-lg transition-colors'
              >
                <HiOutlineX className='w-5 h-5 text-white' />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(85vh-140px)]'>
          {isLoading && (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
              <p className='mt-4 text-gray-600 dark:text-gray-400'>
                Generating implementation guide...
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-500 mt-2'>
                This may take a few seconds
              </p>
            </div>
          )}

          {error && (
            <div className='text-center py-12'>
              <p className='text-red-600 dark:text-red-400'>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className='mt-4 text-blue-600 dark:text-blue-400 hover:underline'
              >
                Try again
              </button>
            </div>
          )}

          {help && (
            <div className='prose prose-sm dark:prose-invert max-w-none prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:text-pink-500 dark:prose-code:text-pink-400'>
              <div className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                {help}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center'>
              <HiOutlineSparkles className='w-3 h-3 mr-1' />
              AI-generated • Review before implementing
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

// PhaseDetail component
function PhaseDetail({ project, phase, onPhaseUpdate, isUpdating }) {
  const [localNotes, setLocalNotes] = useState(phase.notes || '');
  const [localSubTasks, setLocalSubTasks] = useState(phase.subTasks || []);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [helpingTask, setHelpingTask] = useState(null);

  const completedCount = localSubTasks.filter((st) => st.isComplete).length;
  const totalCount = localSubTasks.length;
  const allSubtasksComplete = totalCount > 0 && completedCount === totalCount;
  const hasSubtasks = totalCount > 0;

  useEffect(() => {
    setLocalNotes(phase.notes || '');
    setLocalSubTasks(phase.subTasks || []);
    setEditingIndex(null);
    setNewSubTaskTitle('');
  }, [phase.id, phase.notes, phase.subTasks]);

  const handleNotesSave = () => {
    if (localNotes !== phase.notes) {
      onPhaseUpdate(phase.id, { notes: localNotes });
    }
  };

  const handleToggleSubtask = (index) => {
    const updated = localSubTasks.map((st, idx) =>
      idx === index ? { ...st, isComplete: !st.isComplete } : st
    );
    setLocalSubTasks(updated);

    const allComplete = updated.every((st) => st.isComplete);

    if (allComplete && !phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: true });
    } else if (!allComplete && phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: false });
    } else {
      onPhaseUpdate(phase.id, { subTasks: updated });
    }
  };

  const handleAddSubtask = () => {
    if (!newSubTaskTitle.trim()) return;
    const updated = [
      ...localSubTasks,
      { title: newSubTaskTitle.trim(), isComplete: false },
    ];
    setLocalSubTasks(updated);
    setNewSubTaskTitle('');

    if (phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: false });
    } else {
      onPhaseUpdate(phase.id, { subTasks: updated });
    }
  };

  const handleDeleteSubtask = (index) => {
    const updated = localSubTasks.filter((_, idx) => idx !== index);
    setLocalSubTasks(updated);

    const allComplete =
      updated.length > 0 && updated.every((st) => st.isComplete);

    if (allComplete && !phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: true });
    } else if (updated.length === 0 && phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: false });
    } else {
      onPhaseUpdate(phase.id, { subTasks: updated });
    }
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditingTitle(localSubTasks[index].title);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    if (!editingTitle.trim()) {
      handleDeleteSubtask(editingIndex);
    } else {
      const updated = localSubTasks.map((st, idx) =>
        idx === editingIndex ? { ...st, title: editingTitle.trim() } : st
      );
      setLocalSubTasks(updated);
      onPhaseUpdate(phase.id, { subTasks: updated });
    }
    setEditingIndex(null);
  };

  const handleToggleComplete = () => {
    if (!allSubtasksComplete && !phase.isComplete) return;
    onPhaseUpdate(phase.id, { isComplete: !phase.isComplete });
  };

  const handleAISuggest = async () => {
    setIsSuggesting(true);
    try {
      const result = await aiAPI.suggestSubtasks(project._id, phase.id);
      const existingTitles = new Set([
        ...localSubTasks.map((st) => st.title.toLowerCase()),
        ...suggestions.map((s) => s.title.toLowerCase()),
      ]);
      const newSuggestions = result.suggestions.filter(
        (s) => !existingTitles.has(s.title.toLowerCase())
      );
      setSuggestions((prev) => [...prev, ...newSuggestions]);
    } catch (error) {
      console.error('AI suggest error:', error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    const updated = [...localSubTasks, suggestion];
    setLocalSubTasks(updated);

    if (phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: false });
    } else {
      onPhaseUpdate(phase.id, { subTasks: updated });
    }
    setSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  };

  const handleAddAllSuggestions = () => {
    const updated = [...localSubTasks, ...suggestions];
    setLocalSubTasks(updated);

    if (phase.isComplete) {
      onPhaseUpdate(phase.id, { subTasks: updated, isComplete: false });
    } else {
      onPhaseUpdate(phase.id, { subTasks: updated });
    }
    setSuggestions([]);
  };

  const handleDismissAllSuggestions = () => {
    setSuggestions([]);
  };

  const handleDismissSuggestion = (suggestion) => {
    setSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  };

  return (
    <div>
      {/* Header */}
      <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Phase {phase.id}: {phase.title}
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              {phase.description}
            </p>
          </div>

          <div className='flex flex-col items-end'>
            <button
              onClick={handleToggleComplete}
              disabled={
                isUpdating || (!allSubtasksComplete && !phase.isComplete)
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                phase.isComplete
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800'
                  : allSubtasksComplete
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-800 animate-pulse'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              } disabled:opacity-50`}
            >
              {phase.isComplete ? (
                <>
                  <HiOutlineCheck className='w-5 h-5' />
                  <span>Completed!</span>
                </>
              ) : allSubtasksComplete ? (
                <>
                  <HiOutlineSparkles className='w-5 h-5' />
                  <span>Mark Complete</span>
                </>
              ) : (
                <span>Complete Tasks First</span>
              )}
            </button>
            {!allSubtasksComplete && !phase.isComplete && hasSubtasks && (
              <span className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                {completedCount}/{totalCount} tasks done
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtasks */}
      <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Tasks ({completedCount}/{totalCount})
          </h4>
          <button
            onClick={handleAISuggest}
            disabled={isSuggesting}
            className='text-sm px-3 py-1.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors flex items-center space-x-1.5 disabled:opacity-50'
          >
            {isSuggesting ? (
              <>
                <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin' />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <HiOutlineSparkles className='w-4 h-4' />
                <span>AI Suggest</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {hasSubtasks && (
          <div className='mb-4'>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  allSubtasksComplete ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className='mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
            <div className='flex items-center justify-between mb-3'>
              <span className='text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center'>
                <HiOutlineSparkles className='w-4 h-4 mr-1.5' />
                AI Suggestions ({suggestions.length})
              </span>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={handleAddAllSuggestions}
                  className='text-xs text-purple-600 dark:text-purple-400 hover:underline'
                >
                  Add all
                </button>
                <span className='text-purple-300 dark:text-purple-600'>|</span>
                <button
                  onClick={handleDismissAllSuggestions}
                  className='text-xs text-red-500 dark:text-red-400 hover:underline'
                >
                  Dismiss all
                </button>
              </div>
            </div>
            <div className='space-y-2 max-h-60 overflow-y-auto'>
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded group'
                >
                  <span className='text-sm text-gray-700 dark:text-gray-300 flex-1 pr-2'>
                    {suggestion.title}
                  </span>
                  <div className='flex items-center space-x-1'>
                    <button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className='text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700'
                    >
                      + Add
                    </button>
                    <button
                      onClick={() => handleDismissSuggestion(suggestion)}
                      className='p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <HiOutlineX className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtask List */}
        <div className='space-y-2 mb-4'>
          {localSubTasks.map((subtask, idx) => (
            <div
              key={idx}
              className='flex items-center space-x-3 group p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'
            >
              <input
                type='checkbox'
                checked={subtask.isComplete}
                onChange={() => handleToggleSubtask(idx)}
                className='w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer'
              />

              {editingIndex === idx ? (
                <input
                  type='text'
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                  autoFocus
                  className='flex-1 px-2 py-1 border border-blue-500 rounded dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              ) : (
                <span
                  className={`flex-1 ${
                    subtask.isComplete
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {subtask.title}
                </span>
              )}

              {/* Action buttons */}
              <div className='flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                {!subtask.isComplete && (
                  <button
                    onClick={() => setHelpingTask(subtask)}
                    className='p-1.5 text-purple-500 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded transition-colors'
                    title='Get AI help for this task'
                  >
                    <HiOutlineLightBulb className='w-4 h-4' />
                  </button>
                )}

                <button
                  onClick={() => handleStartEdit(idx)}
                  className='p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors'
                  title='Edit task'
                >
                  <HiOutlinePencil className='w-4 h-4' />
                </button>

                <button
                  onClick={() => handleDeleteSubtask(idx)}
                  className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors'
                  title='Delete task'
                >
                  <HiOutlineTrash className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Task */}
        <div className='flex items-center space-x-2'>
          <input
            type='text'
            value={newSubTaskTitle}
            onChange={(e) => setNewSubTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
            placeholder='Add a new task...'
            className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            onClick={handleAddSubtask}
            disabled={!newSubTaskTitle.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            Add
          </button>
        </div>

        <p className='text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center'>
          <HiOutlineLightBulb className='w-3.5 h-3.5 mr-1 text-yellow-500' />
          Hover over a task and click the lightbulb for AI implementation help
        </p>
      </div>

      {/* Notes */}
      <div className='p-6'>
        <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Notes
        </h4>
        <textarea
          value={localNotes}
          onChange={(e) => setLocalNotes(e.target.value)}
          onBlur={handleNotesSave}
          placeholder='Add notes for this phase...'
          rows={3}
          className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* AI Help Modal */}
      <AnimatePresence>
        {helpingTask && (
          <TaskAIHelp
            task={helpingTask}
            projectName={project.name}
            projectType={project.type}
            phaseName={phase.title}
            onClose={() => setHelpingTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main PhaseTracker component
function PhaseTracker({
  project,
  phases,
  onPhaseUpdate,
  onPhaseSelect,
  isUpdating,
}) {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const currentPhase = phases.find((p) => p.id === expandedPhase);

  useEffect(() => {
    if (onPhaseSelect) {
      onPhaseSelect(expandedPhase);
    }
  }, [expandedPhase, onPhaseSelect]);

  return (
    <div className='space-y-4'>
      {/* Horizontal Progress Track */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 overflow-x-auto'>
        <div className='flex items-center min-w-max'>
          {phases.map((phase, index) => (
            <div key={phase.id} className='flex items-center'>
              <button
                onClick={() =>
                  setExpandedPhase(expandedPhase === phase.id ? null : phase.id)
                }
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-300 ${
                  phase.isComplete
                    ? 'bg-green-500 text-white'
                    : expandedPhase === phase.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                {phase.isComplete ? (
                  <HiOutlineCheck className='w-5 h-5' />
                ) : (
                  phase.id
                )}
              </button>
              {index < phases.length - 1 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    phase.isComplete
                      ? 'bg-green-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className='flex items-start min-w-max mt-2'>
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              style={{ width: index < phases.length - 1 ? '66px' : '40px' }}
            >
              <span
                className={`text-xs text-center w-10 truncate block ${
                  phase.isComplete
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {phase.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Phase */}
      <AnimatePresence mode='wait'>
        {currentPhase && (
          <motion.div
            key={expandedPhase}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden'
          >
            <PhaseDetail
              project={project}
              phase={currentPhase}
              onPhaseUpdate={onPhaseUpdate}
              isUpdating={isUpdating}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase List */}
      <div className='space-y-3'>
        {phases.map((phase) => {
          const completedSubtasks =
            phase.subTasks?.filter((st) => st.isComplete).length || 0;
          const totalSubtasks = phase.subTasks?.length || 0;
          const allSubtasksComplete =
            totalSubtasks > 0 && completedSubtasks === totalSubtasks;

          return (
            <div
              key={phase.id}
              onClick={() =>
                setExpandedPhase(expandedPhase === phase.id ? null : phase.id)
              }
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 transition-all cursor-pointer ${
                expandedPhase === phase.id
                  ? 'border-blue-500'
                  : phase.isComplete
                  ? 'border-green-200 dark:border-green-800'
                  : allSubtasksComplete
                  ? 'border-yellow-200 dark:border-yellow-800'
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
              }`}
            >
              <div className='p-4 flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      phase.isComplete
                        ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                        : allSubtasksComplete
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {phase.isComplete ? (
                      <HiOutlineCheck className='w-5 h-5' />
                    ) : (
                      <span className='text-sm font-medium'>{phase.id}</span>
                    )}
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${
                        phase.isComplete
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {phase.title}
                    </h4>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {completedSubtasks}/{totalSubtasks} tasks
                      {allSubtasksComplete && !phase.isComplete && (
                        <span className='ml-2 text-yellow-600 dark:text-yellow-400'>
                          <HiOutlineSparkles className='inline w-3 h-3 mr-0.5' />
                          Ready!
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <HiOutlineChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedPhase === phase.id ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PhaseTracker;
