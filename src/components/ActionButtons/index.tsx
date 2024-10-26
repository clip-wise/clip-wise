import React from "react";
import { Actions } from "../../../constants";

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
      onClick={() => onActionClick(Actions.Clip)}
      className="action-button"
      disabled={disableOptions}>
      Clip the video ✨
    </button>
    <button
      onClick={() => onActionClick(Actions.TakeNotes)}
      className="action-button"
      disabled={disableOptions}>
      Take Notes 📝
    </button>
    <button
      onClick={() => onActionClick(Actions.FlashCards)}
      className="action-button"
      disabled={disableOptions}>
      Learn with Flashcards 📄
    </button>
    <button
      onClick={() => onActionClick(Actions.Summary)}
      className="action-button"
      disabled={disableOptions}>
      Summarize Important Points 📚
    </button>
  </div>
);

export default ActionButtons;
