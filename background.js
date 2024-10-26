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

    console.log("captions", captions);

    console.log("Filtering captions");

    const GOOGLE_API_KEY = message.apiKey;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          systemInstruction: {
            role: "user",
            parts: [
              {
                text: `
sYou are a helpful learning assistant. You are provided with the transcript of a youtube video including the timestamps. Go over the transcript and identify the part of the script that is not educational. It may be promotions, unuseful talks or random unrelated information.
With that in mind, I need to know the parts of the video that can be skipped while learning.
Return an array of start and end times that can be skipped without affecting the overall watch quality. Respond with valid JSON.`,
              },
            ],
          },
          generationConfig: {
            temperature: 1,
            topK: 64,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                response: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      start: {
                        type: "number",
                      },
                      end: {
                        type: "number",
                      },
                    },
                  },
                },
              },
            },
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: JSON.stringify(captions),
                },
              ],
            },
          ],
        }),
      }
    );

    let data;
    let error;
    if (response.ok) {
      data = await response.json();
      console.log("data", data);
    } else {
      error = response.status;
      console.log("error", error);
    }

    try {
      const responseData = JSON.parse(
        (data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]").trim()
      );
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
