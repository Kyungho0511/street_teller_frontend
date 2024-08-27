import { createContext, useState } from "react";
import { initialTextHome } from "../constants/homeConstants";

export type Message = {
  user?: string;
  ai?: string;
};

type MessageContextProps = {
  messages: Message[];
  setMessageContext: (newMessage: Message) => void;
};

export const MessageContext = createContext<MessageContextProps>(
  {} as MessageContextProps
);

export function MessageContextProvider({children} : {children: React.ReactNode;}) {
  const [messages, setMessages] = useState<Message[]>([initialTextHome]);

  const setMessageContext = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <MessageContext.Provider value={{messages, setMessageContext}}>
      {children}
    </MessageContext.Provider>
  );
}