import React, { useEffect, useState } from 'react';
import YoutubeVideoId from '../utils/getYoutubeVideoId';
import { useApiKey } from './hooks/useApiKey';
import { ApiKeyInput } from './components/ApiKeyInput';

const SidePanelContent = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [captions, setCaptions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { apiKey, hasApiKey, saveApiKey, clearApiKey } = useApiKey();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setActiveTab(tabs[0]);
      }
    });

    chrome.runtime.onMessage.addListener((message, sender, reply) => {
      if (message.type === 'captions-to-skip' && message.data) {
        setCaptions(message.data);
      }
    });
  }, []);

  const handleStart = async () => {
    const videoId = YoutubeVideoId(activeTab?.url || '');
    if (videoId) {
      chrome.runtime.sendMessage(
        { type: 'fetch-data', videoId },
        (response) => {
          console.log('received user data', response);
        }
      );
    }

    if (activeTab?.id) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['scripts/content-script.js'],
          world: 'MAIN',
        });
        setError(null);
      } catch (error) {
        console.error('Error injecting script:', error);
        setError(`An error occurred while starting the extension: ${error}`);
      }
    } else {
      setError(
        'Please navigate to a YouTube video page to use this extension.'
      );
    }
  };

  if (!hasApiKey) {
    return <ApiKeyInput onSubmit={saveApiKey} />;
  }

  return (
    <div className='p-4'>
      <h1 className='mb-4 text-2xl font-bold'>ClipWise</h1>
      {error && (
        <div
          className='relative px-4 py-3 mb-4 text-red-700 bg-red-100 rounded border border-red-400'
          role='alert'>
          <strong className='font-bold'>Error: </strong>
          <span className='block sm:inline'>{error}</span>
        </div>
      )}
      <div>
        <p className='mb-4'>API Key is set for OpenAI. You're ready to go!</p>
        <button
          onClick={handleStart}
          className='p-2 mb-2 w-full text-white bg-green-500 rounded'>
          Start
        </button>
        <button
          onClick={clearApiKey}
          className='p-2 w-full text-gray-700 bg-gray-300 rounded'>
          Change API Key
        </button>
      </div>
      <hr className='my-4' />
      <div>
        {captions.map((caption, index) => (
          <p key={index}>{caption.text.slice(0, 50)}...</p>
        ))}
      </div>
    </div>
  );
};

export default SidePanelContent;
