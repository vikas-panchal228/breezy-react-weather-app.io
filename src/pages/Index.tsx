import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import WeatherCard from "@/components/WeatherCard";
import ForecastCard from "@/components/ForecastCard";
import WeatherHistoryCard from "@/components/WeatherHistoryCard";
import SearchBar from "@/components/SearchBar";
import GoogleAQIMap from "@/components/GoogleAQIMap";
import { useTheme } from "@/context/ThemeContext";
import { fetchWeatherByCity, fetchForecastByCity, fetchWeatherByCoords, fetchForecastByCoords, getDailyForecast, WeatherData, ForecastData } from "@/services/weatherService";
import { getCurrentPosition, isGeolocationSupported } from "@/services/locationService";
import { getPreviousWeatherData, saveWeatherData } from "@/services/weatherHistoryService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  // Default to Delhi, but we'll try to get user location first
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any[] | null>(null);
  const [weatherHistory, setWeatherHistory] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default Delhi coordinates
  const { toast } = useToast();
  const { theme } = useTheme();

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      const weatherData = await fetchWeatherByCity(cityName);
      const forecastData = await fetchForecastByCity(cityName);
      setWeather(weatherData);
      setForecast(getDailyForecast(forecastData));
      setCity(cityName);
      
      // Update location coordinates based on weather data
      if (weatherData.coord) {
        setLocation({ 
          lat: weatherData.coord.lat, 
          lng: weatherData.coord.lon 
        });
      }
      
      // Save weather data to history storage
      saveWeatherData(weatherData);
      
      // Fetch weather history data
      const historyData = getPreviousWeatherData(cityName);
      setWeatherHistory(historyData);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Could not fetch weather data. Please try another city.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const handleLocationSearch = async () => {
    try {
      setLoading(true);
      toast({
        title: "Getting Location",
        description: "Fetching your current location..."
      });
      const coords = await getCurrentPosition();
      const weatherData = await fetchWeatherByCoords(coords.latitude, coords.longitude);
      const forecastData = await fetchForecastByCoords(coords.latitude, coords.longitude);
      setWeather(weatherData);
      setForecast(getDailyForecast(forecastData));
      setCity(weatherData.name); // Update city name from the response
      
      // Update location coordinates
      setLocation({
        lat: coords.latitude,
        lng: coords.longitude
      });
      
      // Save weather data to history storage
      saveWeatherData(weatherData);
      
      // Fetch weather history data
      const historyData = getPreviousWeatherData(weatherData.name);
      setWeatherHistory(historyData);
      
      setLoading(false);
      toast({
        title: "Location Found",
        description: `Showing weather for ${weatherData.name}`
      });
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location Error",
        description: "Could not access your location. Using default location instead.",
        variant: "destructive"
      });
      // Fall back to default city
      fetchWeatherData(city);
    }
  };

  useEffect(() => {
    // Try to get the user's location first on initial load
    const initializeWithLocation = async () => {
      if (isGeolocationSupported()) {
        try {
          await handleLocationSearch();
        } catch (error) {
          // If location access fails, fall back to the default city
          console.error("Could not get location, falling back to default city:", error);
          fetchWeatherData(city);
        }
      } else {
        // If geolocation is not supported, use the default city
        fetchWeatherData(city);
      }
    };
    
    initializeWithLocation();
    // Remove fetchWeatherData(city) from here since we're handling it in initializeWithLocation
  }, []);

  const handleSearch = (cityName: string) => {
    fetchWeatherData(cityName);
  };

  // Determine if it's day or night for background
  const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
  const bgClass = theme === 'dark' ? "from-blue-900 to-indigo-900" : isDay ? "from-blue-400 to-blue-600" : "from-blue-900 to-indigo-900";
  
  return <div className={`min-h-screen bg-gradient-to-b ${bgClass} text-white p-6 pb-20`}>
      <div className="max-w-4xl mx-auto animate-fade-in bg-transparent">
        <header className="mb-8">
          <div className="flex justify-center mb-6">
            <SearchBar onSearch={handleSearch} onLocationSearch={handleLocationSearch} />
          </div>
        </header>

        <main>
          {loading ? <div className="space-y-4">
              <div className="animate-pulse h-64 bg-white/10 rounded-xl"></div>
              <div className="animate-pulse h-32 bg-white/10 rounded-xl"></div>
            </div> : <>
              {weather && <WeatherCard weatherData={weather} className="mb-6" />}
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Air Quality Index</h2>
                <GoogleAQIMap 
                  className="mb-4" 
                  location={location}
                  cityName={city} 
                />
              </div>
              
              <Tabs defaultValue="forecast" className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="forecast">Forecast</TabsTrigger>
                  <TabsTrigger value="history">Historical</TabsTrigger>
                </TabsList>
                
                <TabsContent value="forecast" className="mt-4">
                  {forecast && forecast.length > 0 ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">5-Day Forecast</h2>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {forecast.map((day, index) => <ForecastCard key={index} forecast={day} />)}
                      </div>
                    </div>
                  ) : (
                    <p>No forecast data available</p>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="mt-4">
                  {weatherHistory && weatherHistory.length > 0 ? (
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Previous 5 Days</h2>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {weatherHistory.map((day, index) => <WeatherHistoryCard key={index} historyData={day} />)}
                      </div>
                    </div>
                  ) : (
                    <p>No historical weather data available yet</p>
                  )}
                </TabsContent>
              </Tabs>
            </>}
        </main>

        <footer className="mt-12 text-center text-white/70 text-sm">
          <p>Weather data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </div>;
};

export default Index;
