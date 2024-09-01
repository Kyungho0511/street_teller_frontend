import { createContext, useState } from "react";

export type Message = {
  user: string;
  ai: string;
};

type MessageContextProps = {
  messages: Message[] | [];
  addMessage: (newMessage: Message) => void;
  updateResponse: (newResponse: string) => void;
  prompt: string;
  updatePrompt: (newPrompt: string) => void;
};

// MessageContext stores history of prompts and openAI responses.
// it is updated when the openAI response streaming finishes,
// and when the user submits a new prompt through the PromptBox.
export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps);

// The provider is used in Root.tsx to wrap components.
// TO BE UPDATED: Use sessionStorage to persist messages across page refreshes.
export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[] | []>([]);
  const [prompt, setPrompt] = useState<string>("");

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
  const updatePrompt = (newPrompt: string) => {
    setPrompt(newPrompt);
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
        prompt,
        updatePrompt,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}