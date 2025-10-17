import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts";
import Chart1 from "./Charts/Chart1/Chart1";
import Chart2 from "./Charts/Chart2/Chart2";

const Majors = () => {
  const { language } = useParams();
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update windowWidth on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to chart if hash exists
  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  const info1 = Charts.water[0].majors[0];
  const info2 = Charts.water[0].majors[1];

  // Set chart-container width based on window size
  const chartContainerWidth = windowWidth < 768 ? "100%" : "80%";

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
            ? "Main Rivers and Lakes of Georgia"
            : "საქართველოს მთავარი მდინარეები და ტბები"}
        </h1>
      </div>
      <div className="charts-section">
        <div className="chart-container" style={{ width: chartContainerWidth }}>
          <Chart1 chartInfo={info1} />
          <Chart2 chartInfo={info2} />
        </div>
      </div>
    </div>
  );
};

export default Majors;
