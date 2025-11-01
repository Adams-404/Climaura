import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { processClimatePrompt } from "./openai";
import { getClimateData } from "./climate-data";
import { promptRequestSchema, insertPledgeSchema, quizAnswerSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/prompt", async (req, res) => {
    try {
      const validatedData = promptRequestSchema.parse(req.body);
      
      const aiResponse = await processClimatePrompt(validatedData.prompt);
      
      const climateData = getClimateData(aiResponse.continent);
      
      let quizId: string | undefined;
      if (aiResponse.quizQuestion) {
        const storedQuiz = await storage.storeActiveQuiz({
          continent: aiResponse.continent,
          question: aiResponse.quizQuestion,
          options: aiResponse.quizOptions || [],
          correctIndex: aiResponse.quizCorrectIndex || 0,
        });
        quizId = storedQuiz.id;
      }
      
      const response = {
        text: aiResponse.text,
        continent: aiResponse.continent,
        relatedData: climateData,
        quiz: aiResponse.quizQuestion ? {
          id: quizId,
          question: aiResponse.quizQuestion,
          options: aiResponse.quizOptions || [],
        } : undefined,
      };
      
      res.json(response);
    } catch (error: any) {
      console.error("Error processing prompt:", error);
      res.status(500).json({ 
        error: "Failed to process prompt",
        message: error.message 
      });
    }
  });

  app.post("/api/pledges", async (req, res) => {
    try {
      const validatedData = insertPledgeSchema.parse(req.body);
      const pledge = await storage.createPledge(validatedData);
      res.json(pledge);
    } catch (error: any) {
      console.error("Error creating pledge:", error);
      res.status(400).json({ 
        error: "Failed to create pledge",
        message: error.message 
      });
    }
  });

  app.get("/api/pledges", async (req, res) => {
    try {
      const continent = req.query.continent as string | undefined;
      
      const pledges = continent
        ? await storage.getPledgesByContinent(continent)
        : await storage.getAllPledges();
      
      res.json(pledges);
    } catch (error: any) {
      console.error("Error fetching pledges:", error);
      res.status(500).json({ 
        error: "Failed to fetch pledges",
        message: error.message 
      });
    }
  });

  app.get("/api/climate-data/:continent", async (req, res) => {
    try {
      const { continent } = req.params;
      const data = getClimateData(continent);
      
      if (!data) {
        return res.status(404).json({ error: "Continent not found" });
      }
      
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching climate data:", error);
      res.status(500).json({ 
        error: "Failed to fetch climate data",
        message: error.message 
      });
    }
  });

  app.post("/api/quiz/validate", async (req, res) => {
    try {
      const validatedData = quizAnswerSchema.parse(req.body);
      
      const activeQuiz = await storage.getActiveQuizByContinent(validatedData.continent);
      
      if (!activeQuiz) {
        return res.status(404).json({ 
          error: "No active quiz found for this continent" 
        });
      }
      
      const correct = validatedData.selectedIndex === activeQuiz.correctIndex;
      
      res.json({
        correct,
        correctIndex: activeQuiz.correctIndex,
        explanation: correct 
          ? "Correct! Well done!" 
          : `Not quite right. The correct answer was option ${activeQuiz.correctIndex + 1}.`,
      });
    } catch (error: any) {
      console.error("Error validating quiz:", error);
      res.status(400).json({ 
        error: "Failed to validate quiz answer",
        message: error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
