import { Section, Cluster } from "./surveyConstants";

type textPrompt = {type: "text", content: string};
type sectionPrompt = {type: "section", content: Section}; 
type clusterPrompt = {type: "cluster", content: Cluster[]};
export type Prompt = textPrompt | sectionPrompt | clusterPrompt

// Prompt presets to get instruction for each page from openAI.
const prefix = "Instruct users with the following sentence:";
const suffix = "Keep the instruction under 100 words.";
export const sectionMessages: {[key in Section]: string} = {
  "home": `${prefix} Hi, I am a site analysis agent to recommend site candidates based on your site preferences. Tell me about your healthcare site preferences by sorting the categories below in order of importance for your new healthcare site. I will tell you about NYC site clusters that suit your need the best. ${suffix}`,
  "cluster1": `${prefix} This is the first clustering analysis on the first and the second preference categories you chose in priority. Review my interpretation of the clustering analysis. If you want me to re-explain clustering analysis, press the "retry analysis" button below. When you are ready, select clusters you're targeting, and continue. ${suffix}`,
  "cluster2": `${prefix} This is the second clustering analysis on the third and the fourth preference categories you chose in priority. Review my interpretation of the clustering analysis. If you want me to re-explain clustering analysis, press the "retry analysis" button below. When you are ready, select clusters you're targeting, and continue. ${suffix}`,
  "cluster3": `${prefix} This is the last clustering analysis on the fifth and the sixth preference categories you chose in priority. Review my interpretation of the clustering analysis. If you want me to re-explain clustering analysis, press the "retry analysis" button below. When you are ready, select clusters you're targeting, and continue. ${suffix}`,
};

export const systemMessage = {
  text: "Assistant is a large language model trained by OpenAI. You are an expert in the context of urban planning, your goal is to provide insightful and informative responses to questions about site analysis especially in the context of site selection.",
  cluster: "Assistant is a large language model trained by OpenAI. You are a helpful assistant designed to output JSON. You are an expert for interpreting machine learning outcomes, especially in the context of urban planning, your focus is on analyzing and labeling clusters from k-means clustering. You translate the values of variables within these k-means clusters into understandable, human language names. This process involves examining the distinctive characteristics of each cluster, understanding the significance of each variable within the context of urban fabrics, and then formulating descriptive names that accurately reflect the underlying patterns and relationships. I will provide you a JSON containing four objects representing clusters with numeric values for cluster centers means from k-means clustering. I want you to name each cluster with meaningful names based on numeric values. Please be consistent with naming logic for all clusters and keep the name within four words. For the reasoning part, please keep it under 100 words and specify two distinctive data in number.",
}

export const assistantMessage = `{"clusters": [{"name": "name for cluster1", "reasoning": "reasoning for cluster1"}, {"name": "name for cluster2", "reasoning": "reasoning for cluster2"}, {"name": "name for cluster3", "reasoning": "reasoning for cluster3"}, {"name": "name for cluster4", "reasoning": "reasoning for cluster4"}]`;