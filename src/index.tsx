// @ts-ignore
import React, { useEffect, useState } from "react";
import YoutubeVideoId from "./utils/getYoutubeVideoId";
import { useProviderConfig } from "./hooks/useProviderConfig";
import { Settings } from "./components/Settings/index";
import "./SidePanelContent.css";
import NavigationBar from "./components/NavigationBar/index";
import ErrorMessage from "./components/ErrorMessage";
import MainContent from "./components/MainContent";
import { Captions, Flashcard, SkipTime } from "./types";
import ProcessingIcon from "./components/ProcessIcon";
import { Actions, ChromeMessageTypes } from "../constants";
import TakeNotes from "./components/TakeNotes";
import ReactMarkdown from "react-markdown";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import FlashCard from "./components/FlashCard";

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
            skipTime.start <= currentTime &&
            skipTime.end >= currentTime
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
    data: [],
    error: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { providerConfig, hasApiKey, saveApiKey } = useProviderConfig();
  const [showSettings, setShowSettings] = useState(false);
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState<string | undefined>();
  const [copiedText, copy] = useCopyToClipboard();
  const [showCopied, setShowCopied] = useState(false);
  const [ui, setUi] = useState<"take-notes" | "flashcards" | "default">(
    "default"
  );

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

  const handleClipResponse = (message: any) => {
    if (message?.data?.length !== 0) {
      const responseData = (message.data?.response || message.data).map(
        (v: any) => ({
          start: parseFloat(v.start_time),
          end: parseFloat(v.end_time),
        })
      );
      setCaptions({
        data: responseData,
      });

      console.log("Active tab", activeTab?.id);
      if (activeTab?.id) {
        setSkipTimes(activeTab?.id, responseData);
      }
    } else {
      setCaptions({
        data: [],
        error: "Something went wrong",
      });
    }
    setLoading(undefined);
  };

  const handleSummaryResponse = (message: any) => {
    setSummary(message.data);
    setLoading(undefined);
  };

  const handleFlashCardsResponse = (message: any) => {
    setFlashcards(message.data);
    setLoading(undefined);
  };

  const handleCallback = async (message: any, sender: any, reply: any) => {
    if (message.type === ChromeMessageTypes.ClipResponse) {
      handleClipResponse(message);
    } else if (message.type === ChromeMessageTypes.SummaryResponse) {
      handleSummaryResponse(message);
    } else if (message.type === ChromeMessageTypes.FlashCardsResponse) {
      handleFlashCardsResponse(message);
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleCallback);

    return () => {
      chrome.runtime.onMessage.removeListener(handleCallback);
    };
  }, [activeTab?.id]);

  useEffect(() => {
    const injectScript = async () => {
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
    injectScript();
  }, [activeTab?.id]);

  const handleActionClip = async () => {
    const videoId = YoutubeVideoId(activeTab?.url || "");
    if (videoId) {
      chrome.runtime.sendMessage({
        type: ChromeMessageTypes.Clip,
        videoId,
        providerConfig,
      });
      setCaptions({ data: [] });
      setLoading(Actions.Clip);
    }
  };

  const handleActionSummary = () => {
    const videoId = YoutubeVideoId(activeTab?.url || "");

    chrome.runtime.sendMessage({
      type: ChromeMessageTypes.Summary,
      videoId,
      providerConfig,
    });
    setLoading(Actions.Summary);
  };

  const handleActionFlashCards = () => {
    if (providerConfig.ai === "groq") {
      // Flash cards are not available for Groq provider
      setError("Flash cards are not available for the Groq provider.");
      return;
    }
    const videoId = YoutubeVideoId(activeTab?.url || "");
    chrome.runtime.sendMessage({
      type: ChromeMessageTypes.FlashCards,
      videoId,
      providerConfig,
    });
    setLoading(Actions.FlashCards);
    setUi(Actions.FlashCards as "flashcards");
  };

  const handleActionClick = (action: string) => {
    setSummary("");
    setCaptions({ data: [] });
    setError(null);
    if (action === Actions.Clip) {
      handleActionClip();
    } else if (action === Actions.Summary) {
      handleActionSummary();
    } else if (action === Actions.TakeNotes) {
      setUi(Actions.TakeNotes as "take-notes");
      return;
    } else if (action === Actions.FlashCards) {
      handleActionFlashCards();
    } else {
      // Implement the logic for each action
      console.log(`Missing Handler for the Action: <bold>${action}</bold>`);
    }
    console.log("sending action message", action);

    chrome.runtime.sendMessage({ type: action });
  };

  const handleCopyToClipboard = () => {
    copy(summary);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 800);
  };

  if (showSettings) {
    return (
      <>
        <NavigationBar
          title="ClipWise"
          showSettings={showSettings}
          toggleSettings={() => setShowSettings(!showSettings)}
        />
        <Settings
          onSubmit={saveApiKey}
          closeSettings={() => setShowSettings(false)}
        />
      </>
    );
  }

  return (
    <>
      <NavigationBar
        title="ClipWise"
        showSettings={showSettings}
        toggleSettings={() => setShowSettings(!showSettings)}
      />
      {ui === "default" && (
        <div className="overflow-y-auto flex-1 p-4">
          {error && <ErrorMessage message={error} />}
          <MainContent
            onActionClick={handleActionClick}
            disableOptions={!!loading}
          />
          <div className="mt-4">
            {loading ? (
              <div className="flex flex-col justify-start items-center gap-y-2">
                <ProcessingIcon />
                <p className="mr-2">Processing...</p>
              </div>
            ) : (
              <div>
                {captions?.data?.length > 0 && (
                  <p className="text-xl">Skipped Interval</p>
                )}
                <ul>
                  {captions.data.map((caption: any, index) => (
                    <li key={index} className="mb-2">
                      <span className="text-lg">Starts = </span>
                      <span>{caption.start} seconds;&nbsp;</span>
                      <span className="text-lg">Ends = </span>
                      <span>{caption.end} seconds;&nbsp;</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {captions.error && (
              <p className="italic text-red-600">{captions.error}</p>
            )}
          </div>
          {summary && (
            <div className="mt-1">
              <div className="flex gap-x-2 justify-start">
                <h2 className="text-lg text-bold">Summary of the Video</h2>
                <span>
                  {!showCopied ? (
                    <Clipboard
                      onClick={handleCopyToClipboard}
                      className="cursor-pointer"
                    />
                  ) : (
                    <ClipboardCheck color="green" />
                  )}
                </span>
              </div>
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
      {ui === "take-notes" && (
        <div className="flex-1 p-4">
          <button
            onClick={() => setUi("default")}
            className="px-4 py-2 mb-4 bg-gray-200 rounded"
          >
            ← Back
          </button>
          <p className="mb-4">Take notes in this rich text experience.</p>
          <div className="rounded border border-gray-300">
            <TakeNotes url={activeTab?.url || ""} />
          </div>
        </div>
      )}
      {ui === "flashcards" && (
        <div className="flex-1 p-4">
          <button
            onClick={() => setUi("default")}
            className="px-4 py-2 mb-4 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading === Actions.FlashCards}
          >
            ← Back
          </button>
          <FlashCard
            flashcards={flashcards}
            isLoading={loading === Actions.FlashCards}
          />
        </div>
      )}
    </>
  );
};

export default SidePanelContent;
