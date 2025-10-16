import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import HydrometeorologicalHazardsChart from "./HydrometeorologicalHazardsChart.jsx";
import ScatterChartContainer from "./ScatterChartContainer.jsx";
import Charts from "../../../../../Charts.jsx";
import BarCharts from "./Charts/Chart1/Chart1.jsx";
import AreaChartsWithLine from "./Charts/Chart3/AreaChartsWithLine.jsx";
import StackedBarChartsWithNumbers from "./Charts/Chart4/StackedBarChartsWithNumbers.jsx";
import RadarChartComponent from "./Charts/Chart5/RadarChartComponent.jsx";
import BarChartComponent from "./Charts/Chart6/BarChartComponent.jsx";
import LineChartsWithTwoApiCalls from "./Charts/Chart7/LineChartsWithTwoApiCalls.jsx";

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
      selectedIndices: [1, 3],
      chartID: info[0].chartID,
      unit_ge: "გარდაცვლილთა რაოდენობა",
      unit_en: "Number of casualties",
    },
    {},
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
          {/* <HydrometeorologicalHazardsChart language={language} /> */}
          <BarCharts chartInfo={ChartInfo[0]} />
          <AreaChartsWithLine chartInfo={ChartInfo[2]} />
          <StackedBarChartsWithNumbers chartInfo={ChartInfo[3]} />
          {width > 1200 ? (
            <div style={{ display: "flex", gap: "40px" }}>
              <RadarChartComponent chartInfo={ChartInfo[4]} />
              <BarChartComponent chartInfo={ChartInfo[5]} />
            </div>
          ) : (
            <>
              <RadarChartComponent chartInfo={ChartInfo[4]} />
              <BarChartComponent chartInfo={ChartInfo[5]} />
            </>
          )}

          {/* <LineChartsWithTwoApiCalls chartInfo={ChartInfo[6]} /> */}
          {/* <ScatterChartContainer language={language} /> */}
        </div>
      </div>
    </div>
  );
};

export default Disasters;
