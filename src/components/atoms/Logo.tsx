import { Link } from "react-router-dom";
import styles from "./Logo.module.css";
import white from "../../assets/images/site_teller_white_logo.png";
import black from "../../assets/images/site_teller_black_logo.png";
import blue from "../../assets/images/site_teller_blue_logo.png";

type LogoProps = {
  width: string;
  color: "white" | "black" | "blue";
};

/**
 * Logo component to display the site teller brand image.
 *
 */
export default function Logo({ width, color }: LogoProps) {
  const logo = {
    white: white,
    black: black,
    blue: blue,
  };

  return (
    <Link to="/" draggable={false}>
      <div className={styles.container}>
        <img
          src={logo[color]}
          alt="logo_image"
          className={styles.logo}
          style={{ width: width }}
        />
      </div>
    </Link>
  );
}
