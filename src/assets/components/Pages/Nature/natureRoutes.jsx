import ProtectedAreas from "./ProtectedAreas/ProtectedAreas";
import ForestAndFieldFires from "./ForestAndFieldFires/ForestAndFieldFires";
import ForestArea from "./ForestArea/ForestArea";

const natureRoutes = [
  {
    path: "protectedareas",
    element: <ProtectedAreas />,
  },
  {
    path: "forestarea",
    element: <ForestArea />,
  },
  {
    path: "forestandfieldfires",
    element: <ForestAndFieldFires />,
  },
];

export default natureRoutes;
