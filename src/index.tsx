import React, { useEffect, useState } from "react";
import YoutubeVideoId from "./utils/getYoutubeVideoId";
import { useApiKey } from "./hooks/useApiKey";
import ApiKeyInput from "./components/ApiKeyInput/index";
import "./SidePanelContent.css";
import NavigationBar from "./components/NavigationBar/index";
import ErrorMessage from "./components/ErrorMessage";
import MainContent from "./components/MainContent";
import CaptionSection from "./components/CaptionSection";
import { Captions, SkipTime } from "./types";

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
  const [captions, setCaptions] = useState<Captions>({
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
        const responseData = (message.data?.response || message.data).map(
          (v: any) => ({
            start: parseFloat(v.start),
            end: parseFloat(v.end),
          })
        );
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

  const handleActionClick = (action: string) => {
    if (action === "clip") {
      handleStart();
      return;
    }

    // Implement the logic for each action
    console.log(`Action clicked: ${action}`);
    chrome.runtime.sendMessage({ type: action });
  };

  if (!hasApiKey) {
    return <ApiKeyInput onSubmit={saveApiKey} />;
  }

  return (
    <>
      <NavigationBar title="ClipWise" onClearApiKey={clearApiKey} />
      <div className="side-panel-content">
        {error && <ErrorMessage message={error} />}
        <MainContent onActionClick={handleActionClick} />
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
    </>
  );
};

export default SidePanelContent;
