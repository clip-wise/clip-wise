import React, { useEffect, useState } from "react";
import YoutubeVideoId from "../utils/getYoutubeVideoId";

const SidePanelContent = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [captions, setCaptions] = useState<any[]>([]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("tabs[0]", tabs[0]);
        setActiveTab(tabs[0]);
      }
    });
    // Listen to response from background.js
    chrome.runtime.onMessage.addListener((message, sender, reply) => {
      if (message.type === "captions-to-skip" && message.data) {
        setCaptions(message.data);
      }
    });
  }, []);

  const handleClick = async () => {
    const videoId = YoutubeVideoId(activeTab?.url || "");
    if (videoId) {
      chrome.runtime.sendMessage(
        { type: "fetch-data", videoId },
        (response) => {
          // 3. Got an asynchronous response with the data from the service worker
          console.log("received user data", response);
        }
      );
    }

    if (activeTab?.id) {
      try {
        console.log("activeTab.id", activeTab.id);
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["scripts/content-script.js"],
          world: "MAIN",
        });
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
      <hr />
      <div>
        {captions.map((caption, index) => (
          <p key={index}>{caption.text.slice(0, 50)}...</p>
        ))}
      </div>
    </div>
  );
};

export default SidePanelContent;
