import { useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts.jsx";
import { useState, useEffect } from "react";
import AreaCharts from "./Charts/Chart1/AreaCharts.jsx";
import PositiveAndNegativeBarChart from "./Charts/Chart2/PositiveAndNegativeBarChart.jsx";
import PercentAreaCharts from "./Charts/Chart3/PercentAreaCharts.jsx";
import LineChart from "./Charts/Chart4/LineCharts.jsx";
import PieCharts from "./Charts/Chart5/PieCharts.jsx";
import BarCharts from "./Charts/Chart6/BarCharts.jsx";
import HorizontalBarCharts from "./Charts/Chart7/HorizontalBarCharts.jsx";

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
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#e94d74ff", "#55c079ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [3, 4],
      chartID: info[2].chartID,
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#692fc5ff", "#55c079ff", "#c5964eff", "#dad153ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [1, 11, 16, 6],
      chartID: info[3].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#692fc5ff", "#55c079ff", "#c5964eff", "#dad153ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [0, 10, 15, 5],
      chartID: info[4].chartID,
      unit_ge: "მილიმეტრი",
      unit_en: "millimeters",
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#e94d74ff", "#55c079ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [1, 11, 16, 6],
      chartID: info[5].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[6].title_ge,
      title_en: info[6].title_en,
      colors: ["#e94d74ff", "#55c079ff"],
      id: "atmospheric-precipitation",
      types: ["data", "metadata"],
      selectedIndices: [4, 3, 9, 8, 14, 13, 19, 18],
      chartID: info[6].chartID,
      unit_ge: "მილიმეტრი",
      unit_en: "millimeters",
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
  ];

  return (
    <div className="section-container supply-and-losses">
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
          <PercentAreaCharts chartInfo={ChartInfo[2]} />
          <LineChart chartInfo={ChartInfo[3]} />
          <PieCharts chartInfo={ChartInfo[4]} />
          <BarCharts chartInfo={ChartInfo[5]} />
          <HorizontalBarCharts chartInfo={ChartInfo[6]} />
        </div>
      </div>
    </div>
  );
};

export default Precipitation;
