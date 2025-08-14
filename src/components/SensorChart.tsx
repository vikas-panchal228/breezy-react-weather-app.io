
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StoredSensorData } from '@/services/esp8266StorageService';

interface SensorChartProps {
  data: StoredSensorData[];
  title: string;
  dataKey: 'temperature' | 'humidity';
  color: string;
  unit: string;
}

const SensorChart: React.FC<SensorChartProps> = ({ data, title, dataKey, color, unit }) => {
  // Format data for chart (last 20 readings)
  const chartData = data.slice(0, 20).reverse().map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    value: Number(item[dataKey].toFixed(1)),
    timestamp: item.timestamp
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title} Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                fontSize={12}
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                fontSize={12}
                tick={{ fontSize: 10 }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                formatter={(value) => [`${value}${unit}`, title]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorChart;
