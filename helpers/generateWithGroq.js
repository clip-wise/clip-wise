export const generateWithGroq = async (apiKey, captions) => {
  const URL = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(URL, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      model: "llama3-8b-8192",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
      messages: [
        {
          role: "system",
          content: `
          You are tasked with analyzing a YouTube video transcript to identify potential promotional content. The transcript will be provided in a structured format, and your goal is to find any parts that might contain promotional material.
The user will provide the transcript in the following format:
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
Write your answer inside <answer> tags, ensuring the content is valid JSON.
          `,
        },
        {
          role: "user",
          content: `<transcript>${JSON.stringify(
            captions
          ).trim()}</transcript>`,
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
  console.log(
    "parsed groq response",
    JSON.parse(data.choices?.[0]?.message?.content)
  );
  let responseData = JSON.parse(data.choices?.[0]?.message?.content);
  return { responseData, error };
};
