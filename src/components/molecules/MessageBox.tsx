import styles from "./MessageBox.module.css";
import AiReponse from "../atoms/AiResponse";
import { Message } from "../../context/MessageContext";
import MarkdownRenderer from "../atoms/MarkdownRenderer";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";

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
      {texts.length > textIndex && texts[textIndex].user && (
        <div className={styles.message}>
          <div className={styles.icon}>
            <Icon
              path={iconPaths.user}
              height={24}
              width={24}
              offset={{ x: 0, y: 4 }}
            />
          </div>
          <p>{texts[textIndex].user}</p>
        </div>
      )}
      <div className={styles.message}>
        <div className={styles.icon}>
          <Icon
            path={iconPaths.location}
            height={24}
            width={24}
            offset={{ x: 0, y: 4 }}
          />
        </div>
        {/* AiResponse displays streaming response with typing animation, 
          whereas MarkdownRenderer shows fully fetched AI response */}
        {texts.length > textIndex && texts[textIndex].ai && (
          <MarkdownRenderer content={texts[textIndex].ai} />
        )}
        <AiReponse />
      </div>
    </div>
  );
}
