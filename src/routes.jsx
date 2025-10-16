import { Navigate } from "react-router-dom";
import App from "./App";
import Homepage from "./assets/components/Homepage/Homepage";
import Air from "./assets/components/Pages/Air/Air";
import Climate from "./assets/components/Pages/Climate/Climate";
import Water from "./assets/components/Pages/Water/Water";
import Biodiversity from "./assets/components/Pages/Biodiversity/Biodiversity";
import Energy from "./assets/components/Pages/Energy/Energy";
import Transport from "./assets/components/Pages/Transport/Transport";
import Waste from "./assets/components/Pages/Waste/Waste";
import Other from "./assets/components/Pages/Other/Other";
import Reports from "./assets/components/Pages/Reports/Reports";
// Climate Children Pages
import Disasters from "./assets/components/Pages/Climate/Disasters/Disasters";
import Emissions from "./assets/components/Pages/Climate/Emissions/Emissions";
import Precipitation from "./assets/components/Pages/Climate/Precipitation/Precipitation";
import Temperature from "./assets/components/Pages/Climate/Temperature/Temperature";
// Water Children Pages
import Majors from "./assets/components/Pages/Water/Majors/Majors";
import Protection from "./assets/components/Pages/Water/Protection/Protection";
import SupplyAndLosses from "./assets/components/Pages/Water/SupplyAndLosses/SupplyAndLosses";
import Trace from "./assets/components/Pages/Water/Trace/Trace";
// Biodiversity Children Pages
import ProtectedAreas from "./assets/components/Pages/Biodiversity/ProtectedAreas/ProtectedAreas";
import ForestAndFieldFires from "./assets/components/Pages/Biodiversity/ForestAndFieldFires/ForestAndFieldFires";
import ForestArea from "./assets/components/Pages/Biodiversity/ForestArea/ForestArea";
// ForestArea Pages
import ForestResources from "./assets/components/Pages/Biodiversity/ForestArea/ForestResources/ForestResources";

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
      { path: "climate", element: <Climate /> },
      { path: "water", element: <Water /> },
      { path: "biodiversity", element: <Biodiversity /> },
      { path: "reports", element: <Reports /> },
      { path: "energy", element: <Energy /> },
      { path: "transport", element: <Transport /> },
      { path: "waste", element: <Waste /> },
      { path: "other", element: <Other /> },
      // Climate Paths
      { path: "climate/disasters", element: <Disasters /> },
      { path: "climate/emissions", element: <Emissions /> },
      { path: "climate/precipitation", element: <Precipitation /> },
      { path: "climate/temperature", element: <Temperature /> },
      //Water Paths
      { path: "water/majors", element: <Majors /> },
      { path: "water/protection", element: <Protection /> },
      { path: "water/supplyandlosses", element: <SupplyAndLosses /> },
      { path: "water/trace", element: <Trace /> },
      // Biodiversity Paths
      { path: "biodiversity/protectedareas", element: <ProtectedAreas /> },
      {
        path: "biodiversity/forestandfieldfires",
        element: <ForestAndFieldFires />,
      },
      { path: "biodiversity/forestarea", element: <ForestArea /> },
      // Forest Area Paths
      {
        path: "biodiversity/forestarea/forestresources",
        element: <ForestResources />,
      },
    ],
  },
];

export default routes;
