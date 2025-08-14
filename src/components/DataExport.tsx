
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';
import { StoredSensorData } from '@/services/esp8266StorageService';
import { useToast } from '@/hooks/use-toast';

interface DataExportProps {
  data: StoredSensorData[];
}

const DataExport: React.FC<DataExportProps> = ({ data }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No sensor data available to export.",
        variant: "destructive"
      });
      return;
    }

    // Create CSV content
    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)'];
    const csvContent = [
      headers.join(','),
      ...data.map(row => [
        new Date(row.timestamp).toISOString(),
        row.temperature.toFixed(2),
        row.humidity.toFixed(2)
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esp8266-sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${data.length} sensor readings to CSV.`,
    });
  };

  const exportToJSON = () => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No sensor data available to export.",
        variant: "destructive"
      });
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esp8266-sensor-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Exported ${data.length} sensor readings to JSON.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Download className="mr-2 h-5 w-5" />
          Export Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          className="w-full"
          disabled={data.length === 0}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
        <Button 
          onClick={exportToJSON} 
          variant="outline" 
          className="w-full"
          disabled={data.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export as JSON
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {data.length} readings available
        </p>
      </CardContent>
    </Card>
  );
};

export default DataExport;
