import styles from "./Footbar.module.css";
import { Link, useLocation } from "react-router-dom";
import Button from "../atoms/Button";
import PromptBox from "../molecules/PromptBox";
import MapToggleButton from "../atoms/MapToggleButton";

export const FOOTBAR_HEIGHT = 90;

/**
 * Footbar component.
 */
export default function Footbar() {
  // router navigation logic
  const location = useLocation();
  let nextPath = "/";

  switch (location.pathname) {
    case "/":
      nextPath = "/cluster/1";
      break;
    case "/cluster/1":
      nextPath = "/cluster/2";
      break;
    case "/cluster/2":
      nextPath = "/cluster/3";
      break;
    case "/cluster/3":
      nextPath = "/report";
      break;
  }

  return (
    <footer
      className={styles.footer}
      style={{
        height: FOOTBAR_HEIGHT,
      }}
    >
      <MapToggleButton />
      <PromptBox />
      <Link to={nextPath}>
        <Button text={"continue"} type="footbar" />
      </Link>
    </footer>
  );
}
