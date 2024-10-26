import { getSubtitles } from "youtube-captions-scraper";

import { generateWithGemini } from "./helpers/generateWithGemini";
import { generateWithGroq } from "./helpers/generateWithGroq";

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
  if (message.type == "fetch-data" && message.videoId) {
    const videoID = message.videoId;
    const captions = await getSubtitles({
      videoID,
    });

    console.log("captions", captions);

    try {
      const { responseData, error } =
        message.AI === "gemini"
          ? generateWithGemini(message.apiKey, captions)
          : generateWithGroq(message.apiKey, captions);
      chrome.runtime.sendMessage({
        type: "captions-to-skip",
        data: responseData,
        error,
      });
    } catch (error) {
      chrome.runtime.sendMessage({
        type: "captions-to-skip",
        data: [],
        error: error.message,
      });
    }
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
  }
});
