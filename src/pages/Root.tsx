import { Outlet } from "react-router-dom";
import Footbar from "../components/Footbar";
import Map from "../components/Map";
import { SurveyContextProvider } from "../context/SurveyContext";
import MessageBox from "../components/MessageBox";
import Sidebar from "../components/Sidebar";

export default function Root() {
  return (
    <>
      <Sidebar>
        <MessageBox />
        <SurveyContextProvider>
          <Outlet />
        </SurveyContextProvider>
      </Sidebar>
      <Map />
      <Footbar />
    </>
  )
}