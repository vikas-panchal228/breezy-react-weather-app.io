
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Activity } from 'lucide-react';

interface DeviceStatusProps {
  isConnected: boolean;
  lastUpdate: string | null;
  dataCount: number;
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ isConnected, lastUpdate, dataCount }) => {
  const getStatusColor = () => {
    if (!isConnected) return 'destructive';
    
    if (lastUpdate) {
      const timeDiff = Date.now() - new Date(lastUpdate).getTime();
      const minutesAgo = timeDiff / (1000 * 60);
      
      if (minutesAgo < 2) return 'default'; // Green - very recent
      if (minutesAgo < 5) return 'secondary'; // Yellow - recent
      return 'destructive'; // Red - old data
    }
    
    return 'destructive';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    
    if (lastUpdate) {
      const timeDiff = Date.now() - new Date(lastUpdate).getTime();
      const minutesAgo = Math.floor(timeDiff / (1000 * 60));
      
      if (minutesAgo < 1) return 'Live';
      if (minutesAgo < 5) return `${minutesAgo}m ago`;
      return 'Stale data';
    }
    
    return 'No data';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Activity className="mr-2 h-5 w-5" />
          Device Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Connection:</span>
          <div className="flex items-center">
            {isConnected ? (
              <Wifi className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="mr-2 h-4 w-4 text-red-500" />
            )}
            <Badge variant={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Readings:</span>
          <span className="font-mono text-sm">{dataCount}</span>
        </div>
        
        {lastUpdate && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Update:</span>
            <span className="font-mono text-xs">
              {new Date(lastUpdate).toLocaleString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceStatus;
