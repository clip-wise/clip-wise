import React, { useState } from 'react';
import { Settings } from 'lucide-react';

interface NavigationBarProps {
  title: string;
  onClearApiKey: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  title,
  onClearApiKey,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <nav className='navigation-bar'>
      <h1 className='title'>{title}</h1>
      <div className='settings-dropdown'>
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Settings />
        </button>
        {isSettingsOpen && (
          <div className={`dropdown-content ${isSettingsOpen ? 'open' : ''}`}>
            <button onClick={onClearApiKey}>Change API Key</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
