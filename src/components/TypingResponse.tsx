import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../context/MessageContext";
import runOpenAI from "../services/openai";
import { Prompt, Section } from "../constants/openaiConstants";
import { useLocation } from "react-router-dom";

export default function TypingResponse() {
  const { messages, updateResponse } = useContext(MessageContext);
  const [response, setResponse] = useState<string>("");
  const location = useLocation();

  // Send recently added prompt to openAI API and render response.
  useEffect(() => {
    const prompt: Prompt = { type: "text", content: messages[messages.length - 1].user };
    startTypingAnimation(prompt);
  }, [messages.length]);

  // Get openAI instructions for each page.
  useEffect(() => {
    const pathToSection: { [key: string]: Section } = {
      "/": "home",
      "/explore": "explore",
      "/cluster": "cluster",
      "/report": "report",
    };
    const section: Section = pathToSection[location.pathname];
    const prompt: Prompt = { type: "section", content: section };

    section && startTypingAnimation(prompt);
  }, [location.pathname]);

  async function startTypingAnimation(prompt: Prompt): Promise<void> {
    try {
      for await (const chunk of runOpenAI(prompt)) {
        const formattedChunk = chunk.charAt(0).toLowerCase() + chunk.slice(1) + ' ';
        setResponse((prev) => prev + formattedChunk);
      }
    } catch (error) {
      console.error("Failed to fetch openAI response:", error);
    }
  }

  return <>{response}</>;
}
