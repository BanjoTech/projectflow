// server/utils/phaseTemplates.js

const phaseTemplates = {
  // ═══════════════════════════════════════════════════════════════
  // WEB3 / BLOCKCHAIN TEMPLATE
  // ═══════════════════════════════════════════════════════════════
  web3: [
    {
      id: 0,
      title: 'Project Planning & Research',
      description: 'Define Web3 requirements and blockchain architecture',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Define smart contract requirements [List all on-chain vs off-chain data]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Choose blockchain network [Ethereum, Polygon, Solana, Base - consider gas fees and speed]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Plan token economics if applicable [Token utility, supply, distribution]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Research existing protocols to integrate [OpenZeppelin, Chainlink, etc.]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Set up development wallet [Create MetaMask wallet for testing, get testnet tokens]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 1,
      title: 'Smart Contract Development',
      description: 'Write and test smart contracts',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Set up Hardhat/Foundry development environment [npm install hardhat, configure networks]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Write main smart contract [Solidity 0.8+, use OpenZeppelin contracts]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement access control [Ownable, Roles, or custom modifiers]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add events for frontend tracking [Emit events for all state changes]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Write unit tests [100% coverage for critical functions using Chai]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Gas optimization [Use uint256, pack storage variables, minimize storage writes]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 2,
      title: 'Smart Contract Security',
      description: 'Audit and secure smart contracts',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Run Slither static analysis [slither . --print human-summary]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Check for common vulnerabilities [Reentrancy, overflow, access control]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement upgrade pattern if needed [UUPS or Transparent proxy]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add emergency pause functionality [Pausable from OpenZeppelin]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Document all functions with NatSpec comments',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 3,
      title: 'Testnet Deployment',
      description: 'Deploy and test on testnet',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Deploy to testnet [Sepolia, Mumbai, or relevant testnet]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Verify contract on block explorer [Etherscan/Polygonscan verification]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Test all functions with real transactions',
          isComplete: false,
          description: '',
        },
        {
          title: 'Generate and save ABI and contract addresses',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 4,
      title: 'Frontend Setup',
      description: 'Set up Web3 frontend with wallet connection',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Initialize React/Next.js project [Vite + React or Next.js 14]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Install Web3 dependencies [wagmi, viem, @rainbow-me/rainbowkit]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Configure RainbowKit/Web3Modal [Support MetaMask, WalletConnect, Coinbase]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Create wallet connection component [Connect button, address display, disconnect]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Set up chain switching [Handle wrong network, switch chain prompt]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 5,
      title: 'Smart Contract Integration',
      description: 'Connect frontend to smart contracts',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Import contract ABI and create hooks [useContractRead, useContractWrite]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement read functions [Display on-chain data with loading states]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement write functions [Transaction submission with confirmation]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add transaction status tracking [Pending, success, error states]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Handle transaction errors gracefully [User-friendly error messages]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Listen to contract events [Real-time updates via WebSocket]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 6,
      title: 'UI/UX Development',
      description: 'Build the user interface',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Design Web3-native UI [Dark theme, glassmorphism, gradients]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Build transaction confirmation modals [Show gas estimate, value, recipient]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Create loading states for blockchain operations [Skeleton loaders, spinners]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add ENS name resolution if on Ethereum [Display ENS instead of address]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement responsive design [Mobile wallet app support]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 7,
      title: 'Testing & QA',
      description: 'End-to-end testing',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Test with multiple wallets [MetaMask, Rainbow, Coinbase Wallet]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Test on mobile [WalletConnect on mobile browsers]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Test edge cases [Insufficient balance, rejected transactions, network issues]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Perform testnet user testing [Get feedback from real users]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 8,
      title: 'Mainnet Deployment',
      description: 'Deploy to production',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Final security review [Double-check all access controls]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Deploy smart contracts to mainnet [Use hardware wallet for deployment]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Verify contracts on mainnet explorer',
          isComplete: false,
          description: '',
        },
        {
          title: 'Update frontend with mainnet addresses',
          isComplete: false,
          description: '',
        },
        {
          title: 'Deploy frontend [Vercel/Netlify with environment variables]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Set up monitoring [Tenderly, Alchemy alerts]',
          isComplete: false,
          description: '',
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // ANIMATED WEBSITE TEMPLATE
  // ═══════════════════════════════════════════════════════════════
  animated: [
    {
      id: 0,
      title: 'Animation Planning',
      description: 'Plan animations and interactions',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create animation storyboard [Sketch key animations and transitions]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Define animation triggers [Scroll, hover, click, page load]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Choose animation library [GSAP for complex, Framer Motion for React]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Plan performance budget [Target 60fps, identify heavy animations]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Gather inspiration [Awwwards, Dribbble, collect reference animations]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 1,
      title: 'Project Setup',
      description: 'Initialize project with animation libraries',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create Next.js/React project [npm create vite@latest or npx create-next-app]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Install animation libraries [npm install gsap @gsap/react framer-motion]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Install scroll libraries [npm install @studio-freight/lenis for smooth scroll]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Set up Tailwind CSS with custom config',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Configure CSS for GPU acceleration [will-change, transform3d]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 2,
      title: 'Smooth Scroll & Base',
      description: 'Implement smooth scrolling foundation',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Set up Lenis smooth scroll [Initialize in layout, configure lerp]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create scroll progress indicator [Fixed progress bar at top]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement scroll velocity tracking [For parallax effects]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add scroll-to-section navigation [Smooth anchor links]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 3,
      title: 'Hero Section Animations',
      description: 'Build impressive hero with animations',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create text reveal animation [Split text, animate chars/words with GSAP]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add hero image/video parallax [Scale and translate on scroll]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement stagger animations [Elements appear sequentially]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add floating/morphing elements [Continuous subtle animations]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create scroll-triggered hero exit [Fade/scale out on scroll]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 4,
      title: 'Scroll-Triggered Animations',
      description: 'Animate elements on scroll',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Set up GSAP ScrollTrigger [Register plugin, create triggers]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Create fade-in-up animations [Reusable component with threshold]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement horizontal scroll section [Pin and scrub horizontal]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add parallax image effects [Different scroll speeds per layer]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Create text scramble/decode effect [Reveal text character by character]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Build progress-based animations [Scrub animations tied to scroll %]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 5,
      title: 'Page Transitions',
      description: 'Smooth transitions between pages',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create page transition wrapper [AnimatePresence with exit animations]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement slide/fade transitions [Configurable per route]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add loading state animation [Progress bar or custom loader]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Handle scroll position on navigation [Reset or maintain]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 6,
      title: 'Micro-interactions',
      description: 'Add delightful small animations',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create magnetic button effect [Button follows cursor slightly]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add hover state animations [Scale, color shift, underline reveal]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement custom cursor [Follow mouse with lag, change on hover]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Create link hover underline animation [Draw underline on hover]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add form input focus animations [Label float, border animate]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 7,
      title: 'Performance Optimization',
      description: 'Ensure 60fps animations',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Audit with Chrome DevTools Performance tab [Identify jank]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Use transform and opacity only [Avoid layout-triggering properties]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Implement will-change strategically [Add before animation, remove after]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Lazy load heavy animations [Only animate when in viewport]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add reduced-motion media query support [Respect user preferences]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Optimize images and videos [WebP, lazy loading, proper sizing]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 8,
      title: 'Polish & Deploy',
      description: 'Final touches and deployment',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Test on multiple devices and browsers [Safari, Firefox, mobile]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Fine-tune animation timing and easing [Custom eases for polish]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Add loading screen for initial load [Hide until fonts/assets ready]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Deploy to Vercel [Enable ISR if Next.js]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Test production performance [Lighthouse, WebPageTest]',
          isComplete: false,
          description: '',
        },
      ],
    },
  ],

  // ═══════════════════════════════════════════════════════════════
  // LANDING PAGE TEMPLATE (Enhanced)
  // ═══════════════════════════════════════════════════════════════
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
          description: '',
        },
        {
          title:
            'List all sections needed [Hero, Features, Testimonials, Pricing, FAQ, Footer]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Identify target audience and their pain points',
          isComplete: false,
          description: '',
        },
        {
          title: 'Gather brand assets [Logo, colors, fonts, images]',
          isComplete: false,
          description: '',
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
            'Set up Tailwind config with custom colors [Define primary, secondary, accent]',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Configure typography scale [Font families, sizes, line heights]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create spacing and sizing tokens',
          isComplete: false,
          description: '',
        },
        {
          title: 'Set up dark mode CSS variables',
          isComplete: false,
          description: '',
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
          description: '',
        },
        {
          title: 'Set up folder structure [components/, sections/, assets/]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Install dependencies [Tailwind, Framer Motion, React Icons]',
          isComplete: false,
          description: '',
        },
        { title: 'Set up Git repository', isComplete: false, description: '' },
      ],
    },
    {
      id: 3,
      title: 'Layout & Navigation',
      description: 'Build core layout components',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title:
            'Create Navbar [Logo, nav links, mobile hamburger, CTA button]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement mobile menu with animation',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create Footer [Links, social icons, copyright]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add smooth scroll navigation',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 4,
      title: 'Hero & Content Sections',
      description: 'Build main content sections',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create Hero [Headline, subheadline, CTA, image/illustration]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Build Features section [Icon + title + description cards]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create Social Proof section [Testimonials, logos, stats]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add Pricing section if needed',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create FAQ accordion section',
          isComplete: false,
          description: '',
        },
        {
          title: 'Build final CTA section',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 5,
      title: 'Forms & Interactivity',
      description: 'Add interactive elements',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create contact/signup form with validation',
          isComplete: false,
          description: '',
        },
        {
          title:
            'Connect form to backend or service [Formspree, Netlify Forms]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add success/error states',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement scroll animations [Fade in on scroll]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 6,
      title: 'Polish & Optimize',
      description: 'Final touches and optimization',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Test all responsive breakpoints',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement dark mode toggle',
          isComplete: false,
          description: '',
        },
        {
          title: 'Optimize images [WebP, lazy loading]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add meta tags and Open Graph',
          isComplete: false,
          description: '',
        },
        { title: 'Test Core Web Vitals', isComplete: false, description: '' },
      ],
    },
    {
      id: 7,
      title: 'Deploy',
      description: 'Go live',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Build and test production bundle',
          isComplete: false,
          description: '',
        },
        {
          title: 'Deploy to Vercel/Netlify',
          isComplete: false,
          description: '',
        },
        {
          title: 'Configure custom domain',
          isComplete: false,
          description: '',
        },
        { title: 'Set up analytics', isComplete: false, description: '' },
        {
          title: 'Submit to Google Search Console',
          isComplete: false,
          description: '',
        },
      ],
    },
  ],

  // Keep other templates but shortened for space
  fullstack: [], // Will use generateDynamicPhases
  portfolio: [],
  spa: [],
  saas: [],
  ecommerce: [],
  'mobile-app': [],
  api: [],
  custom: [],
};

