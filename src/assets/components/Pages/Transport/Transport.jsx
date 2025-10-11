import { useLocation, useParams } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import { useEffect } from "react";
import LineCharts from "./Charts/LineCharts";
import PieCharts from "./Charts/PieCharts";
import AreaCharts from "./Charts/AreaCharts";
import Charts from "../../../../Charts";
import CompromisedCharts from "./Charts/CompromisedCharts";
import LineChartsWithTwoApiCalls from "./Charts/LineChartsWithTwoApiCalls";

const Transport = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.transport;

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
      colors: ["#1678e7ff"],
      id: "passenger-turnover",
      types: ["data", "metadata"],
      selectedIndices: [12],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#1bee62ff"],
      id: "freight-turnover",
      types: ["data", "metadata"],
      selectedIndices: [5],
      chartID: info[1].chartID,
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#1678e7ff", "#1bee62ff", "#f7a72fff", "#e94d74ff", "#692fc5ff"],
      id: "passenger-turnover",
      types: ["data", "metadata"],
      selectedIndices: [0, 7, 9, 10, 11],
      chartID: info[2].chartID,
      styles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#1678e7ff", "#1bee62ff", "#f7a72fff", "#e94d74ff"],
      id: "freight-turnover",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 3, 4],
      chartID: info[3].chartID,
      styles: {
        flexDirection: "column",
        gap: "5px",
      },
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#1678e7ff", "#1bee62ff", "#f7a72fff", "#e94d74ff"],
      id: "passenger-turnover",
      types: ["data", "metadata"],
      selectedIndices: [0, 7, 10, 11],
      chartID: info[4].chartID,
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#1bee62ff", "#1678e7ff", "#f7a72fff"],
      id: "freight-turnover",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 4],
      chartID: info[5].chartID,
    },
    {
      title_ge: info[6].title_ge,
      title_en: info[6].title_en,
      colors: ["#1678e7ff", "#e94d74ff"],
      id: "freight-turnover",
      types: ["data", "metadata"],
      selectedIndices: [11, 12],
      chartID: info[6].chartID,
    },
    {
      title_ge: info[7].title_ge,
      title_en: info[7].title_en,
      colors: ["#692fc5ff"],
      id: "passenger-turnover",
      types: ["data", "metadata"],
      selectedIndices: [20],
      chartID: info[7].chartID,
    },
    {
      title_ge: info[8].title_ge,
      title_en: info[8].title_en,
      colors: ["#1678e7ff", "#f7a72fff"],
      id: "passenger-turnover",
      types: ["data", "metadata"],
      selectedIndices: [0],
      chartID: info[8].chartID,
      secontCall: {
        id: "freight-turnover",
        types: ["data", "metadata"],
        selectedIndices: [0],
      },
    },
    {
      title_ge: info[9].title_ge,
      title_en: info[9].title_en,
      colors: ["#1bee62ff", "#e94d74ff"],
      id: "passenger-turnover",
      types: ["data", "metadata"],
      selectedIndices: [7],
      chartID: info[9].chartID,
      secontCall: {
        id: "freight-turnover",
        types: ["data", "metadata"],
        selectedIndices: [1],
      },
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          backgroundPosition: "center 40%",
        }}>
        <div className="overlay"></div> {/* New overlay div */}
        <h1>
          {language === "en"
            ? "Transport Statistics"
            : "ტრანსპორტის სტატისტიკა"}
        </h1>
        <h2>
          {" "}
          {language === "en"
            ? "Monitoring of Georgia's passenger and freight transport trends, fleet development and energy efficiency"
            : "საქართველოს სამგზავრო და სატვირთო ტრანსპორტის ტენდენციების, ავტოპარკის განვითარებისა და ენერგოეფექტურობის მონიტორინგი"}{" "}
        </h2>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <AreaCharts chartInfo={ChartInfo[0]} />
          <AreaCharts chartInfo={ChartInfo[1]} />
          <AreaCharts chartInfo={ChartInfo[2]} />
          <AreaCharts chartInfo={ChartInfo[3]} />
          <PieCharts chartInfo={ChartInfo[4]} />
          <PieCharts chartInfo={ChartInfo[5]} />
          <CompromisedCharts chartInfo={ChartInfo[6]} />
          <LineCharts chartInfo={ChartInfo[7]} />
          <LineChartsWithTwoApiCalls chartInfo={ChartInfo[8]} />
          <LineChartsWithTwoApiCalls chartInfo={ChartInfo[9]} />
        </div>
      </div>
    </div>
  );
};

export default Transport;
