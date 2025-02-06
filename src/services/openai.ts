import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";
import {
  Prompt,
  siteCategoriesMessage,
  wordCountMessage,
} from "../constants/messageConstants";
import AIResponseText from "../components/atoms/AIResponseText";
import { parse } from "best-effort-json-parser";
import { Message } from "../context/MessageContext";
import { Preference } from "../constants/surveyConstants";
import {
  CLUSTERING_SIZE,
  NUMBER_OF_CLUSTERS,
} from "../constants/kMeansConstants";

const openai = new OpenAI({
  // TODO: Disable dangerouslyAllowBrowser after testing!!!!!!!!!!!!!!!!!
  // Remove apiKey from the code and use env instead!!!!!!!!!!!!!!!
  apiKey: import.meta.env.VITE_API_KEY_OPENAI as string,
  dangerouslyAllowBrowser: true,
});

export type OpenAIResponseJSON = {
  labels: { name: string; reasoning: string }[];
};

type OpenAiMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/**
 * Stream chunks of openAI response. It's meant to be rendered with typing animation
 * in the {@link AIResponseText} as soon as it gets the first chunk of the response.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @param history an array of messages representing the conversation history so far.
 * @returns a generator that yields each chunk of the openAI response.
 */
export async function* streamOpenAI(
  prompt: Prompt | undefined,
  history: Message[],
  preferences?: Preference[],
  clusterIndex?: number
): AsyncGenerator<string | OpenAIResponseJSON> {
  if (!prompt) return;

  let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;
  const messages: OpenAiMessage[] = [];

  // 1. Add system messages.
  messages.push({
    role: "system",
    content: getSystemMessage(prompt),
  });

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

  // 2-3. Provide user selection of preferences for clustering pages.
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

  // 3-2. Run openAI with JSON type prompt.
  if (prompt.type === "cluster" || prompt.type === "report") {
    stream = await openai.chat.completions.create({
      messages: [
        ...messages,
        { role: "assistant", content: getAssistantMessage(prompt) },
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
        else if (prompt.type === "cluster" || prompt.type === "report") {
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
export async function runOpenAI(
  prompt: Prompt
): Promise<string | OpenAIResponseJSON> {
  let completion: OpenAI.Chat.Completions.ChatCompletion | null = null;

  // Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "instruction") {
    const content = prompt.content;
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: getSystemMessage(prompt),
        },
        { role: "user", content: content },
      ],
      model: "gpt-4o-mini",
      stream: false,
      response_format: { type: "text" },
    });
  }

  // Run openAI with cluster prompt
  if (prompt.type === "cluster" || prompt.type === "report") {
    const clustersJSON = JSON.stringify(prompt.content);
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: getSystemMessage(prompt),
        },
        {
          role: "assistant",
          content: getAssistantMessage(prompt),
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

/**
 * Get the assistant message for the given prompt.
 */
function getAssistantMessage(prompt: Prompt): string {
  const assistantMessage: OpenAIResponseJSON = { labels: [] };

  if (prompt.type === "cluster") {
    const count = NUMBER_OF_CLUSTERS;
    for (let i = 0; i < count; i++) {
      assistantMessage.labels.push({
        name: `name for the cluster${i + 1}`,
        reasoning: `reasoning for the cluster${i + 1}'s name`,
      });
    }
  } else if (prompt.type === "report") {
    const count = prompt.content.length;

    for (let i = 0; i < count; i++) {
      assistantMessage.labels.push({
        name: `name for the group${i + 1}`,
        reasoning: `reasoning for the group${i + 1}'s name`,
      });
    }
  }

  return JSON.stringify(assistantMessage);
}

/**
 * Get the system message for the given prompt.
 */
function getSystemMessage(prompt: Prompt): string {
  const type = prompt.type === "instruction" ? "text" : prompt.type;

  const count = type === "cluster" ? NUMBER_OF_CLUSTERS : prompt.content.length;

  console.log("count: ", count);

  const prefix = "Assistant is a large language model trained by OpenAI";
  const jsonPrefix =
    "You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language names. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive names that accurately reflect the underlying patterns and relationships.";
  const jsonSuffix = `I want a JSON output with an array of ${count} label object with name and reasoning for each label. Please use "labels" as a key for JSON and store the output array as a value for "labels" key. Be consistent with naming logic and keep the name within four words. For the reasoning part, please keep it under 100 words and specify two distinctive data in number for each object`;

  const message = {
    text: "You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
    cluster: `I will provide you a JSON containing ${count} cluster objects with numeric values for cluster centroids from k-means clustering. I want you to name these clusters with meaningful names based on numeric values.`,
    report: `I will provide you a JSON containing ${count} group objects with an array of three clusters with name, centroids(numeric values for cluster centers means from k-means clustering), and reasoning for each cluster's naming. I want you to label for these ${count} groups with meaningful names based on three clusters' characteristics.`,
  };

  let systemMessage = prefix;

  if (type === "text") {
    systemMessage += message.text;
  } else {
    systemMessage +=
      jsonPrefix + message[type as "cluster" | "report"] + jsonSuffix;
  }

  return systemMessage;
}
