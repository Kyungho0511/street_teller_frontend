import { Outlet } from "react-router-dom";
import Footbar from "../components/organisms/Footbar";
import Map from "../components/organisms/Map";
import Map3DTiles from "../components/organisms/Map3DTiles";
import { SurveyContextProvider } from "../context/SurveyContext";
import MessageBox from "../components/molecules/MessageBox";
import Sidebar from "../components/organisms/Sidebar";
import { MessageContextProvider } from "../context/MessageContext";
import { MapContextProvider } from "../context/MapContext";
import Map3DButton from "../components/atoms/Map3DButton";

export default function RootPage() {
  return (
    <>
      <MapContextProvider>
        <Map />
        <Map3DTiles />
        <MessageContextProvider>
          <Sidebar>
            <MessageBox />
            <SurveyContextProvider>
              <Outlet />
            </SurveyContextProvider>
          </Sidebar>
          <Footbar />
          <Map3DButton />
        </MessageContextProvider>
      </MapContextProvider>
    </>
  )
}
