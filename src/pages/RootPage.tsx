import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import Map3dViewer from "../components/organisms/Map3dViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { ViewerContextProvider } from "../context/ViewerContext";
import MapToggleButton from "../components/atoms/MapToggleButton";

export default function RootPage() {
  return (
    <ViewerContextProvider>
      <MapViewer />
      <Map3dViewer />
      <MapToggleButton />
      <MessageContextProvider>
        <SurveyContextProvider>
          <Outlet />
        </SurveyContextProvider>
        <Footbar />
      </MessageContextProvider>
    </ViewerContextProvider>
  );
}
