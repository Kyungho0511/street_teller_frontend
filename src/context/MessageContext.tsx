import { createContext, useState } from "react";
import { Cluster } from "../constants/surveyConstants";

export type Message = {
  user: string;
  ai: string;
};

type MessageContextProps = {
  messages: Message[] | [];
  addMessage: (newMessage: Message) => void;
  updateResponse: (newResponse: string) => void;
  promptText: string;
  updatePromptText: (newPrompt: string) => void;
  promptJson: Cluster[];
  updatePromptJson: (newJson: Cluster[]) => void;
};

// MessageContext stores history of prompts and openAI responses.
// it is updated when the openAI response streaming finishes,
// and when the user submits a new prompt through the PromptBox.
export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps);

// The provider is used in Root.tsx to wrap components.
// TO BE UPDATED: Use sessionStorage to persist messages across page refreshes.
export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptText, setPromptText] = useState<string>("");
  const [promptJson, setPromptJson] = useState<Cluster[]>([]);

  const addMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  // Update the last message's response(ai).
  const updateResponse = (newResponse: string) => {
    setMessages((prev) => [
      ...prev.slice(0, prev.length - 1),
      { ...prev[prev.length - 1], ai: newResponse },
    ]);
  };

  // Update the last message's prompt(user).
  const updatePromptText = (newPrompt: string) => {
    setPromptText(newPrompt);
    setMessages((prev) => [
      ...prev.slice(0, prev.length - 1),
      { ...prev[prev.length - 1], user: newPrompt },
    ]);
  };

  const updatePromptJson = (newJson: Cluster[]) => {
    setPromptJson(newJson);
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
        updateResponse,
        promptText,
        updatePromptText,
        promptJson,
        updatePromptJson,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}