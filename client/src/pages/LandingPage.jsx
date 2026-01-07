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
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineSparkles,
    title: 'Smart Project Planning',
    description:
      'Describe your project and get a complete development roadmap instantly. From UI design to deployment, every phase is mapped out.',
  },
  {
    icon: HiOutlineDocumentText,
    title: 'PRD Generation',
    description:
      'Generate professional Product Requirements Documents that you can feed directly to AI coding assistants like Cursor or Claude.',
  },
  {
    icon: HiOutlineClipboardCheck,
    title: 'Task Tracking',
    description:
      'Break down phases into actionable tasks. Add implementation notes that become part of your project documentation.',
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Real-Time Collaboration',
    description:
      'Invite team members and work together in real-time. See updates instantly as your team makes progress.',
  },
  {
    icon: HiOutlineCode,
    title: 'AI Development Assistant',
    description:
      'Stuck on a task? Get contextual help and code examples from the built-in AI assistant that understands your project.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Progress Tracking',
    description:
      "Visual progress indicators show exactly where you are. Know what's done, what's next, and what's blocking you.",
  },
];

const projectTypes = [
  { name: 'Landing Pages', icon: '🎯' },
  { name: 'Web3 & DApps', icon: '🔗' },
  { name: 'SaaS Products', icon: '💼' },
  { name: 'E-Commerce', icon: '🛒' },
  { name: 'Mobile Apps', icon: '📱' },
  { name: 'Animated Sites', icon: '✨' },
  { name: 'Full-Stack Apps', icon: '🚀' },
  { name: 'APIs & Backends', icon: '🔌' },
];

const steps = [
  {
    number: '01',
    title: 'Describe Your Project',
    description:
      'Enter your project name and describe what you want to build. The more detail, the better your roadmap.',
  },
  {
    number: '02',
    title: 'Get Your Development Plan',
    description:
      'Receive a complete phase-by-phase development plan covering design, development, testing, and deployment.',
  },
  {
    number: '03',
    title: 'Build & Track Progress',
    description:
      "Work through tasks, add implementation notes, and track your progress. Get AI help when you're stuck.",
  },
  {
    number: '04',
    title: 'Generate Documentation',
    description:
      'Export PRDs for AI coding tools or generate project documentation from your completed work.',
  },
];

function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800' />

        {/* Floating shapes */}
        <div className='absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl' />
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl' />

        <div className='relative max-w-6xl mx-auto px-4 py-20 sm:py-32'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'
          >
            {/* Badge */}
            <div className='inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6'>
              <HiOutlineLightningBolt className='w-4 h-4 mr-2' />
              Plan smarter, build faster
            </div>

            {/* Headline */}
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight'>
              Turn Your Ideas Into
              <span className='block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                Structured Development Plans
              </span>
            </h1>

            {/* Subheadline */}
            <p className='mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto'>
              Stop staring at a blank screen. Describe your project and get a
              complete development roadmap with phases, tasks, and AI assistance
              to guide you from idea to launch.
            </p>

            {/* CTA Buttons */}
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
                href='#how-it-works'
                className='px-8 py-4 text-gray-700 dark:text-gray-300 font-semibold hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                See How It Works
              </a>
            </div>

            {/* Trust indicators */}
            <p className='mt-8 text-sm text-gray-500 dark:text-gray-400'>
              ✓ Free to start &nbsp; ✓ No credit card required &nbsp; ✓ Works
              with any project type
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Types */}
      <section className='py-12 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700'>
        <div className='max-w-6xl mx-auto px-4'>
          <p className='text-center text-sm text-gray-500 dark:text-gray-400 mb-6'>
            WORKS FOR ANY PROJECT TYPE
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            {projectTypes.map((type) => (
              <div
                key={type.name}
                className='flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg'
              >
                <span className='text-xl mr-2'>{type.icon}</span>
                <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className='py-20 bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              Everything You Need to Ship
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              From planning to deployment, we've got you covered with tools that
              actually help you build.
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
                className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4'>
                  <feature.icon className='w-6 h-6 text-white' />
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id='how-it-works' className='py-20 bg-white dark:bg-gray-800'>
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
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className='hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500'
                    style={{ width: 'calc(100% - 2rem)' }}
                  />
                )}

                <div className='text-center'>
                  <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl text-white font-bold text-xl mb-4'>
                    {step.number}
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

      {/* PRD Feature Highlight */}
      <section className='py-20 bg-gradient-to-br from-blue-600 to-purple-600'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col lg:flex-row items-center gap-12'>
            <div className='flex-1 text-white'>
              <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
                Generate PRDs for AI Coding Tools
              </h2>
              <p className='text-lg text-blue-100 mb-8'>
                Create comprehensive Product Requirements Documents from your
                project plan. Copy and paste directly into Cursor, Claude, or
                any AI coding assistant to get better, more contextual code
                generation.
              </p>
              <ul className='space-y-3'>
                {[
                  'Complete technical specifications',
                  'User stories and acceptance criteria',
                  'Architecture recommendations',
                  'API and database design',
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
                <div className='flex items-center space-x-2 mb-4'>
                  <div className='w-3 h-3 bg-red-400 rounded-full' />
                  <div className='w-3 h-3 bg-yellow-400 rounded-full' />
                  <div className='w-3 h-3 bg-green-400 rounded-full' />
                </div>
                <div className='font-mono text-sm text-blue-100 space-y-2'>
                  <p className='text-white font-semibold'>
                    # Product Requirements Document
                  </p>
                  <p className='text-blue-200'>## 1. Executive Summary</p>
                  <p className='text-blue-100/70'>
                    A comprehensive e-commerce platform...
                  </p>
                  <p className='text-blue-200'>
                    ## 2. Technical Specifications
                  </p>
                  <p className='text-blue-100/70'>### Tech Stack</p>
                  <p className='text-blue-100/70'>
                    - Frontend: Next.js 14, Tailwind
                  </p>
                  <p className='text-blue-100/70'>
                    - Backend: Node.js, Express
                  </p>
                  <p className='text-blue-100/70'>- Database: PostgreSQL</p>
                  <p className='text-blue-200'>## 3. Features</p>
                  <p className='text-blue-100/70'>...</p>
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
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
              <div className='text-4xl mb-4'>🚀</div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Solo Developers
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Stay organized on side projects. Never lose track of where you
                left off or what's next.
              </p>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
              <div className='text-4xl mb-4'>👥</div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Small Teams
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Collaborate in real-time. Everyone knows the plan, the progress,
                and their responsibilities.
              </p>
            </div>
            <div className='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm'>
              <div className='text-4xl mb-4'>🎓</div>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                Learning Developers
              </h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Learn professional development workflows. Understand how real
                projects are structured from start to finish.
              </p>
            </div>
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
            Stop planning in your head. Start shipping with a clear roadmap.
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
