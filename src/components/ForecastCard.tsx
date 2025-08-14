
import React from "react";
import { getWeatherIconUrl, formatDate } from "@/services/weatherService";
import { useTheme } from "@/context/ThemeContext";

interface ForecastCardProps {
  forecast: any;
}

const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const { theme } = useTheme();
  
  if (!forecast) return null;

  const { dt, main, weather } = forecast;
  const iconUrl = getWeatherIconUrl(weather[0].icon);

  return (
    <div className={`weather-card p-4 text-white flex flex-col items-center ${theme === 'dark' ? 'bg-black/30' : 'bg-white/20'}`}>
      <p className="text-sm font-medium">{formatDate(dt)}</p>
      <img src={iconUrl} alt={weather[0].main} className="w-16 h-16 my-2" />
      <p className="text-xl font-bold">{Math.round(main.temp)}°C</p>
      <p className="text-xs capitalize opacity-80">{weather[0].description}</p>
    </div>
  );
};

export default ForecastCard;
