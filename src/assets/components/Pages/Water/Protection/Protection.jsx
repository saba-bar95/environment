import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts";
import LineChart1 from "./Charts/LineCharts";
import AreaCharts from "./Charts/AreaCharts";
import PieChartComponent from "./Charts/PieCharts";

const Protection = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.water[1].protection;
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
  }, [width]);

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
    {
      title_ge: info[0].title_ge,
      title_en: info[0].title_en,
      colors: ["#1464dbff", "#4de9d4ff"],
      id: "water-abstraction",
      types: ["data", "metadata"],
      selectedIndices: [0, 1],
      chartID: info[0].chartID,
      unit_ge: "მილიონი მ³",
      unit_en: "Million m³",
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#1464dbff", "#63b8e9ff", "#4de9d4ff"],
      id: "water-abstraction",
      types: ["data", "metadata"],
      selectedIndices: [3, 4, 5],
      chartID: info[0].chartID,
      unit_ge: "მილიონი მ³",
      unit_en: "Million m³",
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#63b8e9ff", "#4de9d4ff"],
      id: "water-abstraction",
      types: ["data", "metadata"],
      selectedIndices: [8, 9],
      chartID: info[2].chartID,
      unit_ge: "მილიონი მ³",
      unit_en: "Million m³",
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#63b8e9ff", "#4de9d4ff"],
      id: "water-abstraction",
      types: ["data", "metadata"],
      selectedIndices: [6, 7],
      chartID: info[3].chartID,
      unit_ge: "მილიონი მ³",
      unit_en: "Million m³",
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#1464dbff", "#63b8e9ff", "#4de9d4ff"],
      id: "water-abstraction",
      types: ["data", "metadata"],
      selectedIndices: [3, 4, 5],
      chartID: info[4].chartID,
      unit_ge: "მილიონი მ³",
      unit_en: "Million m³",
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 45%",
        }}>
        <div className="overlay" />
        <h1>
          {language === "en"
            ? "Trends in Water Abstraction from Natural Sources in Georgia (2012-2023)"
            : "ბუნებრივი ობიექტებიდან წყლის აღების ტენდენციები საქართველოში (2012-2023)"}
        </h1>
      </div>
      <div className="charts-section">
        <div className="chart-container" style={{ gridTemplateColumns: "1fr" }}>
          <LineChart1 chartInfo={ChartInfo[0]} />
          <LineChart1 chartInfo={ChartInfo[1]} />
          <AreaCharts chartInfo={ChartInfo[2]} />
          {width > 1200 ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <AreaCharts chartInfo={ChartInfo[3]} />
              <PieChartComponent chartInfo={ChartInfo[4]} />
            </div>
          ) : (
            <>
              <AreaCharts chartInfo={ChartInfo[3]} />
              <PieChartComponent chartInfo={ChartInfo[4]} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Protection;
