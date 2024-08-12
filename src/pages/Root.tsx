import { Outlet } from "react-router-dom";
import Footbar from "../components/Footbar";
import Map from "../components/Map";
import { SurveyContextProvider } from "../context/SurveyContext";

export default function Root() {
  return (
    <>
      <Map />

      <SurveyContextProvider>
        <Outlet />
      </SurveyContextProvider>
      
      <Footbar />
    </>
  )
}