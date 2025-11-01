import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ClimatePromptResponse {
  text: string;
  continent: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
}

export async function processClimatePrompt(prompt: string): Promise<ClimatePromptResponse> {
  try {
    const systemPrompt = `You are GaiaPrompt, an AI climate educator helping users understand climate change impacts across different continents. 
Your role is to:
1. Identify which continent the user is asking about (Africa, Asia, Europe, North America, South America, Oceania, or Antarctica)
2. Provide educational, hopeful, and actionable insights about climate change
3. Keep responses concise (2-3 paragraphs max)
4. Sometimes create a quiz question to test understanding

Respond with JSON in this exact format:
{
  "text": "Your educational response here",
  "continent": "continentName (lowercase, no spaces - use northAmerica, southAmerica)",
  "quizQuestion": "Optional quiz question",
  "quizOptions": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "quizCorrectIndex": 0
}

Make your responses engaging, solution-oriented, and empowering. Focus on specific impacts, real data when possible, and what people can do to help.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      text: result.text || "I'm here to help you learn about climate change. Please ask me a question!",
      continent: normalizeContinent(result.continent || "africa"),
      quizQuestion: result.quizQuestion,
      quizOptions: result.quizOptions,
      quizCorrectIndex: result.quizCorrectIndex,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to process climate prompt");
  }
}

function normalizeContinent(continent: string): string {
  const normalized = continent.toLowerCase().replace(/\s+/g, "");
  const validContinents = ["africa", "asia", "europe", "northamerica", "southamerica", "oceania", "antarctica"];
  
  if (validContinents.includes(normalized)) {
    return normalized;
  }
  
  return "africa";
}
