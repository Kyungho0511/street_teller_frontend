import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { streamOpenAI } from "../../services/openai";
import { Prompt } from "../../constants/messageConstants";
import MarkdownRenderer from "./MarkdownRenderer";

/**
 * Response component with typing animation for the text response from OpenAI.
 */
export default function AiResponse() {
  const {
    prompt,
    messages,
    updateResponse,
    setLoadingMessage,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext); 
  const [text, setText] = useState<string>("");

  // Send added text prompt to openAI and render the response.
  useEffect(() => {
    if (prompt) {
      startTypingAnimation(prompt);
    }
  }, [prompt]);

  async function startTypingAnimation(prompt: Prompt): Promise<void> {

    // Reset the loading and error status.
    setLoadingMessage((prev) => ({ ...prev, text: true }));
    setErrorMessage((prev) => ({...prev, text: undefined}));

    let accumulatedResponse = ""; 
    try {
      // play typing animation while fetching response
      
      for await (const chunk of streamOpenAI(prompt, messages)) {
        accumulatedResponse += chunk;
        setText((prev) => prev + chunk);
      }
    } catch {
      const error = "Failed to fetch openAI Text response.";
      setErrorMessage(({...errorMessage, text: error}));
      console.error(error);
    } finally {
      // When the response is fully fetched, update states.
      updateResponse(accumulatedResponse);
      setText("");
      setLoadingMessage((prev) => ({ ...prev, text: false }));
    }
  }

    // Display error status of fetching openai response.
    if (errorMessage.json) {
      return <p>{errorMessage.json}</p>
    }

  return <MarkdownRenderer content={text} />;
}