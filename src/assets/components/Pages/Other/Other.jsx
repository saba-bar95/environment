import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import { useEffect } from "react";
import Charts from "../../../../Charts";
import LineChart1 from "./Charts/LineCharts";
import AreaCharts from "./Charts/AreaCharts";
import StackedBarCharts from "./Charts/StackedBarCharts";
import BarCharts from "./Charts/BarCharts";
import LineGridChart from "../Energy/Charts/LineGridChart";
import Fertilizer from "./Svgs/Fertilizer";

const Waste = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.other;

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
      id: "pesticide-consumption",
      types: ["data", "metadata"],
      selectedIndices: [13],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#f7a72fff"],
      id: "pesticide-consumption",
      types: ["data", "metadata"],
      selectedIndices: [14],
      chartID: info[1].chartID,
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#55c079ff", "#1678e7ff", "#f7a72fff", "#4c534eff"],
      id: "pesticide-consumption",
      types: ["data", "metadata"],
      selectedIndices: [5, 3, 1, 11],
      chartID: info[2].chartID,
      wrapperStyles: {
        gridColumn: "1/3",
        width: "100%",
        maxWidth: "100%",
      },
      legendStyles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#692fc5ff", "#e94d74ff"],
      id: "fertilizer-use",
      types: ["data", "metadata"],
      selectedIndices: [9, 15],
      chartID: info[3].chartID,
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#1678e7ff"],
      id: "fertilizer-use",
      types: ["data", "metadata"],
      selectedIndices: [19],
      chartID: info[4].chartID,
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#63b8e9ff", "#55c079ff"],
      id: "fertilizer-use",
      types: ["data", "metadata"],
      selectedIndices: [12, 18],
      chartID: info[5].chartID,
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
          backgroundPosition: "center 50%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Other Environmental Topics"
            : "სხვა გარემოსდაცვითი თემები"}
        </h1>
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
          <Fertilizer />
          {language === "en"
            ? "Use of Pesticides and Fertilizers in Agriculture"
            : "პესტიციდების და სასუქების მოხმარება სოფლის მეურნეობაში"}
        </h1>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <LineChart1 chartInfo={ChartInfo[0]} />
          <AreaCharts chartInfo={ChartInfo[1]} />
          <StackedBarCharts chartInfo={ChartInfo[2]} />
          <BarCharts chartInfo={ChartInfo[3]} />
          <LineChart1 chartInfo={ChartInfo[4]} />
          <LineGridChart chartInfo={ChartInfo[5]} />
        </div>
      </div>
    </div>
  );
};

export default Waste;
