import { Cluster, siteCategories } from "./surveyConstants";

type textPrompt = { type: "text"; content: string };
type instructionPrompt = { type: "instruction"; content: string };
type clusterPrompt = { type: "cluster"; content: Cluster[] };
type reportPrompt = { type: "report"; content: string };

export type Prompt =
  | textPrompt
  | instructionPrompt
  | clusterPrompt
  | reportPrompt;

// Prompt presets to get instruction for each page from openAI.
export const WORD_COUNT_SHORT = 100;
export const WORD_COUNT_LONG = 300;

export const systemMessage = {
  text: "Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
  cluster:
    "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language names. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive names that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing four objects representing clusters with numeric values for cluster centers means from k-means clustering. I want you to name each cluster with meaningful names based on numeric values. Please be consistent with naming logic for all clusters and keep the name within four words. For the reasoning part, please keep it under 100 words and specify two distinctive data in number.",
  report:
    "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. In the context of urban planning, your focus is to name a group that consists of several urban clusters. I will provide you a JSON of an array of three clusters with name, centroids(numeric values for cluster centers means from k-means clustering), and reasoning for each cluster's naming. I want you to label for this group with meaningful names based on three clusters' characteristics. Please keep the name within four words. Additionally, give me the reasoning behind the group's name. Please keep the reasoning under 100 words and specify three distinctive data in number.",
};

export const assistantMessage = {
  cluster: `{"clusters": [{"name": "name for cluster1", "reasoning": "reasoning for cluster1"}, {"name": "name for cluster2", "reasoning": "reasoning for cluster2"}, {"name": "name for cluster3", "reasoning": "reasoning for cluster3"}, {"name": "name for cluster4", "reasoning": "reasoning for cluster4"}]}`,
  report: `{"clusters": [{"name": "name for the group", "reasoning": "reasoning for the group's name"}]}`,
};

export const siteCategoriesMessage = `Here is the list of site preference categories and subcategories under them available for users to select. ${JSON.stringify(
  siteCategories
)}`;

export const wordCountMessage = `When you are asked about a single category and a cluster keep your response under ${WORD_COUNT_SHORT} words. When you are asked about multiple clusters or categories, please provide a response under ${WORD_COUNT_LONG} words in total.`;
