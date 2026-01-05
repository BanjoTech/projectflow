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

// Suggest developer-focused subtasks with HOW-TO details
async function suggestSubtasks(
  projectName,
  projectDescription,
  phaseTitle,
  existingSubtasks
) {
  const currentYear = getCurrentYear();

  const existingList = existingSubtasks.map((st) => `- ${st.title}`).join('\n');

  const prompt = `You are a SENIOR SOFTWARE DEVELOPER helping a developer build a project.

Project: ${projectName}
Description: ${projectDescription}
Current Phase: ${phaseTitle}

Existing tasks:
${existingList || '(none yet)'}

Generate 5-8 DEVELOPER-FOCUSED tasks for this phase. Each task should:
1. Be specific and technical (not vague like "design the layout")
2. Include HOW to accomplish it in brackets
3. Be actionable by a developer
4. Follow ${currentYear} best practices
5. NOT duplicate existing tasks

EXAMPLES of good developer tasks:
- "Create responsive Navbar component [Use flexbox, add mobile hamburger menu with useState toggle, implement sticky positioning]"
- "Set up API route for user authentication [Create /api/auth/login endpoint, use bcrypt for password hashing, return JWT token]"
- "Implement dark mode theme toggle [Use CSS variables for colors, create ThemeContext, persist preference to localStorage]"
- "Create Hero section with animation [Use Framer Motion for fade-in, include CTA button, make background gradient]"
- "Set up database schema for products [Define Product model with name, price, images array, category reference, use Mongoose]"

For landing pages, include tasks like:
- Navbar with mobile menu
- Hero section with CTA
- Features/Services section with grid layout
- Testimonials or social proof section
- Footer with links and social icons
- Contact form with validation

For full-stack apps, include tasks like:
- API endpoint creation
- Database model setup
- Authentication implementation
- Frontend state management
- Error handling and loading states

Return ONLY valid JSON:
{
  "suggestions": [
    {"title": "Task description [How to implement it]", "isComplete": false}
  ]
}`;

  try {
    const completion = await callGroqWithFallback(
      [
        {
          role: 'system',
          content: `You are a senior developer assistant. Always return valid JSON. Generate production-ready, specific technical tasks for ${currentYear}.`,
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

// Context-aware AI Chat for project guidance
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
    ? `\n\nThe user is currently working on: Phase ${currentPhase.id} - ${
        currentPhase.title
      }\nPhase description: ${currentPhase.description}\nCompleted tasks: ${
        currentPhase.subTasks?.filter((t) => t.isComplete).length || 0
      }/${currentPhase.subTasks?.length || 0}`
    : '';

  const systemPrompt = `You are a SENIOR SOFTWARE DEVELOPER assistant with expertise in ${currentYear} technologies. You are helping a developer build their project.

PROJECT CONTEXT:
- Name: ${projectName}
- Description: ${projectDescription}
- Type: ${projectType}${phaseContext}

YOUR ROLE:
- Provide PRODUCTION-READY code examples
- Use ${currentYear} best practices
- Give specific, actionable technical advice
- Include implementation details
- Suggest modern libraries and tools
- Consider performance, security, and accessibility

WHEN GIVING CODE:
- Use proper syntax highlighting (specify language)
- Include comments explaining key parts
- Show complete, working examples
- Use modern syntax (ES6+, async/await, hooks)

WHEN DISCUSSING ARCHITECTURE:
- Suggest folder structures
- Recommend design patterns
- Explain trade-offs

Be concise but thorough. Focus on helping the developer ship production-ready code.`;

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
  suggestSubtasks,
  chatWithAI,
};
