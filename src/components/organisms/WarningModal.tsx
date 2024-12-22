import styles from "./WarningModal.module.css";

type WarningModalProps = {
  title: string;
  message: string;
  onClickYes: () => void;
  onClickNo: () => void;
};

/**
 * Modal component that displays a warning message and asks for user confirmation.
 */
export default function WarningModal({
  title,
  message,
  onClickYes,
  onClickNo,
}: WarningModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <p>{title}</p>
        <p>{message}</p>
        <div className={styles.buttons}>
          <button onClick={onClickYes} className={styles.yesButton}>
            Yes
          </button>
          <button onClick={onClickNo} className={styles.noButton}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
