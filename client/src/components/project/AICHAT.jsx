// client/src/components/project/AIChat.jsx

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiAPI, projectsAPI } from '../../services/api';

// Code block component with copy button
function CodeBlock({ children, className, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!match) {
    return (
      <code
        className='bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm text-pink-600 dark:text-pink-400'
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className='relative group my-3'>
      <div className='absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-1 bg-gray-800 rounded-t-lg border-b border-gray-700'>
        <span className='text-xs text-gray-400 uppercase'>{language}</span>
        <button
          onClick={handleCopy}
          className='text-xs text-gray-400 hover:text-white transition-colors flex items-center space-x-1'
        >
          {copied ? (
            <>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag='div'
        className='!mt-0 !rounded-t-none !pt-8'
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: '2.5rem',
        }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
}

const markdownComponents = {
  code: CodeBlock,
  p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
  ul: ({ children }) => (
    <ul className='list-disc list-inside mb-2 space-y-1'>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className='list-decimal list-inside mb-2 space-y-1'>{children}</ol>
  ),
  li: ({ children }) => <li className='text-sm'>{children}</li>,
  h1: ({ children }) => <h1 className='text-lg font-bold mb-2'>{children}</h1>,
  h2: ({ children }) => (
    <h2 className='text-base font-bold mb-2'>{children}</h2>
  ),
  h3: ({ children }) => <h3 className='text-sm font-bold mb-1'>{children}</h3>,
  strong: ({ children }) => (
    <strong className='font-semibold'>{children}</strong>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-500 hover:underline'
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className='border-l-4 border-gray-300 dark:border-gray-600 pl-3 italic text-gray-600 dark:text-gray-400 my-2'>
      {children}
    </blockquote>
  ),
};

function AIChat({ project, currentPhaseId = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState(project.chatHistory || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef(null);

  const currentYear = new Date().getFullYear();

  // Sync chat history when project changes
  useEffect(() => {
    setChatHistory(project.chatHistory || []);
  }, [project.chatHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Get current phase info for context display
  const currentPhase = currentPhaseId
    ? project.phases.find((p) => p.id === currentPhaseId)
    : null;

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(newHistory);

    setIsLoading(true);

    try {
      // Pass currentPhaseId for context-aware response
      const response = await aiAPI.chat(
        project._id,
        userMessage,
        chatHistory,
        currentPhaseId
      );

      const updatedHistory = [
        ...newHistory,
        { role: 'assistant', content: response.response },
      ];
      setChatHistory(updatedHistory);

      // Save to database
      await projectsAPI.saveChatMessage(project._id, 'user', userMessage);
      await projectsAPI.saveChatMessage(
        project._id,
        'assistant',
        response.response
      );
    } catch (error) {
      console.error('AI chat error:', error);
      setChatHistory([
        ...newHistory,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // FIXED: Clear chat now persists to database
  const handleClearChat = async () => {
    if (chatHistory.length === 0) return;

    setIsClearing(true);
    try {
      await projectsAPI.clearChatHistory(project._id);
      setChatHistory([]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const quickPrompts = [
    'What should I focus on next?',
    `What are the ${currentYear} best practices for this project?`,
    'Suggest modern tech stack improvements',
    'How can I optimize performance?',
    'Show me a code example for dark mode toggle',
    'What testing strategy should I use?',
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all z-50 hover:scale-110'
      >
        {isOpen ? (
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        ) : (
          <span className='text-2xl'>🤖</span>
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='fixed bottom-24 right-6 w-[420px] h-[550px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700'
          >
            {/* Header */}
            <div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <span className='text-2xl'>🤖</span>
                  <div>
                    <h3 className='font-semibold text-white'>AI Assistant</h3>
                    <p className='text-xs text-blue-100'>
                      {currentPhase
                        ? `Context: Phase ${currentPhase.id} - ${currentPhase.title}`
                        : `Powered by ${currentYear} knowledge`}
                    </p>
                  </div>
                </div>
                {chatHistory.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    disabled={isClearing}
                    className='text-xs text-blue-100 hover:text-white transition-colors disabled:opacity-50'
                    title='Clear chat history'
                  >
                    {isClearing ? 'Clearing...' : 'Clear'}
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {chatHistory.length === 0 && (
                <div className='text-center py-4'>
                  <span className='text-4xl'>💬</span>
                  <p className='text-gray-500 dark:text-gray-400 mt-2 text-sm'>
                    Ask me anything about your project!
                  </p>
                  <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                    {currentPhase
                      ? `I'm aware you're working on: ${currentPhase.title}`
                      : 'Select a phase for context-aware help'}
                  </p>
                  <div className='mt-4 space-y-2'>
                    {quickPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMessage(prompt)}
                        className='block w-full text-left text-sm px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors'
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-lg px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className='text-sm whitespace-pre-wrap'>
                        {msg.content}
                      </p>
                    ) : (
                      <div className='text-sm prose prose-sm dark:prose-invert max-w-none'>
                        <ReactMarkdown components={markdownComponents}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className='flex justify-start'>
                  <div className='bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex space-x-1'>
                        <div
                          className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                          style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                          className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                          style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                          className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                          style={{ animationDelay: '300ms' }}
                        ></div>
                      </div>
                      <span className='text-xs text-gray-500 dark:text-gray-400'>
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
              <div className='flex space-x-2'>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Ask about code, best practices, or get recommendations...'
                  rows={1}
                  className='flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className='px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
                    />
                  </svg>
                </button>
              </div>
              <p className='text-xs text-gray-400 dark:text-gray-500 mt-2 text-center'>
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AIChat;
