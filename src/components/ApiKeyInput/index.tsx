import React, { useState } from "react";
import "./ApiKeyInput.css";
import { AIOptions } from "../../../constants";

interface ApiKeyInputProps {
  onSubmit: (apiKey: { ai: AIOptions; apiKey: string }) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState<string>("");
  // const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAI, setSelectedAI] = useState<AIOptions | undefined>(
    undefined
  );
  // const verifyApiKey = async (key: string): Promise<boolean> => {
  //   setIsVerifying(true);
  //   setError(null);
  //   try {
  //     const API_VERSION = 'v1';
  //     const apiUrl = `https://generativelanguage.googleapis.com/${API_VERSION}/models?key=${apiKey}`;

  //     const response = await fetch(apiUrl, {
  //       method: 'GET',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  //     return response.ok;
  //   } catch (error) {
  //     console.error('Error verifying API key:', error);
  //     setError(
  //       'Network error occurred while verifying API key. Please try again.'
  //     );
  //     return false;
  //   } finally {
  //     setIsVerifying(false);
  //   }
  // };

  const handleSubmit = async () => {
    // const isValid = await verifyApiKey(apiKey);
    // if (isValid) {
    if (!selectedAI || !apiKey) return;
    onSubmit({
      ai: selectedAI,
      apiKey,
    });
    // } else {
    // setError('Invalid API key. Please check and try again.');
    // }
  };

  return (
    <div className="api-key-input">
      <h2 className="text-lg mb-2">Update your AI Settings</h2>
      <label htmlFor="ai-select">Choose an AI</label>
      <select
        id="ai-select"
        name="ai-select"
        onChange={(e) => setSelectedAI(e.target.value as AIOptions)}
        className="w-full text-gray-800 border border-r-2 p-2 mb-2"
        value={selectedAI}
      >
        <option value={AIOptions.Gemini}>Gemini</option>
        <option value={AIOptions.Groq}>Groq</option>
      </select>
      <label htmlFor="api-key-input">Enter your API Key</label>
      <input
        id="api-key-input"
        type="text"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter API Key"
        className="border border-r-2 mb-2"
      />
      <button onClick={handleSubmit} disabled={!selectedAI || !apiKey}>
        Submit
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ApiKeyInput;
