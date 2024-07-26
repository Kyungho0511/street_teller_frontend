import { Outlet } from "react-router-dom";
import Footbar from "../components/Footbar";

export default function Root() {
  return (
    <>
      <Outlet />
      <Footbar />
    </>
  )
}