
import React from "react";
import { StoredWeatherData } from "@/services/weatherHistoryService";
import { getWeatherIconUrl } from "@/services/weatherService";
import { useTheme } from "@/context/ThemeContext";
import { MapPin } from "lucide-react";

interface WeatherHistoryCardProps {
  historyData: StoredWeatherData;
  className?: string;
}

const WeatherHistoryCard = ({ historyData, className }: WeatherHistoryCardProps) => {
  const { theme } = useTheme();
  
  if (!historyData) return null;

  const date = new Date(historyData.date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
  
  return (
    <div className={`weather-card p-4 text-white flex flex-col items-center ${theme === 'dark' ? 'bg-gray-800/60' : 'bg-blue-800/40'} ${className}`}>
      <p className="text-sm font-medium">{formattedDate}</p>
      <div className="flex items-center justify-center w-full mt-1 mb-1">
        <MapPin className="w-3 h-3 mr-1" />
        <p className="text-xs">{historyData.city}</p>
      </div>
      <div className="flex items-center">
        <img 
          src={getWeatherIconUrl(historyData.icon)} 
          alt={historyData.description} 
          className="w-12 h-12 my-1" 
        />
        <p className="text-xl font-bold ml-2">{Math.round(historyData.temp)}°C</p>
      </div>
      <p className="text-xs capitalize opacity-80">{historyData.description}</p>
      <div className="mt-2 text-xs flex justify-between w-full">
        <span>H: {historyData.humidity}%</span>
        <span>W: {historyData.wind_speed} m/s</span>
      </div>
    </div>
  );
};

export default WeatherHistoryCard;
