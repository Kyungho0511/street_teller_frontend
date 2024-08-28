import { createContext, useState } from "react";
import { initialTextHome } from "../constants/homeConstants";

export type Message = {
  user: string;
  ai: string;
};

type MessageContextProps = {
  messages: Message[];
  addMessages: (newMessage: Message) => void;
  messageIndex: number;
  nextMessageIndex: () => void;
  prevMessageIndex: () => void;
};

export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps);

// The provider is used in Root.tsx to wrap components.
// TO BE UPDATED: Use sessionStorage to persist messages across page refreshes!!!
export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[]>([initialTextHome]);
  const [messageIndex, setMessageIndex] = useState<number>(0);

  const addMessages = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
    setMessageIndex(messages.length);
  }

  const nextMessageIndex = () => {
    setMessageIndex((prev) => (prev === messages.length - 1 ? prev : prev + 1));
  }

  const prevMessageIndex = () => {
    setMessageIndex((prev) => (prev === 0 ? 0 : prev - 1));
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        addMessages,
        messageIndex,
        nextMessageIndex,
        prevMessageIndex,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}