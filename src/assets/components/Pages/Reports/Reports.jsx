import { useLocation, useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../Charts";
import { useEffect } from "react";
import LineCharts from "./Charts/LineCharts";
import BarCharts from "./Charts/BarCharts";
import StackedBarCharts from "./Charts/StackedBarCharts";
import PieCharts from "./Charts/PieCharts";
import AreaCharts from "./Charts/AreaCharts";
import BarChartsWithYears from "./Charts/BarChartsWithYears";

const Reports = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.reports;

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
      colors: ["#1678e7ff", "#63b8e9ff"],
      id: "domestic-consumption-material-intensity",
      types: ["data", "metadata"],
      selectedIndices: [0, 2],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#692fc5ff", "#f5b24fff"],
      id: "domestic-consumption-material-intensity",
      types: ["data", "metadata"],
      selectedIndices: [5, 4],
      chartID: info[1].chartID,
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#63b8e9ff"],
      id: "domestic-consumption-material-intensity",
      types: ["data", "metadata"],
      selectedIndices: [3],
      chartID: info[2].chartID,
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#63b8e9ff", "#91a0a8ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [1, 0],
      chartID: info[3].chartID,
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#1678e7ff", "#63b8e9ff", "#e94d74ff", "#f5b24fff", "#692fc5ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [3, 4, 5, 6, 7],
      chartID: info[4].chartID,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#1678e7ff", "#63b8e9ff", "#e94d74ff", "#f5b24fff", "#692fc5ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [9, 10, 11, 12, 13],
      chartID: info[5].chartID,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
    },
    {
      title_ge: info[6].title_ge,
      title_en: info[6].title_en,
      colors: ["#e94d74ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [14],
      chartID: info[6].chartID,
    },
    {
      title_ge: info[7].title_ge,
      title_en: info[7].title_en,
      colors: ["#1678e7ff", "#63b8e9ff", "#e94d74ff", "#f5b24fff", "#692fc5ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [15, 16, 17, 18, 19],
      chartID: info[7].chartID,
    },
    {
      title_ge: info[8].title_ge,
      title_en: info[8].title_en,
      colors: ["#f5b24fff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [18],
      chartID: info[8].chartID,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
    },
    {
      title_ge: info[9].title_ge,
      title_en: info[9].title_en,
      colors: ["#1678e7ff", "#63b8e9ff", "#e94d74ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [1, 3, 9],
      chartID: info[9].chartID,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
    },
    {
      title_ge: info[10].title_ge,
      title_en: info[10].title_en,
      colors: ["#2e6aafff", "#e94d74ff"],
      id: "material-flow-indicators",
      types: ["data", "metadata"],
      selectedIndices: [4, 10],
      chartID: info[10].chartID,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: "auto",
          backgroundPosition: "center 30%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Material Flow Accounts"
            : "მატერიალური ნაკადის ანგარიშები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Trends in Georgia's material resources, consumption and trade in 2014-2023"
            : "საქართველოს მატერიალური რესურსების, მოხმარებისა და ვაჭრობის ტენდენციები 2014-2023 წლებში"}{" "}
        </h2>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <LineCharts chartInfo={ChartInfo[0]} />
          <LineCharts chartInfo={ChartInfo[1]} />
          <BarCharts chartInfo={ChartInfo[2]} />
          <StackedBarCharts chartInfo={ChartInfo[3]} />
          <PieCharts chartInfo={ChartInfo[4]} />
          <PieCharts chartInfo={ChartInfo[5]} />
          <AreaCharts chartInfo={ChartInfo[6]} />
          <BarChartsWithYears chartInfo={ChartInfo[7]} />
          <BarCharts chartInfo={ChartInfo[8]} />
          <LineCharts chartInfo={ChartInfo[9]} />
          <AreaCharts chartInfo={ChartInfo[10]} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
