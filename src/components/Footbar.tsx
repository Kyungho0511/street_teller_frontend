import Button from './Button'
import styles from './Footbar.module.css'

export default function Footbar() {
  return (
    <footer className={styles.footer}>
      <div className={styles.progressbar_container}>
        <ul className={styles.progressbar}>
          <li>start</li>
          <li>explore</li>
          <li>cluster1</li>
          <li>cluster2</li>
          <li>cluster3</li>
        </ul>
      </div>
      <Button text="continue" color="grey" />
    </footer>
  )
}