import styles from "./PromptBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useContext, useRef, useState } from "react";
import { MessageContext } from "../context/MessageContext";

export default function PromptBox() {
  const [text, setText] = useState<string>("");
  const { updatePrompt } = useContext(MessageContext);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle MessageContext and prompt on form submission.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Exit if button is inactive.
    if (!buttonRef.current?.classList.contains(styles.active)) return;

    // Update prompt in MessageContext.
    console.log(text);
    updatePrompt(text);

    // Text variable is empty --> need to be fixed!!!!!!!!!!!!!!!!
    // Text variable is empty --> need to be fixed!!!!!!!!!!!!!!!!
    // Text variable is empty --> need to be fixed!!!!!!!!!!!!!!!!
    // Text variable is empty --> need to be fixed!!!!!!!!!!!!!!!!
    // Text variable is empty --> need to be fixed!!!!!!!!!!!!!!!!
    // Text variable is empty --> need to be fixed!!!!!!!!!!!!!!!!
    // Empty prompt box.
    if (text.trim()) {
      setText("");
    }
  };

  // Sync prompt with input field
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.container}>
        <input
          className={styles.input}
          type="text"
          placeholder="Ask SiteTeller"
          value={text}
          onChange={handleChange}
        />
        <button ref={buttonRef} className={`${styles.button} ${text.trim() && styles.active}`}>
          <FontAwesomeIcon icon={faArrowUp} className={styles.icon} />
        </button>
      </div>
    </form>
  );
}
