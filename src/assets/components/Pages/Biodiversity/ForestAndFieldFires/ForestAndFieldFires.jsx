import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts";
import Chart1 from "./Charts/Chart1/Chart1";
import { useEffect } from "react";

const ForestAndFieldFires = () => {
  const { language } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

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
            ? "Forest and Field Fires"
            : "ტყისა და ველის ხანძრები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Data on fires and damaged areas"
            : "მონაცემები ხანძრების და დაზიანებული ტერიტორიების შესახებ"}{" "}
        </h2>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <Chart1 chartInfo={Charts.biodiversity[2].forestandfieldfires[0]} />
        </div>
      </div>
    </div>
  );
};

export default ForestAndFieldFires;
