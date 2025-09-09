import { Navigate } from "react-router-dom";
import App from "./App";
import Homepage from "./assets/components/Homepage/Homepage";
import Air from "./assets/components/Pages/Air/Air";
import Climate from "./assets/components/Pages/Climate/Climate";
import Water from "./assets/components/Pages/Water/Water";
import Nature from "./assets/components/Pages/Nature/Nature";
import Energy from "./assets/components/Pages/Energy/Energy";
import Transport from "./assets/components/Pages/Transport/Transport";
import Waste from "./assets/components/Pages/Waste/Waste";
import Other from "./assets/components/Pages/Other/Other";
import Reports from "./assets/components/Pages/Reports/Reports";
import waterRoutes from "./assets/components/Pages/Water/waterRoutes";
import climateRoutes from "./assets/components/Pages/Climate/climateRoutes";
import natureRoutes from "./assets/components/Pages/Nature/natureRoutes";

const routes = [
  {
    path: "/",
    element: <Navigate to="/ge" replace />,
  },
  {
    path: "/:language",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "air", element: <Air /> },
      { path: "climate", element: <Climate />, children: climateRoutes },
      { path: "water", element: <Water />, children: waterRoutes },
      { path: "nature", element: <Nature />, children: natureRoutes },
      { path: "reports", element: <Reports /> },
      { path: "energy", element: <Energy /> },
      { path: "transport", element: <Transport /> },
      { path: "waste", element: <Waste /> },
      { path: "other", element: <Other /> },
    ],
  },
];

export default routes;
