import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";

/**
 * Root component that wraps other pages.
 */
export default function RootPage() {
  return (
    <MapContextProvider>
      <MapViewer />
      <MessageContextProvider>
        <SurveyContextProvider>
          <Outlet />
        </SurveyContextProvider>
        <Footbar />
      </MessageContextProvider>
    </MapContextProvider>
  );
}
