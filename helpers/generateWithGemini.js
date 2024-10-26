export const generateWithGemini = async (apiKey, captions) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: `
The user will provide a transcript of a Youtube video. Analyse the video and identify the promotional segments in it.
A promotional content is any part of the video that appears to be advertising a product, service, or brand that is not directly related to the main content of the video. 

Return a valid JSON should include an array of promotional segments with the values of 'start_time' and 'end_time' in seconds without decimals:
I will run JSON.parse on the response and skip the promotional segments while playing the video, so be careful with the format of the response.`,
          },
        ],
      },
      generationConfig: {
        temperature: 1,
        topK: 64,
        topP: 0.95,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
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
  });

  let data;
  let error;
  if (response.ok) {
    data = await response.json();
    console.log("data", data);
  } else {
    error = response.status;
    console.log("error", error);
  }
  const responseData = JSON.parse(
    (data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() || "[]").trim()
  );
  return { responseData, error };
};
