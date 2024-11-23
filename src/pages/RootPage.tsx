import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";
import MapToggleButton from "../components/atoms/MapToggleButton";

export default function RootPage() {
  return (
    <MapContextProvider>
      <MapViewer />
      {/* <Map3dViewer /> */}
      <MapToggleButton />
      <MessageContextProvider>
        <SurveyContextProvider>
          <Outlet />
        </SurveyContextProvider>
        <Footbar />
      </MessageContextProvider>
    </MapContextProvider>
  );
}
