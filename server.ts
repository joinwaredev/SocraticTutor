import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for model selection
function getModelName(requested?: string, isComplexOrImage?: boolean): string {
  if (requested === 'gemini-3.1-flash-lite') return 'gemini-3.1-flash-lite';
  if (requested === 'gemini-3.5-flash') return 'gemini-3.5-flash';
  if (requested === 'gemini-3.1-pro-preview') return 'gemini-3.1-pro-preview';
  if (isComplexOrImage) return 'gemini-3.1-pro-preview';
  return 'gemini-3.5-flash';
}

const BASE_SOCRATIC_PROMPT = `
You are "Sparky", a warm, compassionate, patient Socratic AI math tutor designed specifically for elementary school students (Grades 3, 4, and 5).

PEDAGOGICAL DIRECTIVES:
1. NEVER just provide the final numerical answer or do the entire problem at once.
2. Break any math problem into 2 to 4 gentle, bite-sized steps.
3. When starting a problem, welcome the student with encouragement, state the problem clearly in simple words, and walk them ONLY through Step 1.
4. Always end your response with ONE simple, inviting question that invites the student to try or share what they think the first step should be.
5. If the student asks "Why did we do that?":
   - Stop and validate their curiosity warmly ("What an awesome question! Real mathematicians always ask why!").
   - Explain ONLY that single concept using a vivid, age-appropriate metaphor (e.g., sharing cupcakes equally, a balance scale/seesaw that must stay level, stepping stones on a trail, trading ten 1-dollar bills for a 10-dollar bill).
   - Keep the language clear, simple, and jargon-free for their grade level.
   - Do NOT rush them to the next step until this concept is clear.
6. If the problem is advanced (e.g. algebra with x, or even calculus/derivatives uploaded by a curious student):
   - Do not overwhelm them with scary notation.
   - Demystify it with kindness: "Wow, look at you exploring big math! Did you know calculus is just finding how fast something changes, like a puppy running or a rocket zooming?"
   - Translate the concept into visual or everyday logic.
7. Always provide structured JSON metadata at the end of your response, wrapped inside a \`\`\`json\`\`\` block:
{
  "currentStep": 1,
  "totalSteps": 3,
  "stepTitle": "Short title of current step",
  "scaffoldType": "fractions" | "balance_scale" | "array_grid" | "number_line" | "place_value" | "none",
  "scaffoldData": { ...visual configuration details like fractions or scale weights... },
  "guidingQuestion": "The single question asked to the student",
  "encouragement": "A warm confidence-building praise",
  "curiosityFact": "A fun short math fact or metaphor related to this step"
}
`;

