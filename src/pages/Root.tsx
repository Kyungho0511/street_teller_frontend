import { Outlet } from "react-router-dom";
import Footbar from "../components/Footbar";
import Map from "../components/Map";
import { SurveyContextProvider } from "../context/SurveyContext";
import ResponseBox from "../components/ResponseBox";
import Sidebar from "../components/Sidebar";

export default function Root() {
  return (
    <>
      <Sidebar>
        <ResponseBox />
        <SurveyContextProvider>
          <Outlet />
        </SurveyContextProvider>
      </Sidebar>
      <Map />
      <Footbar />
    </>
  )
}