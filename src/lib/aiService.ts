import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

export interface AIResponse {
  text: string;  // Changed from 'response' to 'text' to match the server response
  continent: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex?: number;
  };
  // Add optional fields that might come from the server
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
}

export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Format the prompt for the AI
    const systemPrompt = `You are a climate change educator helping users understand climate change impacts across different continents. 
Your role is to:
1. Identify which continent the user is asking about (Africa, Asia, Europe, North America, South America, Oceania, or Antarctica)
2. Provide educational, hopeful, and actionable insights about climate change
3. Keep responses concise (2-3 paragraphs max)
4. Sometimes create a quiz question to test understanding

Respond with JSON in this exact format and nothing else:
{
  "response": "Your educational response here",
  "continent": "continentName (lowercase, no spaces - use northAmerica, southAmerica)",
  "quiz": {
    "question": "Optional quiz question",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctIndex": 0
  }
}

Make your responses engaging, solution-oriented, and empowering. Focus on specific impacts, real data when possible, and what people can do to help.`;

    const fullPrompt = `${systemPrompt}

User question: ${prompt}`;
    
    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let responseText = response.text().trim();
    
    // Remove markdown code block markers if present
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json\n|```$/g, '').trim();
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```\n|```$/g, '').trim();
    }
    
    try {
      // First, try to parse the response as JSON
      let responseDataToUse;
      try {
        // Check if the response is a string that contains JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseDataToUse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON object found, try to parse the whole response
          responseDataToUse = JSON.parse(responseText);
        }
        
        // If we still have a string, try to parse it again (in case of double-encoded JSON)
        if (typeof responseDataToUse === 'string') {
          try {
            responseDataToUse = JSON.parse(responseDataToUse);
          } catch (e) {
            // If it's not JSON, use it as plain text
            return {
              text: responseDataToUse,
              continent: 'global'
            };
          }
        }
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        // If JSON parsing fails, return the raw text
        return {
          text: responseText,
          continent: 'global'
        };
      }

      // Map the response to our AIResponse interface
      const quizQuestion = responseDataToUse.quizQuestion || responseDataToUse.quiz?.question;
      let quizOptions = responseDataToUse.quizOptions || responseDataToUse.quiz?.options || [];
      
      // Ensure quizOptions is an array and has at least 2 options
      if (!Array.isArray(quizOptions)) {
        quizOptions = [String(quizOptions)];
      }
      
      // Ensure we have at least 2 options
      while (quizOptions.length < 2) {
        quizOptions.push(`Option ${quizOptions.length + 1}`);
      }
      
      // Ensure we don't have more than 4 options
      quizOptions = quizOptions.slice(0, 4);
      
      // Get the correct index, defaulting to 0 if not provided
      const quizCorrectIndex = typeof responseDataToUse.quizCorrectIndex === 'number' 
        ? Math.min(Math.max(0, responseDataToUse.quizCorrectIndex), quizOptions.length - 1)
        : (responseDataToUse.quiz?.correctIndex || 0);
      
      // Ensure we have a valid response object
      const responseData = {
        text: responseDataToUse.text || responseText,
        continent: responseDataToUse.continent || 'global',
        ...(quizQuestion && {
          quiz: {
            question: quizQuestion,
            options: quizOptions,
            correctIndex: quizCorrectIndex
          },
          quizQuestion,
          quizOptions,
          quizCorrectIndex
        })
      };
      
      console.log('AI Response Data:', responseData); // Debug log
      return responseData;
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      console.log('Response text was:', responseText);
      
      // Fallback to text parsing if JSON parsing fails
      const lines = responseText.split('\n').map((line: string) => line.trim()).filter((line: string) => line);
      
      // Extract continent (look for a line that contains "continent:")
      let continent = 'global';
      const continentLine = lines.find((line: string) => line.toLowerCase().includes('"continent"'));
      if (continentLine) {
        const match = continentLine.match(/"continent"\s*:\s*"([^"]+)"/i);
        if (match) continent = match[1].trim();
      }
      
      // Extract question (look for a line that contains "question")
      let question = '';
      const questionLine = lines.find(line => line.includes('"question"'));
      if (questionLine) {
        const match = questionLine.match(/"question"\s*:\s*"([^"]+)"/i);
        if (match) question = match[1].trim();
      }
      
      // Extract options (look for an array of options)
      let options: string[] = [];
      const optionsMatch = responseText.match(/"options"\s*:\s*(\[[^\]]+\])/);
      if (optionsMatch) {
        try {
          options = JSON.parse(optionsMatch[1]);
        } catch (e) {
          console.error('Failed to parse options array:', e);
        }
      }
      
      // Ensure we have at least 2 options
      while (options.length < 2) {
        options.push(`Option ${options.length + 1}`);
      }
      
      const result: AIResponse = {
        text: responseText,
        continent
      };
      
      if (question) {
        const quizOptions = options.slice(0, 4);
        result.quiz = {
          question,
          options: quizOptions,
          correctIndex: 0
        };
        result.quizQuestion = question;
        result.quizOptions = quizOptions;
        result.quizCorrectIndex = 0;
      }
      
      console.log('Fallback response data:', result);
      return result;
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
};

export const savePledge = async (pledge: any) => {
  // In a real app, this would save to a database
  // For now, we'll just log it and return a success response
  console.log('Pledge saved:', pledge);
  return { success: true };
};
