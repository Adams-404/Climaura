import { z } from "zod";

// Climate Data Types
export const climateDataSchema = z.object({
  continent: z.string(),
  co2Emissions: z.number(),
  temperature: z.number(),
  renewableEnergy: z.number(),
  population: z.number(),
  yearlyData: z.array(z.object({
    year: z.number(),
    co2: z.number(),
    temp: z.number(),
    renewable: z.number(),
  })),
});

export type ClimateData = z.infer<typeof climateDataSchema>;

// AI Prompt Types
export const promptRequestSchema = z.object({
  prompt: z.string().min(1),
  continent: z.string().optional(),
});

export type PromptRequest = z.infer<typeof promptRequestSchema>;

export const aiResponseSchema = z.object({
  text: z.string(),
  continent: z.string(),
  relatedData: climateDataSchema.optional(),
  quiz: z.object({
    id: z.string().optional(),
    question: z.string(),
    options: z.array(z.string()),
  }).optional(),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

// Climate Pledge Types
export const pledgeSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.string(),
  continent: z.string().optional(),
});

export const insertPledgeSchema = pledgeSchema.omit({ id: true, createdAt: true });

export type Pledge = z.infer<typeof pledgeSchema>;
export type InsertPledge = z.infer<typeof insertPledgeSchema>;

// Quiz Types
export const quizAnswerSchema = z.object({
  continent: z.string(),
  selectedIndex: z.number(),
});

export type QuizAnswer = z.infer<typeof quizAnswerSchema>;

export const quizResultSchema = z.object({
  correct: z.boolean(),
  correctIndex: z.number(),
  explanation: z.string().optional(),
});

export type QuizResult = z.infer<typeof quizResultSchema>;

// Active Quiz Storage
export const activeQuizSchema = z.object({
  id: z.string(),
  continent: z.string(),
  question: z.string(),
  options: z.array(z.string()),
  correctIndex: z.number(),
  createdAt: z.string(),
});

export type ActiveQuiz = z.infer<typeof activeQuizSchema>;

// Continent Coordinates for Globe Navigation
export const continentCoordinates = {
  africa: { lat: 0, lng: 20, altitude: 2 },
  asia: { lat: 34, lng: 100, altitude: 2 },
  europe: { lat: 54, lng: 15, altitude: 2 },
  northAmerica: { lat: 54, lng: -105, altitude: 2 },
  southAmerica: { lat: -15, lng: -60, altitude: 2 },
  oceania: { lat: -25, lng: 140, altitude: 2 },
  antarctica: { lat: -82, lng: 0, altitude: 2 },
} as const;

export type ContinentKey = keyof typeof continentCoordinates;
