import styles from "./PromptBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { Message, MessageContext } from "../context/MessageContext";

export default function PromptBox() {
  const [prompt, setPrompt] = useState<string>("");
  const { addMessages } = useContext(MessageContext);

  // Handle MessageContext and prompt on form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // empty prompt box
    if (prompt.trim()) {
      setPrompt("");
    }

    // update MessageContext
    const newMessage: Message = {
      user: prompt,
      ai: "",
    };
    addMessages(newMessage);
  };

  // Sync prompt with input field
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.container}>
        <input
          className={styles.input}
          type="text"
          placeholder="Ask SiteTeller"
          value={prompt}
          onChange={handleChange}
        />
        <button className={`${styles.button} ${prompt.trim() && styles.active}`}>
          <FontAwesomeIcon icon={faArrowUp} className={styles.icon} />
        </button>
      </div>
    </form>
  );
}
