import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";
import { assistantMessage, Prompt, sectionMessages, systemMessage } from "../constants/messageConstants";
import AiResponseText from "../components/atoms/AiResponseText";
import { parse } from "best-effort-json-parser";
import { Message } from "../context/MessageContext";
import { Preference, Section } from "../constants/surveyConstants";

const openai = new OpenAI({
  // Disable dangerouslyAllowBrowser after testing!!!!!!!!!!!!!!!!!
  // Remove apiKey from the code and use env instead!!!!!!!!!!!!!!!
  apiKey: import.meta.env.VITE_API_KEY_OPENAI as string,
  dangerouslyAllowBrowser: true,
});

export type OpenAiResponseJSON = {
  clusters: {name: string, reasoning: string}[];
}

type OpenAiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Stream chunks of openAI response. It's meant to be rendered with typing animation
 * in the {@link AiResponseText} as soon as it gets the first chunk of the response.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @param history an array of messages representing the conversation history so far.
 * @returns a generator that yields each chunk of the openAI response.
 */
export async function* streamOpenAI(
  prompt: Prompt,
  history: Message[],
  // preferences: Preference[] 
): AsyncGenerator<string | OpenAiResponseJSON> {
  let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;
  
  // Filter out "section" type messages as section descriptions are not necessary
  // for tracking the conversation context between the user and the AI.
  const filteredHistory: Message[] = history.filter(
    (message) => message.type === "text" || message.type === "cluster"
  );
  
  const messages: OpenAiMessage[] = [];
  
  // 1. Add system messages.
  if (prompt.type === "text" || prompt.type === "section") { 
    messages.push({
      role: "system",
      content: systemMessage.text
    })
  } else if (prompt.type === "cluster") {
    messages.push({
      role: "system",
      content: systemMessage.cluster
    })
  }

  // 2. Add contextual messages from the conversation history.
  filteredHistory.forEach((message) => {
    if (message.user.length > 0) {
      const user: OpenAiMessage = {
        role: "user",
        content: message.user
      };
      messages.push(user);
    }
    if (message.ai.length > 0) {
      const ai: OpenAiMessage = {
        role: "assistant",
        content: message.ai
      };
      messages.push(ai);
    }
  });

  // 3. Add contextual messages from the preferences.
  // const  = preferences.map((preference) => {

  // });

  // 4. Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "section") {
    stream = await openai.chat.completions.create({
      messages: [...messages, 
        {
          role: "user", 
          content: prompt.type === "text" ? prompt.content : sectionMessages[prompt.content]
        }],
      model: "gpt-4o-mini",
      stream: true,
      response_format: { type: "text" },
    });
  }

  // 4. Run openAI with cluster prompt.
  if (prompt.type === "cluster") {
    stream = await openai.chat.completions.create({
      messages: [...messages, 
        {role: "assistant", content: assistantMessage},
        {role: "user", content: JSON.stringify(prompt.content)}
      ],
      model: "gpt-4o-mini",
      stream: true,
      response_format: { type: "json_object" },
    });
  }

  // 5. Yield each chunk of the response as it becomes available.
  if (stream) {
    let accumulatedResponse = "";

    try {
      for await (const chunk of stream) {
        if (!chunk.choices[0]?.delta?.content) continue;

        const content = chunk.choices[0].delta.content;
        accumulatedResponse += content;

        // Yield the text type content
        if (prompt.type === "text" || prompt.type === "section") {
          yield content;
        }

        // Yield the JSON object type content
        else if (prompt.type === "cluster") {
          let parsedData;
          try {
            parsedData = parse(accumulatedResponse);
          } catch (error) {
            console.error("Parsing failed due to incomplete JSON:", error);
            continue;
          }
          if (parsedData) {
            yield parsedData;
          }
        }
      }
    } catch (error) {
      console.error("Error streaming responses:", error);
      throw error;
    }
  }
}

/**
 * Fetch openAI response at once. It is not tracking the conversation context.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @returns openAI response.
 */
export async function runOpenAI(prompt: Prompt): Promise<string> {
  let completion: OpenAI.Chat.Completions.ChatCompletion | null = null;

  // Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "section") {
    const content: string = prompt.type === "text" ? prompt.content : sectionMessages[prompt.content];
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage.text
        },
        { role: "user", content: content},
      ],
      model: "gpt-4o-mini",
      stream: false,
      response_format: { type: "text" },
    });
  }

  // Run openAI with cluster prompt
  if (prompt.type === "cluster") {
    const clustersJSON = JSON.stringify(prompt.content);
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage.cluster
        },
        {
          role: "assistant",
          content: assistantMessage
        },
        { role: "user", content: clustersJSON },
      ],
      model: "gpt-4o-mini",
      stream: false,
      response_format: { type: "json_object" },
    });
  }

  return completion!.choices[0].message.content!;
}