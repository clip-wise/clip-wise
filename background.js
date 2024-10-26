import { getSubtitles } from "youtube-captions-scraper";

import { generateWithGemini } from "./helpers/generateWithGemini";
import { generateWithGroq } from "./helpers/generateWithGroq";
import { summarizeWithGemini } from "./helpers/summarizeWithGemini";
import { summarizeWithGroq } from "./helpers/summarizeWithGroq";
import { flashcardsWithGemini } from "./helpers/flashcardsWithGemini";
import { flashcardsWithGroq } from "./helpers/flashcardsWithGroq";
import { AIOptions, ChromeMessageTypes } from "./constants";

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
  const { type, providerConfig, videoId } = message;
  const { ai, apiKey } = providerConfig || {};

  if (type == ChromeMessageTypes.Clip && videoId) {
    const transcript = await getSubtitles({
      videoID: videoId,
    });

    console.log("captions", transcript);

    try {
      const { responseData, error } =
        ai === AIOptions.Gemini
          ? await generateWithGemini(apiKey, transcript)
          : await generateWithGroq(apiKey, transcript);
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
  } else if (type == ChromeMessageTypes.Summary) {
    if (!videoId) return;
    const transcript = await getSubtitles({
      videoID: videoId,
    });
    debugger;
    const response =
      ai === AIOptions.Gemini
        ? await summarizeWithGemini(apiKey, transcript)
        : await summarizeWithGroq(apiKey, transcript);
    chrome.runtime.sendMessage({
      type: ChromeMessageTypes.SummaryResponse,
      data: response,
    });
  } else if (message.type == ChromeMessageTypes.FlashCards) {
    console.log("Flash cards", message);
    if (!message.videoId) return;
    const transcript = await getSubtitles({
      videoID: message.videoId,
    });
    const response =
      ai === AIOptions.Gemini
        ? await flashcardsWithGemini(message.apiKey, transcript)
        : await flashcardsWithGroq(message.apiKey, transcript);
    chrome.runtime.sendMessage({
      type: ChromeMessageTypes.FlashCardsResponse,
      data: response,
    });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) {
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false,
    });
    return false;
  }
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url?.origin === "https://www.youtube.com") {
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
