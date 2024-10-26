import React from 'react';

interface ActionButtonsProps {
  onActionClick: (action: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onActionClick }) => (
  <div className='action-buttons'>
    <button
      onClick={() => onActionClick('take-notes')}
      className='action-button'>
      Take Notes
    </button>
    <button
      onClick={() => onActionClick('flashcards')}
      className='action-button'>
      Learn with Flashcards
    </button>
    <button onClick={() => onActionClick('summary')} className='action-button'>
      Summarize Important Points
    </button>
  </div>
);

export default ActionButtons;
