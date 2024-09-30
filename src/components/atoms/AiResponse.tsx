import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { streamOpenAI } from "../../services/openai";
import { Prompt } from "../../constants/messageConstants";
import MarkdownRenderer from "./MarkdownRenderer";

/**
 * Response component with typing animation for the text response from OpenAI.
 */
export default function AiResponse() {
  const { prompt, messages, updateResponse } = useContext(MessageContext); 
  const [text, setText] = useState<string>("");

  // Send added text prompt to openAI and render the response.
  useEffect(() => {
    if (prompt) {
      startTypingAnimation(prompt);
    }
  }, [prompt]);

  async function startTypingAnimation(prompt: Prompt): Promise<void> {
    try {
      // play typing animation while fetching response
      let accumulatedResponse = ""; 
      for await (const chunk of streamOpenAI(prompt, messages)) {
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

  return <MarkdownRenderer content={text} />;
}