import { getSubtitles } from "youtube-captions-scraper";

import { generateWithGemini } from "./helpers/generateWithGemini";
import { generateWithGroq } from "./helpers/generateWithGroq";
import { summarizeWithGemini } from "./helpers/summarizeWithGemini";
import { ChromeMessageTypes } from "./constants";

const isFirefoxLike =
  process.env.EXTENSION_PUBLIC_BROWSER === "firefox" ||
  process.env.EXTENSION_PUBLIC_BROWSER === "gecko-based";

if (isFirefoxLike) {
  browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.open();
  });
} else {
  chrome.action.onClicked.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  });
}

chrome.runtime.onMessage.addListener(async function (message, sender, reply) {
  if (message.type == ChromeMessageTypes.Clip && message.videoId) {
    const videoID = message.videoId;
    const captions = await getSubtitles({
      videoID,
    });

    console.log("captions", captions);

    try {
      const { responseData, error } =
        message.AI === "gemini"
          ? await generateWithGemini(message.apiKey, captions)
          : await generateWithGroq(message.apiKey, captions);
      chrome.runtime.sendMessage({
        type: ChromeMessageTypes.ClipResponse,
        data: responseData,
        error,
      });
    } catch (error) {
      chrome.runtime.sendMessage({
        type: ChromeMessageTypes.ClipResponse,
        data: [],
        error: error.message,
      });
    }
  } else if (message.type == ChromeMessageTypes.Summarize) {
    if (!message.videoId) return;
    const captions = await getSubtitles({
      videoID: message.videoId,
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === "https://www.youtube.com") {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "side_panel/default_path.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });

    try {
      const response = await summarizeWithGemini(message.apiKey, captions);
      console.log("Clip response", response);
    } catch (error) {
      console.log("Clip error", error);
    }
  }
});
