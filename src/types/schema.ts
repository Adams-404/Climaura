export type ContinentKey = 'africa' | 'antarctica' | 'asia' | 'europe' | 'north-america' | 'south-america' | 'australia' | 'oceania';

export interface CountryMarker {
  name: string;
  lat: number;
  lng: number;
  capital: string;
  continent: ContinentKey;
  color?: string;
}

export interface YearlyDataPoint {
  year: number;
  value: number;
}

export interface ClimateData {
  co2Emissions: number;
  temperature: number;
  seaLevel: number;
  year: number;
  renewableEnergy: number;
  yearlyData: {
    co2: YearlyDataPoint[];
    temperature: YearlyDataPoint[];
    seaLevel: YearlyDataPoint[];
  };
}

export interface InsertPledge {
  name: string;
  email: string;
  pledge: string;
  country: string;
  createdAt?: string;
}

export interface AIResponse {
  text: string;
  continent: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex?: number;
  };
  relatedData?: any;
}
