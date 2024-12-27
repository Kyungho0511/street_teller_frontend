import { createContext, useState } from "react";

type NavbarContextProps = {
  sidebarRef?: React.RefObject<HTMLElement>;
  setSidebarRef: React.Dispatch<
    React.SetStateAction<React.RefObject<HTMLElement> | undefined>
  >;
  isSidebarOpen: boolean;
  openSidebar: (
    open: boolean,
    sidebarRef?: React.RefObject<HTMLElement>
  ) => void;
  isRestartTooltipOpen: boolean;
  setIsRestartTooltipOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarTooltipOpen: boolean;
  setIsSidebarTooltipOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NavbarContext = createContext<NavbarContextProps>(
  {} as NavbarContextProps
);

export function NavbarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarRef, setSidebarRef] = useState<React.RefObject<HTMLElement>>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isRestartTooltipOpen, setIsRestartTooltipOpen] =
    useState<boolean>(false);

  const [isSidebarTooltipOpen, setIsSidebarTooltipOpen] =
    useState<boolean>(false);

  const openSidebar = (
    open: boolean,
    sidebarRef?: React.RefObject<HTMLElement>
  ) => {
    if (sidebarRef == null || sidebarRef?.current == null) return;
    setIsSidebarTooltipOpen(false);

    const sidebar = sidebarRef.current;
    if (open) {
      sidebar.style.transform = "translateX(0)";
      setIsSidebarOpen(true);
    } else {
      sidebar.style.transform = "translateX(-100%)";
      setIsSidebarOpen(false);
    }
  };

  return (
    <NavbarContext.Provider
      value={{
        sidebarRef,
        setSidebarRef,
        isSidebarOpen,
        openSidebar,
        isRestartTooltipOpen,
        setIsRestartTooltipOpen,
        isSidebarTooltipOpen,
        setIsSidebarTooltipOpen,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}
