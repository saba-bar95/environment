import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import routes from "./routes.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.scss";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
