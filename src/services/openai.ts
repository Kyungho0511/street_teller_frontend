import OpenAI from "openai";
import { Cluster } from "../constants/clusterConstants";
import { Stream } from "openai/streaming.mjs";

// Query openai
// Disable dangerouslyAllowBrowser after testing!!!!!!!!!!!!!!!!!
// Remove apiKey from the code and use env instead!!!!!!!!!!!!!!!
const openai = new OpenAI({
  // apiKey:
  dangerouslyAllowBrowser: true,
});

export default async function runOpenAI(
  prompt?: string,
  clusters?: Cluster[]
): Promise<string | undefined> {

  // Stream mode is essential for displaying early typing animation reponse 
  // in the MessageBox as soon as it gets the first chunk of the response.
  let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>

  // Run openAI with prompt.
  if (prompt) {
    const stream = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      stream: true, 
      response_format: { type: "text" },
    });

    for await (const chunk of stream) {
      console.log(chunk.choices[0]?.delta?.content);
    }

    // return stream.choices[0].message.content! as string;
    return undefined;
  }

  // Run openAI with clusters.
  if (clusters) {
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
      model: "gpt-3.5-turbo",
      stream: true,
      response_format: { type: "json_object" },
    });

    for await (const chunk of stream) {
      console.log(chunk.choices[0]?.delta?.content);
    }

    // return stream.choices[0].message.content! as string;
    return undefined;
  }
}


