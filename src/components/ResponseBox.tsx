import styles from "./ResponseBox.module.css";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function ResponseBox() {
  // hardcoded values for demonstration purposes
  // to be replaced with dynamic values
  const [responseCount, setResponseCount] = useState(8);
  const [currentResponse, setCurrentResponse] = useState(7);

  const handleClick = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "chevron-right") {
      setCurrentResponse((prev) => prev === responseCount ? prev : prev + 1);
    } 
    else if (target.dataset.icon === "chevron-left") {
      setCurrentResponse((prev) => prev === 0 ? 0 : prev - 1);
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <Logo width="160px" color="black" />
        <div className={styles.navigate}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={handleClick} />
          <span>{currentResponse}/{responseCount}</span>
          <FontAwesomeIcon icon={faChevronRight} onClick={handleClick} />
        </div>
      </div>
      <div className={styles.body}>
        <p>
          Tell us about your life-style by selecting the categories important
          for your new home. We will tell you about NYC neighborhoods that suit
          your household the best.
        </p>
      </div>
    </div>
  );
}
