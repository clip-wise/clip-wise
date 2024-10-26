import React, { useEffect, useState } from "react";
import YoutubeVideoId from "./utils/getYoutubeVideoId";
import { useApiKey } from "./hooks/useApiKey";
import ApiKeyInput from "./components/ApiKeyInput/index";
import "./SidePanelContent.css";
import NavigationBar from "./components/NavigationBar/index";
import ErrorMessage from "./components/ErrorMessage";
import MainContent from "./components/MainContent";
import { Captions, SkipTime } from "./types";
import ProcessingIcon from "./components/ProcessIcon";
import { Actions, ChromeMessageTypes } from "../constants";
import TakeNotes from "./components/TakeNotes";

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
    error: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { apiKey, hasApiKey, saveApiKey, clearApiKey } = useApiKey();

  const [ui, setUi] = useState<"take-notes" | "default">("default");

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
    if (message.type === ChromeMessageTypes.ClipResponse) {
      console.log("message-data", message.data);
      if (message?.data?.length !== 0) {
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
        setCaptions({
          data: [],
          loading: false,
          error: "Something went wrong",
        });
      }
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleCallback);

    return () => {
      chrome.runtime.onMessage.removeListener(handleCallback);
    };
  }, [activeTab?.id]);

  const handleActionClip = async () => {
    const videoId = YoutubeVideoId(activeTab?.url || "");
    if (videoId) {
      chrome.runtime.sendMessage({
        type: ChromeMessageTypes.Clip,
        videoId,
        apiKey,
      });
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

  const handleActionSummary = () => {
    const videoId = YoutubeVideoId(activeTab?.url || "");

    chrome.runtime.sendMessage({ type: ChromeMessageTypes.Summarize, videoId });
  };

  const handleActionClick = (action: string) => {
    if (action === Actions.Clip) {
      handleActionClip();
      return;
    }
    if (action === Actions.Summary) {
      handleActionSummary();
      return;
    }
    if (action === "take-notes") {
      setUi("take-notes");
      return;
    }

    // Implement the logic for each action
    console.log(`Missing Handler for the Action: <bold>${action}</bold>`);
    chrome.runtime.sendMessage({ type: action });
  };

  if (!hasApiKey) {
    return <ApiKeyInput onSubmit={saveApiKey} />;
  }

  return (
    <>
      <NavigationBar title="ClipWise" onClearApiKey={clearApiKey} />
      {ui === "default" && (
        <div className="side-panel-content">
          {error && <ErrorMessage message={error} />}
          <MainContent
            onActionClick={handleActionClick}
            disableOptions={captions.loading}
          />
          <div className="captions-section">
            {captions.loading ? (
              <div className="processing">
                <p>Processing...</p>
                <ProcessingIcon />
              </div>
            ) : (
              captions.data.map((caption, index) => (
                <p key={index}>{JSON.stringify(caption)}...</p>
              ))
            )}
            {captions.error && (
              <p className="italic text-red-600">{captions.error}</p>
            )}
          </div>
        </div>
      )}
      {ui === "take-notes" && (
        <div className="side-panel-content pl-0">
          <button onClick={() => setUi("default")} className="px-4">
            ← Back
          </button>
          <p className="px-4 mb-2">Take notes in this rich text experience.</p>
          <div className="border">
            <TakeNotes url={activeTab?.url || ""} />
          </div>
        </div>
      )}
    </>
  );
};

export default SidePanelContent;
