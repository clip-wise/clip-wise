import { flashcardPrompt } from "../prompts";

export const flashcardsWithGemini = async (apiKey, captions) => {
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(URL, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: flashcardPrompt,
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
              text: `<transcript>${JSON.stringify(
                captions.map((caption) => caption.text)
              )}</transcript>`,
            },
          ],
        },
      ],
    }),
  });

  const json = await response.json();
  const string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const regex = /<flashcards_json>([\s\S]*?)<\/flashcards_json>/;
  console.log("string", string);

  const match = string.match(regex);
  console.log("match", match);
  if (match) {
    console.log("match", match);
    const flashcards_json = match[1];
    return JSON.parse(flashcards_json);
  } else {
    return [];
  }
};
