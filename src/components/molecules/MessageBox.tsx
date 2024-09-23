import styles from "./MessageBox.module.css";
import { useContext, useEffect, useState } from "react";
import Logo from "../atoms/Logo";
import AiReponse from "../atoms/AiResponseText";
import { Message, MessageContext } from "../../context/MessageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";

// Performance Issue: If the text history becomes large, it might be more
// efficient to store it in a more complex data structure or consider using
// the _useReducer_ hook for more sophisticated state management.
export default function MessageBox() {
  const { messages } = useContext(MessageContext);

  // Get messages with text type only.
  const [texts, setTexts] = useState<Message[]>([]);
  const [textIndex, setTextIndex] = useState<number>(0);

  useEffect(() => {
    setTexts(messages.filter((message) => message.type === "text" || message.type === "section"));
  }, [messages]);

  // Updates messageIndex when a new message is added.
  useEffect(() => {
    texts.length > 1 && setTextIndex(texts.length - 1); 
  }, [texts.length]);

  const nextMessageIndex = () => {
    setTextIndex((prev) => (prev === messages.length - 1 ? prev : prev + 1));
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
    <div className={styles.container}>
      {/* header */}
      <div className={styles.header}>
        <Logo width="160px" color="black" />
        <div className={styles.navigate}>
          <FontAwesomeIcon icon={faChevronLeft} className={styles.icon} onClick={handleClick}/>
          <span>
            {textIndex + 1}/{texts.length}
          </span>
          <FontAwesomeIcon icon={faChevronRight} className={styles.icon} onClick={handleClick}/>
        </div>
      </div>
      {/* body */}
      <div className={styles.body}>
        {texts.length > 0 && texts[textIndex].user && (
          <p className={`${styles.message} ${styles.user}`}>
            <FontAwesomeIcon icon={faCircleUser} className={styles.icon} />
            {texts[textIndex].user}
          </p>
        )}
        <p className={`${styles.message} ${styles.ai}`}>
          <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
          {texts.length > 0 && texts[textIndex].ai && texts[textIndex].ai}
          <AiReponse />
        </p>
      </div>
    </div>
  );
}
