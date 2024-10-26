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
  <div>
    <div className="pb-2">
      <h2 className="text-bold text-lg">Welcome to ClipWise!</h2>
      <span>
        This extension will help you skip the trivial parts of a video and focus
        on learning.
      </span>
    </div>
    <ActionButtons
      onActionClick={onActionClick}
      disableOptions={disableOptions}
    />
  </div>
);

export default MainContent;
