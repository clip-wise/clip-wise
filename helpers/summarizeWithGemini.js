export const summarizeWithGemini = async (apiKey, captions) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: `You are an expert educational content summarizer tasked with creating concise, informative summaries of YouTube video transcripts. Your goal is to distill key information from videos on various educational topics, presenting it in a way that enhances comprehension and retention for learners.
User will be send the transcript in the following format:
<youtube_transcript>
{{YOUTUBE_TRANSCRIPT}}
</youtube_transcript>
Before creating the final summary, please analyze the transcript and break down your thought process inside <transcript_breakdown> tags. Consider the following points in your analysis:
1. Identify the main topic and overall purpose of the video.
2. Determine the key speakers or characters, if applicable.
3. Note the setting or context of the video content.
4. Identify the video's structure (e.g., lecture, demonstration, interview).
5. Highlight the most important events, concepts, or dialogues.
6. Note any visual elements or graphics mentioned in the transcript.
7. Consider potential learning points or takeaways.
8. Outline the video's progression or main sections.
After your analysis, create a structured summary of the video content using the following format:
<summary>
1. Video Title/Topic:
[Provide a concise title or topic description]
2. Main Characters/Speakers:
[List main characters or speakers, if applicable]
3. Setting/Context:
[Briefly describe the setting or context of the video]
4. Key Events/Dialogue Summary:
[Provide a concise narrative of the most important points, events, or dialogues]
5. Learning Points:
- [Point 1]
- [Point 2]
- [Point 3]
(List 3-5 main takeaways or lessons from the content)
</summary>
Important guidelines for creating your summary:
1. Ensure your summary is applicable to various educational topics and not focused on any specific subject area.
2. Keep the summary concise yet informative, aiming for a length that can be read in 2-3 minutes.
3. Use clear, simple language to ensure accessibility for learners at various levels.
4. Focus on creating a summary that will effectively aid in learning and comprehension of the video content, regardless of the specific topic.
Please proceed with your analysis and summary of the YouTube video transcript.`,
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
              text: `<youtube_transcript>${JSON.stringify(
                captions.map((caption) => caption.text)
              )}</youtube_transcript>`,
            },
          ],
        },
      ],
    }),
  });

  return response.json();
};
