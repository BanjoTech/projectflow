// server/utils/phaseTemplates.js

const phaseTemplates = {
  'landing-page': [
    {
      id: 0,
      title: 'Project Clarity',
      description: 'Define project scope and requirements',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Define primary CTA and conversion goal [What action should users take?]',
          isComplete: false,
        },
        {
          title:
            'List all sections needed [Hero, Features, Testimonials, Pricing, FAQ, Footer]',
          isComplete: false,
        },
        {
          title: 'Identify target audience and their pain points',
          isComplete: false,
        },
        {
          title: 'Gather brand assets [Logo, colors, fonts, images]',
          isComplete: false,
        },
      ],
    },
    {
      id: 1,
      title: 'Design System Setup',
      description: 'Create design tokens and component library',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Set up Tailwind config with custom colors [Define primary, secondary, accent colors]',
          isComplete: false,
        },
        {
          title:
            'Configure typography scale [Font families, sizes, line heights]',
          isComplete: false,
        },
        { title: 'Create spacing and sizing tokens', isComplete: false },
        {
          title: 'Set up dark mode CSS variables [Use CSS custom properties]',
          isComplete: false,
        },
      ],
    },
    {
      id: 2,
      title: 'Project Structure',
      description: 'Set up project with proper folder organization',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Initialize project [Vite + React or Next.js]',
          isComplete: false,
        },
        {
          title:
            'Set up folder structure [components/, sections/, assets/, hooks/]',
          isComplete: false,
        },
        {
          title: 'Install dependencies [Tailwind, Framer Motion, React Icons]',
          isComplete: false,
        },
        { title: 'Configure ESLint and Prettier', isComplete: false },
        { title: 'Set up Git repository with .gitignore', isComplete: false },
      ],
    },
    {
      id: 3,
      title: 'Layout Components',
      description: 'Build reusable layout components',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create Navbar component [Logo, nav links, mobile hamburger menu, CTA button]',
          isComplete: false,
        },
        {
          title:
            'Implement mobile menu [Use useState for toggle, add slide animation]',
          isComplete: false,
        },
        {
          title:
            'Create Footer component [Links grid, social icons, copyright]',
          isComplete: false,
        },
        {
          title:
            'Build Container/Wrapper component [Max-width, padding, centered]',
          isComplete: false,
        },
        {
          title:
            'Add smooth scroll navigation [scrollIntoView with behavior: smooth]',
          isComplete: false,
        },
      ],
    },
    {
      id: 4,
      title: 'Hero Section',
      description: 'Build the above-the-fold section',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create Hero component [Headline, subheadline, CTA buttons]',
          isComplete: false,
        },
        {
          title:
            'Add hero image/illustration [Optimize with next/image or lazy loading]',
          isComplete: false,
        },
        {
          title:
            'Implement entrance animations [Framer Motion fade-up on mount]',
          isComplete: false,
        },
        {
          title: 'Make fully responsive [Stack vertically on mobile]',
          isComplete: false,
        },
        { title: 'Add gradient or pattern background', isComplete: false },
      ],
    },
    {
      id: 5,
      title: 'Content Sections',
      description: 'Build main content sections',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create Features section [Icon + title + description cards in grid]',
          isComplete: false,
        },
        {
          title:
            'Build Benefits/How it Works section [Numbered steps or timeline]',
          isComplete: false,
        },
        {
          title: 'Create Testimonials section [Cards with avatar, quote, name]',
          isComplete: false,
        },
        {
          title:
            'Build Pricing section if needed [Pricing cards with feature lists]',
          isComplete: false,
        },
        {
          title: 'Create FAQ section [Accordion with expand/collapse]',
          isComplete: false,
        },
        {
          title: 'Add scroll-triggered animations [Framer Motion whileInView]',
          isComplete: false,
        },
      ],
    },
    {
      id: 6,
      title: 'Forms & Interactivity',
      description: 'Add interactive elements',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create Contact/Signup form [Email input, validation, submit button]',
          isComplete: false,
        },
        {
          title:
            'Add form validation [Required fields, email format, error messages]',
          isComplete: false,
        },
        {
          title: 'Implement form submission [Connect to API or email service]',
          isComplete: false,
        },
        { title: 'Add loading and success states', isComplete: false },
        {
          title:
            'Create reusable Button component [Variants: primary, secondary, ghost]',
          isComplete: false,
        },
      ],
    },
    {
      id: 7,
      title: 'Responsive & Polish',
      description: 'Ensure mobile-first and add polish',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Test all breakpoints [Mobile 375px, Tablet 768px, Desktop 1024px+]',
          isComplete: false,
        },
        { title: 'Fix any responsive layout issues', isComplete: false },
        {
          title: 'Add hover states to all interactive elements',
          isComplete: false,
        },
        {
          title:
            'Implement dark mode toggle [ThemeProvider, localStorage persist]',
          isComplete: false,
        },
        {
          title:
            'Add micro-interactions [Button press, link hover, card hover]',
          isComplete: false,
        },
      ],
    },
    {
      id: 8,
      title: 'Performance & SEO',
      description: 'Optimize for speed and search engines',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Optimize images [WebP format, lazy loading, proper sizing]',
          isComplete: false,
        },
        {
          title:
            'Add meta tags [Title, description, Open Graph, Twitter cards]',
          isComplete: false,
        },
        {
          title: 'Add structured data [JSON-LD for rich snippets]',
          isComplete: false,
        },
        {
          title: 'Set up analytics [Google Analytics or Plausible]',
          isComplete: false,
        },
        { title: 'Test Core Web Vitals [LCP, FID, CLS]', isComplete: false },
        { title: 'Add favicon and app icons', isComplete: false },
      ],
    },
    {
      id: 9,
      title: 'Deploy & Launch',
      description: 'Deploy to production',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        { title: 'Build production bundle [npm run build]', isComplete: false },
        {
          title: 'Deploy to Vercel/Netlify [Connect GitHub repo]',
          isComplete: false,
        },
        {
          title: 'Configure custom domain [Add DNS records]',
          isComplete: false,
        },
        {
          title: 'Set up SSL certificate [Usually automatic]',
          isComplete: false,
        },
        { title: 'Test production site thoroughly', isComplete: false },
        { title: 'Submit sitemap to Google Search Console', isComplete: false },
      ],
    },
  ],

  fullstack: [
    {
      id: 0,
      title: 'Project Planning',
      description: 'Define requirements and architecture',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Write project requirements document [Features, user stories]',
          isComplete: false,
        },
        {
          title: 'Define database entities and relationships [ERD diagram]',
          isComplete: false,
        },
        {
          title: 'Plan API endpoints [REST or GraphQL, list all routes]',
          isComplete: false,
        },
        {
          title: 'Choose tech stack [Frontend, backend, database, hosting]',
          isComplete: false,
        },
        { title: 'Create wireframes for key pages', isComplete: false },
      ],
    },
    {
      id: 1,
      title: 'Backend Setup',
      description: 'Initialize backend project',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Initialize Node.js project [npm init, package.json]',
          isComplete: false,
        },
        {
          title: 'Set up Express server [Create index.js, basic routes]',
          isComplete: false,
        },
        {
          title: 'Configure environment variables [dotenv, .env file]',
          isComplete: false,
        },
        { title: 'Set up MongoDB/PostgreSQL connection', isComplete: false },
        {
          title:
            'Create folder structure [routes/, controllers/, models/, middleware/]',
          isComplete: false,
        },
        { title: 'Set up CORS for frontend requests', isComplete: false },
      ],
    },
    {
      id: 2,
      title: 'Database Models',
      description: 'Create database schemas',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create User model [name, email, password (hashed), timestamps]',
          isComplete: false,
        },
        {
          title: 'Create core data models based on requirements',
          isComplete: false,
        },
        {
          title: 'Add model validations [required, unique, enum, minlength]',
          isComplete: false,
        },
        {
          title: 'Set up model relationships [references, populate]',
          isComplete: false,
        },
        {
          title: 'Create indexes for frequently queried fields',
          isComplete: false,
        },
      ],
    },
    {
      id: 3,
      title: 'Authentication',
      description: 'Implement user auth system',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create auth routes [/signup, /login, /logout, /me]',
          isComplete: false,
        },
        {
          title: 'Implement password hashing [bcryptjs with salt rounds]',
          isComplete: false,
        },
        {
          title: 'Create JWT token generation and verification',
          isComplete: false,
        },
        {
          title:
            'Build auth middleware [Protect routes, extract user from token]',
          isComplete: false,
        },
        {
          title: 'Add password reset functionality [Email token flow]',
          isComplete: false,
        },
      ],
    },
    {
      id: 4,
      title: 'API Endpoints',
      description: 'Build REST API routes',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create CRUD routes for each resource [GET, POST, PUT, DELETE]',
          isComplete: false,
        },
        {
          title: 'Add input validation [express-validator or Joi]',
          isComplete: false,
        },
        { title: 'Implement error handling middleware', isComplete: false },
        {
          title: 'Add pagination for list endpoints [limit, skip, total count]',
          isComplete: false,
        },
        { title: 'Implement search and filtering', isComplete: false },
        {
          title: 'Test all endpoints with Postman/Thunder Client',
          isComplete: false,
        },
      ],
    },
    {
      id: 5,
      title: 'Frontend Setup',
      description: 'Initialize React frontend',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create React app [Vite: npm create vite@latest]',
          isComplete: false,
        },
        {
          title: 'Set up Tailwind CSS [Install, configure, add to CSS]',
          isComplete: false,
        },
        {
          title: 'Install dependencies [react-router-dom, axios, react-query]',
          isComplete: false,
        },
        {
          title:
            'Create folder structure [components/, pages/, hooks/, services/]',
          isComplete: false,
        },
        { title: 'Set up React Router with routes', isComplete: false },
        { title: 'Create API service with axios instance', isComplete: false },
      ],
    },
    {
      id: 6,
      title: 'Frontend Auth',
      description: 'Implement auth UI and state',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create AuthContext for global auth state',
          isComplete: false,
        },
        { title: 'Build Login page with form validation', isComplete: false },
        { title: 'Build Signup page with form validation', isComplete: false },
        { title: 'Create ProtectedRoute component', isComplete: false },
        { title: 'Implement token storage and auto-login', isComplete: false },
        { title: 'Add logout functionality', isComplete: false },
      ],
    },
    {
      id: 7,
      title: 'Frontend Features',
      description: 'Build core UI features',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create reusable UI components [Button, Input, Card, Modal]',
          isComplete: false,
        },
        { title: 'Build main dashboard/home page', isComplete: false },
        { title: 'Create list views with data fetching', isComplete: false },
        { title: 'Build create/edit forms for resources', isComplete: false },
        { title: 'Implement loading states and skeletons', isComplete: false },
        { title: 'Add error handling and error boundaries', isComplete: false },
      ],
    },
    {
      id: 8,
      title: 'Polish & Testing',
      description: 'Finalize and test',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        { title: 'Add responsive design for all pages', isComplete: false },
        { title: 'Implement dark mode', isComplete: false },
        { title: 'Add toast notifications for actions', isComplete: false },
        { title: 'Write unit tests for critical functions', isComplete: false },
        { title: 'Test all user flows end-to-end', isComplete: false },
        { title: 'Fix bugs and edge cases', isComplete: false },
      ],
    },
    {
      id: 9,
      title: 'Deploy',
      description: 'Deploy to production',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Set up production database [MongoDB Atlas / Supabase]',
          isComplete: false,
        },
        {
          title: 'Deploy backend [Railway, Render, or Heroku]',
          isComplete: false,
        },
        { title: 'Deploy frontend [Vercel or Netlify]', isComplete: false },
        {
          title: 'Configure environment variables in production',
          isComplete: false,
        },
        { title: 'Set up custom domain and SSL', isComplete: false },
        { title: 'Test production deployment thoroughly', isComplete: false },
      ],
    },
  ],

  portfolio: [
    {
      id: 0,
      title: 'Content Planning',
      description: 'Plan portfolio content and structure',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Write compelling bio/about section [Who you are, what you do, your value]',
          isComplete: false,
        },
        { title: 'Select 4-6 best projects to showcase', isComplete: false },
        {
          title:
            'Write case study for each project [Problem, solution, tech, outcome]',
          isComplete: false,
        },
        { title: 'List skills with proficiency levels', isComplete: false },
        {
          title: 'Prepare professional photo and resume PDF',
          isComplete: false,
        },
      ],
    },
    {
      id: 1,
      title: 'Design Planning',
      description: 'Plan visual design',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Choose color palette [Primary, accent, neutrals]',
          isComplete: false,
        },
        {
          title: 'Select fonts [Heading font, body font from Google Fonts]',
          isComplete: false,
        },
        {
          title: 'Create moodboard or gather design inspiration',
          isComplete: false,
        },
        {
          title:
            'Sketch layout for each section [Hero, About, Projects, Contact]',
          isComplete: false,
        },
        { title: 'Plan animations and micro-interactions', isComplete: false },
      ],
    },
    {
      id: 2,
      title: 'Project Setup',
      description: 'Initialize and configure project',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        { title: 'Create Next.js or React + Vite project', isComplete: false },
        { title: 'Set up Tailwind CSS with custom config', isComplete: false },
        { title: 'Install Framer Motion for animations', isComplete: false },
        { title: 'Set up project folder structure', isComplete: false },
        { title: 'Configure dark mode support', isComplete: false },
      ],
    },
    {
      id: 3,
      title: 'Layout & Navigation',
      description: 'Build core layout',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create Navbar [Logo, nav links, theme toggle, resume button]',
          isComplete: false,
        },
        { title: 'Implement smooth scroll navigation', isComplete: false },
        { title: 'Build mobile hamburger menu', isComplete: false },
        {
          title: 'Create Footer [Social links, copyright, back to top]',
          isComplete: false,
        },
        { title: 'Add active section highlighting in nav', isComplete: false },
      ],
    },
    {
      id: 4,
      title: 'Hero Section',
      description: 'Build impressive hero',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create Hero with animated greeting [Typewriter or fade effect]',
          isComplete: false,
        },
        { title: 'Add role/title with rotation animation', isComplete: false },
        {
          title: 'Include CTA buttons [View Work, Contact Me]',
          isComplete: false,
        },
        { title: 'Add social links with hover effects', isComplete: false },
        {
          title: 'Consider adding 3D element or particle background',
          isComplete: false,
        },
      ],
    },
    {
      id: 5,
      title: 'About & Skills',
      description: 'Build about section',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create About section [Photo, bio, personal story]',
          isComplete: false,
        },
        {
          title: 'Build Skills grid [Icons with labels and progress bars]',
          isComplete: false,
        },
        { title: 'Add experience timeline if applicable', isComplete: false },
        { title: 'Include download resume button', isComplete: false },
        {
          title: 'Add scroll animations with Framer Motion',
          isComplete: false,
        },
      ],
    },
    {
      id: 6,
      title: 'Projects Section',
      description: 'Showcase your work',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create ProjectCard component [Image, title, description, tech, links]',
          isComplete: false,
        },
        {
          title: 'Build projects grid with filter by category',
          isComplete: false,
        },
        {
          title: 'Add hover effects [Image zoom, overlay with links]',
          isComplete: false,
        },
        { title: 'Create project detail modal or page', isComplete: false },
        { title: 'Add GitHub and live demo links', isComplete: false },
      ],
    },
    {
      id: 7,
      title: 'Contact Section',
      description: 'Build contact form',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create contact form [Name, email, message fields]',
          isComplete: false,
        },
        { title: 'Add form validation and error states', isComplete: false },
        {
          title: 'Connect to email service [EmailJS, Formspree, or custom API]',
          isComplete: false,
        },
        { title: 'Add success/error toast notifications', isComplete: false },
        {
          title:
            'Include alternative contact methods [Email, LinkedIn, Twitter]',
          isComplete: false,
        },
      ],
    },
    {
      id: 8,
      title: 'Polish & Optimize',
      description: 'Final touches',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        { title: 'Test all responsive breakpoints', isComplete: false },
        {
          title: 'Optimize all images [WebP, proper sizes]',
          isComplete: false,
        },
        { title: 'Add page transitions between sections', isComplete: false },
        {
          title: 'Implement dark/light mode toggle with persistence',
          isComplete: false,
        },
        { title: 'Add meta tags and Open Graph images', isComplete: false },
        {
          title: 'Test accessibility [Keyboard nav, screen readers, contrast]',
          isComplete: false,
        },
      ],
    },
    {
      id: 9,
      title: 'Deploy',
      description: 'Go live',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Deploy to Vercel [Connect GitHub, auto-deploy]',
          isComplete: false,
        },
        {
          title: 'Set up custom domain [yourname.dev or similar]',
          isComplete: false,
        },
        {
          title: 'Configure analytics [Vercel Analytics or Plausible]',
          isComplete: false,
        },
        { title: 'Test live site on multiple devices', isComplete: false },
        {
          title: 'Share on social media and update LinkedIn',
          isComplete: false,
        },
      ],
    },
  ],

  // Add simplified versions for other types
  spa: [],
  saas: [],
  ecommerce: [],
  'mobile-app': [],
  api: [],
  custom: [],
};

// Fill empty templates with fullstack template as fallback
['spa', 'saas', 'ecommerce', 'mobile-app', 'api', 'custom'].forEach((type) => {
  if (phaseTemplates[type].length === 0) {
    phaseTemplates[type] = JSON.parse(
      JSON.stringify(phaseTemplates['fullstack'])
    );
  }
});

function getPhaseTemplate(projectType) {
  const template = phaseTemplates[projectType];

  if (!template || template.length === 0) {
    return JSON.parse(JSON.stringify(phaseTemplates['fullstack']));
  }

  return JSON.parse(JSON.stringify(template));
}

module.exports = { phaseTemplates, getPhaseTemplate };
