// client/src/components/project/PRDModal.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI } from '../../services/api';
import {
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineClipboardCopy,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
} from 'react-icons/hi';

function PRDModal({ project, onClose }) {
  const [prd, setPrd] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const generatePRDPrompt = () => {
    const completedPhases = project.phases.filter((p) => p.isComplete);
    const allTasks = project.phases.flatMap((phase) =>
      phase.subTasks.map((task) => ({
        phase: phase.title,
        task: task.title,
        completed: task.isComplete,
      }))
    );

    const completedTasks = allTasks.filter((t) => t.completed);
    const phaseDetails = project.phases
      .map((phase) => {
        const tasks = phase.subTasks.map((t) => `  - ${t.title}`).join('\n');
        return `### ${phase.title}\n${
          phase.description
        }\n\nTasks:\n${tasks}\n\nNotes: ${phase.notes || 'None'}`;
      })
      .join('\n\n');

    return `You are a senior technical writer. Generate a professional Product Requirements Document (PRD) for a completed software project.

PROJECT DETAILS:
- Name: ${project.name}
- Type: ${project.type}
- Description: ${project.description || 'No description provided'}
- Progress: ${project.progress}%
- Total Phases: ${project.phases.length}
- Completed Phases: ${completedPhases.length}
- Total Tasks: ${allTasks.length}
- Completed Tasks: ${completedTasks.length}

PHASE BREAKDOWN:
${phaseDetails}

Generate a comprehensive PRD with the following structure. Use proper markdown formatting:

# ${project.name} - Product Requirements Document

## 1. Executive Summary
A brief overview of the project, its purpose, and key outcomes. (2-3 paragraphs)

## 2. Project Overview
### 2.1 Problem Statement
What problem does this project solve?

### 2.2 Solution
How does this project solve the problem?

### 2.3 Target Users
Who will use this product?

## 3. Goals & Objectives
- Primary goals (bullet points)
- Success metrics

## 4. Technical Specifications
### 4.1 Tech Stack
Based on the project type (${project.type}), list likely technologies used.

### 4.2 Architecture Overview
High-level architecture description.

### 4.3 Key Components
List and describe main components/modules.

## 5. Features & Functionality
For each phase, describe the features implemented:
(Convert the tasks into feature descriptions)

## 6. User Stories
Write 5-8 user stories in the format: "As a [user], I want to [action] so that [benefit]"

## 7. Development Timeline
Based on the phases, create a timeline overview.

## 8. Future Considerations
Potential future enhancements and scalability considerations.

## 9. Appendix
### 9.1 Glossary
Define any technical terms.

### 9.2 References
Placeholder for documentation links.

---

Make the PRD professional, comprehensive, and ready for stakeholder review. Use the actual project details provided above to make it specific and relevant.`;
  };

  const fetchPRD = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const prompt = generatePRDPrompt();
      const response = await aiAPI.chat(null, prompt, [], null);
      setPrd(response.response);
    } catch (err) {
      console.error('Failed to generate PRD:', err);
      setError('Failed to generate PRD. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPRD();
  }, []);

  const handleCopy = () => {
    if (prd) {
      navigator.clipboard.writeText(prd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (prd) {
      // Create markdown file
      const blob = new Blob([prd], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-prd.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRegenerate = () => {
    fetchPRD();
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
                  Product Requirements Document
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

        {/* Action Bar */}
        {prd && !isLoading && (
          <div className='px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between flex-shrink-0'>
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
                      Copy Markdown
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
              onClick={handleRegenerate}
              className='inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm'
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
              <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
              <p className='mt-6 text-gray-600 dark:text-gray-400 text-lg'>
                Generating your PRD...
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
                onClick={handleRegenerate}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
              >
                Try Again
              </button>
            </div>
          )}

          {prd && !isLoading && (
            <div className='prose prose-sm dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-h1:text-2xl prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-2 prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-pre:bg-gray-900 prose-pre:text-gray-100'>
              <div className='whitespace-pre-wrap text-gray-700 dark:text-gray-300'>
                {prd}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0'>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-500 dark:text-gray-400 flex items-center'>
              <HiOutlineDocumentText className='w-3.5 h-3.5 mr-1' />
              AI-generated document • Review before sharing
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
