import React from "react";
import { WeatherData } from "@/services/weatherService";
import { getWeatherIconUrl, formatTime } from "@/services/weatherService";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
interface WeatherCardProps {
  weatherData: WeatherData;
  className?: string;
}
const WeatherCard = ({
  weatherData,
  className
}: WeatherCardProps) => {
  const {
    theme
  } = useTheme();
  const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
  const bgClass = theme === 'dark' ? "weather-night-gradient" : isDay ? "weather-gradient" : "weather-night-gradient";
  if (!weatherData) {
    return <div className="animate-pulse h-64 bg-gray-200 rounded-xl"></div>;
  }
  const {
    main,
    weather,
    wind,
    name,
    sys
  } = weatherData;
  const weatherCondition = weather[0].main;
  const iconUrl = getWeatherIconUrl(weather[0].icon);
  return <div className={cn("rounded-xl overflow-hidden shadow-lg", bgClass, className)}>
      <div className="p-6 text-white bg-transparent">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold">{name}</h2>
            <p className="text-sm opacity-90">{sys.country}</p>
            <div className="mt-6">
              <p className="text-6xl font-bold">{Math.round(main.temp)}°C</p>
              <p className="text-xl opacity-90">Feels like {Math.round(main.feels_like)}°C</p>
            </div>
            <p className="mt-2 text-lg capitalize">{weather[0].description}</p>
          </div>
          <div className="text-right">
            <img src={iconUrl} alt={weatherCondition} className="w-24 h-24 animate-float object-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="weather-card p-3">
            <p className="text-sm opacity-80">Humidity</p>
            <p className="text-xl font-semibold">{main.humidity}%</p>
          </div>
          <div className="weather-card p-3">
            <p className="text-sm opacity-80">Wind Speed</p>
            <p className="text-xl font-semibold">{wind.speed} m/s</p>
          </div>
          <div className="weather-card p-3">
            <p className="text-sm opacity-80">Sunrise</p>
            <p className="text-xl font-semibold">{formatTime(sys.sunrise)}</p>
          </div>
          <div className="weather-card p-3">
            <p className="text-sm opacity-80">Sunset</p>
            <p className="text-xl font-semibold">{formatTime(sys.sunset)}</p>
          </div>
        </div>
      </div>
    </div>;
};
export default WeatherCard;