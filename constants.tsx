export const ChromeMessageTypes = {
  Clip: "clip",
  ClipResponse: "clip-response",
  Summary: "summarize",
  SummaryResponse: "summarize-response",
  TakeNotes: "take-notes",
  TakeNotesResponse: "take-notes-response",
  FlashCards: "flashcards",
  FlashCardsResponse: "flashcards-response",
};

export const Actions = {
  Clip: "clip",
  TakeNotes: "take-notes",
  FlashCards: "flashcards",
  Summary: "summary",
};

export enum AIOptions {
  Gemini = "gemini",
  Groq = "groq",
}
