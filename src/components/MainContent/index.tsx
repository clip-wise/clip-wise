import React from "react";
import ActionButtons from "../ActionButtons";
import { useState, useEffect } from "react";
import { Flashcard, MessageData } from "../../types";
import { ChromeMessageTypes } from "../../../constants";
interface MainContentProps {
  onActionClick: (action: string) => void;
  disableOptions: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  onActionClick,
  disableOptions,
}) => (
  <div className="space-y-4">
    <div>
      <h2 className="mb-2 text-lg font-bold">Welcome to ClipWise!</h2>
      <p>
        This extension will help you skip the trivial parts of a video and focus
        on learning.
      </p>
    </div>
    <ActionButtons
      onActionClick={onActionClick}
      disableOptions={disableOptions}
    />
  </div>
);

export default MainContent;
