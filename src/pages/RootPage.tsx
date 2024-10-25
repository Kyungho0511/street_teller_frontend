import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import SatelliteViewer from "../components/organisms/SatelliteViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { ViewerContextProvider } from "../context/ViewerContext";
import { CameraContextProvider } from "../context/CameraContext";
import MapToggleButton from "../components/atoms/MapToggleButton";

export default function RootPage() {
  return (
    <ViewerContextProvider>
      <CameraContextProvider>
        <MapViewer />
        <SatelliteViewer />
        <MapToggleButton />
      </CameraContextProvider>
      <MessageContextProvider>
        <SurveyContextProvider>
          <Outlet />
        </SurveyContextProvider>
        <Footbar />
      </MessageContextProvider>
    </ViewerContextProvider>
  );
}
