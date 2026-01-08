// client/src/components/project/PhaseTracker.jsx

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiAPI, projectsAPI } from '../../services/api';
import {
  HiOutlineSparkles,
  HiOutlineX,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLightBulb,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineClipboardCopy,
  HiOutlineAnnotation,
  HiOutlinePlus,
  HiOutlineDotsVertical,
} from 'react-icons/hi';

function TaskAIHelp({ task, projectName, projectType, phaseName, onClose }) {
  const [help, setHelp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHelp = async () => {
      try {
        const prompt = `Help implement: "${task.title}" for ${projectType} project "${projectName}", phase: ${phaseName}`;
        const response = await aiAPI.chat(null, prompt, [], null);
        setHelp(response.response);
      } catch (err) {
        setError('Failed to get help');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHelp();
  }, [task.title, projectName, projectType, phaseName]);

  const handleCopy = () => {
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 flex justify-between'>
          <div className='flex items-center space-x-3'>
            <HiOutlineLightBulb className='w-5 h-5 text-white' />
            <div>
              <h3 className='font-semibold text-white'>Implementation Guide</h3>
              <p className='text-sm text-blue-100'>{task.title}</p>
            </div>
          </div>
          <div className='flex space-x-2'>
            {help && (
              <button
                onClick={handleCopy}
                className='p-2 hover:bg-white/20 rounded-lg'
              >
                <HiOutlineClipboardCopy className='w-5 h-5 text-white' />
              </button>
            )}
            <button
              onClick={onClose}
              className='p-2 hover:bg-white/20 rounded-lg'
            >
              <HiOutlineX className='w-5 h-5 text-white' />
            </button>
          </div>
        </div>

        <div className='p-6 overflow-y-auto max-h-[calc(85vh-100px)]'>
          {isLoading && (
            <div className='flex flex-col items-center py-12'>
              <div className='w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
              <p className='mt-4 text-gray-600 dark:text-gray-400'>
                Generating guide...
              </p>
            </div>
          )}
          {error && <p className='text-red-600 text-center py-12'>{error}</p>}
          {help && (
            <div className='text-gray-700 dark:text-gray-300 whitespace-pre-wrap'>
              {help}
            </div>
          )}
        </div>

        {copied && (
          <div className='absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm'>
            Copied!
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function TaskDescriptionModal({ task, onSave, onClose }) {
  const [description, setDescription] = useState(task.description || '');

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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-white flex items-center'>
            <HiOutlineAnnotation className='w-5 h-5 mr-2 text-blue-500' />
            Task Notes
          </h3>
        </div>
        <div className='p-4'>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Add notes...'
            rows={5}
            className='w-full px-4 py-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500'
            autoFocus
          />
        </div>
        <div className='p-4 border-t dark:border-gray-700 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(description);
              onClose();
            }}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhaseModal({ phase, onSave, onClose }) {
  const [title, setTitle] = useState(phase?.title || '');
  const [description, setDescription] = useState(phase?.description || '');

  const handleSave = () => {
    if (!title.trim()) return alert('Title required');
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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-4 border-b dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            {phase ? 'Edit Phase' : 'Add New Phase'}
          </h3>
        </div>
        <div className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1 dark:text-gray-300'>
              Title *
            </label>
            <input
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Phase title'
              className='w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              autoFocus
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1 dark:text-gray-300'>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Optional description'
              rows={3}
              className='w-full px-4 py-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            />
          </div>
        </div>
        <div className='p-4 border-t dark:border-gray-700 flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
          >
            {phase ? 'Save' : 'Add'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteConfirmModal({ title, message, onConfirm, onClose }) {
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
        className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4'>
          <HiOutlineTrash className='w-6 h-6 text-red-600' />
        </div>
        <h3 className='text-lg font-semibold text-center mb-2 dark:text-white'>
          {title}
        </h3>
        <p className='text-sm text-gray-600 dark:text-gray-400 text-center mb-4'>
          {message}
        </p>
        <div className='flex justify-end space-x-3'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PhaseMenu({
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className='p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
      >
        <HiOutlineDotsVertical className='w-5 h-5' />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className='absolute right-0 top-8 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-1 z-20'
          >
            <button
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
              className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center'
            >
              <HiOutlinePencil className='w-4 h-4 mr-2' /> Edit
            </button>
            {canMoveUp && (
              <button
                onClick={() => {
                  onMoveUp();
                  setIsOpen(false);
                }}
                className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center'
              >
                <HiOutlineChevronUp className='w-4 h-4 mr-2' /> Move Up
              </button>
            )}
            {canMoveDown && (
              <button
                onClick={() => {
                  onMoveDown();
                  setIsOpen(false);
                }}
                className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center'
              >
                <HiOutlineChevronDown className='w-4 h-4 mr-2' /> Move Down
              </button>
            )}
            <hr className='my-1 border-gray-200 dark:border-gray-700' />
            <button
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
              className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center'
            >
              <HiOutlineTrash className='w-4 h-4 mr-2' /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhaseCard({
  project,
  phase,
  phaseIndex,
  totalPhases,
  onPhaseUpdate,
  onPhaseEdit,
  onPhaseDelete,
  onPhaseMove,
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
  const allComplete = totalCount > 0 && completedCount === totalCount;

  useEffect(() => {
    setLocalNotes(phase.notes || '');
    setLocalSubTasks(phase.subTasks || []);
  }, [phase._id, phase.notes, phase.subTasks]);

  const handleNotesSave = () => {
    if (localNotes !== phase.notes)
      onPhaseUpdate(phase._id || phase.id, { notes: localNotes });
  };

  const handleToggleSubtask = (index) => {
    const updated = localSubTasks.map((st, idx) =>
      idx === index ? { ...st, isComplete: !st.isComplete } : st
    );
    setLocalSubTasks(updated);
    const allDone = updated.every((st) => st.isComplete);
    onPhaseUpdate(phase._id || phase.id, {
      subTasks: updated,
      isComplete: allDone && updated.length > 0,
    });
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
    onPhaseUpdate(phase._id || phase.id, {
      subTasks: updated,
      isComplete: false,
    });
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
    if (!allComplete && !phase.isComplete) return;
    onPhaseUpdate(phase._id || phase.id, { isComplete: !phase.isComplete });
  };

  const handleAISuggest = async () => {
    setIsSuggesting(true);
    try {
      const result = await aiAPI.suggestSubtasks(project._id, phase.id);
      const existing = new Set(
        localSubTasks.map((st) => st.title.toLowerCase())
      );
      const newSuggestions = result.suggestions.filter(
        (s) => !existing.has(s.title.toLowerCase())
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

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all overflow-hidden ${
        isExpanded
          ? 'border-blue-500 shadow-lg'
          : phase.isComplete
          ? 'border-green-200 dark:border-green-800'
          : 'border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className='p-4 flex items-center justify-between'>
        <button
          onClick={onToggle}
          className='flex-1 flex items-center space-x-4 text-left'
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
              phase.isComplete
                ? 'bg-green-100 dark:bg-green-900 text-green-600'
                : allComplete
                ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
            }`}
          >
            {phase.isComplete ? (
              <HiOutlineCheck className='w-5 h-5' />
            ) : (
              phaseIndex + 1
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <h4
              className={`font-semibold truncate ${
                phase.isComplete
                  ? 'text-green-700 dark:text-green-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {phase.title}
            </h4>
            <p className='text-sm text-gray-500'>
              {completedCount}/{totalCount} tasks
            </p>
          </div>
          <HiOutlineChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        <PhaseMenu
          onEdit={() => onPhaseEdit(phase)}
          onDelete={() => onPhaseDelete(phase)}
          onMoveUp={() => onPhaseMove(phaseIndex, 'up')}
          onMoveDown={() => onPhaseMove(phaseIndex, 'down')}
          canMoveUp={phaseIndex > 0}
          canMoveDown={phaseIndex < totalPhases - 1}
        />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden'
          >
            <div className='border-t dark:border-gray-700'>
              {phase.description && (
                <div className='px-6 py-3 bg-gray-50 dark:bg-gray-900/50'>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {phase.description}
                  </p>
                </div>
              )}

              <div className='p-6'>
                {totalCount > 0 && (
                  <div className='mb-4'>
                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                      <div
                        className={`h-2 rounded-full ${
                          allComplete ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${(completedCount / totalCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {suggestions.length > 0 && (
                  <div className='mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center'>
                        <HiOutlineSparkles className='w-4 h-4 mr-1.5' />
                        Suggestions ({suggestions.length})
                      </span>
                      <div className='flex space-x-2'>
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
                      {suggestions.map((s, idx) => (
                        <div
                          key={idx}
                          className='flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded'
                        >
                          <span className='text-sm text-gray-700 dark:text-gray-300'>
                            {s.title}
                          </span>
                          <button
                            onClick={() => handleAddSuggestion(s)}
                            className='text-xs px-2 py-1 bg-purple-600 text-white rounded'
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className='space-y-2 mb-4'>
                  {localSubTasks.length === 0 ? (
                    <p className='text-sm text-gray-500 text-center py-4'>
                      No tasks yet
                    </p>
                  ) : (
                    localSubTasks.map((subtask, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          subtask.isComplete
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
                            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200'
                        }`}
                      >
                        <div className='flex items-start space-x-3'>
                          <input
                            type='checkbox'
                            checked={subtask.isComplete}
                            onChange={() => handleToggleSubtask(idx)}
                            className='w-5 h-5 mt-0.5 rounded cursor-pointer'
                          />
                          <div className='flex-1 min-w-0'>
                            {editingIndex === idx ? (
                              <input
                                type='text'
                                value={editingTitle}
                                onChange={(e) =>
                                  setEditingTitle(e.target.value)
                                }
                                onBlur={handleSaveEdit}
                                onKeyDown={(e) =>
                                  e.key === 'Enter' && handleSaveEdit()
                                }
                                autoFocus
                                className='w-full px-2 py-1 border border-blue-500 rounded dark:bg-gray-700'
                              />
                            ) : (
                              <span
                                className={
                                  subtask.isComplete
                                    ? 'text-gray-400 line-through'
                                    : 'text-gray-700 dark:text-gray-300'
                                }
                              >
                                {subtask.title}
                              </span>
                            )}
                            {subtask.description && (
                              <p className='text-xs text-gray-500 mt-1 italic'>
                                📝 {subtask.description}
                              </p>
                            )}
                          </div>
                          <div className='flex space-x-1'>
                            {!subtask.isComplete && (
                              <button
                                onClick={() => setHelpingTask(subtask)}
                                className='p-1.5 text-purple-500 hover:bg-purple-100 rounded'
                                title='Get help'
                              >
                                <HiOutlineLightBulb className='w-4 h-4' />
                              </button>
                            )}
                            <button
                              onClick={() => setEditingDescriptionIndex(idx)}
                              className='p-1.5 text-blue-500 hover:bg-blue-100 rounded'
                              title='Notes'
                            >
                              <HiOutlineAnnotation className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleStartEdit(idx)}
                              className='p-1.5 text-gray-400 hover:bg-gray-100 rounded'
                              title='Edit'
                            >
                              <HiOutlinePencil className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => handleDeleteSubtask(idx)}
                              className='p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded'
                              title='Delete'
                            >
                              <HiOutlineTrash className='w-4 h-4' />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className='flex space-x-2 mb-4'>
                  <input
                    type='text'
                    value={newSubTaskTitle}
                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    placeholder='Add task...'
                    className='flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600'
                  />
                  <button
                    onClick={handleAddSubtask}
                    disabled={!newSubTaskTitle.trim()}
                    className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50'
                  >
                    Add
                  </button>
                  <button
                    onClick={handleAISuggest}
                    disabled={isSuggesting}
                    className='px-3 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 rounded-lg'
                  >
                    {isSuggesting ? (
                      <div className='w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin' />
                    ) : (
                      <HiOutlineSparkles className='w-4 h-4' />
                    )}
                  </button>
                </div>

                <div>
                  <label className='block text-sm font-medium mb-2 dark:text-gray-300'>
                    Phase Notes
                  </label>
                  <textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    onBlur={handleNotesSave}
                    placeholder='Notes...'
                    rows={2}
                    className='w-full px-4 py-2 border rounded-lg resize-none dark:bg-gray-700 dark:border-gray-600'
                  />
                </div>

                <div className='mt-4 flex justify-end'>
                  <button
                    onClick={handleToggleComplete}
                    disabled={isUpdating || (!allComplete && !phase.isComplete)}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 ${
                      phase.isComplete
                        ? 'bg-green-100 text-green-700'
                        : allComplete
                        ? 'bg-yellow-100 text-yellow-700 animate-pulse'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {phase.isComplete ? (
                      <>
                        <HiOutlineCheck className='w-5 h-5' />
                        <span>Completed</span>
                      </>
                    ) : allComplete ? (
                      <>
                        <HiOutlineSparkles className='w-5 h-5' />
                        <span>Mark Complete</span>
                      </>
                    ) : (
                      <span>Complete all tasks</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            onSave={(desc) =>
              handleUpdateTaskDescription(editingDescriptionIndex, desc)
            }
            onClose={() => setEditingDescriptionIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PhaseTracker({
  project,
  phases,
  onPhaseUpdate,
  onPhaseSelect,
  isUpdating,
}) {
  const [expandedPhase, setExpandedPhase] = useState(null);
  const [showAddPhase, setShowAddPhase] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [deletingPhase, setDeletingPhase] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (onPhaseSelect) onPhaseSelect(expandedPhase);
  }, [expandedPhase, onPhaseSelect]);

  const handleToggle = (phaseId) => {
    setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
  };

  const handleAddPhase = async (data) => {
    setIsProcessing(true);
    try {
      await projectsAPI.addPhase(project._id, data);
    } catch (error) {
      alert('Failed to add phase');
    } finally {
      setIsProcessing(false);
      setShowAddPhase(false);
    }
  };

  const handleEditPhase = async (data) => {
    if (!editingPhase) return;
    setIsProcessing(true);
    try {
      await projectsAPI.updatePhase(
        project._id,
        editingPhase._id || editingPhase.id,
        data
      );
    } catch (error) {
      alert('Failed to edit phase');
    } finally {
      setIsProcessing(false);
      setEditingPhase(null);
    }
  };

  const handleDeletePhase = async () => {
    if (!deletingPhase) return;
    setIsProcessing(true);
    try {
      await projectsAPI.deletePhase(
        project._id,
        deletingPhase._id || deletingPhase.id
      );
    } catch (error) {
      alert('Failed to delete phase');
    } finally {
      setIsProcessing(false);
      setDeletingPhase(null);
    }
  };

  const handleMovePhase = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= phases.length) return;
    const newOrder = [...phases];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(newIndex, 0, moved);
    const phaseIds = newOrder.map((p) => p._id || p.id);
    setIsProcessing(true);
    try {
      await projectsAPI.reorderPhases(project._id, phaseIds);
    } catch (error) {
      alert('Failed to reorder');
    } finally {
      setIsProcessing(false);
    }
  };

  const completedPhases = phases.filter((p) => p.isComplete).length;

  return (
    <div className='space-y-4'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium dark:text-gray-300'>
            Phase Progress
          </span>
          <span className='text-sm text-gray-500'>
            {completedPhases}/{phases.length} complete
          </span>
        </div>
        <div className='flex space-x-1'>
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
          {phases.length === 0 && (
            <div className='flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700' />
          )}
        </div>
      </div>

      <div className='space-y-3'>
        {phases.map((phase, index) => (
          <PhaseCard
            key={phase._id || phase.id}
            project={project}
            phase={phase}
            phaseIndex={index}
            totalPhases={phases.length}
            onPhaseUpdate={onPhaseUpdate}
            onPhaseEdit={setEditingPhase}
            onPhaseDelete={setDeletingPhase}
            onPhaseMove={handleMovePhase}
            isUpdating={isUpdating || isProcessing}
            isExpanded={expandedPhase === (phase._id || phase.id)}
            onToggle={() => handleToggle(phase._id || phase.id)}
          />
        ))}
      </div>

      <button
        onClick={() => setShowAddPhase(true)}
        disabled={isProcessing}
        className='w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center space-x-2'
      >
        <HiOutlinePlus className='w-5 h-5' />
        <span>Add New Phase</span>
      </button>

      <AnimatePresence>
        {showAddPhase && (
          <PhaseModal
            onSave={handleAddPhase}
            onClose={() => setShowAddPhase(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingPhase && (
          <PhaseModal
            phase={editingPhase}
            onSave={handleEditPhase}
            onClose={() => setEditingPhase(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deletingPhase && (
          <DeleteConfirmModal
            title='Delete Phase?'
            message={`Delete "${deletingPhase.title}" and all tasks?`}
            onConfirm={handleDeletePhase}
            onClose={() => setDeletingPhase(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PhaseTracker;
