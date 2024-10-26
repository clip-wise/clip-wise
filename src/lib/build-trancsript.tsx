import { YoutubeTranscriptItem } from '../types/YoutubeTranscriptResult';

export const buildTranscript = (transcript: YoutubeTranscriptItem[]) => {
  return transcript
    .map((item) => {
      return `${item.text}\n`;
    })
    .join('');
};
