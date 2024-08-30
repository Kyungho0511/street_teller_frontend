import { createContext, useState } from "react";
import { initialTextHome } from "../constants/homeConstants";

export type Message = {
  user: string;
  ai: string;
};

type MessageContextProps = {
  messages: Message[];
  addMessages: (newMessage: Message) => void;
};

export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps);

// The provider is used in Root.tsx to wrap components.
// TO BE UPDATED: Use sessionStorage to persist messages across page refreshes!!!
export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[]>([initialTextHome]);

  const addMessages = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}