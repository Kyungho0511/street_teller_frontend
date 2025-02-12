import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";
import Navbar from "../components/organisms/Navbar";
import { NavbarContextProvider } from "../context/NavbarContext";

/**
 * Root component that wraps other pages.
 */
export default function RootPage() {
  return (
    <MapContextProvider>
      <MapViewer />
      <NavbarContextProvider>
        <Navbar />
        <MessageContextProvider>
          <SurveyContextProvider>
            <Outlet />
          </SurveyContextProvider>
          <Footbar />
        </MessageContextProvider>
      </NavbarContextProvider>
    </MapContextProvider>
  );
}
