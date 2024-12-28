import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";
import {
  assistantMessage,
  Prompt,
  siteCategoriesMessage,
  systemMessage,
  wordCountMessage,
} from "../constants/messageConstants";
import AiResponse from "../components/atoms/AiResponse";
import { parse } from "best-effort-json-parser";
import { Message } from "../context/MessageContext";
import { Preference } from "../constants/surveyConstants";
import { CLUSTERING_SIZE } from "../constants/kMeansConstants";

const openai = new OpenAI({
  // Disable dangerouslyAllowBrowser after testing!!!!!!!!!!!!!!!!!
  // Remove apiKey from the code and use env instead!!!!!!!!!!!!!!!
  apiKey: import.meta.env.VITE_API_KEY_OPENAI as string,
  dangerouslyAllowBrowser: true,
});

export type OpenAiResponseJSON = {
  clusters: { name: string; reasoning: string }[];
};

type OpenAiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * Stream chunks of openAI response. It's meant to be rendered with typing animation
 * in the {@link AiResponse} as soon as it gets the first chunk of the response.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @param history an array of messages representing the conversation history so far.
 * @returns a generator that yields each chunk of the openAI response.
 */
export async function* streamOpenAI(
  prompt: Prompt,
  history: Message[],
  preferences?: Preference[],
  clusterIndex?: number
): AsyncGenerator<string | OpenAiResponseJSON> {
  let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;
  const messages: OpenAiMessage[] = [];

  // 1. Add system messages.
  if (prompt.type === "text" || prompt.type === "instruction") {
    messages.push({
      role: "system",
      content: systemMessage.text,
    });
  } else if (prompt.type === "cluster") {
    messages.push({
      role: "system",
      content: systemMessage.cluster,
    });
  }

  // 2-1. Provide the conversation history for context.
  history.forEach((message) => {
    if (message.user.length > 0) {
      const user: OpenAiMessage = {
        role: "user",
        content: message.user,
      };
      messages.push(user);
    }
    if (message.ai.length > 0) {
      const ai: OpenAiMessage = {
        role: "assistant",
        content: message.ai,
      };
      messages.push(ai);
    }
  });

  // 2-2. Provide all preference categories for context.
  messages.push({
    role: "user",
    content: siteCategoriesMessage,
  });

  // 2-3. Provide user selection of preferences for context.
  if (preferences && clusterIndex) {
    const startIndex = CLUSTERING_SIZE * clusterIndex;
    messages.push({
      role: "user",
      content: `Among the list of site preference categories, the user ranked the categories in the following order: ${preferences
        .map((pref) => pref.category)
        .join(
          ", "
        )}. In this clustering analysis session, the user is focusing on the ${
        preferences[startIndex].category
      } and ${
        preferences[startIndex + 1].category
      } categories. When you are asked questions regarding categories, please refer to the list of subcategories under each category.`,
    });
  }

  // 2-4. Provide the word count instruction.
  messages.push({
    role: "user",
    content: wordCountMessage,
  });

  // 3-1. Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "instruction") {
    stream = await openai.chat.completions.create({
      messages: [
        ...messages,
        {
          role: "user",
          content: prompt.content,
        },
      ],
      model: "gpt-4o-mini",
      stream: true,
      response_format: { type: "text" },
    });
  }

  // 3-2. Run openAI with cluster prompt.
  if (prompt.type === "cluster") {
    stream = await openai.chat.completions.create({
      messages: [
        ...messages,
        { role: "assistant", content: assistantMessage },
        { role: "user", content: JSON.stringify(prompt.content) },
      ],
      model: "gpt-4o-mini",
      stream: true,
      response_format: { type: "json_object" },
    });
  }

  // 4. Yield each chunk of the response as it becomes available.
  if (stream) {
    let accumulatedResponse = "";

    try {
      for await (const chunk of stream) {
        if (!chunk.choices[0]?.delta?.content) continue;

        const content = chunk.choices[0].delta.content;
        accumulatedResponse += content;

        // Yield the text type content
        if (prompt.type === "text" || prompt.type === "instruction") {
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
 * Fetch openAI response at once. It is not tracking the conversation history.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @returns openAI response.
 */
export async function runOpenAI(prompt: Prompt): Promise<string> {
  let completion: OpenAI.Chat.Completions.ChatCompletion | null = null;

  // Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "instruction") {
    const content = prompt.content;
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemMessage.text,
        },
        { role: "user", content: content },
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
          content: systemMessage.cluster,
        },
        {
          role: "assistant",
          content: assistantMessage,
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
