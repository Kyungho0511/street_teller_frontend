import { createContext, useState } from "react";
import { Prompt } from "../constants/messageConstants";
import useSessionStorage from "../hooks/useSessionStorage";
import { initialSectionMessages, Section } from "../constants/sectionConstants";

export type Message = {
  user: string;
  ai: string;
  type: "text" | "section" | "cluster";
};

export type LoadingMessage = {
  text: boolean;
  json: boolean;
};

export type ErrorMessage = {
  text: string;
  json: string;
};

type MessageContextProps = {
  messages: Record<Section, Message[]>;
  addMessage: (section: Section, message: Message) => void;
  updateResponse: (section: Section, response: string) => void;
  prompt?: Prompt;
  updatePrompt: (section: Section, prompt: Prompt) => void;
  loadingMessage: LoadingMessage;
  setLoadingMessage: React.Dispatch<React.SetStateAction<LoadingMessage>>;
  errorMessage: ErrorMessage;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessage>>;
};

/**
 * Message context to manage the message state between the user and the AI.
 * The context is updated when the openAI response streaming finishes,
 * and when the user submits a new prompt through the PromptBox.
 */
export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps
);

/**
 * Message context provider to manage the message state between the user and the AI.
 * Performance Issue: If the text history becomes large, it might be more
 * efficient to store it in a more complex data structure or consider using
 * the _useReducer_ hook for more sophisticated state management.
 */
export function MessageContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useSessionStorage<Record<Section, Message[]>>(
    "messages",
    initialSectionMessages
  );
  const [prompt, setPrompt] = useState<Prompt>();
  const [loadingMessage, setLoadingMessage] = useState<LoadingMessage>({
    text: false,
    json: false,
  });
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
    text: "",
    json: "",
  });

  // Add a new message to the current section
  const addMessage = (section: Section, message: Message) => {
    setMessages((prev) => ({
      ...prev,
      [section]: [...prev[section], message],
    }));
  };

  // Update the last message's response (ai) for the current section
  const updateResponse = (section: Section, response: string) => {
    setMessages((prev) => ({
      ...prev,
      [section]: [
        ...prev[section].slice(0, prev[section].length - 1),
        { ...prev[section][prev[section].length - 1], ai: response },
      ],
    }));
  };

  // Update the last message's prompt (user) for the current section
  const updatePrompt = (section: Section, prompt: Prompt) => {
    setPrompt(prompt);

    if (prompt.type === "text") {
      setMessages((prev) => ({
        ...prev,
        [section]: [
          ...prev[section].slice(0, prev[section].length - 1),
          { ...prev[section][prev[section].length - 1], user: prompt.content },
        ],
      }));
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
        updateResponse,
        prompt,
        updatePrompt,
        loadingMessage,
        setLoadingMessage,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
