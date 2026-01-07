// server/services/aiService.js

const Groq = require('groq-sdk');

let groqClient = null;

function getGroqClient() {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured.');
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

function getCurrentYear() {
  return new Date().getFullYear();
}

const AI_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'mixtral-8x7b-32768',
  'gemma2-9b-it',
];

async function callGroqWithFallback(messages, maxTokens = 4000) {
  const groq = getGroqClient();

  for (const model of AI_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        messages,
        model,
        temperature: 0.7,
        max_tokens: maxTokens,
      });
      return completion;
    } catch (error) {
      if (
        error.status === 400 &&
        error.error?.error?.code === 'model_decommissioned'
      ) {
        console.log(`Model ${model} is decommissioned, trying next...`);
        continue;
      }
      throw error;
    }
  }

  throw new Error('All AI models are unavailable.');
}

// ═══════════════════════════════════════════════════════════════
// Generate Comprehensive Dynamic Phases
// ═══════════════════════════════════════════════════════════════
async function generateDynamicPhases(
  projectName,
  projectDescription,
  projectType
) {
  const currentYear = getCurrentYear();

  const prompt = `You are a SENIOR SOFTWARE DEVELOPMENT LEAD creating a complete project development plan.

PROJECT DETAILS:
- Name: ${projectName}
- Type: ${projectType}
- Description: ${projectDescription || 'No description provided'}
- Year: ${currentYear}

Create a COMPREHENSIVE development plan that covers the ENTIRE software development lifecycle. This should be what a professional team would follow from idea to launch.

MANDATORY PHASES TO INCLUDE (adapt based on project type):

1. **Discovery & Planning** - Research, requirements gathering, competitor analysis, defining scope
2. **UI/UX Design** - Wireframes, mockups, design system, user flows, prototyping
3. **Architecture & Technical Planning** - Tech stack decisions, system design, database schema, API design
4. **Project Setup** - Initialize project, folder structure, dependencies, dev environment, version control
5. **Core Development** - Main features implementation (split into logical sub-phases if complex)
6. **Integration & APIs** - Third-party integrations, API connections, external services
7. **Testing & QA** - Unit tests, integration tests, user testing, bug fixes
8. **Performance & Optimization** - Speed optimization, SEO, accessibility, security review
9. **Deployment & Launch** - Production deployment, domain setup, monitoring, go-live checklist
10. **Post-Launch** - Analytics setup, feedback collection, documentation, maintenance plan

PHASE GENERATION RULES:
1. Generate between 6-12 phases based on project complexity
2. Simpler projects (landing page, portfolio): 6-8 phases
3. Complex projects (SaaS, e-commerce, Web3): 10-12 phases
4. Each phase should have 4-8 specific, actionable tasks
5. Tasks must be concrete, not vague (e.g., "Create Navbar component with mobile hamburger menu" NOT "Build navigation")
6. Include implementation hints in brackets [like this]
7. Order phases logically - you can't code before you design!

PROJECT-SPECIFIC CONSIDERATIONS:
- For e-commerce: Include product management, cart, checkout, payment integration phases
- For SaaS: Include auth system, subscription/billing, user dashboard phases
- For Web3: Include smart contract development, wallet integration, testnet phases
- For mobile: Include platform-specific setup, navigation, app store submission
- For landing pages: Focus more on design, content, animations, conversion optimization
- For portfolios: Include content curation, project showcases, contact forms
- For animated sites: Include animation planning, scroll effects, performance phases

TASK FORMAT:
Each task should follow this format:
"[Action verb] [specific thing] [implementation hints in brackets]"

Examples:
- "Create responsive navigation bar [Use flexbox, hamburger menu for mobile, sticky positioning]"
- "Design product card component in Figma [Include image, title, price, add-to-cart button, hover states]"
- "Set up MongoDB database schema [Users, Products, Orders collections with proper relationships]"
- "Implement user authentication flow [JWT tokens, bcrypt password hashing, protected routes]"
- "Write unit tests for checkout process [Jest, test cart calculations, payment validation]"
- "Optimize images for web [Convert to WebP, lazy loading, responsive srcset]"

Return ONLY valid JSON in this exact format:
{
  "phases": [
    {
      "id": 0,
      "title": "Phase Title",
      "description": "Brief description of what this phase accomplishes",
      "subTasks": [
        {"title": "Specific task [Implementation hints]", "isComplete": false, "description": ""}
      ]
    }
  ],
  "estimatedDuration": "X weeks",
  "complexity": "low|medium|high"
}`;

  try {
    const completion = await callGroqWithFallback(
      [
        {
          role: 'system',
          content: `You are a senior software development lead with 15+ years of experience. You create comprehensive, professional development plans that cover the ENTIRE lifecycle: research, design, development, testing, and deployment. Always return valid JSON. Be specific and actionable. Use ${currentYear} best practices.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      5000
    );

    const responseText = completion.choices[0]?.message?.content;

    // Clean and parse JSON
    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Try to extract JSON if there's extra text
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedResponse);

    // Validate and ensure proper structure
    const phases = parsed.phases.map((phase, index) => ({
      id: index,
      title: phase.title,
      description: phase.description || '',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: (phase.subTasks || []).map((task) => ({
        title: task.title,
        isComplete: false,
        description: '', // User will fill this with their solution
      })),
    }));

    return {
      phases,
      metadata: {
        estimatedDuration: parsed.estimatedDuration || 'Unknown',
        complexity: parsed.complexity || 'medium',
      },
    };
  } catch (error) {
    console.error('AI phase generation error:', error);
    // Return a fallback if AI fails
    return getFallbackPhases(projectType);
  }
}

// Fallback phases if AI fails
function getFallbackPhases(projectType) {
  const phases = [
    {
      id: 0,
      title: 'Discovery & Planning',
      description: 'Research and define project requirements',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Define project goals and target audience',
          isComplete: false,
          description: '',
        },
        {
          title:
            'List all features and prioritize them [Must-have, Should-have, Nice-to-have]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Research competitors and gather inspiration',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create user stories for main features',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 1,
      title: 'UI/UX Design',
      description: 'Design the user interface and experience',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create wireframes for all pages [Use Figma or pen & paper]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Design high-fidelity mockups [Colors, typography, spacing]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Define design system [Color palette, fonts, components]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create mobile responsive designs',
          isComplete: false,
          description: '',
        },
        {
          title: 'Get feedback and iterate on designs',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 2,
      title: 'Technical Architecture',
      description: 'Plan the technical implementation',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Choose tech stack [Frontend, backend, database]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Design database schema [Tables/collections, relationships]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Plan API endpoints [REST routes, request/response format]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Define folder structure and coding conventions',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 3,
      title: 'Project Setup',
      description: 'Initialize the development environment',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Initialize frontend project [Vite, Next.js, or CRA]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Initialize backend project [Express, Node.js setup]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Set up version control [Git repository, .gitignore]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Configure development tools [ESLint, Prettier, Tailwind]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Set up environment variables [.env files]',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 4,
      title: 'Frontend Development',
      description: 'Build the user interface',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Create layout components [Navbar, Footer, Sidebar]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Build reusable UI components [Button, Input, Card, Modal]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement page routes and navigation',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add responsive styling for all breakpoints',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement dark mode support',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 5,
      title: 'Backend Development',
      description: 'Build the server and database',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Set up database and create models/schemas',
          isComplete: false,
          description: '',
        },
        {
          title: 'Create API routes and controllers',
          isComplete: false,
          description: '',
        },
        {
          title: 'Implement authentication [JWT, sessions]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add input validation and error handling',
          isComplete: false,
          description: '',
        },
        {
          title: 'Connect frontend to backend APIs',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 6,
      title: 'Testing & QA',
      description: 'Test and fix bugs',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Test all user flows manually',
          isComplete: false,
          description: '',
        },
        {
          title: 'Test responsive design on different devices',
          isComplete: false,
          description: '',
        },
        {
          title: 'Test in different browsers [Chrome, Firefox, Safari]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Fix all discovered bugs',
          isComplete: false,
          description: '',
        },
        {
          title: 'Write unit tests for critical functions',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 7,
      title: 'Optimization',
      description: 'Improve performance and SEO',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Optimize images [WebP, compression, lazy loading]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Add SEO meta tags and Open Graph',
          isComplete: false,
          description: '',
        },
        {
          title: 'Improve page load speed [Lighthouse audit]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Ensure accessibility compliance',
          isComplete: false,
          description: '',
        },
      ],
    },
    {
      id: 8,
      title: 'Deployment',
      description: 'Launch to production',
      isComplete: false,
      completedAt: null,
      notes: '',
      subTasks: [
        {
          title: 'Set up production database',
          isComplete: false,
          description: '',
        },
        {
          title: 'Deploy backend [Railway, Render, or Heroku]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Deploy frontend [Vercel or Netlify]',
          isComplete: false,
          description: '',
        },
        {
          title: 'Configure custom domain and SSL',
          isComplete: false,
          description: '',
        },
        {
          title: 'Set up monitoring and error tracking',
          isComplete: false,
          description: '',
        },
        {
          title: 'Final production testing',
          isComplete: false,
          description: '',
        },
      ],
    },
  ];

  return {
    phases,
    metadata: {
      estimatedDuration: '4-8 weeks',
      complexity: 'medium',
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// Generate Planning PRD (Before Development)
// ═══════════════════════════════════════════════════════════════
async function generatePlanningPRD(project) {
  const currentYear = getCurrentYear();

  const phaseSummary = project.phases
    .map((phase, idx) => {
      const tasks = phase.subTasks.map((t) => `    - ${t.title}`).join('\n');
      return `Phase ${idx}: ${phase.title}\n  Description: ${phase.description}\n  Tasks:\n${tasks}`;
    })
    .join('\n\n');

  const prompt = `You are a SENIOR PRODUCT MANAGER creating a Product Requirements Document (PRD) for a software project that is about to begin development.

PROJECT DETAILS:
- Name: ${project.name}
- Type: ${project.type}
- Description: ${project.description || 'No description provided'}
- Number of Phases: ${project.phases.length}

DEVELOPMENT PLAN:
${phaseSummary}

Generate a comprehensive PRD that will guide the development team. This is a PLANNING document created BEFORE development starts.

Use proper markdown formatting. Make it specific to this project - not generic. Extract features from the description and phases to create detailed requirements.

Include:
1. Executive Summary
2. Problem Statement & Solution
3. Target Users (create specific personas)
4. Detailed Feature Requirements (with user stories and acceptance criteria)
5. Technical Specifications (recommend ${currentYear} best practices)
6. UI/UX Requirements
7. API Specifications (if applicable)
8. Database Design (if applicable)
9. Security Requirements
10. Performance Requirements
11. Timeline & Milestones
12. Success Metrics

Make this PRD professional and ready to hand to a developer or AI coding assistant.`;

  try {
    const completion = await callGroqWithFallback(
      [
        {
          role: 'system',
          content: `You are a senior product manager creating a detailed PRD. Write professionally and specifically. This PRD should be comprehensive enough that a developer can build the entire project from it.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      6000
    );

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('Planning PRD generation error:', error);
    throw new Error('Failed to generate PRD: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// Generate Documentation PRD (After Development)
// ═══════════════════════════════════════════════════════════════
async function generateDocumentationPRD(project) {
  const currentYear = getCurrentYear();

  const completedPhases = project.phases.filter((p) => p.isComplete);
  const allTasks = project.phases.flatMap((phase) =>
    phase.subTasks.map((task) => ({
      phase: phase.title,
      task: task.title,
      description: task.description || '', // User's solution/notes for this task
      completed: task.isComplete,
    }))
  );

  const completedTasks = allTasks.filter((t) => t.completed);

  // Build detailed phase info including user's task descriptions
  const phaseDetails = project.phases
    .map((phase) => {
      const tasks = phase.subTasks
        .map((t) => {
          let taskInfo = `  - [${t.isComplete ? 'x' : ' '}] ${t.title}`;
          if (t.description) {
            taskInfo += `\n      Implementation Notes: ${t.description}`;
          }
          return taskInfo;
        })
        .join('\n');
      return `### ${phase.title} ${phase.isComplete ? '✅' : '🔄'}\n${
        phase.description
      }\n\nTasks:\n${tasks}\n\nPhase Notes: ${phase.notes || 'None'}`;
    })
    .join('\n\n');

  const prompt = `You are a SENIOR TECHNICAL WRITER creating documentation for a software project.

PROJECT DETAILS:
- Name: ${project.name}
- Type: ${project.type}
- Description: ${project.description || 'No description provided'}
- Progress: ${project.progress}%
- Total Phases: ${project.phases.length}
- Completed Phases: ${completedPhases.length}
- Total Tasks: ${allTasks.length}
- Completed Tasks: ${completedTasks.length}

PHASE BREAKDOWN WITH IMPLEMENTATION NOTES:
${phaseDetails}

Generate comprehensive PROJECT DOCUMENTATION based on what was built. USE THE IMPLEMENTATION NOTES provided by the developer to understand how things were actually built.

This documentation should:
1. Describe what was built and how it works
2. Include technical details from the implementation notes
3. Serve as a reference for future developers
4. Document the architecture and key decisions
5. Include setup and deployment instructions

Use proper markdown formatting.`;

  try {
    const completion = await callGroqWithFallback(
      [
        {
          role: 'system',
          content: `You are a senior technical writer creating comprehensive project documentation. Focus on what was actually implemented based on the tasks and implementation notes provided.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      6000
    );

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('Documentation PRD generation error:', error);
    throw new Error('Failed to generate documentation: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// Suggest subtasks for a phase
// ═══════════════════════════════════════════════════════════════
async function suggestSubtasks(
  projectName,
  projectDescription,
  phaseTitle,
  existingSubtasks
) {
  const currentYear = getCurrentYear();

  const existingList = existingSubtasks.map((st) => `- ${st.title}`).join('\n');

  const prompt = `You are a SENIOR SOFTWARE DEVELOPER helping plan tasks for a project phase.

Project: ${projectName}
Description: ${projectDescription}
Current Phase: ${phaseTitle}

Existing tasks:
${existingList || '(none yet)'}

Generate 5-8 specific, actionable tasks for this phase. 

RULES:
1. Tasks must be specific and technical (not vague)
2. Include HOW to implement in brackets [like this]
3. Each task should take 30 mins to 4 hours
4. Follow ${currentYear} best practices
5. Don't duplicate existing tasks

Return ONLY valid JSON:
{
  "suggestions": [
    {"title": "Task description [Implementation hints]", "isComplete": false, "description": ""}
  ]
}`;

  try {
    const completion = await callGroqWithFallback(
      [
        {
          role: 'system',
          content: `You are a senior developer. Return only valid JSON. Generate specific, actionable tasks.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      2000
    );

    const responseText = completion.choices[0]?.message?.content;

    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanedResponse);
    return parsed.suggestions;
  } catch (error) {
    console.error('AI suggestion error:', error);
    throw new Error('Failed to generate suggestions: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════════════
// Context-aware AI Chat
// ═══════════════════════════════════════════════════════════════
async function chatWithAI(
  projectName,
  projectDescription,
  projectType,
  chatHistory,
  userMessage,
  currentPhase = null
) {
  const currentYear = getCurrentYear();

  const phaseContext = currentPhase
    ? `\n\nCurrently working on: Phase ${currentPhase.id} - ${
        currentPhase.title
      }\nPhase description: ${currentPhase.description}\nCompleted: ${
        currentPhase.subTasks?.filter((t) => t.isComplete).length || 0
      }/${currentPhase.subTasks?.length || 0} tasks`
    : '';

  const systemPrompt = `You are a SENIOR SOFTWARE DEVELOPER assistant helping build a ${projectType} project called "${projectName}".

Project description: ${projectDescription}${phaseContext}

Provide specific, actionable advice with code examples when relevant. Use ${currentYear} best practices.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.slice(-20).map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  try {
    const completion = await callGroqWithFallback(messages, 3000);
    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('AI chat error:', error);
    throw new Error('Failed to get AI response: ' + error.message);
  }
}

module.exports = {
  generateDynamicPhases,
  generatePlanningPRD,
  generateDocumentationPRD,
  suggestSubtasks,
  chatWithAI,
  getFallbackPhases,
};
