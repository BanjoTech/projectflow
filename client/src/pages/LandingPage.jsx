// client/src/pages/LandingPage.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineLightningBolt,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineCode,
  HiOutlineClipboardCheck,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineArrowRight,
  HiOutlineCheck,
  HiOutlinePlusCircle,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineSwitchVertical,
  HiOutlineLightBulb,
  HiOutlineAnnotation,
  HiOutlineRefresh,
  HiOutlineLink,
  HiOutlineFolder,
  HiOutlineGlobe,
  HiOutlineShoppingCart,
  HiOutlineDeviceMobile,
  HiOutlineServer,
  HiOutlineTemplate,
  HiOutlineChatAlt2,
  HiOutlineClipboardList,
  HiOutlineDocumentDuplicate,
  HiOutlineEye,
  HiOutlineCollection,
  HiOutlineCog,
  HiOutlinePlay,
  HiOutlineAcademicCap,
  HiOutlineUserCircle,
  HiOutlineUsers,
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineSparkles,
    title: 'AI-Powered Project Planning',
    description:
      'Describe your project and AI generates a complete development roadmap with phases, tasks, and estimated timelines tailored to your project type.',
  },
  {
    icon: HiOutlineCollection,
    title: 'Flexible Phase Management',
    description:
      'Add, edit, delete, and reorder phases to match your workflow. Full control over your project structure with drag-and-drop simplicity.',
  },
  {
    icon: HiOutlineClipboardCheck,
    title: 'Smart Task Tracking',
    description:
      'Break down phases into actionable tasks. Get AI suggestions for tasks, add implementation notes, and track completion in real-time.',
  },
  {
    icon: HiOutlineDocumentText,
    title: 'PRD Generation',
    description:
      'Generate Planning PRDs before coding and Documentation PRDs after. Perfect for feeding to AI coding assistants like Cursor or Claude.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Real-Time Collaboration',
    description:
      'Invite team members via email or share invite codes. See updates instantly as your team makes progress with Socket.io live sync.',
  },
  {
    icon: HiOutlineChatAlt2,
    title: 'AI Development Assistant',
    description:
      'Context-aware AI chat that understands your project. Get implementation help, code examples, and guidance for any task.',
  },
  {
    icon: HiOutlineCode,
    title: 'GitHub Integration',
    description:
      'Connect repositories, create new ones from projects, browse files, view commits, PRs, issues, and compare tasks with actual code.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Visual Progress Tracking',
    description:
      'Beautiful progress indicators show exactly where you are. Phase-by-phase and task-by-task visibility into your project status.',
  },
  {
    icon: HiOutlineLightBulb,
    title: 'AI Task Suggestions',
    description:
      'Stuck on what to do next? AI analyzes your phase and suggests relevant tasks based on your project type and current progress.',
  },
];

const projectTypes = [
  { name: 'Landing Pages', icon: HiOutlineGlobe },
  { name: 'Full-Stack Apps', icon: HiOutlineServer },
  { name: 'SaaS Products', icon: HiOutlineCube },
  { name: 'E-Commerce', icon: HiOutlineShoppingCart },
  { name: 'Mobile Apps', icon: HiOutlineDeviceMobile },
  { name: 'APIs & Backends', icon: HiOutlineCode },
  { name: 'Web3 & DApps', icon: HiOutlineLink },
  { name: 'Animated Sites', icon: HiOutlineSparkles },
];

const steps = [
  {
    number: '01',
    icon: HiOutlinePencilAlt,
    title: 'Describe Your Project',
    description:
      'Enter your project name, select the type, and describe what you want to build. AI will analyze your requirements.',
  },
  {
    number: '02',
    icon: HiOutlineTemplate,
    title: 'Get AI-Generated Plan',
    description:
      'Receive a complete phase-by-phase development plan with tasks covering design, development, testing, and deployment.',
  },
  {
    number: '03',
    icon: HiOutlineClipboardList,
    title: 'Customize & Build',
    description:
      'Add, edit, or reorder phases and tasks. Get AI help when stuck. Track progress as you complete each milestone.',
  },
  {
    number: '04',
    icon: HiOutlineDocumentDuplicate,
    title: 'Generate Documentation',
    description:
      'Export PRDs for AI coding tools or generate comprehensive project documentation from your completed work.',
  },
];

