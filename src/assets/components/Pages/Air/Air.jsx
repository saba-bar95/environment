import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../Charts";
import Chart1 from "./Charts/Chart1/Chart1";
import Chart2 from "./Charts/Chart2/Chart2";
import Chart3 from "./Charts/Chart3/Chart3";
import Footer from "./Footer/Footer";
import Quality from "./Quality/Quality";

const Air = () => {
  const { language } = useParams();
  const location = useLocation(); // Get the current location to access hash

  // Scroll to the chart specified in the URL hash
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
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Air Quality and Emissions"
            : "ჰაერის ხარისხი და გაფრქვევები"}
        </h1>
        <h2>
          {language === "en"
            ? "Latest trends in air pollution, emissions and urban air quality in Georgia"
            : "ჰაერის დაბინძურების, გაფრქვევებისა და ქალაქებში ჰაერის ხარისხის უახლესი ტენდენციები საქართველოში"}
        </h2>
      </div>
      <div className="charts-section">
        <Quality />
        <div className="chart-container">
          <Chart1 chartInfo={Charts.air[0]} />
          <Chart2 chartInfo={Charts.air[1]} />
          <Chart3 chartInfo={Charts.air[2]} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Air;
