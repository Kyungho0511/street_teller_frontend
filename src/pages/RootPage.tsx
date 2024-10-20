import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import SatelliteViewer from "../components/organisms/SatelliteViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";

export default function RootPage() {
  return (
    <>
      <MapContextProvider>
        <MapViewer />
        <SatelliteViewer />
        <MessageContextProvider>
            <SurveyContextProvider>
              <Outlet />
            </SurveyContextProvider>
          <Footbar />
        </MessageContextProvider>
      </MapContextProvider>
    </>
  )
}
