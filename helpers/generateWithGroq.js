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
          content:
            "You are a helpful learning assistant. You are provided with the transcript of a youtube video including the timestamps. Go over the transcript and identify the part of the script that is not educational. It may be promotions, unuseful talks or random unrelated information.\nWith that in mind, I need to know the parts of the video that can be skipped while learning.\nReturn only an array of start and end times that can be skipped without affecting the overall watch quality. Respond with valid JSON.\nOnly include the skip durations that are more than 3 seconds.",
        },
        {
          role: "user",
          content: JSON.stringify(captions),
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
  const responseData = JSON.parse(data.choices?.[0]?.message?.content);
  return { responseData, error };
};
