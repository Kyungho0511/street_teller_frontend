import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../context/MessageContext";
import runOpenAI from "../services/openai";
import { Prompt, Section } from "../constants/openaiConstants";
import { useLocation } from "react-router-dom";

export default function AiResponse() {
  const { prompt, messages, addMessage, updateResponse } = useContext(MessageContext); 
  const [text, setText] = useState<string>("");
  const location = useLocation();

  // Send added text prompt to openAI and render the response.
  useEffect(() => {
    if (prompt) {
      // Proceed typing animation for the text prompt
      startTypingAnimation({ type: "text", content: prompt });
    }
  }, [prompt]);

  // Get openAI instructions for each page.
  useEffect(() => {
    const pathToSection: { [key: string]: Section } = {
      "/": "home",
      "/explore": "explore",
      "/cluster": "cluster",
      "/report": "report",
    };

    // Initialize an empty message
    addMessage({ user: "", ai: "" });

    // Proceed typing animation for the section
    const section: Section = pathToSection[location.pathname];
    const prompt: Prompt = { type: "section", content: section };
    section && startTypingAnimation(prompt);
  }, [location.pathname]);


  async function startTypingAnimation(prompt: Prompt): Promise<void> {
    try {
      let accumulatedResponse = ""; // Temporary variable to hold the entire response

      // play typing animation while fetching response
      for await (const chunk of runOpenAI(prompt)) {
        const formattedChunk = chunk.charAt(0).toLowerCase() + chunk.slice(1) + ' ';
        accumulatedResponse += formattedChunk;
        setText((prev) => prev + formattedChunk);
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
