import { Outlet } from "react-router-dom";
import Header from "./assets/components/Header/Header";
import Footer from "./assets/components/Footer/Footer";
import ScrollToTop from "./ScrollToTop";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}

export default App;
