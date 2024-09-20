import { Link, useLocation } from 'react-router-dom'
import Button from '../atoms/Button'
import styles from './Footbar.module.css'
import PromptBox from '../molecules/PromptBox';

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
    <footer className={styles.footer}>
      <PromptBox />
      <Link to={nextPath}> 
        <Button text="continue" color="grey" location="footbar" />
      </Link>
    </footer>
  )
}