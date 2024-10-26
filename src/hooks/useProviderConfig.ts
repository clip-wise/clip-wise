import { useState, useEffect } from "react";
import { AIOptions } from "../../constants";

interface ProviderConfig {
  ai: AIOptions;
  apiKey: string;
}

const LOCAL_STORAGE_KEY_LLM_CONFIG = "llmConfig";

export const useProviderConfig = () => {
  const [providerConfig, setProviderConfig] = useState<ProviderConfig>({
    ai: AIOptions.Gemini,
    apiKey: "",
  });
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  useEffect(() => {
    const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEY_LLM_CONFIG);
    console.log("storedConfig", storedConfig);
    if (storedConfig) {
      const config: ProviderConfig = JSON.parse(storedConfig);
      setProviderConfig(config);
      setHasApiKey(true);
    }
  }, []);

  const saveApiKey = ({ ai, apiKey }: { ai: AIOptions; apiKey: string }) => {
    const config: ProviderConfig = { ai, apiKey };
    localStorage.setItem(LOCAL_STORAGE_KEY_LLM_CONFIG, JSON.stringify(config));
    setProviderConfig(config);
    setHasApiKey(true);
  };

  const clearApiKey = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_LLM_CONFIG);
    setProviderConfig({ ai: AIOptions.Gemini, apiKey: "" });
    setHasApiKey(false);
  };

  return { providerConfig, hasApiKey, saveApiKey, clearApiKey };
};
