import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useToast } from '@/components/ui/use-toast';
import { fetchAQIByCoords, getAQILevel, AQIData, convertToUSAQI } from '@/services/aqiService';
import { getCurrentPosition } from '@/services/locationService';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

// Using the provided Google Maps API key
const GOOGLE_MAPS_API_KEY = "your_google_maps_api_key_here";
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.75rem'
};

// Default location: Delhi, India
const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090
};
interface GoogleAQIMapProps {
  className?: string;
  location?: {
    lat: number;
    lng: number;
  };
  cityName?: string;
}
const GoogleAQIMap: React.FC<GoogleAQIMapProps> = ({
  className,
  location,
  cityName
}) => {
  const {
    isLoaded
  } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [usAqi, setUsAqi] = useState<number>(0);
  const [infoOpen, setInfoOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    toast
  } = useToast();
  const {
    theme
  } = useTheme();
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);
  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);
  const fetchAndDisplayAQI = async (lat: number, lng: number) => {
    try {
      setLoading(true);

      // Move map to location
      if (map) {
        map.panTo({
          lat,
          lng
        });
      }
      const data = await fetchAQIByCoords(lat, lng);
      setAqiData(data);

      // Calculate US EPA AQI
      const pm25 = data.list[0].components.pm2_5;
      const pm10 = data.list[0].components.pm10;
      const o3 = data.list[0].components.o3;
      const no2 = data.list[0].components.no2;
      const so2 = data.list[0].components.so2;
      const calculatedAqi = convertToUSAQI(data.list[0].main.aqi, pm25, pm10, o3, no2, so2);
      setUsAqi(calculatedAqi);
      setMarker({
        lat,
        lng
      });
      setInfoOpen(true);
      setLoading(false);
      toast({
        title: "AQI Data Loaded",
        description: `Air Quality Index: ${getAQILevel(calculatedAqi).level}`
      });
    } catch (error) {
      console.error("Error fetching AQI data:", error);
      toast({
        title: "Error",
        description: "Failed to load air quality data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      fetchAndDisplayAQI(lat, lng);
    }
  };
  const handleUseLocation = async () => {
    try {
      toast({
        title: "Getting Location",
        description: "Fetching your current location..."
      });
      const coords = await getCurrentPosition();
      fetchAndDisplayAQI(coords.latitude, coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      toast({
        title: "Location Error",
        description: "Could not access your location. Please check your browser permissions.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // Watch for location changes from parent component
  useEffect(() => {
    if (isLoaded && location && location.lat && location.lng) {
      fetchAndDisplayAQI(location.lat, location.lng);
    }
  }, [isLoaded, location]);

  // Format AQI component values to appropriate units and precision
  const formatAQIValue = (value: number, pollutant: string): string => {
    // Round to 2 decimal places
    const roundedValue = Math.round(value * 100) / 100;

    // Return with appropriate units
    switch (pollutant) {
      case 'co':
        return `${roundedValue} mg/m³`;
      case 'no':
      case 'no2':
      case 'o3':
      case 'so2':
      case 'pm2_5':
      case 'pm10':
      case 'nh3':
        return `${roundedValue} μg/m³`;
      default:
        return `${roundedValue}`;
    }
  };

  // Set map styles based on theme
  const mapOptions = {
    styles: theme === 'dark' ? [{
      elementType: "geometry",
      stylers: [{
        color: "#242f3e"
      }]
    }, {
      elementType: "labels.text.stroke",
      stylers: [{
        color: "#242f3e"
      }]
    }, {
      elementType: "labels.text.fill",
      stylers: [{
        color: "#746855"
      }]
    }, {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#d59563"
      }]
    }, {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#d59563"
      }]
    }, {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{
        color: "#263c3f"
      }]
    }, {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#6b9a76"
      }]
    }, {
      featureType: "road",
      elementType: "geometry",
      stylers: [{
        color: "#38414e"
      }]
    }, {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#212a37"
      }]
    }, {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#9ca5b3"
      }]
    }, {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{
        color: "#746855"
      }]
    }, {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{
        color: "#1f2835"
      }]
    }, {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#f3d19c"
      }]
    }, {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{
        color: "#2f3948"
      }]
    }, {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#d59563"
      }]
    }, {
      featureType: "water",
      elementType: "geometry",
      stylers: [{
        color: "#17263c"
      }]
    }, {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{
        color: "#515c6d"
      }]
    }, {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{
        color: "#17263c"
      }]
    }] : []
  };
  if (!isLoaded) return <div className="animate-pulse h-[400px] bg-white/10 rounded-xl"></div>;
  return <div className={`relative ${className}`}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={location || defaultCenter} zoom={10} onClick={handleMapClick} onLoad={onLoad} onUnmount={onUnmount} options={mapOptions}>
        {marker && <Marker position={{
        lat: marker.lat,
        lng: marker.lng
      }} icon={{
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: aqiData ? getAQILevel(usAqi).color : '#FF0000',
        fillOpacity: 0.8,
        strokeWeight: 1,
        strokeColor: '#FFFFFF',
        scale: 10
      }} onClick={() => setInfoOpen(true)}>
            {infoOpen && aqiData && <InfoWindow position={{
          lat: marker.lat,
          lng: marker.lng
        }} onCloseClick={() => setInfoOpen(false)}>
                <div className="p-3 max-w-xs rounded-sm bg-zinc-900">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full" style={{
                backgroundColor: getAQILevel(usAqi).color
              }}></div>
                    <h3 className="font-bold text-lg text-slate-100">Air Quality: {getAQILevel(usAqi).level}</h3>
                  </div>
                  
                  <p className="text-sm mb-3 text-slate-50 font-bold">{getAQILevel(usAqi).description}</p>
                  
                  <div className="p-2 rounded-md mb-3 bg-zinc-800">
                    <p className="text-sm font-semibold text-slate-100">AQI Index: {usAqi} (0-500 scale)</p>
                    {cityName && <p className="text-xs text-slate-300 mt-1">Location: {cityName}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 bg-gray-950">
                    <div className="p-2 rounded bg-zinc-800">
                      <p className="text-xs font-medium text-slate-100">PM2.5</p>
                      <p className="font-medium text-gray-100">{formatAQIValue(aqiData.list[0].components.pm2_5, 'pm2_5')}</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800">
                      <p className="text-xs font-medium text-slate-100">PM10</p>
                      <p className="font-medium">{formatAQIValue(aqiData.list[0].components.pm10, 'pm10')}</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800">
                      <p className="text-xs font-medium text-slate-100">CO</p>
                      <p className="font-medium">{formatAQIValue(aqiData.list[0].components.co, 'co')}</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800">
                      <p className="text-xs font-medium text-slate-100">O₃</p>
                      <p className="font-medium">{formatAQIValue(aqiData.list[0].components.o3, 'o3')}</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800">
                      <p className="text-xs font-medium text-slate-50">NO₂</p>
                      <p className="font-medium">{formatAQIValue(aqiData.list[0].components.no2, 'no2')}</p>
                    </div>
                    <div className="p-2 rounded bg-zinc-800">
                      <p className="text-xs font-medium text-slate-100">SO₂</p>
                      <p className="font-medium">{formatAQIValue(aqiData.list[0].components.so2, 'so2')}</p>
                    </div>
                  </div>
                </div>
              </InfoWindow>}
          </Marker>}
      </GoogleMap>
      <div className="absolute top-4 left-4 z-10">
        
      </div>
      {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>}
    </div>;
};
export default GoogleAQIMap;