const githubFeatures = [
  {
    icon: HiOutlineLink,
    title: 'Connect Any Repository',
    description:
      'Link existing GitHub repos or create new ones directly from your project.',
  },
  {
    icon: HiOutlineFolder,
    title: 'File Browser',
    description:
      'Browse your entire repository structure without leaving the app.',
  },
  {
    icon: HiOutlineRefresh,
    title: 'Live Activity',
    description:
      'View recent commits, open PRs, issues, and branch information.',
  },
  {
    icon: HiOutlineClipboardCheck,
    title: 'Task Comparison',
    description:
      'Compare your project tasks with actual code to see what matches.',
  },
];

const taskFeatures = [
  { icon: HiOutlinePlusCircle, text: 'Add unlimited tasks to any phase' },
  { icon: HiOutlinePencilAlt, text: 'Edit task titles inline' },
  { icon: HiOutlineTrash, text: 'Delete tasks you no longer need' },
  { icon: HiOutlineSparkles, text: 'Get AI-suggested tasks' },
  { icon: HiOutlineLightBulb, text: 'AI implementation help for each task' },
  { icon: HiOutlineAnnotation, text: 'Add notes documenting your solution' },
];

const phaseFeatures = [
  { icon: HiOutlinePlusCircle, text: 'Add custom phases anytime' },
  { icon: HiOutlinePencilAlt, text: 'Edit phase titles and descriptions' },
  { icon: HiOutlineTrash, text: "Remove phases you don't need" },
  { icon: HiOutlineSwitchVertical, text: 'Reorder phases with move up/down' },
  { icon: HiOutlineAnnotation, text: 'Add phase-level notes' },
  { icon: HiOutlineCheck, text: 'Mark phases complete when all tasks done' },
];

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800' />
        <div className='absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl' />

        <div className='relative max-w-6xl mx-auto px-4 py-20 sm:py-32'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'
          >
            <div className='inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6'>
              <HiOutlineLightningBolt className='w-4 h-4 mr-2' />
              AI-Powered Project Management
            </div>

            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight'>
              Turn Your Ideas Into
              <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Structured Development Plans
              </span>
            </h1>

            <p className='mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
              Stop staring at blank screens. Describe your project and get a
              complete AI-generated development roadmap with phases, tasks,
              GitHub integration, and real-time collaboration.
            </p>

            <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center'
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Planning Free'}
                  <HiOutlineArrowRight className='w-5 h-5 ml-2' />
                </motion.button>
              </Link>
              <a
                href='#features'
                className='px-8 py-4 text-gray-700 dark:text-gray-300 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors flex items-center'
              >
                <HiOutlineEye className='w-5 h-5 mr-2' />
                See All Features
              </a>
            </div>

            <div className='mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400'>
              <span className='flex items-center'>
                <HiOutlineCheck className='w-4 h-4 mr-1 text-green-500' />
                Free to start
              </span>
              <span className='flex items-center'>
                <HiOutlineCheck className='w-4 h-4 mr-1 text-green-500' />
                No credit card required
              </span>
              <span className='flex items-center'>
                <HiOutlineCheck className='w-4 h-4 mr-1 text-green-500' />
                GitHub integration
              </span>
              <span className='flex items-center'>
                <HiOutlineCheck className='w-4 h-4 mr-1 text-green-500' />
                Real-time collaboration
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Types */}
      <section className='py-12 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700'>
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-6 uppercase tracking-wider'>
            Works for any project type
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            {projectTypes.map((type) => (
              <div
                key={type.name}
                className='flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
              >
                <type.icon className='w-5 h-5 mr-2 text-blue-600 dark:text-blue-400' />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section id='features' className='py-20 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              Everything You Need to Ship
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              From AI planning to GitHub integration, we've built the complete
              toolkit for developers who ship.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4'>
                  <feature.icon className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 bg-white dark:bg-gray-800'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              How It Works
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>
              From idea to shipped product in four simple steps
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className='relative'
              >
                {index < steps.length - 1 && (
                  <div
                    className='hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500'
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
                )}

                <div className='text-center'>
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white mb-4'>
                    <step.icon className='w-7 h-7' />
                  </div>
                  <div className='text-xs font-bold text-blue-600 dark:text-blue-400 mb-2'>
                    STEP {step.number}
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    {step.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phase & Task Management */}
      <section className='py-20 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              Complete Project Control
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>
              Full flexibility to manage phases and tasks your way
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Phase Management */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm'
            >
              <div className='flex items-center mb-6'>
                <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4'>
                  <HiOutlineCollection className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Phase Management
                </h3>
              </div>
              <div className='space-y-3'>
                {phaseFeatures.map((item, idx) => (
                  <div key={idx} className='flex items-center text-sm'>
                    <item.icon className='w-5 h-5 mr-3 text-blue-600 dark:text-blue-400' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Task Management */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm'
            >
              <div className='flex items-center mb-6'>
                <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4'>
                  <HiOutlineClipboardCheck className='w-6 h-6 text-purple-600 dark:text-purple-400' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Task Management
                </h3>
              </div>
              <div className='space-y-3'>
                {taskFeatures.map((item, idx) => (
                  <div key={idx} className='flex items-center text-sm'>
                    <item.icon className='w-5 h-5 mr-3 text-purple-600 dark:text-purple-400' />
                    <span className='text-gray-700 dark:text-gray-300'>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GitHub Integration */}
      <section className='py-20 bg-gray-900 dark:bg-black'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='flex-1'>
              <div className='inline-flex items-center px-3 py-1 bg-gray-800 rounded-full text-gray-300 text-sm mb-4'>
                <HiOutlineCode className='w-4 h-4 mr-2' />
                GitHub Integration
              </div>
              <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
                Connect Your Code Repository
              </h2>
              <p className='text-lg text-gray-400 mb-8'>
                Link your GitHub repositories to bridge the gap between planning
                and code. Browse files, view activity, and compare your tasks
                with actual implementation.
              </p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {githubFeatures.map((feature, idx) => (
                  <div key={idx} className='flex items-start space-x-3'>
                    <div className='w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <feature.icon className='w-5 h-5 text-blue-400' />
                    </div>
                    <div>
                      <h4 className='font-medium text-white'>
                        {feature.title}
                      </h4>
                      <p className='text-sm text-gray-500'>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='flex-1'>
              <div className='bg-gray-800 rounded-xl p-6 border border-gray-700'>
                <div className='flex items-center space-x-2 mb-4'>
                  <div className='w-3 h-3 bg-red-500 rounded-full' />
                  <div className='w-3 h-3 bg-yellow-500 rounded-full' />
                  <div className='w-3 h-3 bg-green-500 rounded-full' />
                  <span className='text-gray-500 text-sm ml-2'>
                    Repository Connected
                  </span>
                </div>
                <div className='space-y-3 text-sm font-mono'>
                  <div className='flex items-center text-gray-400'>
                    <HiOutlineFolder className='w-4 h-4 mr-2 text-blue-400' />
                    <span className='text-blue-400'>src/</span>
                  </div>
                  <div className='flex items-center text-gray-400 ml-4'>
                    <HiOutlineFolder className='w-4 h-4 mr-2 text-blue-400' />
                    <span>components/</span>
                  </div>
                  <div className='flex items-center text-gray-400 ml-4'>
                    <HiOutlineFolder className='w-4 h-4 mr-2 text-blue-400' />
                    <span>pages/</span>
                  </div>
                  <div className='flex items-center text-gray-400 ml-4'>
                    <HiOutlineCode className='w-4 h-4 mr-2 text-green-400' />
                    <span>App.jsx</span>
                  </div>
                  <div className='flex items-center text-gray-400'>
                    <HiOutlineDocumentText className='w-4 h-4 mr-2 text-yellow-400' />
                    <span>package.json</span>
                  </div>
                  <div className='flex items-center text-gray-400'>
                    <HiOutlineDocumentText className='w-4 h-4 mr-2 text-gray-500' />
                    <span>README.md</span>
                  </div>
                </div>
                <div className='mt-4 pt-4 border-t border-gray-700'>
                  <div className='text-xs text-gray-500 mb-2'>
                    Recent Commits
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center text-sm'>
                      <span className='text-gray-600 font-mono mr-2'>
                        a3f2b1c
                      </span>
                      <span className='text-gray-400'>feat: add user auth</span>
                    </div>
                    <div className='flex items-center text-sm'>
                      <span className='text-gray-600 font-mono mr-2'>
                        b7e4d2a
                      </span>
                      <span className='text-gray-400'>fix: navigation bug</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRD Feature Highlight */}
      <section className='py-20 bg-gradient-to-br from-blue-600 to-purple-600'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='flex-1 text-white'>
              <div className='inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-white text-sm mb-4'>
                <HiOutlineDocumentDuplicate className='w-4 h-4 mr-2' />
                Documentation
              </div>
              <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
                Generate PRDs for AI Coding Tools
              </h2>
              <p className='text-lg text-blue-100 mb-8'>
                Create two types of documents: Planning PRDs before you start
                coding (feed to Cursor, Claude, or ChatGPT), and Documentation
                PRDs after completion for handoff and reference.
              </p>
              <ul className='space-y-3'>
                {[
                  'Planning PRD: Technical specs before coding',
                  'Documentation PRD: What was built and how',
                  'Copy directly into AI coding assistants',
                  'Includes phases, tasks, and notes',
                ].map((item) => (
                  <li key={item} className='flex items-center'>
                    <HiOutlineCheck className='w-5 h-5 mr-3 text-green-300' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex-1'>
              <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center space-x-2'>
                    <div className='w-3 h-3 bg-red-400 rounded-full' />
                    <div className='w-3 h-3 bg-yellow-400 rounded-full' />
                    <div className='w-3 h-3 bg-green-400 rounded-full' />
                  </div>
                  <span className='text-xs text-blue-200'>Planning PRD</span>
                </div>
                <div className='font-mono text-sm text-blue-100 space-y-2'>
                  <p className='text-white font-semibold'>
                    # Product Requirements Document
                  </p>
                  <p className='text-blue-200'>## 1. Project Overview</p>
                  <p className='text-blue-100/70'>
                    E-commerce platform with user auth...
                  </p>
                  <p className='text-blue-200'>## 2. Development Phases</p>
                  <p className='text-blue-100/70'>
                    ### Phase 1: Setup & Foundation
                  </p>
                  <p className='text-blue-100/70'>
                    - Initialize Next.js project
                  </p>
                  <p className='text-blue-100/70'>- Configure Tailwind CSS</p>
                  <p className='text-blue-200'>## 3. Technical Details</p>
                  <p className='text-blue-100/70'>
                    ### Stack: React, Node.js, MongoDB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Collaboration */}
      <section className='py-20 bg-white dark:bg-gray-800'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col lg:flex-row-reverse items-center gap-12'>
            <div className='flex-1'>
              <div className='inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-sm mb-4'>
                <HiOutlineRefresh className='w-4 h-4 mr-2' />
                Live Sync
              </div>
              <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                Real-Time Collaboration
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
                Work together with your team in real-time. Invite members via
                email or shareable invite codes. See task completions, phase
                updates, and progress changes instantly.
              </p>
              <ul className='space-y-3'>
                {[
                  'Invite team members by email',
                  'Share projects with invite codes',
                  'Real-time updates with Socket.io',
                  'Role-based access (owner, editor, viewer)',
                ].map((item) => (
                  <li
                    key={item}
                    className='flex items-center text-gray-700 dark:text-gray-300'
                  >
                    <HiOutlineCheck className='w-5 h-5 mr-3 text-green-500' />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='flex-1'>
              <div className='bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between mb-6'>
                  <h4 className='font-semibold text-gray-900 dark:text-white'>
                    Team Members
                  </h4>
                  <span className='text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full'>
                    3 Online
                  </span>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium mr-3'>
                        JD
                      </div>
                      <div>
                        <p className='font-medium text-gray-900 dark:text-white'>
                          John Doe
                        </p>
                        <p className='text-xs text-gray-500'>Owner</p>
                      </div>
                    </div>
                    <div className='w-2 h-2 bg-green-500 rounded-full' />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium mr-3'>
                        AS
                      </div>
                      <div>
                        <p className='font-medium text-gray-900 dark:text-white'>
                          Alice Smith
                        </p>
                        <p className='text-xs text-gray-500'>Editor</p>
                      </div>
                    </div>
                    <div className='w-2 h-2 bg-green-500 rounded-full' />
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium mr-3'>
                        BW
                      </div>
                      <div>
                        <p className='font-medium text-gray-900 dark:text-white'>
                          Bob Wilson
                        </p>
                        <p className='text-xs text-gray-500'>Editor</p>
                      </div>
                    </div>
                    <div className='w-2 h-2 bg-green-500 rounded-full' />
                  </div>
                </div>
                <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
                  <div className='flex items-center text-sm text-gray-500'>
                    <HiOutlineLink className='w-4 h-4 mr-2' />
                    Invite Code:{' '}
                    <span className='ml-2 font-mono text-blue-600 dark:text-blue-400'>
                      ABC123
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className='py-20 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              Built For Developers Who Ship
            </h2>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'
            >
              <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4'>
                <HiOutlineUserCircle className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Solo Developers
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Stay organized on side projects. Never lose track of where you
                left off or what's next. Get AI help when you're stuck on
                implementation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'
            >
              <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4'>
                <HiOutlineUsers className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Small Teams
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Collaborate in real-time. Everyone knows the plan, the progress,
                and their responsibilities. Perfect for startups and small dev
                teams.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'
            >
              <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4'>
                <HiOutlineAcademicCap className='w-6 h-6 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Learning Developers
              </h3>
              <p className='text-gray-600 dark:text-gray-400 text-sm'>
                Learn professional development workflows. Understand how real
                projects are structured and get AI guidance at every step.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='py-20 bg-white dark:bg-gray-800'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6'>
            <HiOutlineCube className='w-8 h-8 text-white' />
          </div>
          <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
            Ready to Build Something?
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
            Stop planning in your head. Start shipping with a clear roadmap, AI
            assistance, and team collaboration.
          </p>
          <Link to={isAuthenticated ? '/projects/new' : '/signup'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow inline-flex items-center'
            >
              {isAuthenticated ? 'Create New Project' : 'Get Started Free'}
              <HiOutlineArrowRight className='w-5 h-5 ml-2' />
            </motion.button>
          </Link>
          <p className='mt-6 text-sm text-gray-500 dark:text-gray-400'>
            No credit card required. Start building in minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <HiOutlineLightningBolt className='w-5 h-5 text-white' />
              </div>
              <span className='font-bold text-gray-900 dark:text-white'>
                ProjectFlow
              </span>
            </div>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              © {new Date().getFullYear()} ProjectFlow. Built for developers who
              ship.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
