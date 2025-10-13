import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import GeoMapContainer from "./GeoMapContainer";
import Charts from "../../../../../Charts";
import { useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import LineChart1 from "./Charts/LineCharts";

const ProtectedAreas = () => {
  const { language } = useParams();
  const location = useLocation(); // Get the current location to access hash
  const info = Charts.nature[0].protectedAreas;

  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]); // Re-run when the hash changes

  const ChartInfo = [
    {},
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#552a08ff", "#4c534eff", "#f7a72fff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [0, 4, 6],
      chartID: info[1].chartID,
    },
  ];

  return (
    <div className="section-container supply-and-losses">
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
        <GeoMapContainer chartInfo={info[0]} />
        <div className="chart-container">
          <div
            className="header-container1"
            style={{
              borderBottom: "2px solid green",
              width: "100%",
              paddingBottom: "10px",
              gridColumn: "1/3",
            }}>
            <h1
              className="title-text"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                margin: "auto",
                width: "90%",
              }}>
              {language === "en"
                ? "Protected Mammal Species"
                : "დაცული ძუძუმწოვრების სახეობები"}
            </h1>
          </div>
          <LineChart1 chartInfo={ChartInfo[1]} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedAreas;
