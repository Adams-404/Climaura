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
    
    let responseDataToUse;
    
    // First, try to parse the response as JSON
    try {
      // Remove markdown code block markers if present
      let cleanResponseText = responseText;
      if (cleanResponseText.startsWith('```json')) {
        cleanResponseText = cleanResponseText.replace(/^```json\n|```$/g, '').trim();
      } else if (cleanResponseText.startsWith('```')) {
        cleanResponseText = cleanResponseText.replace(/^```\n|```$/g, '').trim();
      }
      
      // Try to parse the response as JSON
      try {
        // Check if the response contains a JSON object
        const jsonMatch = cleanResponseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseDataToUse = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON object found, try to parse the whole response
          responseDataToUse = JSON.parse(cleanResponseText);
        }
        
        // If we still have a string, it might be double-encoded JSON
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
        console.log('Response text was:', responseText);
        
        // If JSON parsing fails, try to extract any text content
        let fallbackText = responseText;
        // Try to clean up the response to get just the text
        const textMatch = responseText.match(/"response"\s*:\s*"([^"]+)"/i) || 
                         responseText.match(/"text"\s*:\s*"([^"]+)"/i);
        
        if (textMatch && textMatch[1]) {
          fallbackText = textMatch[1];
        }
        
        return {
          text: fallbackText,
          continent: 'global'
        };
      }

      // Map the response to our AIResponse interface
      const responseContent = responseDataToUse.response || responseDataToUse.text || '';
      const continent = (responseDataToUse.continent || 'global').toLowerCase();
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
      // Log the response data for debugging
      const responseData = {
        text: responseContent,
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
      
      console.log('AI Response Data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Failed to parse AI response as JSON:', error);
      console.log('Response text was:', responseText);
      
      // Fallback to text parsing if JSON parsing fails
      const lines = responseText.split('\n').map((line: string) => line.trim()).filter(Boolean);
      
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
