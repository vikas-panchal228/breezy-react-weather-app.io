// Service to store and retrieve ESP8266 sensor data history

import { ESP8266Data } from './esp8266Service';

// Interface for stored sensor data with timestamp
export interface StoredSensorData {
  id: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

// Mock local storage implementation (in a real app, this would use IndexedDB or a backend database)
const STORAGE_KEY = 'your_storage_key_here';
const MAX_DAYS_TO_STORE = 10;

/**
 * Save sensor data to storage
 */
export const saveSensorData = (data: ESP8266Data): void => {
  try {
    // Get existing data
    const existingData = getSensorDataHistory();
    
    // Generate a unique ID for this reading
    const newReading: StoredSensorData = {
      ...data,
      id: Date.now().toString(),
    };
    
    // Add new data to the beginning of the array (newest first)
    const updatedData = [newReading, ...existingData];
    
    // Keep only data from the last 10 days
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - MAX_DAYS_TO_STORE);
    
    const filteredData = updatedData.filter(item => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= tenDaysAgo;
    });
    
    // Save back to storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
  } catch (error) {
    console.error('Error saving sensor data to storage:', error);
  }
};

/**
 * Get all stored sensor data
 */
export const getSensorDataHistory = (): StoredSensorData[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Error retrieving sensor data from storage:', error);
    return [];
  }
};

/**
 * Group sensor data by day for summary display
 */
export const getSensorDataByDay = () => {
  const allData = getSensorDataHistory();
  const groupedByDay: Record<string, StoredSensorData[]> = {};
  
  // Group readings by day
  allData.forEach(reading => {
    const date = new Date(reading.timestamp).toLocaleDateString();
    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }
    groupedByDay[date].push(reading);
  });
  
  // Calculate daily averages and min/max
  const dailySummaries = Object.entries(groupedByDay).map(([day, readings]) => {
    const avgTemp = readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length;
    const avgHumidity = readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length;
    const minTemp = Math.min(...readings.map(r => r.temperature));
    const maxTemp = Math.max(...readings.map(r => r.temperature));
    const minHumidity = Math.min(...readings.map(r => r.humidity));
    const maxHumidity = Math.max(...readings.map(r => r.humidity));
    const readingCount = readings.length;
    
    return {
      day,
      readings,
      summary: {
        avgTemp,
        avgHumidity,
        minTemp,
        maxTemp,
        minHumidity,
        maxHumidity,
        readingCount
      }
    };
  });
  
  // Sort by date (newest first)
  return dailySummaries.sort((a, b) => 
    new Date(b.day).getTime() - new Date(a.day).getTime()
  );
};

/**
 * Clear all stored sensor data
 */
export const clearSensorData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
