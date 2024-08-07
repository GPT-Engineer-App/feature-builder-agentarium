import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const SettingsMenu = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      if (!apiKey) return;
      setIsLoadingModels(true);
      try {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        const data = await response.json();
        setModels(data.data || []);
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, [apiKey]);

  const handleSave = () => {
    onSave({ apiKey, endpoint, model: selectedModel });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="api-key">API Key</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="api-key"
            type={showApiKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <Switch
            checked={showApiKey}
            onCheckedChange={setShowApiKey}
            aria-label="Toggle API key visibility"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="endpoint">Endpoint</Label>
        <Input id="endpoint" type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="model">Model</Label>
        <Select onValueChange={setSelectedModel} value={selectedModel}>
          <SelectTrigger>
            <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select a model"} />
          </SelectTrigger>
          <SelectContent>
            {isLoadingModels ? (
              <SelectItem value="loading" disabled>Loading models...</SelectItem>
            ) : models.length > 0 ? (
              models.map((model) => (
                <SelectItem key={model.id} value={model.id}>{model.id}</SelectItem>
              ))
            ) : (
              <SelectItem value="no-models" disabled>No models available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  );
};

export default SettingsMenu;
