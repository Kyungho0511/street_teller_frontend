import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../atoms/Logo";
import MessageBox from "../molecules/MessageBox";
import {
  faArrowRotateRight,
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { Message, MessageContext } from "../../context/MessageContext";
import Tooltip from "../atoms/Tooltip";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";

export const SIDEBAR_WIDTH = 480;

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

  const [searchQuery, setSearchQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const [displaySearchTooltip, setDisplaySearchTooltip] =
    useState<boolean>(false);

  const restartBtnRef = useRef<HTMLDivElement>(null);
  const [displayRestartTooltip, setDisplayRestartTooltip] =
    useState<boolean>(false);

  const location = useLocation();
  const section = pathToSection(location.pathname);

  useEffect(() => {
    setTexts(
      messages[section].filter(
        (message) => message.type === "text" || message.type === "section"
      )
    );
  }, [messages, section]);

  // Updates messageIndex when a new message is added or page changes.
  useEffect(() => {
    texts.length > 1 && setTextIndex(texts.length - 1);
  }, [texts.length, section]);

  const nextMessageIndex = () => {
    setTextIndex((prev) => (prev === texts.length - 1 ? prev : prev + 1));
  };

  const prevMessageIndex = () => {
    setTextIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleNavigate = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "right") {
      nextMessageIndex();
    } else if (target.dataset.icon === "left") {
      prevMessageIndex();
    }
  };

  const handleRestart = () => {
    sessionStorage.clear();
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const input = inputRef.current;
    if (input) {
      input.focus();
      input.classList.add(styles.active);
    }
  };

  return (
    <aside className={styles.sidebar} style={{ width: SIDEBAR_WIDTH }}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Logo width="148px" color="black" />
          <div className={styles.navigate_container}>
            <div
              className={`${styles.icon} ${styles.small}`}
              onClick={handleNavigate}
              data-icon={"left"}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <span>
              {textIndex + 1}/{texts.length}
            </span>
            <div
              className={`${styles.icon} ${styles.small}`}
              onClick={handleNavigate}
              data-icon={"right"}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>

        <div className={styles.btn_container}>
          <form onSubmit={handleSearch} className={styles.search_container}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sites"
              className={styles.search_input}
              ref={inputRef}
              onBlur={() => inputRef.current?.classList.remove(styles.active)}
            />
            <button
              ref={searchBtnRef}
              type="submit"
              className={`${styles.search_btn} ${styles.tooltip}`}
              onMouseEnter={() => setDisplaySearchTooltip(true)}
              onMouseLeave={() => setDisplaySearchTooltip(false)}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              {displaySearchTooltip && <Tooltip text="Search" />}
            </button>
          </form>

          <div
            ref={restartBtnRef}
            className={`${styles.icon} ${styles.tooltip}`}
            onMouseEnter={() => setDisplayRestartTooltip(true)}
            onMouseLeave={() => setDisplayRestartTooltip(false)}
          >
            <FontAwesomeIcon
              icon={faArrowRotateRight}
              onClick={handleRestart}
            />
            {displayRestartTooltip && <Tooltip text="Restart" />}
          </div>
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
