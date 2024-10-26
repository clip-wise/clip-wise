import React from "react";
import ActionButtons from "../ActionButtons";

interface MainContentProps {
  onActionClick: (action: string) => void;
  disableOptions: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  onActionClick,
  disableOptions,
}) => (
  <div className="main-content">
    <h2>
      Welcome to ClipWise! This extension will help you skip the trivial parts
      of a video and focus on learning.
    </h2>
    <ActionButtons onActionClick={onActionClick} disableOptions={disableOptions} />
  </div>
);

export default MainContent;
