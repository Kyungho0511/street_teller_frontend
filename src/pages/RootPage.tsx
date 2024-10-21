import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import SatelliteViewer from "../components/organisms/SatelliteViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { ViewerContextProvider } from "../context/ViewerContext";

/**
 * Root component that manages other pages and provides the context.
 */
export default function RootPage() {
  return (
    <>
      <ViewerContextProvider>
        <MapViewer />
        <SatelliteViewer />
        <MessageContextProvider>
            <SurveyContextProvider>
              <Outlet />
            </SurveyContextProvider>
          <Footbar />
        </MessageContextProvider>
      </ViewerContextProvider>
    </>
  )
}
