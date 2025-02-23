import styles from "./Sidebar.module.css";
import Logo from "../atoms/Logo";
import MessageBox from "../molecules/MessageBox";
import { useContext, useEffect, useRef, useState } from "react";
import { Message, MessageContext } from "../../context/MessageContext";
import Tooltip from "../atoms/Tooltip";
import { useLocation } from "react-router-dom";
import { pathToSection } from "../../utils/utils";
import { NavbarContext } from "../../context/NavbarContext";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";

export const SIDEBAR_WIDTH = 480;

/**
 * Sidebar component that displays AI conversation and its children components.
 * Performance Issue: If the text history becomes large, it might be more
 * efficient to store it in a more complex data structure or consider using
 * the _useReducer_ hook for more sophisticated state management.
 */
export default function Sidebar({ children }: { children: React.ReactNode }) {
  const {
    setSidebarRef,
    isSidebarOpen,
    openSidebar,
    isRestartTooltipOpen,
    setIsRestartTooltipOpen,
    isSidebarTooltipOpen,
    setIsSidebarTooltipOpen,
    setIsModalOpen,
  } = useContext(NavbarContext);
  const { messages } = useContext(MessageContext);
  const [currentMessage, setCurrentMessage] = useState<Message[]>([]);
  const [messageIndex, setMessageIndex] = useState<number>(0);

  const sidebarRef = useRef<HTMLElement>(null);

  const location = useLocation();
  const section = pathToSection(location.pathname);

  // Update currentMessage.
  useEffect(() => {
    setCurrentMessage(
      messages[section].filter(
        (message) => message.type === "text" || message.type === "instruction"
      )
    );
  }, [messages, section]);

  // Updates messageIndex when a new message is added or page changes.
  useEffect(() => {
    currentMessage.length > 0 && setMessageIndex(currentMessage.length - 1);
  }, [currentMessage.length, section]);

  // Set sidebar reference.
  useEffectAfterMount(() => {
    setSidebarRef(sidebarRef);
  }, [sidebarRef.current]);

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

  return (
    <aside
      ref={sidebarRef}
      className={styles.sidebar}
      style={{ width: SIDEBAR_WIDTH }}
    >
      <div className={styles.header}>
        <div className={styles.logo_container}>
          <Logo color="white" />
          <div className={styles.navigate_container}>
            <div
              className={`${styles.button} ${styles.small}`}
              onClick={navigateMessage}
              data-icon={"left"}
            >
              <Icon path={iconPaths.chevronLeft} color="var(--color-white)" />
            </div>
            <span>
              {messageIndex + 1}/{currentMessage.length}
            </span>
            <div
              className={`${styles.button} ${styles.small}`}
              onClick={navigateMessage}
              data-icon={"right"}
            >
              <Icon path={iconPaths.chevronRight} color="var(--color-white)" />
            </div>
          </div>
        </div>

        <div className={styles.btn_container}>
          <div
            className={`${styles.button} ${styles.tooltip}`}
            onMouseEnter={() => setIsSidebarTooltipOpen(true)}
            onMouseLeave={() => setIsSidebarTooltipOpen(false)}
            onClick={() => openSidebar(false, sidebarRef)}
          >
            <Icon path={iconPaths.sidebar} color="var(--color-white)" />
            {isSidebarTooltipOpen && isSidebarOpen && (
              <Tooltip text="Close sidebar" />
            )}
          </div>
          <div
            className={`${styles.button} ${styles.tooltip}`}
            onMouseEnter={() => setIsRestartTooltipOpen(true)}
            onMouseLeave={() => setIsRestartTooltipOpen(false)}
            onClick={() => setIsModalOpen(true)}
          >
            <Icon path={iconPaths.restart} color="var(--color-white)" />
            {isRestartTooltipOpen && isSidebarOpen && (
              <Tooltip text="Restart" />
            )}
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
    </aside>
  );
}
