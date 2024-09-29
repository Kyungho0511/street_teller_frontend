import { useEffect } from "react";
import { pathToSection } from "../utils/utils";
import { getInstructionPrompt } from "../services/openai";
import { Prompt } from "../constants/messageConstants";
import { Section, SiteCategory } from "../constants/surveyConstants";
import { useLocation } from "react-router-dom";
import { Message } from "../context/MessageContext";

/**
 * Get openAI instructions on the current page.
 */
export default function useOpenAiInstruction(
  addMessage: (newMessage: Message) => void,
  updatePrompt: (newPrompt: Prompt) => void,
  sectionId?: number,
  selectedCategories?: SiteCategory[]
) {
  const location = useLocation();

  useEffect(() => {
    addMessage({ user: "", ai: "", type: "section" });
    const section: Section = pathToSection(location.pathname);
    const prompt: Prompt = {
      type: "section",
      content: getInstructionPrompt(section, sectionId, selectedCategories),
    };
    section && updatePrompt(prompt);
  }, [location.pathname]);
}
