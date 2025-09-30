import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import GeoMapContainer from "./GeoMapContainer";
import Charts from "../../../../../Charts";
import { useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

const ProtectedAreas = () => {
  const { language } = useParams();
  const location = useLocation(); // Get the current location to access hash

  const info = Charts.nature[0].protectedAreas[0];

  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]); // Re-run when the hash changes

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Protected Areas of Georgia"
            : "საქართველოს დაცული ტერიტორიები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Discover Georgia's growing network of national parks, reserves, and protected landscapes"
            : "აღმოაჩინეთ საქართველოს ეროვნული პარკების, ნაკრძალებისა და დაცული ლანდშაფტების მზარდი ქსელი"}{" "}
        </h2>
      </div>
      <Header />
      <div className="charts-section">
        <GeoMapContainer chartInfo={info} />
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedAreas;
