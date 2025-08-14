
// Service to fetch data from ESP8266 with DHT11 sensor

export interface ESP8266Data {
  temperature: number;
  humidity: number;
  timestamp: string;
}

export interface ESP8266Config {
  baseUrl: string;
  endpoint: string;
  timeout: number;
}

// Default configuration - can be updated by user
let config: ESP8266Config = {
  baseUrl: "http://192.168.1.100", // Default ESP8266 IP
  endpoint: "/dht11",
  timeout: 10000 // 10 seconds
};

import { saveSensorData } from './esp8266StorageService';

/**
 * Update ESP8266 configuration
 */
export function updateESP8266Config(newConfig: Partial<ESP8266Config>): void {
  config = { ...config, ...newConfig };
  console.log('ESP8266 config updated:', config);
}

/**
 * Get current ESP8266 configuration
 */
export function getESP8266Config(): ESP8266Config {
  return { ...config };
}

/**
 * Fetch sensor data from ESP8266 device via REST API
 */
export async function fetchSensorData(): Promise<ESP8266Data> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeout);

  try {
    console.log(`Fetching data from: ${config.baseUrl}${config.endpoint}`);
    
    const response = await fetch(`${config.baseUrl}${config.endpoint}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ESP8266 API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Received data from ESP8266:', data);

    // Validate the response data
    if (typeof data.temperature !== 'number' || typeof data.humidity !== 'number') {
      throw new Error('Invalid data format from ESP8266');
    }

    // Ensure timestamp is included
    const sensorData: ESP8266Data = {
      temperature: data.temperature,
      humidity: data.humidity,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // Save data to storage
    saveSensorData(sensorData);
    
    return sensorData;
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${config.timeout}ms`);
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to ESP8266. Check if device is online and URL is correct.');
      }
    }
    
    console.error("Error fetching ESP8266 sensor data:", error);
    throw error;
  }
}

/**
 * Test connection to ESP8266 device
 */
export async function testESP8266Connection(): Promise<boolean> {
  try {
    await fetchSensorData();
    return true;
  } catch (error) {
    console.error('ESP8266 connection test failed:', error);
    return false;
  }
}

// Format functions
export function formatTemperature(temp: number): string {
  return `${temp.toFixed(1)}°C`;
}

export function formatHumidity(humidity: number): string {
  return `${humidity.toFixed(1)}%`;
}
