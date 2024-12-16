import styles from "./MessageBox.module.css";
import AiReponse from "../atoms/AiResponse";
import { Message } from "../../context/MessageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import MarkdownRenderer from "../atoms/MarkdownRenderer";

type MessageBoxProps = {
  texts: Message[];
  textIndex: number;
};

/**
 * Message box component to display the chat history between user and AI.
 */
export default function MessageBox({ texts, textIndex }: MessageBoxProps) {
  return (
    <div className={styles.container}>
      {texts.length > 0 && texts[textIndex].user && (
        <div className={styles.message}>
          <FontAwesomeIcon icon={faCircleUser} className={styles.icon} />
          {texts[textIndex].user}
        </div>
      )}
      <div className={styles.message}>
        <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
        {/* AiResponse displays streaming response with typing animation, 
          whereas MarkdownRenderer shows fully fetched AI response */}
        {texts.length > 0 && texts[textIndex].ai && (
          <MarkdownRenderer content={texts[textIndex].ai} />
        )}
        <AiReponse />
      </div>
    </div>
  );
}
