// Service to store and retrieve weather history data

import { WeatherData } from './weatherService';

// Interface for stored weather data with timestamp
export interface StoredWeatherData {
  id: string;
  city: string;
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  date: string; // ISO string date
}

// Local storage key
const STORAGE_KEY = 'weather_history_data';
const MAX_DAYS_TO_STORE = 10;

/**
 * Save weather data to storage
 */
export const saveWeatherData = (data: WeatherData): void => {
  try {
    // Get existing data
    const existingData = getWeatherHistory();
    
    // Check if we already have an entry for this city and date
    const today = new Date().toISOString().split('T')[0];
    const existingEntryIndex = existingData.findIndex(
      item => item.city === data.name && item.date.includes(today)
    );
    
    // Create new weather entry
    const newEntry: StoredWeatherData = {
      id: Date.now().toString(),
      city: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      wind_speed: data.wind.speed,
      date: new Date().toISOString()
    };
    
    let updatedData: StoredWeatherData[];
    
    // If we already have an entry for today, replace it
    if (existingEntryIndex !== -1) {
      updatedData = [...existingData];
      updatedData[existingEntryIndex] = newEntry;
    } else {
      // Otherwise add new entry to the beginning
      updatedData = [newEntry, ...existingData];
    }
    
    // Keep only recent data
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - MAX_DAYS_TO_STORE);
    
    const filteredData = updatedData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= tenDaysAgo;
    });
    
    // Save back to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
  } catch (error) {
    console.error('Error saving weather data to storage:', error);
  }
};

/**
 * Get stored weather history for a specific city
 */
export const getWeatherHistory = (cityName?: string): StoredWeatherData[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const allData: StoredWeatherData[] = storedData ? JSON.parse(storedData) : [];
    
    // If city name is provided, filter by city
    if (cityName) {
      return allData.filter(item => item.city.toLowerCase() === cityName.toLowerCase());
    }
    
    return allData;
  } catch (error) {
    console.error('Error retrieving weather history from storage:', error);
    return [];
  }
};

/**
 * Get last 5 days of weather history for a specific city
 */
export const getPreviousWeatherData = (cityName: string): StoredWeatherData[] => {
  const allHistory = getWeatherHistory(cityName);
  
  // Group by date (YYYY-MM-DD)
  const groupedByDay: Record<string, StoredWeatherData> = {};
  
  allHistory.forEach(reading => {
    const date = new Date(reading.date).toISOString().split('T')[0];
    // Keep only the latest reading per day
    if (!groupedByDay[date] || new Date(reading.date) > new Date(groupedByDay[date].date)) {
      groupedByDay[date] = reading;
    }
  });
  
  // Convert to array and sort by date (newest first)
  const sortedHistory = Object.values(groupedByDay)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Return last 5 days
  return sortedHistory.slice(0, 5);
};

/**
 * Clear all stored weather data
 */
export const clearWeatherHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
