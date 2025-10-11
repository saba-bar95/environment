import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import { useEffect } from "react";
import Waste1 from "./Svg/Waste1";
import Trash from "./Svg/Trash";
import Charts from "../../../../Charts";
import BarCharts from "../Reports/Charts/BarCharts";
import LineChart1 from "./Charts/LineCharts";
import CompromisedCharts from "./Charts/CompromisedCharts";
import PositiveAndNegativeBarChart from "../Energy/Charts/PositiveAndNegativeBarChart";
import BarChartsFull from "./Charts/BarChartsFull";
import PieChartComponent from "./Charts/PieCharts";
import Quality from "./Quality/Quality";

const Waste = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.waste;

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
      colors: ["#e94d74ff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [0],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#f7a72fff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [2],
      chartID: info[1].chartID,
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#55c079ff", "#3972b3ff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [0, 1],
      chartID: info[2].chartID,
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#e94d74ff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [0],
      chartID: info[3].chartID,
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#55c079ff", "#f7a72fff", "#e94d74ff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [2],
      chartID: info[4].chartID,
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#55c079ff", "#f7a72fff", "#e94d74ff"],
      id: "municipal-waste",
      types: ["data", "metadata"],
      selectedIndices: [2],
      chartID: info[5].chartID,
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 29%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en" ? "Municipal Waste" : "მუნიციპალური ნარჩენები"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Waste Management Trends in Georgia"
            : "საქართველოში ნარჩენების მართვის ტენდენციები"}{" "}
        </h2>
      </div>
      <div className="header-container1">
        <h1
          className="title-text"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin: "auto",
            width: "90%",
          }}>
          <Trash />
          {language === "en"
            ? "Municipal Waste in 2023"
            : "2023 წლის მუნიციპალური ნარჩენები"}
        </h1>
      </div>
      <Quality />

      <div className="header-container1">
        <h1
          className="title-text"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            margin: "auto",
            width: "90%",
          }}>
          <Waste1 />
          {language === "en"
            ? "Landfill trends (2015-2023)"
            : "ნარჩენების ნაგავსაყრელზე განთავსების ტენდენციები (2015-2023)"}
        </h1>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <BarCharts chartInfo={ChartInfo[0]} />
          <LineChart1 chartInfo={ChartInfo[1]} />
          <CompromisedCharts chartInfo={ChartInfo[2]} />
          {/* <PositiveAndNegativeBarChart chartInfo={ChartInfo[3]} /> */}
          <BarChartsFull chartInfo={ChartInfo[4]} />
          {/* <PieChartComponent chartInfo={ChartInfo[5]} /> */}
        </div>
      </div>
    </div>
  );
};

export default Waste;
