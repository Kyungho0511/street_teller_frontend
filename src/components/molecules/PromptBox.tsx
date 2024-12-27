import styles from "./PromptBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useContext, useRef, useState } from "react";
import { MessageContext } from "../../context/MessageContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { NavbarContext } from "../../context/NavbarContext";

/**
 * Prompt box component to send user messages to the AI.
 */
export default function PromptBox() {
  // Global states
  const { addMessage, updatePrompt, loadingMessage } =
    useContext(MessageContext);
  const { sidebarRef, isSidebarOpen, openSidebar } = useContext(NavbarContext);

  // Local states
  const [text, setText] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(
    () => loadingMessage.text || loadingMessage.json
  );

  const buttonRef = useRef<HTMLButtonElement>(null);

  const location = useLocation();
  const section = pathToSection(location.pathname);

  useEffectAfterMount(() => {
    setDisabled(loadingMessage.text || loadingMessage.json);
  }, [loadingMessage]);

  // Handle MessageContext and prompt on form submission.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Exit if button is inactive.
    if (!buttonRef.current?.classList.contains(styles.active)) return;

    // Update MessageContext.
    addMessage(section, { user: text, ai: "", type: "text" });
    updatePrompt(section, { type: "text", content: text });

    // Empty prompt box.
    if (text.trim()) {
      setText("");
    }

    // Open sidebar if closed.
    if (!isSidebarOpen) {
      openSidebar(true, sidebarRef);
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
        <button
          ref={buttonRef}
          disabled={disabled}
          className={`${styles.button} ${text.trim() && styles.active}`}
        >
          <FontAwesomeIcon icon={faArrowUp} className={styles.icon} />
        </button>
      </div>
    </form>
  );
}
