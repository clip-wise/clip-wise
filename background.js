import { getSubtitles } from "youtube-captions-scraper";

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

    // TODO: find captions to skip

    chrome.runtime.sendMessage({ type: "captions-to-skip", data: captions });
  }
});
