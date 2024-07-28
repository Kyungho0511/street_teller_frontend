import { Outlet } from "react-router-dom";
import Footbar from "../components/Footbar";
import Map from "../components/Map";

export default function Root() {
  return (
    <>
      <Map />
      <Outlet />
      <Footbar />
    </>
  )
}