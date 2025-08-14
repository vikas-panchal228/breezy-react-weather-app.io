
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, RefreshCw, BarChart3 } from "lucide-react";
import { fetchSensorData, formatTemperature, formatHumidity } from "@/services/esp8266Service";
import { getSensorDataHistory } from "@/services/esp8266StorageService";
import { useToast } from "@/hooks/use-toast";
import SensorChart from "@/components/SensorChart";
import DeviceStatus from "@/components/DeviceStatus";
import DataExport from "@/components/DataExport";
import ESP8266Config from "@/components/ESP8266Config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ESP8266Page = () => {
  const { toast } = useToast();
  const [historicalData, setHistoricalData] = useState(getSensorDataHistory());

  // Use React Query to fetch and cache sensor data
  const {
    data: sensorData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["esp8266-sensor-data"],
    queryFn: fetchSensorData,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2, // Retry failed requests 2 times
    retryDelay: 3000 // Wait 3 seconds between retries
  });

  // Update historical data when new data comes in
  useEffect(() => {
    if (sensorData) {
      setHistoricalData(getSensorDataHistory());
    }
  }, [sensorData]);

  // Handle refetch button click
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Updating sensor data from ESP8266...",
      duration: 2000
    });
  };

  // Show error toast if fetch fails
  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect to ESP8266",
        variant: "destructive"
      });
    }
  }, [isError, error, toast]);

  const lastUpdate = sensorData?.timestamp || (historicalData.length > 0 ? historicalData[0].timestamp : null);
  const isConnected = !isError && !!sensorData;

  return (
    <div className="container py-8 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">ESP8266 Sensor Monitor</h1>
      
      <p className="mb-6 text-muted-foreground">Real-time temperature and humidity data from your ESP8266 device via REST API.</p>
      
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Data</TabsTrigger>
          <TabsTrigger value="charts">Charts & Trends</TabsTrigger>
          <TabsTrigger value="settings">Settings & Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Temperature Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/10 pb-0">
                <CardTitle className="flex items-center text-2xl">
                  <Thermometer className="mr-2 h-6 w-6 text-primary" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="animate-pulse text-2xl text-muted-foreground">Loading...</div>
                  </div>
                ) : isError ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="text-xl text-destructive">Connection error</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2">
                      {formatTemperature(sensorData?.temperature || 0)}
                    </div>
                    <div className="text-muted-foreground text-center">
                      Last updated: {new Date(sensorData?.timestamp || "").toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Humidity Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-secondary/10 pb-0">
                <CardTitle className="flex items-center text-2xl">
                  <Droplets className="mr-2 h-6 w-6 text-secondary" />
                  Humidity
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="animate-pulse text-2xl text-muted-foreground">Loading...</div>
                  </div>
                ) : isError ? (
                  <div className="h-24 flex items-center justify-center">
                    <div className="text-xl text-destructive">Connection error</div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2">
                      {formatHumidity(sensorData?.humidity || 0)}
                    </div>
                    <div className="text-muted-foreground text-center">
                      Last updated: {new Date(sensorData?.timestamp || "").toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Device Status */}
            <DeviceStatus 
              isConnected={isConnected}
              lastUpdate={lastUpdate}
              dataCount={historicalData.length}
            />
          </div>
          
          {/* Controls */}
          <Card>
            <CardFooter>
              <Button 
                onClick={handleRefresh} 
                disabled={isLoading} 
                className="flex items-center mx-auto"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          {historicalData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SensorChart 
                data={historicalData}
                title="Temperature"
                dataKey="temperature"
                color="#ef4444"
                unit="°C"
              />
              <SensorChart 
                data={historicalData}
                title="Humidity"
                dataKey="humidity"
                color="#3b82f6"
                unit="%"
              />
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Historical Data</h3>
                <p className="text-muted-foreground text-center">
                  Start collecting data from your ESP8266 to see trends and charts here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ESP8266Config />
            <DataExport data={historicalData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESP8266Page;