// Helper that tries primary model, and seamlessly falls back through alternative Gemini models
async function generateWithFallback(contents: any, primaryModel: string, baseConfig: any) {
  const modelChain = [primaryModel, 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  let lastError: any = null;
  for (const model of modelChain) {
    try {
      const config = { ...baseConfig };
      if (!model.includes('pro') && config.thinkingConfig) {
        delete config.thinkingConfig;
      }
      const response = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      return { response, modelUsed: model };
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} encountered error: ${err?.message}. Trying next fallback model...`);
    }
  }
  throw lastError;
}

// 1. Endpoint: Start Problem (Text or Image Upload)
app.post('/api/tutor/start', async (req, res) => {
  try {
    const { problemText, imageBase64, mimeType, gradeLevel = '4th', thinkingMode = true, modelChoice } = req.body;

    const gradeInstructions = `
The student is in ${gradeLevel} grade.
Grade 3: Emphasize visual arrays, equal sharing, basic fraction bars (halves, thirds, fourths), addition/subtraction regrouping.
Grade 4: Emphasize multi-digit operations, equivalent fractions, area models, multi-step word problems.
Grade 5: Emphasize fraction operations, decimal place value, order of operations (PEMDAS), simple unknown equations (algebraic thinking).
`;

    const modelToUse = getModelName(modelChoice, true);

    const contents: any = [];

    // Add image if provided
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    const textPrompt = `
${gradeInstructions}

Here is the student's math problem to solve together:
${problemText ? `Problem text: "${problemText}"` : 'Please carefully read the math problem shown in the uploaded photo.'}

Remember:
- Greet the student with warmth and gentle encouragement.
- Transcribe/state what the problem is asking in simple, friendly terms.
- Introduce ONLY Step 1. Do NOT reveal the solution or step 2.
- Offer a visual scaffolding representation in your JSON block.
- Ask ONE guiding question for Step 1 to invite their thinking.
`;

    contents.push({ text: textPrompt });

    const config: any = {
      systemInstruction: BASE_SOCRATIC_PROMPT,
      temperature: 0.7,
    };

    if (thinkingMode && modelToUse.includes('pro')) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const { response, modelUsed } = await generateWithFallback(
      { parts: contents },
      modelToUse,
      config
    );

    const responseText = response.text || '';

    // Extract JSON block if present
    let metadata: any = null;
    let cleanText = responseText;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        metadata = JSON.parse(jsonMatch[1]);
        cleanText = responseText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (parseErr) {
        console.warn('Could not parse metadata JSON block', parseErr);
      }
    }

    return res.json({
      success: true,
      text: cleanText,
      metadata: metadata || {
        currentStep: 1,
        totalSteps: 3,
        stepTitle: 'Understand the Problem & Identify Step 1',
        scaffoldType: 'none',
        scaffoldData: {},
        guidingQuestion: 'What do you think is the very first number or clue we should look at?',
        encouragement: "You're taking the first brave step!",
      },
      modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/tutor/start:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Something went wrong while analyzing the problem.',
    });
  }
});

// 2. Endpoint: Multi-Turn Socratic Chat
app.post('/api/tutor/chat', async (req, res) => {
  try {
    const {
      history = [],
      message,
      gradeLevel = '4th',
      problemContext,
      currentStep = 1,
      actionType = 'regular', // 'regular' | 'why' | 'hint' | 'check' | 'simplify'
      thinkingMode = true,
      modelChoice,
    } = req.body;

    const modelToUse = getModelName(modelChoice, actionType === 'why' || thinkingMode);

    let actionDirective = '';
    if (actionType === 'why') {
      actionDirective = `
The student just asked: "Why did we do that?" or wants to understand the underlying reason for Step ${currentStep}.
CRITICAL INSTRUCTION:
- Stop! Do NOT move to the next step.
- Validate them with genuine warmth: "That is the best question you could ask!"
- Explain ONLY the specific mathematical concept or rule behind Step ${currentStep}.
- Use a relatable, tactile metaphor (e.g. food sharing, seesaw/balance, toy blocks, coins, stepping stones).
- Check if this makes sense before inviting them back to the problem.
`;
    } else if (actionType === 'hint') {
      actionDirective = `
The student is asking for a gentle hint for Step ${currentStep}.
- Provide a small, friendly clue or question that nudges them in the right direction.
- Do NOT solve the arithmetic for them.
- Offer an analogy or suggest looking at a specific number or visual aid.
`;
    } else if (actionType === 'check') {
      actionDirective = `
The student wants to check their work/thought for Step ${currentStep}.
- If they are correct: CELEBRATE enthusiastically! Award verbal praise and guide them to Step ${currentStep + 1} with a new guiding question.
- If they have a minor mistake: Be super compassionate! Point out what they got right first, gently ask: "Look closely at [part], what happens if...?" Never say "Wrong" or "Incorrect".
`;
    } else if (actionType === 'simplify') {
      actionDirective = `
The student asked to explain it in even simpler terms.
- Use an imaginative story or humorous visual (e.g. pizzas, superhero powers, balancing monkeys) suitable for a 3rd grader.
- Keep sentences short and cheerful.
`;
    }

    const conversationHistoryFormatted = history.map((msg: any) => ({
      role: msg.role === 'tutor' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || msg.text }],
    }));

    const currentPrompt = `
Grade level: ${gradeLevel}
Current Step: ${currentStep}
Original Problem Context: ${problemContext || 'Elementary math problem'}
${actionDirective}

Student's message: "${message}"

Respond with compassion, Socratic guidance, and include the JSON metadata block with updated currentStep, totalSteps, scaffoldType, scaffoldData, guidingQuestion, and encouragement.
`;

    const config: any = {
      systemInstruction: BASE_SOCRATIC_PROMPT,
      temperature: 0.7,
    };

    if (thinkingMode && modelToUse.includes('pro')) {
      config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
    }

    const contents = [
      ...conversationHistoryFormatted,
      {
        role: 'user',
        parts: [{ text: currentPrompt }],
      },
    ];

    const { response, modelUsed } = await generateWithFallback(
      contents,
      modelToUse,
      config
    );

    const responseText = response.text || '';

    let metadata: any = null;
    let cleanText = responseText;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        metadata = JSON.parse(jsonMatch[1]);
        cleanText = responseText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (parseErr) {
        console.warn('Could not parse metadata JSON block in chat', parseErr);
      }
    }

    return res.json({
      success: true,
      text: cleanText,
      metadata: metadata || {
        currentStep,
        totalSteps: 3,
        stepTitle: `Step ${currentStep}`,
        scaffoldType: 'none',
        scaffoldData: {},
        guidingQuestion: 'What would you like to try next?',
        encouragement: 'Every question makes your brain stronger!',
      },
      modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/tutor/chat:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error processing tutor response.',
    });
  }
});

// 3. Endpoint: Westerville City Schools Bridges Curriculum Lesson Review
app.post('/api/curriculum/review', async (req, res) => {
  try {
    const {
      gradeLevel = '4th',
      unitTitle,
      lessonOrTopic,
      audience = 'student', // 'student' | 'parent'
      userQuestion,
      modelChoice = 'gemini-3.5-flash',
    } = req.body;

    const systemPrompt = `
You are "Sparky", the elementary math coach specializing in the Westerville City School District (WCSD, Ohio) elementary math curriculum: "Bridges in Mathematics" (2nd Edition, by The Math Learning Center) and "Number Corner", aligned with Ohio's Learning Standards for Mathematics.

YOUR MISSION:
Review a specific lesson, visual strategy, or unit concept BEFORE the student begins practicing problems, so they build conceptual confidence and eliminate math anxiety.

TARGET AUDIENCE: ${audience === 'parent' ? 'Parent or Caregiver helping at home' : `Elementary Student (${gradeLevel} Grade)`}

KEY BRIDGES PEDAGOGICAL PILLARS:
1. Emphasize Bridges visual models (Open Number Lines, Ratio Tables, Tile Arrays & Area Models, Fraction Strips, Clock Fractions, Money Models, Base Ten Mats).
2. Explain "WHY did we do that?": Always explain the conceptual mathematical reason behind the visual model (e.g., why a ratio table prevents guessing in division, why the area model prevents misplaced zeros, why clock fractions make unlike denominators easy).
3. Connect to Ohio's Learning Standards for Mathematics.
4. Keep the tone compassionate, encouraging, and clear. Avoid confusing technical jargon.

Provide a comprehensive, beautifully structured review with:
- Concept Name & Big Idea
- The Visual Mental Model (step-by-step how to picture it)
- The "Why It Works" (the secret logic real mathematicians use)
- Watch Out For (1-2 common stumbling blocks and how to gently avoid them)
- Warmup Practice Question (a low-stakes question ready to try)
`;

    const userPrompt = `
Grade Level: ${gradeLevel} Grade
Bridges Unit: ${unitTitle || 'Bridges in Mathematics Core Unit'}
Specific Lesson or Homework Topic: ${lessonOrTopic || 'General Unit Concept'}
${userQuestion ? `Specific question: "${userQuestion}"` : ''}

Please generate an interactive, compassionate pre-lesson review for this topic.
`;

    const modelToUse = getModelName(modelChoice, false);
    const config: any = {
      systemInstruction: systemPrompt,
      temperature: 0.6,
    };

    const { response, modelUsed } = await generateWithFallback(
      [{ role: 'user', parts: [{ text: userPrompt }] }],
      modelToUse,
      config
    );

    return res.json({
      success: true,
      reviewText: response.text || '',
      gradeLevel,
      unitTitle,
      modelUsed,
    });
  } catch (error: any) {
    console.error('Error in /api/curriculum/review:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Error generating curriculum review.',
    });
  }
});

// Vite middleware in development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Socratic AI Math Tutor server listening on http://0.0.0.0:${PORT}`);
});
