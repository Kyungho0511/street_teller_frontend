import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";
import { Prompt, promptPresets } from "../constants/messageConstants";
import AiResponseText from "../components/atoms/AiResponseText";
import { parse } from "best-effort-json-parser";

const openai = new OpenAI({
  // Disable dangerouslyAllowBrowser after testing!!!!!!!!!!!!!!!!!
// Remove apiKey from the code and use env instead!!!!!!!!!!!!!!!
  apiKey: import.meta.env.VITE_API_KEY_OPENAI as string,
  dangerouslyAllowBrowser: true,
});

export type OpenAiResponseJSON = {
  clusters: {name: string, reasoning: string}[];
}

/**
 * Stream chunks of openAI response. It's meant to be rendered with typing animation
 * in the {@link AiResponseText} as soon as it gets the first chunk of the response.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @returns a generator that yields each chunk of the openAI response.
 */
export async function* streamOpenAI(prompt: Prompt): AsyncGenerator<string | OpenAiResponseJSON> {
  let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;

  // Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "section") {
    const content: string = prompt.type === "text" ? prompt.content : promptPresets[prompt.content];
    stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
        },
        { role: "user", content: content},
      ],
      model: "gpt-4o-mini",
      stream: true,
      response_format: { type: "text" },
    });
  }

  if (prompt.type === "cluster") {
    const clustersJSON = JSON.stringify(prompt.content);
    stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language labels. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive labels that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing four objects representing clusters with numeric values for cluster centers means from k-means clustering. I want you to label each cluster with meaningful names based on numeric values",
        },
        {
          role: "assistant",
          content:
            '{"clusters": [{"name": "name for cluster1", "reasoning": "reasoning for cluster1"}, {"name": "name for cluster2", "reasoning": "reasoning for cluster2"}, {"name": "name for cluster3", "reasoning": "reasoning for cluster3"}, {"name": "name for cluster4", "reasoning": "reasoning for cluster4"}]',
        },
        { role: "user", content: clustersJSON },
      ],
      model: "gpt-4o-mini",
      stream: true,
      response_format: { type: "json_object" },
    });
  }

  // Yield each chunk of the response as it becomes available.
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
 * Fetch openAI response at once.
 * @param prompt takes three types of prompts: text, section, and cluster.
 * @returns openAI response.
 */
export async function runOpenAI(prompt: Prompt): Promise<string> {
  let completion: OpenAI.Chat.Completions.ChatCompletion | null = null;

  // Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "section") {
    const content: string = prompt.type === "text" ? prompt.content : promptPresets[prompt.content];
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
        },
        { role: "user", content: content},
      ],
      model: "gpt-4o-mini",
      stream: false,
      response_format: { type: "text" },
    });
  }

  if (prompt.type === "cluster") {
    const clustersJSON = JSON.stringify(prompt.content);
    completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language names. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive names that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing four objects representing clusters with numeric values for cluster centers means from k-means clustering. I want you to name each cluster with meaningful names based on numeric values. Please be consistent with naming logic for all clusters and keep the name within four words. For the reasoning part, please keep it under 100 words and specify two distinctive data in number.",
        },
        {
          role: "assistant",
          content:
            '{"clusters": [{"name": "name for cluster1", "reasoning": "reasoning for cluster1"}, {"name": "name for cluster2", "reasoning": "reasoning for cluster2"}, {"name": "name for cluster3", "reasoning": "reasoning for cluster3"}, {"name": "name for cluster4", "reasoning": "reasoning for cluster4"}]',
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