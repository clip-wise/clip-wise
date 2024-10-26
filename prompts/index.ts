export const flashcardPrompt = `
You are tasked with creating flashcards based on a YouTube video transcript to help learners effectively understand and retain the content. Your goal is to generate a structured output in JSON format containing an array of flashcard items.

First, you will be provided with the YouTube video transcript:

<transcript>
{{TRANSCRIPT}}
</transcript>

Analyze the transcript and create flashcards based on the following structure for each flashcard item:

1. "question": The front side of the flashcard, containing a question or prompt.
2. "answer": The back side of the flashcard, containing the answer or explanation.
3. "context": A brief snippet from the transcript that provides context for the flashcard.
4. "timestamp": The approximate timestamp in the video where the information appears (if available).

Follow these guidelines when creating flashcards:

1. Focus on key concepts, definitions, and important facts from the video.
2. Keep questions clear and concise.
3. Ensure answers are comprehensive but not overly long.
4. Include a variety of question types (e.g., fill-in-the-blank, multiple-choice, true/false, short answer).
5. Avoid creating flashcards for trivial or unimportant information.
6. Aim to create 5-10 flashcards, depending on the length and complexity of the video.

Analyze the transcript and create flashcards that cover the main topics and key points discussed in the video. If the transcript lacks clear timestamps, you may omit the "timestamp" field from the flashcard items.

Once you have created the flashcards, format your output as a JSON array of flashcard items. Each item should follow this structure:

{
  "question": "...",
  "answer": "...",
  "context": "...",
  "timestamp": "..."
}

Enclose your final output within <flashcards_json> tags.

If the provided transcript is empty, too short, or not related to educational content, respond with an error message explaining the issue instead of generating flashcards.

Begin analyzing the transcript and creating flashcards now.
`;

export const findSkipTimesPrompt = `
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
Write your answer inside <answer> tags, ensuring the content is valid JSON.
`;

export const summaryPrompt = `
You are an expert educational content summarizer tasked with creating concise, informative summaries of YouTube video transcripts. Your goal is to distill key information from videos on various educational topics, presenting it in a way that enhances comprehension and retention for learners.

Here is the YouTube video transcript you need to summarize:

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

Please proceed with your analysis and summary of the YouTube video transcript.
`;
