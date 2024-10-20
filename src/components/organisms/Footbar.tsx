import { Link, useLocation } from 'react-router-dom'
import Button from '../atoms/Button'
import styles from './Footbar.module.css'
import PromptBox from '../molecules/PromptBox';
import MapToggleButton from '../atoms/MapToggleButton';
import { SIDEBAR_WIDTH } from './Sidebar';

export const FOOTBAR_HEIGHT = 100;

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
      nextPath = "/cluster/3";
      break;
}

  return (
    <footer
      className={styles.footer}
      style={{
        height: FOOTBAR_HEIGHT,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
      }}
    >
      <MapToggleButton />
      <PromptBox />
      <Link to={nextPath}>
        <Button text="continue" location="footbar" />
      </Link>
    </footer>
  );
}