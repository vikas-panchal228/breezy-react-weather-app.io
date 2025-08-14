
import React from "react";
import AQIMap from "@/components/AQIMap";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AQIMapPage = () => {
  const { theme } = useTheme();
  const isDay = new Date().getHours() > 6 && new Date().getHours() < 18;
  const bgClass = theme === 'dark' 
    ? "from-blue-900 to-indigo-900" 
    : isDay ? "from-blue-400 to-blue-600" : "from-blue-900 to-indigo-900";

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgClass} text-white p-6`}>
      <div className="max-w-6xl mx-auto animate-fade-in">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Air Quality Map</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main>
          <div className="mb-6">
            <p className="text-white/90">
              View the Air Quality Index (AQI) on the map. Click anywhere to see air quality details 
              for that location, or use the button to check your current location.
            </p>
          </div>
          <AQIMap className="mb-6" />
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4">
            <h2 className="text-xl font-semibold mb-2">About Air Quality Index</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#90EE90" }}></div>
                <div>
                  <p className="font-medium">Good</p>
                  <p className="text-xs text-white/70">AQI: 1</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FFFF00" }}></div>
                <div>
                  <p className="font-medium">Fair</p>
                  <p className="text-xs text-white/70">AQI: 2</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FFA500" }}></div>
                <div>
                  <p className="font-medium">Moderate</p>
                  <p className="text-xs text-white/70">AQI: 3</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FF4500" }}></div>
                <div>
                  <p className="font-medium">Poor</p>
                  <p className="text-xs text-white/70">AQI: 4</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#FF0000" }}></div>
                <div>
                  <p className="font-medium">Very Poor</p>
                  <p className="text-xs text-white/70">AQI: 5</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-white/70 text-sm">
          <p>Weather and AQI data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
};

export default AQIMapPage;
