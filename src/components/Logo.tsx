import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

type LogoProps = {
  width?: string;
  color?: "white" | "black" | "blue";
};

export default function Logo({ width, color }: LogoProps) {
  return (
    <Link to="/" draggable={false}>
      <img
        src={`src/assets/images/site_teller_${color ?? "black"}_logo.png`}
        alt="logo_image"
        className={styles.logo}
        style={{ width: width }}
      />
    </Link>
  );
}
