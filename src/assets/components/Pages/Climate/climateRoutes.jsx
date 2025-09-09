import Disasters from "./Disasters/Disasters";
import Emissions from "./Emissions/Emissions";
import Precipitation from "./Precipitation/Precipitation";
import Temperature from "./Temperature/Temperature";

const natureRoutes = [
  {
    path: "disasters",
    element: <Disasters />,
  },
  {
    path: "temperature",
    element: <Temperature />,
  },
  {
    path: "precipitation",
    element: <Precipitation />,
  },
  {
    path: "emissions",
    element: <Emissions />,
  },
];

export default natureRoutes;
