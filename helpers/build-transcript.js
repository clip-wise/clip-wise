export const buildTranscript = (transcript) => {
  return transcript
    .map((item) => {
      return `${item.text}\n`;
    })
    .join('');
};
