import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const verifyApiKey = async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setError(null);
    try {
      const response = await fetch('https://api.openai.com/v1/engines', {
        headers: { Authorization: `Bearer ${key}` },
      });
      return response.ok;
    } catch (error) {
      console.error('Error verifying API key:', error);
      setError(
        'Network error occurred while verifying API key. Please try again.'
      );
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = await verifyApiKey(apiKey);
    if (isValid) {
      onSubmit(apiKey);
    } else {
      setError('Invalid API key. Please check and try again.');
    }
  };

  return (
    <div>
      <p className='mb-2'>Please enter your OpenAI API key:</p>
      <input
        type='text'
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder='Enter API Key'
        className='p-2 mb-4 w-full rounded border'
      />
      <button
        onClick={handleSubmit}
        disabled={isVerifying}
        className='p-2 w-full text-white bg-blue-500 rounded disabled:bg-blue-300'>
        {isVerifying ? 'Verifying...' : 'Submit'}
      </button>
      {error && <div className='mt-2 text-red-500'>{error}</div>}
    </div>
  );
};
