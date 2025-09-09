import Majors from "./Majors/Majors";
import Protection from "./Protection/Protection";
import SupplyAndLosses from "./SupplyAndLosses/SupplyAndLosses";
import Trace from "./Trace/Trace";

const waterRoutes = [
  {
    path: "majors",
    element: <Majors />,
  },
  {
    path: "protection",
    element: <Protection />,
  },
  {
    path: "supplyandlosses",
    element: <SupplyAndLosses />,
  },
  {
    path: "trace",
    element: <Trace />,
  },
];

export default waterRoutes;
