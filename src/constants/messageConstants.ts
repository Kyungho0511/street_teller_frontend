import { Centroid, siteCategories } from "./surveyConstants";

export type TextPrompt = { type: "text"; content: string };
export type InstructionPrompt = { type: "instruction"; content: string };
export type ClusterPrompt = {
  type: "cluster";
  content: { name: string; centroids: Centroid[] }[];
};
export type ReportPrompt = {
  type: "report";
  content: {
    clusters: { name: string; centroids: Centroid[]; reasoning: string }[];
  }[];
};

export type Prompt =
  | TextPrompt
  | InstructionPrompt
  | ClusterPrompt
  | ReportPrompt;

// Prompt presets to get instruction for each page from openAI.
export const WORD_COUNT_SHORT = 100;
export const WORD_COUNT_LONG = 300;

export const siteCategoriesMessage = `Here is the list of site preference categories and subcategories under them available for users to select. ${JSON.stringify(
  siteCategories
)}`;

export const wordCountMessage = `When you are asked about a single category and a cluster keep your response under ${WORD_COUNT_SHORT} words. When you are asked about multiple clusters or categories, please provide a response under ${WORD_COUNT_LONG} words in total.`;
