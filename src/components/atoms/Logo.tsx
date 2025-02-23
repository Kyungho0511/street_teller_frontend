import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
import white from "../../assets/images/street_teller_white_icon.png";
import black from "../../assets/images/street_teller_black_icon.png";
import blue from "../../assets/images/street_teller_blue_icon.png";

type LogoProps = {
  color: "white" | "black" | "blue";
};

/**
 * Logo component to display the street teller brand image.
 *
 */
export default function Logo({ color }: LogoProps) {
  const logo = {
    white: white,
    black: black,
    blue: blue,
  };

  return (
    <Link to="/" draggable={false}>
      <div className={styles.container}>
        <img src={logo[color]} alt="logo_image" className={styles.icon} />
        <p className={styles.text}>Street Teller</p>
      </div>
    </Link>
  );
}
