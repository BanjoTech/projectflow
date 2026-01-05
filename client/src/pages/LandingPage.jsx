// client/src/pages/LandingPage.jsx

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO'; // Added SEO import
import {
  HiOutlineLightningBolt,
  HiOutlineChip,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCode,
  HiOutlineTemplate,
  HiOutlineChatAlt2,
  HiOutlineShare,
} from 'react-icons/hi';

function LandingPage() {
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();

  const features = [
    {
      icon: HiOutlineTemplate,
      title: '10-Phase System',
      description:
        'Break any project into clear, developer-focused phases from planning to deployment.',
    },
    {
      icon: HiOutlineChip,
      title: 'AI-Powered Guidance',
      description: `Get intelligent task suggestions and implementation help using ${currentYear} best practices.`,
    },
    {
      icon: HiOutlineUserGroup,
      title: 'Real-Time Collaboration',
      description:
        'Work with your team in real-time. See updates instantly, get notified when tasks complete.',
    },
    {
      icon: HiOutlineDocumentText,
      title: 'Auto-Generate PRD',
      description:
        'Finish your project and export a professional PRD document. Perfect for handoffs.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Project',
      description: "Pick a project type and describe what you're building",
    },
    {
      number: '02',
      title: 'Follow Phases',
      description: 'Work through developer-focused phases and tasks',
    },
    {
      number: '03',
      title: 'Get AI Help',
      description: 'AI assists you at every step with implementation guidance',
    },
    {
      number: '04',
      title: 'Ship & Document',
      description: 'Complete your project and generate documentation',
    },
  ];

  const additionalFeatures = [
    {
      icon: HiOutlineCheckCircle,
      title: 'Track Progress',
      description: 'Visual progress tracking',
    },
    {
      icon: HiOutlineSparkles,
      title: 'Dark Mode',
      description: 'Easy on the eyes',
    },
    {
      icon: HiOutlineChatAlt2,
      title: 'AI Chat',
      description: 'Get guidance anytime',
    },
    {
      icon: HiOutlineShare,
      title: 'Easy Sharing',
      description: 'Invite via link or email',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'>
      {/* SEO Component Integration */}
      <SEO
        title='Ship Projects Faster with AI'
        description='AI-powered project management for developers. Break down projects into phases, get intelligent task suggestions, and auto-generate PRD documents.'
        url='https://projectflow.netlify.app'
      />

      {/* Hero Section */}
      <section className='relative overflow-hidden'>
        {/* Background Effects */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob' />
          <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000' />
          <div className='absolute top-40 left-1/2 w-80 h-80 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000' />
        </div>

        <div className='relative max-w-6xl mx-auto px-4 pt-20 pb-24 sm:pt-28 sm:pb-32'>
          <div className='text-center'>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-8'
            >
              <HiOutlineSparkles className='w-4 h-4' />
              <span>AI-powered project management for developers</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight'
            >
              Ship projects faster with
              <span className='block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2'>
                AI-guided workflows
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed'
            >
              Stop staring at blank todo lists. ProjectFlow breaks down your
              project into developer-focused phases and uses AI to guide you
              through implementation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'
            >
              {isAuthenticated ? (
                <Link
                  to='/dashboard'
                  className='group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                >
                  Go to Dashboard
                  <HiOutlineArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Link>
              ) : (
                <>
                  <Link
                    to='/signup'
                    className='group w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                  >
                    Start Building Free
                    <HiOutlineArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </Link>
                  <Link
                    to='/login'
                    className='w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all'
                  >
                    Sign In
                  </Link>
                </>
              )}
            </motion.div>

            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className='mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center'
            >
              <HiOutlineCheckCircle className='w-4 h-4 mr-1.5 text-green-500' />
              No credit card required • Free tier available
            </motion.p>
          </div>

          {/* Hero Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className='mt-16 relative'
          >
            <div className='relative mx-auto max-w-4xl'>
              {/* Browser Frame */}
              <div className='bg-gray-900 rounded-t-xl p-3 flex items-center space-x-2'>
                <div className='flex space-x-2'>
                  <div className='w-3 h-3 rounded-full bg-red-500' />
                  <div className='w-3 h-3 rounded-full bg-yellow-500' />
                  <div className='w-3 h-3 rounded-full bg-green-500' />
                </div>
                <div className='flex-1 bg-gray-800 rounded-lg px-4 py-1 text-sm text-gray-400 text-center'>
                  projectflow.app/dashboard
                </div>
              </div>

              {/* App Preview */}
              <div className='bg-gray-100 dark:bg-gray-800 rounded-b-xl p-6 shadow-2xl'>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                  {[
                    { name: 'E-Commerce App', progress: 75 },
                    { name: 'Portfolio v2', progress: 45 },
                    { name: 'SaaS Dashboard', progress: 20 },
                  ].map((project, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                      className='bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm'
                    >
                      <div className='flex items-center space-x-2 mb-3'>
                        <HiOutlineCode className='w-5 h-5 text-blue-500' />
                        <span className='font-medium text-gray-900 dark:text-white text-sm truncate'>
                          {project.name}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                          className='bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full'
                        />
                      </div>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
                        {project.progress}% complete
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className='absolute -left-4 top-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 hidden lg:flex items-center space-x-2'
            >
              <HiOutlineChip className='w-5 h-5 text-purple-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                AI Suggestion
              </span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className='absolute -right-4 top-1/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 hidden lg:flex items-center space-x-2'
            >
              <HiOutlineCheckCircle className='w-5 h-5 text-green-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Task Complete!
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              Built for developers who ship
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              Not another generic project manager. ProjectFlow understands how
              developers actually work.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className='bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow'
                >
                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4'>
                    <Icon className='w-6 h-6 text-white' />
                  </div>
                  <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className='py-20 bg-gray-50 dark:bg-gray-800'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
              How it works
            </h2>
            <p className='mt-4 text-lg text-gray-600 dark:text-gray-400'>
              From idea to shipped project in four simple steps
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className='text-center'
              >
                <div className='text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4'>
                  {step.number}
                </div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  {step.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className='py-16 bg-white dark:bg-gray-900'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {additionalFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className='text-center p-4'
                >
                  <div className='w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-3'>
                    <Icon className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <h4 className='font-medium text-gray-900 dark:text-white'>
                    {feature.title}
                  </h4>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-purple-600'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-white mb-6'>
            Ready to ship your next project?
          </h2>
          <p className='text-lg text-blue-100 mb-8 max-w-2xl mx-auto'>
            Join developers who use ProjectFlow to stay organized, get AI
            guidance, and actually finish their side projects.
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/signup'}
            className='inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg'
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
            <HiOutlineArrowRight className='ml-2 w-5 h-5' />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 bg-gray-900 text-gray-400'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                <HiOutlineLightningBolt className='w-5 h-5 text-white' />
              </div>
              <span className='text-xl font-bold text-white'>ProjectFlow</span>
            </div>
            <p className='text-sm'>
              © {currentYear} ProjectFlow. Built for developers, by developers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
