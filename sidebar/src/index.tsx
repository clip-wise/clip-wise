import React, { useEffect, useState } from "react";

const SidePanelContent = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("tabs[0]", tabs[0]);
        setActiveTab(tabs[0]);
      }
    });
  }, []);

  const handleClick = async () => {
    if (activeTab?.id) {
      try {
        console.log("activeTab.id", activeTab.id);
        alert("executing script");
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["scripts/content-script.js"],
          world: "MAIN",
        });
        alert("executed script");
      } catch (error) {
        console.error("Error injecting script:", error);
        alert(`An error occurred. Please try again. ${error}`);
      }
    } else {
      alert("Please navigate to a YouTube video page to use this extension.");
    }
  };

  return (
    <div>
      <h1>SidePanel Content</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default SidePanelContent;
