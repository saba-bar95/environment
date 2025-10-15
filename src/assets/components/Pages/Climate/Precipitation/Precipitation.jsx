import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts.jsx";
import { useState, useEffect } from "react";
import AreaCharts from "./Charts/Chart1/AreaCharts.jsx";
import PositiveAndNegativeBarChart from "./Charts/Chart2/PositiveAndNegativeBarChart.jsx";

const Precipitation = () => {
  const { language } = useParams();

  const info = Charts.climate[2].precipitation;
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      const chartId = location.hash.replace("#", "");
      const element = document.getElementById(chartId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const ChartInfo = [
    {
      title_ge: info[0].title_ge,
      title_en: info[0].title_en,
      colors: ["#1678e7ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [1],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#e94d74ff", "#55c079ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [20],
      chartID: info[1].chartID,
    },
  ];

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Atmospheric Precipitation"
            : "ატმოსფერული ნალექები"}
        </h1>
        <h2>
          {language === "en"
            ? "Rain and snow distribution, droughts and extreme events across Georgia"
            : "წვიმისა და თოვლის განაწილება, გვალვები და ექსტრემალური მოვლენები საქართველოს მასშტაბით"}
        </h2>
      </div>

      <div className="charts-section">
        <div className="chart-container" style={{ width: "100%" }}>
          <AreaCharts chartInfo={ChartInfo[0]} />
          <PositiveAndNegativeBarChart chartInfo={ChartInfo[1]} />
        </div>
      </div>
    </div>
  );
};

export default Precipitation;
