import React, { useEffect, useState } from 'react';
import YoutubeVideoId from '../utils/getYoutubeVideoId';
import { useApiKey } from './hooks/useApiKey';
import { ApiKeyInput } from './components/ApiKeyInput';
import './SidePanelContent.css';

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
    <div className='side-panel-content'>
      <h1 className='title'>ClipWise</h1>
      {error && (
        <div className='error-message' role='alert'>
          <strong>Error: </strong>
          <span>{error}</span>
        </div>
      )}
      <div className='api-key-section'>
        <p>API Key is set for OpenAI. You're ready to go!</p>
        <button onClick={handleStart} className='start-button'>
          Start
        </button>
        <button onClick={clearApiKey} className='change-key-button'>
          Change API Key
        </button>
      </div>
      <hr className='divider' />
      <div className='captions-section'>
        {captions.map((caption, index) => (
          <p key={index} className='caption-preview'>
            {caption.text.slice(0, 50)}...
          </p>
        ))}
      </div>
    </div>
  );
};

export default SidePanelContent;
