import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { streamOpenAI } from "../../services/openai";
import { Prompt } from "../../constants/messageConstants";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { Section } from "../../constants/surveyConstants";

export default function AiResponseText() {
  const { promptText: prompt, addMessage, updateResponse } = useContext(MessageContext); 
  const [text, setText] = useState<string>("");
  const location = useLocation();

  // Send added text prompt to openAI and render the response.
  useEffect(() => {
    if (prompt) {
      // Proceed typing animation for the text prompt
      startTypingAnimation({ type: "text", content: prompt });
    }
  }, [prompt]);

  // Get openAI instructions on the current page.
  useEffect(() => {
    // Initialize an empty message
    addMessage({ user: "", ai: "" });

    // Proceed typing animation for the section
    const section: Section = pathToSection(location.pathname);
    const prompt: Prompt = { type: "section", content: section };
    section && startTypingAnimation(prompt);
  }, [location.pathname]);


  async function startTypingAnimation(prompt: Prompt): Promise<void> {
    try {
      // play typing animation while fetching response
      let accumulatedResponse = ""; 
      for await (const chunk of streamOpenAI(prompt)) {
        accumulatedResponse += chunk;
        setText((prev) => prev + chunk);
      }

      // When the response is fully fetched, update states.
      updateResponse(accumulatedResponse);
      setText("");
    } catch (error) {
      console.error("Failed to fetch openAI response:", error);
    }
  }

  return <>{text}</>;
}
