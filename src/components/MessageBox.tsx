import styles from "./MessageBox.module.css";
import Logo from "./Logo";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initialTextExplore } from "../constants/exploreConstants";
import { initialTextCluster } from "../constants/clusterConstants";
import { MessageContext } from "../context/MessageContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";


export default function MessageBox() {
  // history of text responses and current response index
  // Performance Issue: If the text history becomes large, it might be more
  // efficient to store it in a more complex data structure or consider using
  // the __useReducer__ hook for more sophisticated state management.
  const {
    messages,
    addMessages,
    messageIndex,
    nextMessageIndex,
    prevMessageIndex,
  } = useContext(MessageContext);
  const location = useLocation();

  // To be deleted after testing!!
  console.log("index:", messageIndex, "length:", messages.length);

  useEffect(() => {
    // send initial prompt to LLM based on url location.
    switch (location.pathname) {
      case "/explore":
        addMessages(initialTextExplore);
        break;
      case "/cluster":
        addMessages(initialTextCluster);
        break;
    }
  }, [location.pathname]);

  const handleClick = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "chevron-right") {
      nextMessageIndex();
    } else if (target.dataset.icon === "chevron-left") {
      prevMessageIndex();
    }
  };

  return (
    <div className={styles.container}>
      
      {/* header */}
      <div className={styles.header}>
        <Logo width="160px" color="black" />
        <div className={styles.navigate}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={styles.icon}
            onClick={handleClick}
          />
          <span>
            {messageIndex + 1}/{messages.length}
          </span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className={styles.icon}
            onClick={handleClick}
          />
        </div>
      </div>

      {/* body */}
      <div className={styles.body}>
        <p className={`${styles.message} ${styles.user}`}>
          <FontAwesomeIcon icon={faCircleUser} className={styles.icon} />
          {messages[messageIndex].user}
        </p>
        <p className={`${styles.message} ${styles.ai}`}>
          <FontAwesomeIcon icon={faLocationDot} className={styles.icon} />
          {messages[messageIndex].ai}
        </p>
      </div>

    </div>
  );
}
