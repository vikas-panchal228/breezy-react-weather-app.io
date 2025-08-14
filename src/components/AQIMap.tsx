
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useToast } from '@/components/ui/use-toast';
import { fetchAQIByCoords, getAQILevel, AQIData } from '@/services/aqiService';
import { getCurrentPosition } from '@/services/locationService';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { Loader2 } from 'lucide-react';

// You would typically store this in an environment variable
// For this demo, we're using a public token
const MAPBOX_TOKEN = 'your mapbox_access_token_here';

interface AQIMapProps {
  initialLat?: number;
  initialLng?: number;
  className?: string;
}

const AQIMap: React.FC<AQIMapProps> = ({ 
  initialLat = 40.7128, 
  initialLng = -74.006, 
  className 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { theme } = useTheme();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: theme === 'dark' 
        ? 'mapbox://styles/mapbox/dark-v11' 
        : 'mapbox://styles/mapbox/light-v11',
      center: [initialLng, initialLat],
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup function
    return () => {
      map.current?.remove();
    };
  }, [initialLat, initialLng, theme]);

  // Fetch AQI data and add marker
  const fetchAndDisplayAQI = async (lat: number, lng: number) => {
    if (!map.current) return;

    try {
      setLoading(true);
      
      // Fly to the location
      map.current.flyTo({
        center: [lng, lat],
        essential: true,
        duration: 1000
      });

      const data = await fetchAQIByCoords(lat, lng);
      setAqiData(data);
      
      // Get AQI level info
      const aqi = data.list[0].main.aqi;
      const aqiInfo = getAQILevel(aqi);
      
      // Remove existing marker and popup if any
      if (marker.current) marker.current.remove();
      if (popup.current) popup.current.remove();
      
      // Create new popup
      popup.current = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div>
            <h3 style="font-weight: bold; margin-bottom: 5px;">Air Quality: ${aqiInfo.level}</h3>
            <div style="width: 20px; height: 20px; background-color: ${aqiInfo.color}; display: inline-block; margin-right: 5px; border-radius: 50%;"></div>
            <p style="font-size: 12px; margin-top: 5px;">${aqiInfo.description}</p>
            <p style="font-size: 12px; margin-top: 5px;">PM2.5: ${data.list[0].components.pm2_5} μg/m³</p>
            <p style="font-size: 12px; margin-top: 5px;">PM10: ${data.list[0].components.pm10} μg/m³</p>
          </div>
        `);
      
      // Create new marker
      marker.current = new mapboxgl.Marker({
        color: aqiInfo.color
      })
        .setLngLat([lng, lat])
        .setPopup(popup.current)
        .addTo(map.current);
      
      // Open popup by default
      marker.current.togglePopup();
      
      setLoading(false);
      
      toast({
        title: "AQI Data Loaded",
        description: `Air Quality Index: ${aqiInfo.level}`,
      });
    } catch (error) {
      console.error("Error fetching AQI data:", error);
      toast({
        title: "Error",
        description: "Failed to load air quality data",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Use user's current location
  const handleUseLocation = async () => {
    try {
      toast({
        title: "Getting Location",
        description: "Fetching your current location...",
      });
      
      const coords = await getCurrentPosition();
      fetchAndDisplayAQI(coords.latitude, coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location Error",
        description: "Could not access your location. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAndDisplayAQI(initialLat, initialLng);
  }, [initialLat, initialLng]);

  // Map click handler
  useEffect(() => {
    if (!map.current) return;
    
    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      fetchAndDisplayAQI(lat, lng);
    };
    
    map.current.on('click', handleMapClick);
    
    return () => {
      map.current?.off('click', handleMapClick);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-[500px] rounded-xl overflow-hidden" />
      <div className="absolute top-4 left-4 z-10">
        <Button 
          onClick={handleUseLocation} 
          variant="secondary"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Use My Location
        </Button>
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default AQIMap;
