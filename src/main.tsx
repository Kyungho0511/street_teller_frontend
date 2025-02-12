import ReactDOM from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // TODO: Enable StrictMode on production
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
