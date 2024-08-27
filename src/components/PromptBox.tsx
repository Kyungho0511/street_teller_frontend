import styles from "./PromptBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function PromptBox() {
  const [prompt, setPrompt] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (prompt.trim()) {
      setPrompt("");
    }
  };

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
        <button
          className={`${styles.button} ${prompt.trim() && styles.active}`}
        >
          <FontAwesomeIcon icon={faArrowUp} className={styles.icon} />
        </button>
      </div>
    </form>
  );
}
