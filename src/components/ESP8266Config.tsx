
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { updateESP8266Config, getESP8266Config, testESP8266Connection } from '@/services/esp8266Service';
import { useToast } from '@/hooks/use-toast';

const ESP8266Config: React.FC = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState(getESP8266Config());
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'failed'>('unknown');

  const handleConfigUpdate = () => {
    updateESP8266Config(config);
    toast({
      title: "Configuration Updated",
      description: "ESP8266 settings have been saved.",
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const isConnected = await testESP8266Connection();
      setConnectionStatus(isConnected ? 'success' : 'failed');
      
      toast({
        title: isConnected ? "Connection Successful" : "Connection Failed",
        description: isConnected 
          ? "Successfully connected to ESP8266 device." 
          : "Could not connect to ESP8266. Check your settings.",
        variant: isConnected ? "default" : "destructive"
      });
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: "Connection Test Failed",
        description: "An error occurred while testing the connection.",
        variant: "destructive"
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          ESP8266 Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="baseUrl">Device IP Address/URL</Label>
          <Input
            id="baseUrl"
            type="text"
            placeholder="http://192.168.1.100"
            value={config.baseUrl}
            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Enter your ESP8266 device's IP address or hostname
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endpoint">API Endpoint</Label>
          <Input
            id="endpoint"
            type="text"
            placeholder="/dht11"
            value={config.endpoint}
            onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            The endpoint path on your ESP8266 device
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeout">Timeout (ms)</Label>
          <Input
            id="timeout"
            type="number"
            min="1000"
            max="30000"
            value={config.timeout}
            onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 10000 })}
          />
          <p className="text-xs text-muted-foreground">
            Request timeout in milliseconds (1000-30000)
          </p>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Status:</span>
            {getStatusIcon()}
            {getStatusBadge()}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleConfigUpdate} className="flex-1">
            Save Configuration
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="flex items-center"
          >
            <TestTube className={`mr-2 h-4 w-4 ${isTestingConnection ? 'animate-spin' : ''}`} />
            {isTestingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Expected ESP8266 Response Format:</p>
          <pre className="text-xs overflow-x-auto">
{`{
  "temperature": 25.6,
  "humidity": 60.3,
  "timestamp": "2024-01-01T12:00:00Z"
}`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESP8266Config;
