import OpenAI from "openai";
import { Stream } from "openai/streaming.mjs";
import { Prompt, promptPresets } from "../constants/openaiConstants";
import { clusters } from "../constants/clusterConstants";

// Query openai
// Disable dangerouslyAllowBrowser after testing!!!!!!!!!!!!!!!!!
// Remove apiKey from the code and use env instead!!!!!!!!!!!!!!!
const openai = new OpenAI({
  // apiKey: 
  dangerouslyAllowBrowser: true,
});

  // Stream mode is essential for displaying early typing animation reponse
  // in the MessageBox as soon as it gets the first chunk of the response.
  // asynchroneous generator function is used to yield each chunk of the response
export default async function* runOpenAI(prompt: Prompt): AsyncGenerator<string> {
  let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk> | null = null;

  // Run openAI with text or section prompts.
  if (prompt.type === "text" || prompt.type === "section") {
    const content: string = prompt.type === "text" ? prompt.content : promptPresets[prompt.content];

    console.log(content);

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

  // TO BE UPDATED: Run openAI with clusters prompt. 
  if (prompt.type === "cluster") {
    const clustersJSON = JSON.stringify(clusters);
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
            '{"clusters": [{"lable": "label for cluster1", "reasoning": "reasoning for the cluster1 label"}, {"lable": "label for cluster2", "reasoning": "reasoning for the cluster2 label"}, {"lable": "label for cluster3", "reasoning": "reasoning for the cluster3 label"}, {"lable": "label for cluster4", "reasoning": "reasoning for the cluster4 label"}]',
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
    try {
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          yield chunk.choices[0].delta.content;
        }
      }
    } catch (error) {
      console.error("Error streaming responses:", error);
      throw error;
    }
  }
}