import { createContext, useState } from "react";

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
};

/**
 * Message context to manage the message state between the user and the AI.
 * The context is updated when the openAI response streaming finishes,
 * and when the user submits a new prompt through the PromptBox.
 */
export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps);

/**
 * Message context provider to manage the message state between the user and the AI.
 */
export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptText, setPromptText] = useState<string>("");

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

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
        updateResponse,
        promptText,
        updatePromptText,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}