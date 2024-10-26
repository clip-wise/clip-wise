import { flashcardPrompt } from "../prompts";

export const flashcardsWithGroq = async (apiKey, captions) => {
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
      stop: null,
      messages: [
        {
          role: "system",
          content: flashcardPrompt,
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

  const json = await response.json();
  const string = json.choices?.[0]?.message?.content;

  const regex = /<flashcards_json>([\s\S]*?)<\/flashcards_json>/;

  const match = string.match(regex);
  if (match) {
    const flashcards_json = match[1];
    return flashcards_json;
  } else {
    return string;
  }
};
