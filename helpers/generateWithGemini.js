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
You are tasked with analyzing a YouTube video transcript to identify potential promotional content. The transcript will be provided in a structured format, and your goal is to find any parts that might contain promotional material.
The user will provide the transcript in the following format:
<transcript>
{{TRANSCRIPT}}
</transcript>
For this task, consider promotional content as any part of the video that appears to be advertising a product, service, or brand that is not directly related to the main content of the video. This could include sponsored segments, product placements, or explicit advertisements.
Carefully analyze the transcript.
If you identify any potential promotional content, you should include it in your output.
Provide your analysis in a JSON format that can be used to manipulate a video player. The JSON should include an array of objects with the following properties:
   - "start": The start time of the promotional segment (in seconds) should be integer without decimal 
   - "end": The end time of the promotional segment (in seconds) should be integer without decimal 
`,
          },
        ],
      },
      generationConfig: {
        temperature: 0.8,
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
                    type: "integer",
                  },
                  end: {
                    type: "integer",
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
              text: `<transcript>${JSON.stringify(captions)}</transcript>`,
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
    (data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]").trim()
  );
  return { responseData, error };
};
