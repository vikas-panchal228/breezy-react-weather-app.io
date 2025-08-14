import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Save, Clock, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSensorDataByDay, clearSensorData, StoredSensorData } from "@/services/esp8266StorageService";
import { formatTemperature, formatHumidity } from "@/services/esp8266Service";
const SensorSummaryPage: React.FC = () => {
  const {
    toast
  } = useToast();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get data summaries grouped by day
  const dailySummaries = getSensorDataByDay();

  // Handle clearing all data
  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all stored sensor data? This cannot be undone.")) {
      clearSensorData();
      setRefreshTrigger(prev => prev + 1);
      toast({
        title: "Data cleared",
        description: "All sensor history has been deleted.",
        duration: 3000
      });
    }
  };

  // Handle toggling a day's expanded state
  const toggleDayExpanded = (day: string) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Format time for display
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };
  return <div className="container py-8 mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Sensor Data Summary</h1>
      
      <p className="mb-6 text-muted-foreground">Historical temperature and humidity data. stored for the last 10 days.</p>
      
      <Tabs defaultValue="summary" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Daily Summary</TabsTrigger>
          <TabsTrigger value="details">Detailed Readings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          {dailySummaries.length === 0 ? <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No data has been collected yet. Data will appear here after sensor readings are taken.
                </p>
              </CardContent>
            </Card> : <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Avg Temp</TableHead>
                  <TableHead className="text-right">Min/Max Temp</TableHead>
                  <TableHead className="text-right">Avg Humidity</TableHead>
                  <TableHead className="text-right">Min/Max Humidity</TableHead>
                  <TableHead className="text-right">Readings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailySummaries.map(({
              day,
              summary
            }) => <TableRow key={day}>
                    <TableCell>{day}</TableCell>
                    <TableCell className="text-right">
                      {formatTemperature(summary.avgTemp)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatTemperature(summary.minTemp)} - {formatTemperature(summary.maxTemp)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatHumidity(summary.avgHumidity)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatHumidity(summary.minHumidity)} - {formatHumidity(summary.maxHumidity)}
                    </TableCell>
                    <TableCell className="text-right">{summary.readingCount}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>}
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          {dailySummaries.length === 0 ? <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No data has been collected yet. Data will appear here after sensor readings are taken.
                </p>
              </CardContent>
            </Card> : dailySummaries.map(({
          day,
          readings
        }) => <Collapsible key={day} open={expandedDay === day}>
                <Card className="mb-4">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50" onClick={() => toggleDayExpanded(day)}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Database className="mr-2 h-5 w-5" />
                          {day} ({readings.length} readings)
                        </CardTitle>
                        {expandedDay === day ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead><Clock className="h-4 w-4" /> Time</TableHead>
                            <TableHead className="text-right">Temperature</TableHead>
                            <TableHead className="text-right">Humidity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {readings.map((reading: StoredSensorData) => <TableRow key={reading.id}>
                              <TableCell>{formatTime(reading.timestamp)}</TableCell>
                              <TableCell className="text-right">{formatTemperature(reading.temperature)}</TableCell>
                              <TableCell className="text-right">{formatHumidity(reading.humidity)}</TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>)}
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Save className="mr-2 h-5 w-5" />
            Data Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Sensor data is automatically saved when retrieved from the ESP8266 and stored for up to 10 days.
            You can manually clear all stored data using the button below.
          </p>
          
          <Button variant="destructive" onClick={handleClearData}>
            Clear All Stored Data
          </Button>
        </CardContent>
      </Card>
    </div>;
};
export default SensorSummaryPage;