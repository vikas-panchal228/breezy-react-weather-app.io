
// Weather data service for fetching from OpenWeatherMap API
// Note: In a production app, you would keep this key in an environment variable
export const API_KEY = "your_openweathermap_api_key_here";
const BASE_URL = "open wheather base url here";

export interface WeatherData {
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
  };
}

export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather data fetch failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export async function fetchForecastByCity(city: string): Promise<ForecastData> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast data fetch failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather data fetch failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    throw error;
  }
}

export async function fetchForecastByCoords(lat: number, lon: number): Promise<ForecastData> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast data fetch failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast data by coordinates:", error);
    throw error;
  }
}

// Get weather icon URL from OpenWeatherMap
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Helper to format date
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Helper to format time
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true
  });
}

// Convert forecast data into daily forecast
export function getDailyForecast(forecastData: ForecastData): any[] {
  // Group forecast by day
  const dailyMap = new Map();
  
  forecastData.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, item);
    }
  });
  
  // Convert map to array
  return Array.from(dailyMap.values()).slice(0, 5);
}
