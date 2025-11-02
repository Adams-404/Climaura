import axios from 'axios';
import type { ClimateData } from "@shared/schema";

const WORLD_BANK_API = 'https://api.worldbank.org/v2/country';

interface WorldBankIndicator {
  date: string;
  value: number;
}

async function fetchWorldBankData(countryCode: string, indicator: string): Promise<number | null> {
  try {
    const url = `${WORLD_BANK_API}/${countryCode}/indicator/${indicator}?format=json&per_page=1`;
    console.log(`Fetching data from: ${url}`);
    
    const response = await axios.get(url);
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    const data = response.data[1]?.[0] as WorldBankIndicator | undefined;
    const value = data?.value ?? null;
    console.log(`Extracted value for ${indicator}:`, value);
    return value;
  } catch (error) {
    console.error(`Error fetching ${indicator} for ${countryCode}:`, error);
    return null;
  }
}

// Map continents to representative countries for World Bank data
const CONTINENT_COUNTRIES: Record<string, string> = {
  africa: 'ZAF',      // South Africa
  asia: 'CHN',        // China
  europe: 'DEU',      // Germany
  northAmerica: 'USA', // United States
  southAmerica: 'BRA', // Brazil
  oceania: 'AUS',     // Australia
  antarctica: 'ATA',   // Antarctica (not available in World Bank, will use fallback)
};

// Fallback data in case API calls fail
const FALLBACK_DATA: Record<string, Partial<ClimateData>> = {
  africa: {
    co2Emissions: 1.3,
    temperature: 1.2,
    renewableEnergy: 18.5,
    population: 1400000000,
  },
  // ... (other continents' fallback data)
};

export async function getRealTimeClimateData(continent: string): Promise<ClimateData> {
  const countryCode = CONTINENT_COUNTRIES[continent] || 'WLD'; // Default to World if continent not found
  console.log(`\n=== Starting to fetch real-time data for ${continent} (using country code: ${countryCode}) ===`);
  
  try {
    console.log('Fetching all data in parallel...');
    const [co2Data, renewableData, populationData] = await Promise.all([
      fetchWorldBankData(countryCode, 'EN.ATM.CO2E.PC'), // CO2 emissions (metric tons per capita)
      fetchWorldBankData(countryCode, 'EG.FEC.RNEW.ZS'), // Renewable energy consumption (% of total final energy consumption)
      fetchWorldBankData(countryCode, 'SP.POP.TOTL'),    // Population, total
    ]);

    console.log('\n=== Fetched Data ===');
    console.log('CO2 Data:', co2Data);
    console.log('Renewable Energy Data:', renewableData);
    console.log('Population Data:', populationData);

    // Get temperature data from a different source (World Bank doesn't provide this directly)
    console.log('\nFetching temperature data...');
    const temperatureData = await fetchTemperatureData(continent);
    console.log('Temperature Data:', temperatureData);

    return {
      continent: continent.charAt(0).toUpperCase() + continent.slice(1),
      co2Emissions: co2Data ?? FALLBACK_DATA[continent]?.co2Emissions ?? 0,
      temperature: temperatureData ?? FALLBACK_DATA[continent]?.temperature ?? 0,
      renewableEnergy: renewableData ?? FALLBACK_DATA[continent]?.renewableEnergy ?? 0,
      population: populationData ?? FALLBACK_DATA[continent]?.population ?? 0,
      yearlyData: [], // This would require historical API calls
    };
  } catch (error) {
    console.error('Error fetching climate data:', error);
    return {
      continent: continent.charAt(0).toUpperCase() + continent.slice(1),
      co2Emissions: FALLBACK_DATA[continent]?.co2Emissions ?? 0,
      temperature: FALLBACK_DATA[continent]?.temperature ?? 0,
      renewableEnergy: FALLBACK_DATA[continent]?.renewableEnergy ?? 0,
      population: FALLBACK_DATA[continent]?.population ?? 0,
      yearlyData: [],
    };
  }
}

// Placeholder function - in a real app, you would implement this to fetch from a weather API
async function fetchTemperatureData(continent: string): Promise<number | null> {
  // This is a simplified example. In a real app, you would use a weather API here.
  // For now, we'll return the fallback temperature.
  return FALLBACK_DATA[continent]?.temperature ?? null;
}
