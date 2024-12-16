import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../atoms/Logo";
import MessageBox from "../molecules/MessageBox";
import styles from "./Sidebar.module.css";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { Message, MessageContext } from "../../context/MessageContext";

export const SIDEBAR_WIDTH = 450;

/**
 * Sidebar component that displays AI conversation and its children components.
 * Performance Issue: If the text history becomes large, it might be more
 * efficient to store it in a more complex data structure or consider using
 * the _useReducer_ hook for more sophisticated state management.
 */
export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { messages } = useContext(MessageContext);

  // Get messages with text type only.
  const [texts, setTexts] = useState<Message[]>([]);
  const [textIndex, setTextIndex] = useState<number>(0);

  useEffect(() => {
    setTexts(
      messages.filter(
        (message) => message.type === "text" || message.type === "section"
      )
    );
  }, [messages]);

  // Updates messageIndex when a new message is added.
  useEffect(() => {
    texts.length > 1 && setTextIndex(texts.length - 1);
  }, [texts.length]);

  const nextMessageIndex = () => {
    setTextIndex((prev) => (prev === texts.length - 1 ? prev : prev + 1));
  };

  const prevMessageIndex = () => {
    setTextIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleClick = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "chevron-right") {
      nextMessageIndex();
    } else if (target.dataset.icon === "chevron-left") {
      prevMessageIndex();
    }
  };

  return (
    <aside className={styles.sidebar} style={{ width: SIDEBAR_WIDTH }}>
      <div className={styles.header}>
        <Logo width="160px" color="black" />
        <div className={styles.navigate}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={styles.icon}
            onClick={handleClick}
          />
          <span>
            {textIndex + 1}/{texts.length}
          </span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className={styles.icon}
            onClick={handleClick}
          />
        </div>
      </div>
      <div className={styles.body}>
        {/* scroller implements a rounded scrollbar */}
        <div className={styles.scroller}>
          <MessageBox texts={texts} textIndex={textIndex} />
          {children}
        </div>
      </div>
    </aside>
  );
}
