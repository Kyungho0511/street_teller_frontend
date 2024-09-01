import { createContext, useState } from "react";

export type Message = {
  user: string;
  ai: string;
};

type MessageContextProps = {
  messages: Message[];
  addMessage: (newMessage: Message) => void;
  updateResponse: (newResponse: string) => void;
};

// MessageContext stores history of prompts and openAI responses.
// it is updated when the openAI response streaming finishes,
// and when the user submits a new prompt through the PromptBox.
export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps);

// The provider is used in Root.tsx to wrap components.
// TO BE UPDATED: Use sessionStorage to persist messages across page refreshes!!!
export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[]>([{user:"", ai:""}]);

  const addMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  }

    const updateResponse = (newResponse: string) => {
      setMessages((prev) => [...prev, {...prev[prev.length - 1], ai: newResponse}]);
    }

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessage,
        updateResponse
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}