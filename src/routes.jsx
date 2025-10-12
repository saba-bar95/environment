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
import TransportAndEnergy from "./assets/components/Pages/TransportAndEnergy/TransportAndEnergy";
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
// Nature Children Pages
import ProtectedAreas from "./assets/components/Pages/Nature/ProtectedAreas/ProtectedAreas";
import ForestAndFieldFires from "./assets/components/Pages/Nature/ForestAndFieldFires/ForestAndFieldFires";
import ForestArea from "./assets/components/Pages/Nature/ForestArea/ForestArea";
// ForestArea Pages
import ForestResources from "./assets/components/Pages/Nature/ForestArea/ForestResources/ForestResources";
import Inventorization from "./assets/components/Pages/Nature/ForestArea/Inventorization/Inventorization";
import Timber from "./assets/components/Pages/Nature/ForestArea/Timber/Timber";

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
      { path: "nature", element: <Nature /> },
      { path: "reports", element: <Reports /> },
      { path: "energy", element: <Energy /> },
      { path: "transport", element: <Transport /> },
      { path: "waste", element: <Waste /> },
      { path: "other", element: <Other /> },
      { path: "transportandenergy", element: <TransportAndEnergy /> },
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
      // Nature Paths
      { path: "nature/protectedareas", element: <ProtectedAreas /> },
      { path: "nature/forestandfieldfires", element: <ForestAndFieldFires /> },
      { path: "nature/forestarea", element: <ForestArea /> },
      // Forest Area Paths
      {
        path: "nature/forestarea/forestresources",
        element: <ForestResources />,
      },
      { path: "nature/forestarea/timber", element: <Timber /> },
      {
        path: "nature/forestarea/inventorization",
        element: <Inventorization />,
      },
    ],
  },
];

export default routes;
