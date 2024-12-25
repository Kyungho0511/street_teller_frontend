import styles from "./Navbar.module.css";
import { useContext } from "react";
import SidebarIcon from "../atoms/icons/SidebarIcon";
import Logo from "../atoms/Logo";
import { NavbarContext } from "../../context/NavbarContext";
import WarningModal from "./WarningModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../atoms/Tooltip";

/**
 * Navbar component.
 */
export default function Navbar() {
  const {
    sidebarRef,
    isSidebarOpen,
    openSidebar,
    isRestartTooltipOpen,
    setIsRestartTooltipOpen,
    isSidebarTooltipOpen,
    setIsSidebarTooltipOpen,
    isModalOpen,
    setIsModalOpen,
  } = useContext(NavbarContext);

  const confirmRestart = () => {
    sessionStorage.clear();
    window.location.href = "/";
    setIsModalOpen(false);
  };

  const cancelRestart = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {!isSidebarOpen && (
        <nav className={styles.navbar}>
          <Logo width="150px" color="black" />

          <div className={styles.btn_container}>
            <div
              className={`${styles.icon} ${styles.tooltip}`}
              onMouseEnter={() => setIsSidebarTooltipOpen(true)}
              onMouseLeave={() => setIsSidebarTooltipOpen(false)}
              onClick={() => openSidebar(true, sidebarRef)}
            >
              <SidebarIcon />
              {isSidebarTooltipOpen && !isSidebarOpen && (
                <Tooltip text="Open sidebar" />
              )}
            </div>

            <div
              className={`${styles.icon} ${styles.tooltip}`}
              onMouseEnter={() => setIsRestartTooltipOpen(true)}
              onMouseLeave={() => setIsRestartTooltipOpen(false)}
              onClick={() => setIsModalOpen(true)}
            >
              <FontAwesomeIcon icon={faArrowRotateRight} />
              {isRestartTooltipOpen && !isSidebarOpen && (
                <Tooltip text="Restart" />
              )}
            </div>
          </div>
        </nav>
      )}

      {isModalOpen && (
        <WarningModal
          title="Restart"
          message="Your progress will be deleted. Do you want to restart?"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          onConfirm={confirmRestart}
          onCancel={cancelRestart}
          icon={
            <FontAwesomeIcon
              icon={faArrowRotateRight}
              className="fa-xl"
              style={{ color: "var(--color-dark-grey)" }}
            />
          }
        />
      )}
    </>
  );
}
