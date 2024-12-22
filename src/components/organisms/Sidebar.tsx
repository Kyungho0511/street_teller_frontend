import styles from "./Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Logo from "../atoms/Logo";
import MessageBox from "../molecules/MessageBox";
import {
  faArrowRotateRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import { Message, MessageContext } from "../../context/MessageContext";
import Tooltip from "../atoms/Tooltip";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import SidebarIcon from "../atoms/icons/SidebarIcon";
import WarningModal from "./WarningModal";

export const SIDEBAR_WIDTH = 480;

/**
 * Sidebar component that displays AI conversation and its children components.
 * Performance Issue: If the text history becomes large, it might be more
 * efficient to store it in a more complex data structure or consider using
 * the _useReducer_ hook for more sophisticated state management.
 */
export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { messages } = useContext(MessageContext);
  const [currentMessage, setCurrentMessage] = useState<Message[]>([]);
  const [messageIndex, setMessageIndex] = useState<number>(0);

  const [displayRestartTooltip, setDisplayRestartTooltip] =
    useState<boolean>(false);
  const [displaySidebarTooltip, setDisplaySidebarTooltip] =
    useState<boolean>(false);
  const [displayModal, setDisplayModal] = useState<boolean>(false);

  const location = useLocation();
  const section = pathToSection(location.pathname);

  useEffect(() => {
    setCurrentMessage(
      messages[section].filter(
        (message) => message.type === "text" || message.type === "section"
      )
    );
  }, [messages, section]);

  // Updates messageIndex when a new message is added or page changes.
  useEffect(() => {
    currentMessage.length > 0 && setMessageIndex(currentMessage.length - 1);
  }, [currentMessage.length, section]);

  const nextMessageIndex = () => {
    setMessageIndex((prev) =>
      prev === currentMessage.length - 1 ? prev : prev + 1
    );
  };

  const prevMessageIndex = () => {
    setMessageIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const navigateMessage = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "right") {
      nextMessageIndex();
    } else if (target.dataset.icon === "left") {
      prevMessageIndex();
    }
  };

  const confirmRestart = () => {
    sessionStorage.clear();
    window.location.href = "/";
    setDisplayModal(false);
  };

  const cancelRestart = () => {
    setDisplayModal(false);
  };

  const toggleSidebar = () => {};

  return (
    <aside className={styles.sidebar} style={{ width: SIDEBAR_WIDTH }}>
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Logo width="150px" color="black" />
          <div className={styles.navigate_container}>
            <div
              className={`${styles.icon} ${styles.small}`}
              onClick={navigateMessage}
              data-icon={"left"}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </div>
            <span>
              {messageIndex + 1}/{currentMessage.length}
            </span>
            <div
              className={`${styles.icon} ${styles.small}`}
              onClick={navigateMessage}
              data-icon={"right"}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>

        <div className={styles.btn_container}>
          <div
            className={`${styles.icon} ${styles.tooltip}`}
            onMouseEnter={() => setDisplaySidebarTooltip(true)}
            onMouseLeave={() => setDisplaySidebarTooltip(false)}
            onClick={toggleSidebar}
          >
            <SidebarIcon />
            {displaySidebarTooltip && <Tooltip text="Close sidebar" />}
          </div>
          <div
            className={`${styles.icon} ${styles.tooltip}`}
            onMouseEnter={() => setDisplayRestartTooltip(true)}
            onMouseLeave={() => setDisplayRestartTooltip(false)}
            onClick={() => setDisplayModal(true)}
          >
            <FontAwesomeIcon icon={faArrowRotateRight} />
            {displayRestartTooltip && <Tooltip text="Restart" />}
          </div>
        </div>
      </div>
      <div className={styles.body}>
        {/* scroller implements a rounded scrollbar */}
        <div className={styles.scroller}>
          <MessageBox texts={currentMessage} textIndex={messageIndex} />
          {children}
        </div>
      </div>
      {displayModal && (
        <WarningModal
          title="Restart Application"
          message="Your progress will be deleted. Do you want to restart?"
          onClickYes={confirmRestart}
          onClickNo={cancelRestart}
        />
      )}
    </aside>
  );
}
