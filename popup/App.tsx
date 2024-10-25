import './css/global.css';
import Logo from '../public/images/logo.svg';
import Play from '../public/images/play.svg';
import { useState, useEffect } from 'react';

export const App = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log('tabs[0]', tabs[0]);
        setActiveTab(tabs[0]);
      }
    });
  }, []);

  const handleClick = async () => {
    if (activeTab?.id && activeTab.url?.includes('youtube.com/watch')) {
      try {
        console.log('activeTab.id', activeTab.id);
        // await chrome.scripting.executeScript({
        //   target: { tabId: activeTab.id },
        //   files: ['scripts/content-script.tsx'],
        // });
        chrome.tabs.sendMessage(activeTab.id, { type: 'TOGGLE_SIDEBAR' });
        window.close(); // Close the popup after sending the message
      } catch (error) {
        console.error('Error injecting script:', error);
        alert(`An error occurred. Please try again. ${error}`);
      }
    } else {
      alert('Please navigate to a YouTube video page to use this extension.');
    }
  };

  return (
    <div className='flex flex-col justify-between h-32 w-28 p-3'>
      <div className='flex flex-col items-center gap-x-2 w-full mb-auto'>
        <img className='h-12' src={Logo} alt='logo' />
        <p className='font-lg font-bold'>ClipWise</p>
      </div>
      <div className='flex w-full justify-center'>
        <button
          onClick={handleClick}
          className='border rounded-lg border-blue-600 bg-blue-300 flex p-1 px-2 gap-x-2'>
          <img className='display-inline h-4' src={Play} alt='play' />
          start
        </button>
      </div>
    </div>
  );
};
