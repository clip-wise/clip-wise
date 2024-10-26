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
Here is the transcript you need to analyze:
<transcript>
{{TRANSCRIPT}}
</transcript>
For this task, consider promotional content as any part of the video that appears to be advertising a product, service, or brand that is not directly related to the main content of the video. This could include sponsored segments, product placements, or explicit advertisements.
Carefully analyze the transcript and look for:
1. Sudden mentions of specific brands or products
2. Segments that seem out of place with the rest of the content
3. Language typically used in advertisements (e.g., "sponsored by", "brought to you by", etc.)
4. Calls to action related to purchasing or using a product or service
If you identify any potential promotional content, you should include it in your output. If you don't find any promotional content, state that in your output.
Provide your analysis in a JSON format that can be used to manipulate a video player. The JSON should include:
1. A boolean field "contains_promotion" indicating whether promotional content was found
2. An array field "promotional_segments" containing objects with the following properties:
   - "start_time": The start time of the promotional segment (in seconds)
   - "end_time": The end time of the promotional segment (in seconds)
   - "content": The text content of the promotional segment
Before providing your final answer, think carefully about your analysis and make sure you've considered all parts of the transcript.
Write your answer inside <answer> tags, ensuring the content is valid JSON.`,
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
