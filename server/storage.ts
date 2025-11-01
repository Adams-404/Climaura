import { type Pledge, type InsertPledge, type ActiveQuiz } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createPledge(pledge: InsertPledge): Promise<Pledge>;
  getAllPledges(): Promise<Pledge[]>;
  getPledgesByContinent(continent: string): Promise<Pledge[]>;
  storeActiveQuiz(quiz: Omit<ActiveQuiz, 'id' | 'createdAt'>): Promise<ActiveQuiz>;
  getActiveQuiz(id: string): Promise<ActiveQuiz | undefined>;
  getActiveQuizByContinent(continent: string): Promise<ActiveQuiz | undefined>;
}

export class MemStorage implements IStorage {
  private pledges: Map<string, Pledge>;
  private activeQuizzes: Map<string, ActiveQuiz>;

  constructor() {
    this.pledges = new Map();
    this.activeQuizzes = new Map();
  }

  async createPledge(insertPledge: InsertPledge): Promise<Pledge> {
    const id = randomUUID();
    const pledge: Pledge = {
      ...insertPledge,
      id,
      createdAt: new Date().toISOString(),
    };
    this.pledges.set(id, pledge);
    return pledge;
  }

  async getAllPledges(): Promise<Pledge[]> {
    return Array.from(this.pledges.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPledgesByContinent(continent: string): Promise<Pledge[]> {
    return Array.from(this.pledges.values())
      .filter((pledge) => pledge.continent?.toLowerCase() === continent.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async storeActiveQuiz(quiz: Omit<ActiveQuiz, 'id' | 'createdAt'>): Promise<ActiveQuiz> {
    const id = randomUUID();
    const activeQuiz: ActiveQuiz = {
      ...quiz,
      id,
      createdAt: new Date().toISOString(),
    };
    this.activeQuizzes.set(id, activeQuiz);
    return activeQuiz;
  }

  async getActiveQuiz(id: string): Promise<ActiveQuiz | undefined> {
    return this.activeQuizzes.get(id);
  }

  async getActiveQuizByContinent(continent: string): Promise<ActiveQuiz | undefined> {
    return Array.from(this.activeQuizzes.values())
      .filter((quiz) => quiz.continent.toLowerCase() === continent.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }
}

export const storage = new MemStorage();
