import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import MapViewer from "../components/organisms/MapViewer";
import SatelliteViewer from "../components/organisms/SatelliteViewer";
import { SurveyContextProvider } from "../context/SurveyContext";
import MessageBox from "../components/molecules/MessageBox";
import Sidebar from "../components/organisms/Sidebar";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";

export default function RootPage() {
  return (
    <>
      <MapContextProvider>
        <MapViewer />
        <SatelliteViewer />
        <MessageContextProvider>
          <Sidebar>
            <MessageBox />
            <SurveyContextProvider>
              <Outlet />
            </SurveyContextProvider>
          </Sidebar>
          <Footbar />
        </MessageContextProvider>
      </MapContextProvider>
    </>
  )
}
