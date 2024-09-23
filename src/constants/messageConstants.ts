import { Section, Cluster } from "./surveyConstants";

type textPrompt = {type: "text", content: string};
type sectionPrompt = {type: "section", content: Section}; 
type clusterPrompt = {type: "cluster", content: Cluster[]};
export type Prompt = textPrompt | sectionPrompt | clusterPrompt

// Prompt presets to get instruction for each page from openAI.
const presetPrefix: string = "Instruct users with the following sentence:";
export const promptPresets: {[key in Section]: string} = {
  "home": `${presetPrefix} Hi, I am a site analysis agent to deliver site candidates based on your preferences. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best. Tell us about your life-style by selecting the categories important for your new home. We will tell you about NYC neighborhoods that suit your household the best.`,
  "cluster1": `${presetPrefix} Add or remove features to customize your clustering analysis. Click the 'Cluster' button when you are ready. Review the subcategory values for each cluster in the legend. Exclude the clusters you're not targeting, and continue.`,
  "cluster2": `${presetPrefix} Add or remove features to customize your clustering analysis. Click the 'Cluster' button when you are ready. Review the subcategory values for each cluster in the legend. Exclude the clusters you're not targeting, and continue.`,
  "cluster3": `${presetPrefix} Add or remove features to customize your clustering analysis. Click the 'Cluster' button when you are ready. Review the subcategory values for each cluster in the legend. Exclude the clusters you're not targeting, and continue.`,
};