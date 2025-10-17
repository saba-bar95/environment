import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../../Charts";
import Chart1 from "./Charts/Chart1/Chart1";

const ForestResources = () => {
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
        <h1>{language === "en" ? "Forest Resources" : "ტყის რესურსები"}</h1>
        <h2>
          {" "}
          {language === "en"
            ? "Information about forest use cover"
            : "ინფორმაცია ტყითსარგებლობის შესახებ"}{" "}
        </h2>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <Chart1
            chartInfo={Charts.biodiversity[1].forestarea[0].forestResources[0]}
          />
        </div>
      </div>
    </div>
  );
};

export default ForestResources;
