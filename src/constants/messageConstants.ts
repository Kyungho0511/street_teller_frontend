import { Section, Cluster, siteCategories, SiteCategory } from "./surveyConstants";
import { parseString } from "../utils/utils";
import { CLUSTERING_SIZE } from "../services/kmeans";

type textPrompt = { type: "text"; content: string };
type sectionPrompt = { type: "section"; content: string };
type clusterPrompt = { type: "cluster"; content: Cluster[] };
export type Prompt = textPrompt | sectionPrompt | clusterPrompt;

// Prompt presets to get instruction for each page from openAI.
export const WORD_COUNT_SHORT = 100;
export const WORD_COUNT_LONG = 300;

export const systemMessage = {
  text: `Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.`,
  cluster:"Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language names. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive names that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing four objects representing clusters with numeric values for cluster centers means from k-means clustering. I want you to name each cluster with meaningful names based on numeric values. Please be consistent with naming logic for all clusters and keep the name within four words. For the reasoning part, please keep it under 100 words and specify two distinctive data in number.",
};
export const assistantMessage = `{"clusters": [{"name": "name for cluster1", "reasoning": "reasoning for cluster1"}, {"name": "name for cluster2", "reasoning": "reasoning for cluster2"}, {"name": "name for cluster3", "reasoning": "reasoning for cluster3"}, {"name": "name for cluster4", "reasoning": "reasoning for cluster4"}]`;
export const siteCategoriesMessage = `Here is the list of site preference categories and subcategories under them available for users to select. ${JSON.stringify(siteCategories)}`;
export const wordCountMessage = `When you are asked about a single category and a cluster keep your response under ${WORD_COUNT_SHORT} words. When you are asked about multiple clusters or categories, please provide a response under ${WORD_COUNT_LONG} words in total.`;

/**
 * Get instruction prompt for each page to request to openAI.
 * @param section section name of the current page.
 * @param sectionId section id number of the current page in case of multiple sub-sections.
 * @param categories name of the selected preference categories for current clustering analysis.
 */
export function getInstructionPrompt(
  section: Section,
  sectionId?: number,
  selectedCategories?: SiteCategory[],
): string {
  
  // Instruction prompt prefix.
  let instructionPrompt = "Instruct users with the following sentence: ";
  
  if (section === "home") {
    instructionPrompt += `Hi, I am a site analysis agent to recommend site clusters based on your site preferences. Tell me about your healthcare site preferences by sorting the categories below in order of importance for your new healthcare site. I will tell you about NYC site clusters that suit your need the best. Try not to mention the category names as it is redundant, unless you are asked for it.`;
  } else if (parseString(section) === "cluster" && sectionId && selectedCategories) {
    const categoryNumber = CLUSTERING_SIZE * (sectionId - 1) + 1;
    instructionPrompt += `These are cluster groups based on the preference categories ranked at ${categoryNumber} and ${categoryNumber + 1} in your priority.  
      ${categoryNumber}. **${selectedCategories[0]}** 
      ${categoryNumber + 1}. **${selectedCategories[1]}**
      Review my interpretation of the clustering analysis below. If you want me to re-explain clustering analysis, press the "retry analysis" button below. When you are ready, select clusters you're targeting, and continue.`;
  }

  return instructionPrompt;
}