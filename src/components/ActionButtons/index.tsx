import React from "react";

interface ActionButtonsProps {
  onActionClick: (action: string) => void;
  disableOptions: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onActionClick,
  disableOptions,
}) => (
  <div className="action-buttons">
    <button
      onClick={() => onActionClick("clip")}
      className="action-button"
      disabled={disableOptions}
    >
      Clip the video ✨
    </button>
    <button
      onClick={() => onActionClick("take-notes")}
      className="action-button"
      disabled={disableOptions}
    >
      Take Notes
    </button>
    <button
      onClick={() => onActionClick("flashcards")}
      className="action-button"
      disabled={disableOptions}
    >
      Learn with Flashcards
    </button>
    <button
      onClick={() => onActionClick("summary")}
      className="action-button"
      disabled={disableOptions}
    >
      Summarize Important Points
    </button>
  </div>
);

export default ActionButtons;
