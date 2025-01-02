import styles from "./Navbar.module.css";
import { useContext, useRef } from "react";
import { NavbarContext } from "../../context/NavbarContext";
import WarningModal from "./WarningModal";
import Tooltip from "../atoms/Tooltip";
import { relocateLogo } from "../../services/mapbox";
import useEffectAfterMount from "../../hooks/useEffectAfterMount";
import { SIDEBAR_WIDTH } from "./Sidebar";
import Icon from "../atoms/Icon";
import { iconPaths } from "../../constants/IconConstants";
import { MapContext } from "../../context/MapContext";

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
  const { mapViewer } = useContext(MapContext);
  const mapboxLogoRef = useRef<HTMLDivElement>(null);

  // Relocate Mapbox logo to navbar.
  useEffectAfterMount(() => {
    if (!mapboxLogoRef.current || !mapViewer) return;
    mapViewer.on("idle", () => {
      relocateLogo(mapboxLogoRef.current!);
    });
  }, [mapboxLogoRef.current, mapViewer]);

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
              <Icon path={iconPaths.sidebar} color="var(--color-dark-grey)" />
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
              <Icon path={iconPaths.restart} color="var(--color-dark-grey)" />
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
            <Icon
              path={iconPaths.restart}
              color="var(--color-dark-grey)"
              width={30}
              height={30}
            />
          }
        />
      )}
    </>
  );
}
