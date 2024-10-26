import axios from "axios";

interface ProviderConfig {
  name: string;
  apiKey: string;
}

const getApiKey = (): string => {
  const storedConfig = localStorage.getItem("llmConfig");
  if (storedConfig) {
    const config: ProviderConfig = JSON.parse(storedConfig);
    return config.apiKey;
  }
  throw new Error("API key not found in local storage");
};

const apiClient = axios.create({
  baseURL: "https://generativelanguage.googleapis.com//v1", // Default to Google Gemini, can be changed based on provider
});

apiClient.interceptors.request.use((config) => {
  const apiKey = getApiKey();
  config.headers.Authorization = `Bearer ${apiKey}`;
  return config;
});

export default apiClient;
