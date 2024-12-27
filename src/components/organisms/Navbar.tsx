import styles from "./Navbar.module.css";
import { useContext, useEffect, useRef } from "react";
import SidebarIcon from "../atoms/icons/SidebarIcon";
import { NavbarContext } from "../../context/NavbarContext";
import WarningModal from "./WarningModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../atoms/Tooltip";
import { relocateLogo } from "../../services/mapbox";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { SIDEBAR_WIDTH } from "./Sidebar";

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

  const mapboxLogoRef = useRef<HTMLDivElement>(null);

  // Relocate Mapbox logo to navbar
  useEffectAfterMount(() => {
    if (!mapboxLogoRef.current) return;
    relocateLogo(mapboxLogoRef.current);
  }, [mapboxLogoRef.current]);

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
      <nav
        className={styles.navbar}
        style={
          isSidebarOpen
            ? {
                width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                left: SIDEBAR_WIDTH,
              }
            : {
                width: `100%`,
                left: 0,
              }
        }
      >
        {!isSidebarOpen && (
          <div className={styles.btn_container}>
            <div
              className={`${styles.button} ${styles.tooltip}`}
              onMouseEnter={() => setIsSidebarTooltipOpen(true)}
              onMouseLeave={() => setIsSidebarTooltipOpen(false)}
              onClick={() => openSidebar(true, sidebarRef)}
            >
              <div className={styles.icon}>
                <SidebarIcon color="var(--color-dark-grey)" />
              </div>
              {isSidebarTooltipOpen && !isSidebarOpen && (
                <Tooltip text="Open sidebar" offset={{ x: 28, y: 0 }} />
              )}
            </div>

            <div
              className={`${styles.button} ${styles.tooltip}`}
              onMouseEnter={() => setIsRestartTooltipOpen(true)}
              onMouseLeave={() => setIsRestartTooltipOpen(false)}
              onClick={() => setIsModalOpen(true)}
            >
              <div className={styles.icon}>
                <FontAwesomeIcon icon={faArrowRotateRight} />
              </div>
              {isRestartTooltipOpen && !isSidebarOpen && (
                <Tooltip text="Restart" />
              )}
            </div>
          </div>
        )}
        <div ref={mapboxLogoRef}></div>
      </nav>

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
