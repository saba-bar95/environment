import { useLocation, useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import { useEffect } from "react";
import LineCharts from "./Charts/LineCharts";
import PieCharts from "./Charts/PieCharts";
import AreaCharts from "./Charts/AreaCharts";
import StackedBarChartsWithPercents from "./Charts/StackedBarChartsWithPercents";
import PositiveAndNegativeBarChart from "./Charts/PositiveAndNegativeBarChart";
import LineGridChart from "./Charts/LineGridChart";
import Charts from "../../../../Charts";

const Energy = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.energy;

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
      colors: ["#1678e7ff", "#f7a72fff", "#f0eba4ff", "#4c534eff", "#1bee62ff"],
      id: "final-energy-consumption",
      types: ["data", "metadata"],
      selectedIndices: [5, 3, 1, 7, 15],
      chartID: info[0].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#1678e7ff", "#f7a72fff", "#f0eba4ff", "#4c534eff", "#1bee62ff"],
      id: "final-energy-consumption",
      types: ["data", "metadata"],
      selectedIndices: [5, 3, 1, 7, 15],
      chartID: info[1].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#1678e7ff", "#f7a72fff", "#f0eba4ff", "#4c534eff", "#1bee62ff"],
      id: "final-energy-consumption",
      types: ["data", "metadata"],
      selectedIndices: [5, 3, 1, 7, 15],
      chartID: info[2].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
      wrapperStyles: {
        gridColumn: "1/3",
        width: "100%",
        maxWidth: "100%",
      },
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#3972b3ff", "#c5964eff", "#dad153ff", "#4c534eff", "#55c079ff"],
      id: "primary-energy-supply",
      types: ["data", "metadata"],
      selectedIndices: [9, 8, 6, 25, 26],
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
      id: "primary-energy-supply",
      types: ["data", "metadata"],
      selectedIndices: [1, 0, 2],
      chartID: info[4].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#e94d74ff", "#55c079ff"],
      id: "energy-intensity",
      types: ["data", "metadata"],
      selectedIndices: [4, 0],
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
      id: "energy-intensity",
      types: ["data", "metadata"],
      selectedIndices: [5],
      chartID: info[6].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[7].title_ge,
      title_en: info[7].title_en,
      colors: ["#3972b3ff", "#c5964eff", "#e94d74ff", "#55c079ff"],
      id: "renewable-energy-supply",
      types: ["data", "metadata"],
      selectedIndices: [1, 5, 9, 7],
      chartID: info[7].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[8].title_ge,
      title_en: info[8].title_en,
      colors: ["#63b8e9ff", "#c5964eff", "#e94d74ff", "#55c079ff"],
      id: "renewable-energy-supply",
      types: ["data", "metadata"],
      selectedIndices: [1, 5, 9, 7],
      chartID: info[8].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[9].title_ge,
      title_en: info[9].title_en,
      colors: ["#55c079ff"],
      id: "renewable-energy-supply",
      types: ["data", "metadata"],
      selectedIndices: [14],
      chartID: info[9].chartID,
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
      wrapperStyles: {
        gridColumn: "1/3",
        width: "100%",
        maxWidth: "100%",
      },
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 77%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Environmental Performance of Georgian Energy Sector"
            : "საქართველოს ენერგეტიკის გარემოსდაცვითი მაჩვენებლები"}
        </h1>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <AreaCharts chartInfo={ChartInfo[0]} />
          <PieCharts chartInfo={ChartInfo[1]} />
          <StackedBarChartsWithPercents chartInfo={ChartInfo[2]} />
          <AreaCharts chartInfo={ChartInfo[3]} />
          <LineCharts chartInfo={ChartInfo[4]} />
          <LineCharts chartInfo={ChartInfo[5]} />
          <PositiveAndNegativeBarChart chartInfo={ChartInfo[6]} />
          <AreaCharts chartInfo={ChartInfo[7]} />
          <PieCharts chartInfo={ChartInfo[8]} />
          <LineGridChart chartInfo={ChartInfo[9]} />
        </div>
      </div>
    </div>
  );
};

export default Energy;
