import { Navigate } from "react-router-dom";
import App from "./App";
import Homepage from "./assets/components/Homepage/Homepage";

const routes = [
  {
    path: "/",
    element: <Navigate to="/ge" replace />,
  },
  {
    path: "/:language",
    element: <App />,
    children: [{ index: true, element: <Homepage /> }],
  },
];

export default routes;
