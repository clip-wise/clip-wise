import React, { useState } from "react";
import { Settings } from "lucide-react";

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
    <nav className="navigation-bar">
      <h1 className="title">
        <svg
          viewBox="0 0 491 491"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M320.618 372.828L320.769 366.68C320.769 351.538 324.326 339.353 331.44 330.123C381.239 286.725 406.139 245.221 406.139 205.611C406.139 117.46 334.473 46 246.07 46C157.666 46 86 117.46 86 205.611C86 244.973 110.9 286.477 160.699 330.123C167.023 338.327 170.536 348.867 171.239 361.742L171.433 370.647L171.655 375.126L172.092 380.029C172.186 380.877 172.29 381.739 172.407 382.614L173.265 387.994C178.035 413.656 194.155 446.174 246.07 446.174C297.984 446.174 314.104 413.656 318.874 387.994L319.732 382.614L320.295 377.53L320.618 372.828Z"
            fill="#6A425C"
            stroke="white"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M172.713 357.376C195.778 366.033 220.232 370.361 246.074 370.361C271.916 370.361 296.371 366.033 319.439 357.376"
            fill="#6A425C"
          />
          <path
            d="M172.713 357.376C195.778 366.033 220.232 370.361 246.074 370.361C271.916 370.361 296.371 366.033 319.439 357.376"
            stroke="white"
            strokeWidth="30"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M204 204V264L319 204L204 144V204Z"
            stroke="white"
            strokeWidth="30"
            strokeLinejoin="round"
          />
        </svg>

        <span>{title}</span>
      </h1>
      <div className="settings-dropdown">
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Settings />
        </button>
        {isSettingsOpen && (
          <div className={`dropdown-content ${isSettingsOpen ? "open" : ""}`}>
            <button onClick={onClearApiKey}>Change API Key</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
