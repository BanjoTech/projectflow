// client/src/components/project/PhaseTracker.jsx

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { aiAPI, projectsAPI } from '../../services/api';
import {
  HiOutlineSparkles,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineLightBulb,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineClipboardCopy,
  HiOutlineAnnotation,
  HiOutlinePlus,
  HiOutlineMenuAlt2,
} from 'react-icons/hi';

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
        const prompt = `You are a senior developer. Help implement this task for a ${projectType} project called "${projectName}".

TASK: "${task.title}"
PHASE: ${phaseName}

Provide a complete, step-by-step implementation guide with code examples. Be specific and use ${new Date().getFullYear()} best practices.`;

        const response = await aiAPI.chat(null, prompt, [], null);
        setHelp(response.response);
      } catch (err) {
        console.error('Failed to get AI help:', err);
        setError('Failed to get help. Please try again.');
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
        <div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600'>
          <div className='flex items-start justify-between'>
            <div className='flex items-start space-x-3'>
              <div className='p-2 bg-white/20 rounded-lg'>
                <HiOutlineLightBulb className='w-5 h-5 text-white' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>
                  Implementation Guide
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
                  className='p-2 hover:bg-white/20 rounded-lg transition-colors'
                  title='Copy all'
                >
                  <HiOutlineClipboardCopy className='w-5 h-5 text-white' />
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

        <div className='p-6 overflow-y-auto max-h-[calc(85vh-140px)]'>
          {isLoading && (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
              <p className='mt-4 text-gray-600 dark:text-gray-400'>
                Generating guide...
              </p>
            </div>
          )}
          {error && (
            <p className='text-red-600 dark:text-red-400 text-center py-12'>
              {error}
            </p>
          )}
          {help && (
            <div className='prose prose-sm dark:prose-invert max-w-none'>
              <div className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
                {help}
              </div>
            </div>
          )}
        </div>

        {copied && (
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm'>
            Copied to clipboard!
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Task Description Modal
function TaskDescriptionModal({ task, onSave, onClose }) {
  const [description, setDescription] = useState(task.description || '');

  const handleSave = () => {
    onSave(description);
    onClose();
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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-white flex items-center'>
            <HiOutlineAnnotation className='w-5 h-5 mr-2 text-blue-500' />
            Task Notes / Solution
          </h3>
          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2'>
            {task.title}
          </p>
        </div>

        <div className='p-4'>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Document your implementation...'
            rows={6}
            className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            autoFocus
          />
        </div>

        <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Save Notes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Add/Edit Phase Modal
function PhaseModal({ phase, onSave, onClose }) {
  const [title, setTitle] = useState(phase?.title || '');
  const [description, setDescription] = useState(phase?.description || '');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() });
    onClose();
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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            {phase ? 'Edit Phase' : 'Add New Phase'}
          </h3>
        </div>

        <div className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Phase Title *
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g., User Authentication'
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              autoFocus
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='What needs to be accomplished in this phase?'
              rows={3}
              className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50'
          >
            {phase ? 'Save Changes' : 'Add Phase'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Single Phase Card
function PhaseCard({
  project,
  phase,
  onPhaseUpdate,
  onPhaseDelete,
  onPhaseEdit,
  isUpdating,
  isExpanded,
  onToggle,
}) {
  const [localNotes, setLocalNotes] = useState(phase.notes || '');
  const [localSubTasks, setLocalSubTasks] = useState(phase.subTasks || []);
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [helpingTask, setHelpingTask] = useState(null);
  const [editingDescriptionIndex, setEditingDescriptionIndex] = useState(null);

  const completedCount = localSubTasks.filter((st) => st.isComplete).length;
  const totalCount = localSubTasks.length;
  const allSubtasksComplete = totalCount > 0 && completedCount === totalCount;

  useEffect(() => {
    setLocalNotes(phase.notes || '');
    setLocalSubTasks(phase.subTasks || []);
  }, [phase._id, phase.notes, phase.subTasks]);

  const handleNotesSave = () => {
    if (localNotes !== phase.notes) {
      onPhaseUpdate(phase._id || phase.id, { notes: localNotes });
    }
  };

  const handleToggleSubtask = (index) => {
    const updated = localSubTasks.map((st, idx) =>
      idx === index ? { ...st, isComplete: !st.isComplete } : st
    );
    setLocalSubTasks(updated);

    const allComplete = updated.every((st) => st.isComplete);
    if (allComplete && !phase.isComplete) {
      onPhaseUpdate(phase._id || phase.id, {
        subTasks: updated,
        isComplete: true,
      });
    } else if (!allComplete && phase.isComplete) {
      onPhaseUpdate(phase._id || phase.id, {
        subTasks: updated,
        isComplete: false,
      });
    } else {
      onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
    }
  };

  const handleUpdateTaskDescription = (index, description) => {
    const updated = localSubTasks.map((st, idx) =>
      idx === index ? { ...st, description } : st
    );
    setLocalSubTasks(updated);
    onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
  };

  const handleAddSubtask = () => {
    if (!newSubTaskTitle.trim()) return;
    const updated = [
      ...localSubTasks,
      { title: newSubTaskTitle.trim(), isComplete: false, description: '' },
    ];
    setLocalSubTasks(updated);
    setNewSubTaskTitle('');

    if (phase.isComplete) {
      onPhaseUpdate(phase._id || phase.id, {
        subTasks: updated,
        isComplete: false,
      });
    } else {
      onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
    }
  };

  const handleDeleteSubtask = (index) => {
    const updated = localSubTasks.filter((_, idx) => idx !== index);
    setLocalSubTasks(updated);
    onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
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
      onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
    }
    setEditingIndex(null);
  };

  const handleToggleComplete = () => {
    if (!allSubtasksComplete && !phase.isComplete) return;
    onPhaseUpdate(phase._id || phase.id, { isComplete: !phase.isComplete });
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
    const updated = [...localSubTasks, { ...suggestion, description: '' }];
    setLocalSubTasks(updated);
    onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
    setSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  };

  const handleAddAllSuggestions = () => {
    const updated = [
      ...localSubTasks,
      ...suggestions.map((s) => ({ ...s, description: '' })),
    ];
    setLocalSubTasks(updated);
    onPhaseUpdate(phase._id || phase.id, { subTasks: updated });
    setSuggestions([]);
  };

  const handleDeletePhase = () => {
    if (
      window.confirm(`Delete phase "${phase.title}"? This cannot be undone.`)
    ) {
      onPhaseDelete(phase._id || phase.id);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all overflow-hidden ${
        isExpanded
          ? 'border-blue-500 shadow-lg'
          : phase.isComplete
          ? 'border-green-200 dark:border-green-800'
          : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
      }`}
    >
      {/* Phase Header */}
      <div className='p-4 flex items-center justify-between'>
        <button
          onClick={onToggle}
          className='flex items-center space-x-4 flex-1 text-left'
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              phase.isComplete
                ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                : allSubtasksComplete
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
            }`}
          >
            {phase.isComplete ? (
              <HiOutlineCheck className='w-5 h-5' />
            ) : (
              phase.id
            )}
          </div>
          <div>
            <h4
              className={`font-semibold ${
                phase.isComplete
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {phase.title}
            </h4>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {completedCount}/{totalCount} tasks
              {allSubtasksComplete && !phase.isComplete && (
                <span className='ml-2 text-yellow-600 dark:text-yellow-400'>
                  • Ready to complete!
                </span>
              )}
            </p>
          </div>
        </button>

        <div className='flex items-center space-x-1'>
          <button
            onClick={() => onPhaseEdit(phase)}
            className='p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors'
            title='Edit phase'
          >
            <HiOutlinePencil className='w-4 h-4' />
          </button>
          <button
            onClick={handleDeletePhase}
            className='p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'
            title='Delete phase'
          >
            <HiOutlineTrash className='w-4 h-4' />
          </button>
          <button onClick={onToggle} className='p-2'>
            <HiOutlineChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='overflow-hidden'
          >
            <div className='border-t border-gray-100 dark:border-gray-700'>
              {phase.description && (
                <div className='px-6 py-3 bg-gray-50 dark:bg-gray-900/50'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {phase.description}
                  </p>
                </div>
              )}

              <div className='p-6'>
                {/* Task Progress Bar */}
                {totalCount > 0 && (
                  <div className='mb-4'>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          allSubtasksComplete ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
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
                        Suggestions ({suggestions.length})
                      </span>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={handleAddAllSuggestions}
                          className='text-xs text-purple-600 hover:underline'
                        >
                          Add all
                        </button>
                        <button
                          onClick={() => setSuggestions([])}
                          className='text-xs text-red-500 hover:underline'
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                    <div className='space-y-2 max-h-40 overflow-y-auto'>
                      {suggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className='flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded'
                        >
                          <span className='text-sm text-gray-700 dark:text-gray-300 flex-1 pr-2'>
                            {suggestion.title}
                          </span>
                          <button
                            onClick={() => handleAddSuggestion(suggestion)}
                            className='text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700'
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Task List */}
                <div className='space-y-2 mb-4'>
                  {localSubTasks.map((subtask, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border transition-colors ${
                        subtask.isComplete
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className='flex items-start space-x-3'>
                        <input
                          type='checkbox'
                          checked={subtask.isComplete}
                          onChange={() => handleToggleSubtask(idx)}
                          className='w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
                        />

                        <div className='flex-1 min-w-0'>
                          {editingIndex === idx ? (
                            <input
                              type='text'
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onBlur={handleSaveEdit}
                              onKeyDown={(e) =>
                                e.key === 'Enter' && handleSaveEdit()
                              }
                              autoFocus
                              className='w-full px-2 py-1 border border-blue-500 rounded dark:bg-gray-700 dark:text-white focus:outline-none'
                            />
                          ) : (
                            <span
                              className={`block ${
                                subtask.isComplete
                                  ? 'text-gray-400 line-through'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {subtask.title}
                            </span>
                          )}

                          {subtask.description && (
                            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 italic'>
                              📝 {subtask.description}
                            </p>
                          )}
                        </div>

                        <div className='flex items-center space-x-1 flex-shrink-0'>
                          {!subtask.isComplete && (
                            <button
                              onClick={() => setHelpingTask(subtask)}
                              className='p-1.5 text-purple-500 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded'
                              title='Get help'
                            >
                              <HiOutlineLightBulb className='w-4 h-4' />
                            </button>
                          )}
                          <button
                            onClick={() => setEditingDescriptionIndex(idx)}
                            className='p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded'
                            title='Add notes'
                          >
                            <HiOutlineAnnotation className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleStartEdit(idx)}
                            className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded'
                            title='Edit'
                          >
                            <HiOutlinePencil className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => handleDeleteSubtask(idx)}
                            className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded'
                            title='Delete'
                          >
                            <HiOutlineTrash className='w-4 h-4' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Task */}
                <div className='flex items-center space-x-2 mb-4'>
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
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors'
                  >
                    Add
                  </button>
                  <button
                    onClick={handleAISuggest}
                    disabled={isSuggesting}
                    className='px-3 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 transition-colors flex items-center'
                    title='Get AI suggestions'
                  >
                    {isSuggesting ? (
                      <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <HiOutlineSparkles className='w-4 h-4' />
                    )}
                  </button>
                </div>

                {/* Phase Notes */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Phase Notes
                  </label>
                  <textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    onBlur={handleNotesSave}
                    placeholder='Add notes for this phase...'
                    rows={2}
                    className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                {/* Complete Phase Button */}
                <div className='mt-4 flex justify-end'>
                  <button
                    onClick={handleToggleComplete}
                    disabled={
                      isUpdating || (!allSubtasksComplete && !phase.isComplete)
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                      phase.isComplete
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 hover:bg-green-200'
                        : allSubtasksComplete
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {phase.isComplete ? (
                      <>
                        <HiOutlineCheck className='w-5 h-5' />
                        <span>Completed</span>
                      </>
                    ) : allSubtasksComplete ? (
                      <>
                        <HiOutlineSparkles className='w-5 h-5' />
                        <span>Mark Complete</span>
                      </>
                    ) : (
                      <span>Complete all tasks first</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
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

      <AnimatePresence>
        {editingDescriptionIndex !== null && (
          <TaskDescriptionModal
            task={localSubTasks[editingDescriptionIndex]}
            onSave={(description) =>
              handleUpdateTaskDescription(editingDescriptionIndex, description)
            }
            onClose={() => setEditingDescriptionIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main PhaseTracker Component
function PhaseTracker({
  project,
  phases,
  onPhaseUpdate,
  onPhaseSelect,
  isUpdating,
}) {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [isAddingPhase, setIsAddingPhase] = useState(false);

  useEffect(() => {
    if (onPhaseSelect) {
      onPhaseSelect(expandedPhase);
    }
  }, [expandedPhase, onPhaseSelect]);

  const handleToggle = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const handleAddPhase = async (data) => {
    setIsAddingPhase(true);
    try {
      await projectsAPI.addPhase(project._id, data);
      // The parent component should refresh the project data
      window.location.reload(); // Simple refresh - or implement proper state update
    } catch (error) {
      console.error('Failed to add phase:', error);
      alert('Failed to add phase');
    } finally {
      setIsAddingPhase(false);
    }
  };

  const handleEditPhase = async (data) => {
    if (!editingPhase) return;
    try {
      await onPhaseUpdate(editingPhase._id || editingPhase.id, {
        title: data.title,
        description: data.description,
      });
    } catch (error) {
      console.error('Failed to update phase:', error);
    }
  };

  const handleDeletePhase = async (phaseId) => {
    try {
      await projectsAPI.deletePhase(project._id, phaseId);
      window.location.reload(); // Simple refresh
    } catch (error) {
      console.error('Failed to delete phase:', error);
      alert('Failed to delete phase');
    }
  };

  const completedPhases = phases.filter((p) => p.isComplete).length;

  return (
    <div className='space-y-4'>
      {/* Progress Overview */}
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Phase Progress
          </span>
          <span className='text-sm text-gray-500 dark:text-gray-400'>
            {completedPhases}/{phases.length} phases complete
          </span>
        </div>
        <div className='flex items-center space-x-1'>
          {phases.map((phase) => (
            <div
              key={phase._id || phase.id}
              className={`flex-1 h-2 rounded-full ${
                phase.isComplete
                  ? 'bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Phase Cards */}
      <div className='space-y-3'>
        {phases.map((phase) => (
          <PhaseCard
            key={phase._id || phase.id}
            project={project}
            phase={phase}
            onPhaseUpdate={onPhaseUpdate}
            onPhaseDelete={handleDeletePhase}
            onPhaseEdit={(p) => {
              setEditingPhase(p);
              setShowPhaseModal(true);
            }}
            isUpdating={isUpdating}
            isExpanded={expandedPhase === (phase._id || phase.id)}
            onToggle={() => handleToggle(phase._id || phase.id)}
          />
        ))}
      </div>

      {/* Add Phase Button */}
      <button
        onClick={() => {
          setEditingPhase(null);
          setShowPhaseModal(true);
        }}
        disabled={isAddingPhase}
        className='w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center space-x-2'
      >
        {isAddingPhase ? (
          <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
        ) : (
          <>
            <HiOutlinePlus className='w-5 h-5' />
            <span>Add New Phase</span>
          </>
        )}
      </button>

      {/* Phase Modal */}
      <AnimatePresence>
        {showPhaseModal && (
          <PhaseModal
            phase={editingPhase}
            onSave={editingPhase ? handleEditPhase : handleAddPhase}
            onClose={() => {
              setShowPhaseModal(false);
              setEditingPhase(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PhaseTracker;
