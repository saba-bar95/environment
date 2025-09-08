import { Outlet } from "react-router-dom";
import Header from "./assets/components/Header/Header";
// import Footer from "./assets/components/Footer/Footer";

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