// Fill empty templates with a minimal fallback
const minimalFallback = [
  {
    id: 0,
    title: 'Planning',
    description: 'Define requirements and scope',
    isComplete: false,
    completedAt: null,
    notes: '',
    subTasks: [
      {
        title: 'Define project requirements and goals',
        isComplete: false,
        description: '',
      },
      {
        title: 'Create technical specification',
        isComplete: false,
        description: '',
      },
    ],
  },
  {
    id: 1,
    title: 'Setup',
    description: 'Initialize project and tools',
    isComplete: false,
    completedAt: null,
    notes: '',
    subTasks: [
      {
        title: 'Set up development environment',
        isComplete: false,
        description: '',
      },
      {
        title: 'Initialize project with chosen tech stack',
        isComplete: false,
        description: '',
      },
    ],
  },
  {
    id: 2,
    title: 'Development',
    description: 'Build core features',
    isComplete: false,
    completedAt: null,
    notes: '',
    subTasks: [
      {
        title: 'Implement core functionality',
        isComplete: false,
        description: '',
      },
      { title: 'Build user interface', isComplete: false, description: '' },
    ],
  },
  {
    id: 3,
    title: 'Testing & Deploy',
    description: 'Test and launch',
    isComplete: false,
    completedAt: null,
    notes: '',
    subTasks: [
      { title: 'Test all features', isComplete: false, description: '' },
      { title: 'Deploy to production', isComplete: false, description: '' },
    ],
  },
];

// Fill empty templates
[
  'fullstack',
  'portfolio',
  'spa',
  'saas',
  'ecommerce',
  'mobile-app',
  'api',
  'custom',
].forEach((type) => {
  if (!phaseTemplates[type] || phaseTemplates[type].length === 0) {
    phaseTemplates[type] = JSON.parse(JSON.stringify(minimalFallback));
  }
});

function getPhaseTemplate(projectType) {
  const template = phaseTemplates[projectType];
  if (!template || template.length === 0) {
    return JSON.parse(JSON.stringify(minimalFallback));
  }
  return JSON.parse(JSON.stringify(template));
}

// Check if should use AI generation instead of template
function shouldUseAIGeneration(projectType, description) {
  // Use AI for types with minimal templates or when description is detailed
  const aiPreferredTypes = [
    'fullstack',
    'saas',
    'ecommerce',
    'mobile-app',
    'api',
    'custom',
    'spa',
    'portfolio',
  ];
  const hasDetailedDescription = description && description.length > 50;

  return aiPreferredTypes.includes(projectType) || hasDetailedDescription;
}

module.exports = {
  phaseTemplates,
  getPhaseTemplate,
  shouldUseAIGeneration,
};
