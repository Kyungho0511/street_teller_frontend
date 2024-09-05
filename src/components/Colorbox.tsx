import styles from "./Colorbox.module.css";

export default function Colorbox({ label }: { label: string }) {
  return (
    <div className={styles.container}>
      <div className={styles.colorbox}></div>
      <p>{label}</p>
    </div>
  )
}