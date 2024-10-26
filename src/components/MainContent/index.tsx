import React from 'react';
import ActionButtons from '../ActionButtons';

interface MainContentProps {
  onActionClick: (action: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({ onActionClick }) => (
  <div className='main-content'>
    <h2>Choose an action:</h2>
    <ActionButtons onActionClick={onActionClick} />
  </div>
);

export default MainContent;
