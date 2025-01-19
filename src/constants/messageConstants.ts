import { Centroid, siteCategories } from "./surveyConstants";

export type TextPrompt = { type: "text"; content: string };
export type InstructionPrompt = { type: "instruction"; content: string };
export type ClusterPrompt = {
  type: "cluster";
  content: { name: string; centroids: Centroid[] }[];
};
export type ReportPrompt = {
  type: "report";
  content: { name: string; centroids: Centroid[]; reasoning: string }[];
};

export type Prompt =
  | TextPrompt
  | InstructionPrompt
  | ClusterPrompt
  | ReportPrompt;

// Prompt presets to get instruction for each page from openAI.
export const WORD_COUNT_SHORT = 100;
export const WORD_COUNT_LONG = 300;

export const systemMessage = {
  text: "Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
  cluster:
    "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language names. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive names that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing multiple cluster objects with numeric values for cluster centroids from k-means clustering. I want you to name these clusters with meaningful names based on numeric values. Please be consistent with naming logic and keep the name within four words. For the reasoning part, please keep it under 100 words and specify two distinctive data in number for each cluster.",
  report:
    "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. In the context of urban planning, your focus is to name groups of urban clusters. I will provide you a JSON of multiple group objects with an array of three clusters with name, centroids(numeric values for cluster centers means from k-means clustering), and reasoning for each cluster's naming. I want you to label for these groups with meaningful names based on three clusters' characteristics. Please be consistent with naming logic and keep the name within four words. Additionally, give me reasoning behind each group's name. Please keep the reasoning under 100 words and specify three distinctive data in number for each group.",
};

export const siteCategoriesMessage = `Here is the list of site preference categories and subcategories under them available for users to select. ${JSON.stringify(
  siteCategories
)}`;

export const wordCountMessage = `When you are asked about a single category and a cluster keep your response under ${WORD_COUNT_SHORT} words. When you are asked about multiple clusters or categories, please provide a response under ${WORD_COUNT_LONG} words in total.`;
