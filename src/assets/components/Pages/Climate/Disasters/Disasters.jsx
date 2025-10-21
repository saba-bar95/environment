import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts.jsx";
import BarCharts from "./Charts/Chart1/Chart1.jsx";
import DisastersHeatmapChart from "./Charts/Chart2/HeatmapChart.jsx";
import AreaChartsWithLine from "./Charts/Chart3/AreaChartsWithLine.jsx";
import StackedBarChartsWithNumbers from "./Charts/Chart4/StackedBarChartsWithNumbers.jsx";
import RadarChartComponent from "./Charts/Chart5/RadarChartComponent.jsx";
import BarChartComponent from "./Charts/Chart6/BarChartComponent.jsx";
import LineChartWithTwoApiCalls from "./Charts/Chart7/LineChartWithTwoApiCalls.jsx";
import ScatterChart from "./Charts/Chart8/ScatterChart.jsx";
import PieChartWithYears from "./Charts/Chart9/PieChartWithYears.jsx";

const Disasters = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.climate[0].disasters;
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
  }, [location.hash]);

  const ChartInfo = [
    {
      title_ge: info[0].title_ge,
      title_en: info[0].title_en,
      colors: ["#e94d74ff"],
      id: "geological-phenomena",
      types: ["data", "metadata"],
      selectedIndices: [0, 1],
      chartID: info[0].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#e94d74ff"],
      id: "hydro-meteorological-hazards",
      types: ["data", "metadata"],
      selectedIndices: [6],
      chartID: info[1].chartID,
      unit_ge: "შემთხვევების რაოდენობა",
      unit_en: "Number of cases",
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#1678e7ff", "#63b8e9ff", "#e94d74ff"],
      id: "geological-phenomena",
      types: ["data", "metadata"],
      selectedIndices: [0, 2, 1, 3],
      chartID: info[2].chartID,
      unit_ge: "შემთხვევების რაოდენობა",
      unit_en: "Number of cases",
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: [
        "#1678e7ff",
        "#f7a72fff",
        "#dad153ff",
        "#692fc5ff",
        "#55c079ff",
        "#a9b8aeff",
      ],
      id: "hydro-meteorological-hazards",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 2, 3, 4, 5],
      chartID: info[3].chartID,
      unit_ge: "შემთხვევების რაოდენობა",
      unit_en: "Number of cases",
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#1678e7ff", "#55c079ff", "#a9b8aeff"],
      id: "hydro-meteorological-hazards",
      types: ["data", "metadata"],
      selectedIndices: [0, 2, 5],
      chartID: info[4].chartID,
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#1678e7ff", "#55c079ff", "#a9b8aeff", "#63b8e9ff", "#e94d74ff"],
      id: "hydro-meteorological-hazards",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 2, 3, 4, 5],
      chartID: info[5].chartID,
    },
    {
      title_ge: info[6].title_ge,
      title_en: info[6].title_en,
      colors: ["#f7a72fff", "#e94d74ff"],
      id: "geological-phenomena",
      types: ["data", "metadata"],
      selectedIndices: [0, 2],
      chartID: info[6].chartID,
      unit_ge: "შემთხვევების რაოდენობა",
      unit_en: "Number of cases",
      secontCall: {
        id: "hydro-meteorological-hazards",
        types: ["data", "metadata"],
        selectedIndices: [0, 1, 2, 3, 4, 5],
      },
    },
    {
      title_ge: info[7].title_ge,
      title_en: info[7].title_en,
      colors: ["#692fc5ff"],
      id: "geological-phenomena",
      types: ["data", "metadata"],
      selectedIndices: [5, 6, 1, 3],
      chartID: info[7].chartID,
      unit_ge: "წრეწირის ზომა ასახავს გარდაცვლილთა რაოდენობას",
      unit_en: "The size of the circle reflects the number of deaths",
    },
    {
      title_ge: info[8].title_ge,
      title_en: info[8].title_en,
      colors: ["#1678e7ff", "#692fc5ff", "#63b8e9ff", "#f7a72fff"],
      id: "geological-phenomena",
      types: ["data", "metadata"],
      selectedIndices: [0, 2],
      chartID: info[8].chartID,
    },
  ];

  return (
    <div className="section-container">
      <div
        className="background-container"
        style={{ backgroundImage: `url(${backgroundImg})` }}>
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Natural Disasters in Georgia"
            : "სტიქიური მოვლენები საქართველოში"}
        </h1>
        <h2>
          {language === "en"
            ? "Trends in geological and hydrometeorological events"
            : "გეოლოგიური და ჰიდრომეტეოროლოგიური მოვლენების ტენდენციები"}
        </h2>
      </div>

      <div className="charts-section">
        <div className="chart-container" style={{ width: "100%" }}>
          <BarCharts chartInfo={ChartInfo[0]} />
          <DisastersHeatmapChart chartInfo={ChartInfo[1]} />
          <AreaChartsWithLine chartInfo={ChartInfo[2]} />
          {width > 1200 ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <StackedBarChartsWithNumbers chartInfo={ChartInfo[3]} />
              <RadarChartComponent chartInfo={ChartInfo[4]} />
            </div>
          ) : (
            <>
              <StackedBarChartsWithNumbers chartInfo={ChartInfo[3]} />
              <RadarChartComponent chartInfo={ChartInfo[4]} />
            </>
          )}
          {width > 1200 ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <BarChartComponent chartInfo={ChartInfo[5]} />
              <LineChartWithTwoApiCalls chartInfo={ChartInfo[6]} />
            </div>
          ) : (
            <>
              <BarChartComponent chartInfo={ChartInfo[5]} />
              <LineChartWithTwoApiCalls chartInfo={ChartInfo[6]} />
            </>
          )}

          {width > 1200 ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <ScatterChart chartInfo={ChartInfo[7]} />
              <PieChartWithYears chartInfo={ChartInfo[8]} />
            </div>
          ) : (
            <>
              <ScatterChart chartInfo={ChartInfo[7]} />
              <PieChartWithYears chartInfo={ChartInfo[8]} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Disasters;
