import React, { useEffect, useState } from "react";
import YoutubeVideoId from "../utils/getYoutubeVideoId";
import { useApiKey } from "./hooks/useApiKey";
import { ApiKeyInput } from "./components/ApiKeyInput";
import "./SidePanelContent.css";

type SkipTime = { start: number; end: number };

const fn = (skipTimes: SkipTime[]) => {
  if (!(window as any).skipTimesTimer) {
    (window as any).skipTimes = skipTimes;
    (window as any).skipTimesTimer = setInterval(() => {
      const skipTimes = (window as any).skipTimes as SkipTime[];
      const video = document.querySelector(
        ".html5-video-player"
      ) as HTMLVideoElement;

      const currentTime = (video as any).getCurrentTime();
      if (skipTimes) {
        const skipTime = skipTimes.find(
          (skipTime) =>
            skipTime.start <= currentTime && skipTime.end >= currentTime
        );
        if (skipTime) {
          (video as any)?.seekTo(skipTime.end);
        }
      }
    }, 1000);
  }
  (window as any).skipTimes = skipTimes;
};

const SidePanelContent = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [captions, setCaptions] = useState<{
    loading: boolean;
    data: SkipTime[];
  }>({
    loading: false,
    data: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { apiKey, hasApiKey, saveApiKey, clearApiKey } = useApiKey();

  const setSkipTimes = async (activeTabId: number, skipTimes: SkipTime[]) => {
    await chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      func: fn,
      args: [skipTimes],
      world: "MAIN",
    });
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        setActiveTab(tabs[0]);
      }
    });
  }, []);

  const handleCallback = async (message: any, sender: any, reply: any) => {
    if (message.type === "captions-to-skip") {
      console.log("message-data", message.data);
      if (message.data?.length !== 0) {
        const responseData = message.data.map((v: any) => ({
          start: parseFloat(v.start),
          end: parseFloat(v.end),
        }));
        setCaptions({
          data: responseData,
          loading: false,
        });
        console.log("Active tab", activeTab?.id);
        if (activeTab?.id) {
          setSkipTimes(activeTab?.id, responseData);
        }
      } else {
        setCaptions({ data: [], loading: false });
      }
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleCallback);

    return () => {
      chrome.runtime.onMessage.removeListener(handleCallback);
    };
  }, [activeTab?.id]);

  const handleStart = async () => {
    const videoId = YoutubeVideoId(activeTab?.url || "");
    if (videoId) {
      chrome.runtime.sendMessage(
        { type: "fetch-data", videoId, apiKey },
        (response) => {
          console.log("received user data", response);
        }
      );
      setCaptions({ loading: true, data: [] });
    }

    if (activeTab?.id) {
      try {
        await chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ["scripts/content-script.js"],
          world: "MAIN",
        });
        setError(null);
      } catch (error) {
        console.error("Error injecting script:", error);
        setError(`An error occurred while starting the extension: ${error}`);
      }
    } else {
      setError(
        "Please navigate to a YouTube video page to use this extension."
      );
    }
  };

  if (!hasApiKey) {
    return <ApiKeyInput onSubmit={saveApiKey} />;
  }

  return (
    <div className="side-panel-content">
      <h1 className="title">ClipWise</h1>
      {error && (
        <div className="error-message" role="alert">
          <strong>Error: </strong>
          <span>{error}</span>
        </div>
      )}
      <div className="api-key-section">
        <p>API Key is set for Google Gemini. You're ready to go!</p>
        <button
          onClick={handleStart}
          className="start-button"
          disabled={captions.loading}
        >
          Start
        </button>
        <button onClick={clearApiKey} className="change-key-button">
          Change API Key
        </button>
      </div>
      <hr className="divider" />
      <div className="captions-section">
        {captions.loading ? (
          <p>Processing...</p>
        ) : (
          captions.data.map((caption, index) => (
            <p key={index}>{JSON.stringify(caption)}...</p>
          ))
        )}
      </div>
    </div>
  );
};

export default SidePanelContent;
