import styles from "./PromptBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { Message, MessageContext } from "../context/MessageContext";
import runOpenAI from "../services/openai";

export default function PromptBox() {
  const [prompt, setPrompt] = useState<string>("");
  const { messages, addMessages } = useContext(MessageContext);

  // Handle MessageContext and prompt on form submission.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Empty prompt box.
    if (prompt.trim()) {
      setPrompt("");
    }

    // Send prompt to LLM
    runOpenAI(prompt).then((response) => {
      
      // Update MessageContext with LLM response.
      if (response) {
        const newMessage: Message = {
          user: prompt,
          ai: response,
        };
        addMessages(newMessage);
      }
    })
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
