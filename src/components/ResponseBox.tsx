import styles from "./ResponseBox.module.css";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initialTextHome } from "../constants/homeConstants";
import { initialTextExplore } from "../constants/exploreConstants";
import { initialTextCluster } from "../constants/clusterConstants";

type Message = {
  text: string,
  sender: "ai" | "user"
};

export default function ResponseBox() {
  // history of text responses and current response index
  // Performance Issue: If the text history becomes large, it might be more   
  // efficient to store it in a more complex data structure or consider using  
  // the useReducer hook for more sophisticated state management.
  const [textHistory, setTextHistory] = useState<string[]>([]); 
  const [textIndex, setTextIndex] = useState<number>(0);

  const location = useLocation();

  console.log("index:", textIndex, "length:", textHistory.length);

  useEffect(() => {
    // send initial prompt to LLM based on url location.
    switch (location.pathname) {
      case "/":
        setTextHistory((prev) => [...prev, initialTextHome]);
        setTextIndex(textIndex + 1);
        break;
      case "/explore":
        setTextHistory((prev) => [...prev, initialTextExplore]);
        setTextIndex(textIndex + 1);
        break;
      case "/cluster":
        setTextHistory((prev) => [...prev, initialTextCluster]);
        setTextIndex(textIndex + 1);
        break;
    }
  }, [location.pathname]);

  const handleClick = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (target.dataset.icon === "chevron-right") {
      setTextIndex((prev) => prev === textHistory.length - 1 ? prev : prev + 1);
    } 
    else if (target.dataset.icon === "chevron-left") {
      setTextIndex((prev) => prev === 0 ? 0 : prev - 1);
    }
  }

  return (
    <div className={styles.container}>
      {/* header */}
      <div className={styles.header}>
        <Logo width="160px" color="black" />
        <div className={styles.navigate}>
          <FontAwesomeIcon icon={faChevronLeft} onClick={handleClick} />
          <span>
            {textIndex + 1}/{textHistory.length}
          </span>
          <FontAwesomeIcon icon={faChevronRight} onClick={handleClick} />
        </div>
      </div>

      {/* body */}
      <div className={styles.body}>
        <p className={`${styles.message} ${styles.user}`}>
          {"hello, how can you help me? please tell me about this site."}
        </p>
        <p className={`${styles.message} ${styles.ai}`}>
          {textHistory[textIndex]}
        </p>
      </div>
    </div>
  );
}
