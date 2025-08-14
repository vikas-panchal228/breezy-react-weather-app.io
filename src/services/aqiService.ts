
// AQI data service for fetching from OpenWeatherMap API
// We're using the same API key as the weather service
import { API_KEY } from './weatherService';

const BASE_URL = "your_openweathermap_base_url_here"; // Replace with actual base URL

export interface AQIData {
  coord: {
    lon: number;
    lat: number;
  };
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}

export async function fetchAQIByCoords(lat: number, lon: number): Promise<AQIData> {
  try {
    const response = await fetch(
      `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`AQI data fetch failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching AQI data:", error);
    throw error;
  }
}

// Convert the OpenWeatherMap AQI (1-5) to US EPA AQI scale (0-500)
export function convertToUSAQI(aqi: number, pm25: number, pm10: number, o3: number, no2: number, so2: number): number {
  // For simplicity, we'll use PM2.5 as the main determiner since it's a common pollutant
  // This is a simplified conversion - the actual EPA calculation is more complex
  
  if (aqi === 1) return Math.round(pm25 * 2.1); // Good (0-50)
  if (aqi === 2) return Math.round(50 + (pm25 - 12) * 4.17); // Moderate (51-100)
  if (aqi === 3) return Math.round(100 + (pm25 - 35.4) * 2.1); // Unhealthy for Sensitive Groups (101-150)
  if (aqi === 4) return Math.round(150 + (pm25 - 55.4) * 2.46); // Unhealthy (151-200)
  if (aqi === 5) return Math.min(Math.round(200 + (pm25 - 150.4) * 2.1), 500); // Very Unhealthy to Hazardous (201-500)
  
  return 0;
}

export function getAQILevel(aqiValue: number): {
  level: string;
  color: string;
  description: string;
} {
  // Using US EPA AQI scale (0-500)
  if (aqiValue <= 50) {
    return {
      level: "Good",
      color: "#90EE90", // Light green
      description: "Air quality is satisfactory, and air pollution poses little or no risk."
    };
  } else if (aqiValue <= 100) {
    return {
      level: "Moderate",
      color: "#FFFF00", // Yellow
      description: "Air quality is acceptable. However, there may be a risk for some people."
    };
  } else if (aqiValue <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "#FFA500", // Orange
      description: "Members of sensitive groups may experience health effects."
    };
  } else if (aqiValue <= 200) {
    return {
      level: "Unhealthy",
      color: "#FF4500", // Orange Red
      description: "Everyone may begin to experience health effects."
    };
  } else if (aqiValue <= 300) {
    return {
      level: "Very Unhealthy",
      color: "#FF0000", // Red
      description: "Health warnings of emergency conditions. The entire population is more likely to be affected."
    };
  } else {
    return {
      level: "Hazardous",
      color: "#800080", // Purple
      description: "Health alert: everyone may experience more serious health effects."
    };
  }
}

