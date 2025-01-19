import { useContext, useEffect, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import { streamOpenAI } from "../../services/openai";
import { Prompt } from "../../constants/messageConstants";
import MarkdownRenderer from "./MarkdownRenderer";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";

/**
 * AI Response component with typing animation for the text response from OpenAI.
 */
export default function AIResponseText() {
  const {
    prompt,
    setPrompt,
    messages,
    updateMessageResponse,
    setIsStreaming,
    errorMessage,
    setErrorMessage,
  } = useContext(MessageContext);

  const [text, setText] = useState<string>("");
  const location = useLocation();
  const section = pathToSection(location.pathname);

  // Send added text prompt to openAI and render the response.
  useEffect(() => {
    if (prompt) {
      displayOpenAIResponse(prompt);
    }
  }, [prompt]);

  async function displayOpenAIResponse(prompt: Prompt): Promise<void> {
    // Reset the loading and error status.
    setIsStreaming((prev) => ({ ...prev, text: true }));
    setErrorMessage((prev) => ({ ...prev, text: "" }));

    let accumulatedResponse = "";
    try {
      // Display response streaming.
      for await (const chunk of streamOpenAI(prompt, messages[section])) {
        accumulatedResponse += chunk;
        setText((prev) => prev + chunk);
      }
    } catch {
      const error = "Failed to fetch openAI Text response.";
      setErrorMessage({ ...errorMessage, text: error });
      console.error(error);
    } finally {
      // When the response is fully fetched, update states.
      updateMessageResponse(section, accumulatedResponse);
      setText("");
      setIsStreaming((prev) => ({ ...prev, text: false }));
      setPrompt(undefined);
    }
  }

  // Display error status of fetching openai response.
  if (errorMessage.json) {
    return <p>{errorMessage.json}</p>;
  }

  return <MarkdownRenderer content={text} />;
}
