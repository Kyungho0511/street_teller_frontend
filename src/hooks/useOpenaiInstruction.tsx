import { useContext, useEffect } from "react";
import { parseString, pathToSection } from "../utils/utils";
import { Prompt } from "../constants/messageConstants";
import { SiteCategory } from "../constants/surveyConstants";
import { Section } from "../constants/sectionConstants";
import { useLocation } from "react-router-dom";
import { MessageContext } from "../context/MessageContext";
import { CLUSTERING_SIZE } from "../constants/kMeansConstants";

/**
 * Get openAI instruction of the current page.
 */
export default function useOpenaiInstruction(
  sectionId?: number,
  selectedCategories?: SiteCategory[]
) {
  const { messages, addMessage, updatePrompt } = useContext(MessageContext);
  const location = useLocation();
  const section = pathToSection(location.pathname);

  useEffect(() => {
    // Exit if the section already has instruction.
    if (messages[section].find((message) => message.type === "instruction")) {
      return;
    }

    addMessage(section, { user: "", ai: "", type: "instruction" });
    const prompt: Prompt = {
      type: "instruction",
      content: getInstructionPrompt(section, sectionId, selectedCategories),
    };
    updatePrompt(section, prompt);
  }, [location.pathname]);
}

/**
 * Get instruction prompt for each page to request to openAI.
 * @param section section name of the current page.
 * @param sectionId section id number of the current page in case of multiple sub-sections.
 * @param categories name of the selected preference categories for current clustering analysis.
 */
function getInstructionPrompt(
  section: Section,
  sectionId?: number,
  selectedCategories?: SiteCategory[]
): string {
  // Instruction prompt prefix.
  let instructionPrompt = "Instruct users with the following sentence: ";

  if (section === "home") {
    instructionPrompt += `Hi, I am a site analysis agent to recommend site clusters based on your site preferences. Tell me about your healthcare site preferences by sorting the categories below in order of importance for your new healthcare site. I will tell you about NYC site clusters that suit your need the best. Try not to mention the category names as it is redundant, unless you are asked for it.`;
  } else if (
    parseString(section) === "cluster" &&
    sectionId &&
    selectedCategories
  ) {
    const categoryNumber = CLUSTERING_SIZE * (sectionId - 1) + 1;
    instructionPrompt += `These are cluster groups based on the preference categories ranked at ${categoryNumber} and ${
      categoryNumber + 1
    } in your priority.  
      ${categoryNumber}. **${selectedCategories[0]}** 
      ${categoryNumber + 1}. **${selectedCategories[1]}**
      Review my interpretation of the clustering analysis below. If you want me to re-explain clustering analysis, press the "retry analysis" button below. When you are ready, select clusters you're targeting, and continue.`;
  }
  return instructionPrompt;
}
