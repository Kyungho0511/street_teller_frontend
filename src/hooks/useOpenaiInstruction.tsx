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
 * @param sectionId section id number of the current page in case of multiple sub-sections.
 * @param siteCategories name of the selected preference categories for current clustering analysis.
 */
export default function useOpenaiInstruction(
  sectionId?: number,
  siteCategories?: SiteCategory[]
) {
  const { messages, addMessage, updateMessagePrompt } =
    useContext(MessageContext);
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
      content: getInstructionPrompt(section, sectionId, siteCategories),
    };
    updateMessagePrompt(section, prompt);
  }, [location.pathname]);
}

/**
 * Get instruction prompt for each page to request to openAI.
 * @param section section name of the current page.
 * @param sectionId section id number of the current page in case of multiple sub-sections.
 * @param siteCategories name of the selected preference categories for current clustering analysis.
 */
function getInstructionPrompt(
  section: Section,
  sectionId?: number,
  siteCategories?: SiteCategory[]
): string {
  const prefix = "Instruct users with the following sentence: ";
  let prompt = "";

  // Home Instruction
  if (section === "home") {
    prompt += `Hi, I am a site analysis agent to recommend site clusters based on your site preferences. Tell me about your healthcare site preferences by sorting the categories below in order of importance for your new healthcare site. I will tell you about NYC site clusters that suit your need the best. Try not to mention the category names as it is redundant, unless you are asked for it.`;
  }
  // Cluster Instruction
  else if (parseString(section) === "cluster" && sectionId && siteCategories) {
    const categoryNumber = CLUSTERING_SIZE * (sectionId - 1) + 1;
    prompt += `These are cluster groups based on your prefered site categories ranked at ${categoryNumber} and ${
      categoryNumber + 1
    } in your priority.  
      ${categoryNumber}. **${siteCategories[0]}** 
      ${categoryNumber + 1}. **${siteCategories[1]}**
      Please review my clustering analysis report below. Choose the clusters you want to target and click the "Continue" button located at the bottom right corner.`;
  }
  // Report Instruction
  else if (section === "report") {
    prompt += `Review the selected site clusters you'd like to search in the real estate listing. You can adjust your selection by using the checkboxes below. When you're finished, click the "Show Listing" button in the bottom right corner.`;
  }
  return prefix + prompt;
}
