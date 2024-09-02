import { Outlet } from "react-router-dom";
import Footbar from "../components/Footbar";
import Map from "../components/Map";
import { SurveyContextProvider } from "../context/SurveyContext";
import MessageBox from "../components/MessageBox";
import Sidebar from "../components/Sidebar";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";

export default function Root() {
  return (
    <>
      <MapContextProvider>
        <Map />
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