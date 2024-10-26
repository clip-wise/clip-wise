import { useState, useEffect } from "react";

interface ProviderConfig {
  name: "Google Gemini";
  apiKey: string;
}

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const storedConfig = localStorage.getItem("llmConfig");
    if (storedConfig) {
      const config: ProviderConfig = JSON.parse(storedConfig);
      setApiKey(config.apiKey);
      setHasApiKey(true);
    }
  }, []);

  const saveApiKey = (key: string) => {
    const config: ProviderConfig = { name: "Google Gemini", apiKey: key };
    localStorage.setItem("llmConfig", JSON.stringify(config));
    setApiKey(key);
    setHasApiKey(true);
  };

  const clearApiKey = () => {
    localStorage.removeItem("llmConfig");
    setApiKey("");
    setHasApiKey(false);
  };

  return { apiKey, hasApiKey, saveApiKey, clearApiKey };
};
