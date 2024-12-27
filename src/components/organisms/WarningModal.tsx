import styles from "./WarningModal.module.css";
import ReactDOM from "react-dom";
import CloseIcon from "../atoms/icons/CloseIcon";

type WarningModalProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: React.ReactNode;
};

/**
 * Modal component that displays a warning message and asks for user confirmation.
 */
export default function WarningModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  icon,
}: WarningModalProps) {
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.titleContainer}>
          {icon}
          <p className={styles.title}>{title}</p>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {confirmLabel}
          </button>
          <button onClick={onCancel} className={styles.cancelButton}>
            {cancelLabel}
          </button>
        </div>

        <div className={styles.closeButton} onClick={onCancel}>
          <CloseIcon color="#444444" />
        </div>
      </div>
    </div>,
    document.body
  );
}
