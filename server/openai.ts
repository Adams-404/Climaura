import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

interface ClimatePromptResponse {
  text: string;
  continent: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
}

export async function processClimatePrompt(prompt: string): Promise<ClimatePromptResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are GaiaPrompt, an AI climate educator helping users understand climate change impacts across different continents. 
Your role is to:
1. Identify which continent the user is asking about (Africa, Asia, Europe, North America, South America, Oceania, or Antarctica)
2. Provide educational, hopeful, and actionable insights about climate change
3. Keep responses concise (2-3 paragraphs max)
4. Sometimes create a quiz question to test understanding

Respond with JSON in this exact format and nothing else:
{
  "text": "Your educational response here",
  "continent": "continentName (lowercase, no spaces - use northAmerica, southAmerica)",
  "quizQuestion": "Optional quiz question",
  "quizOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "quizCorrectIndex": 0
}

Make your responses engaging, solution-oriented, and empowering. Focus on specific impacts, real data when possible, and what people can do to help.`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `User question: ${prompt}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1000,
      }
    });

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const resultData = JSON.parse(jsonMatch[0]);
    
    return {
      text: resultData.text || "I'm here to help you learn about climate change. Please ask me a question!",
      continent: normalizeContinent(resultData.continent || "africa"),
      quizQuestion: resultData.quizQuestion,
      quizOptions: resultData.quizOptions,
      quizCorrectIndex: resultData.quizCorrectIndex,
    };
  } catch (error) {
    console.error("Error processing prompt with Gemini:", error);
    return {
      text: "I'm having trouble connecting to the AI service. Please try again later.",
      continent: "global"
    };
  }
}

function normalizeContinent(continent: string): string {
  const lower = continent.toLowerCase().trim();
  // Handle variations in continent names
  if (['north america', 'north-america', 'north_america', 'northamerica'].includes(lower)) return 'northAmerica';
  if (['south america', 'south-america', 'south_america', 'southamerica'].includes(lower)) return 'southAmerica';
  if (['europe'].includes(lower)) return 'europe';
  if (['africa'].includes(lower)) return 'africa';
  if (['asia'].includes(lower)) return 'asia';
  if (['australia', 'oceania'].includes(lower)) return 'oceania';
  if (['antarctica'].includes(lower)) return 'antarctica';
  return 'global'; // default fallback
}
