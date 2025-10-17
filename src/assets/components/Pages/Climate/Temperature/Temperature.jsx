import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import Charts from "../../../../../Charts";
import {
  useEffect,
  // useState
} from "react";
import AreaChartsWithLine from "./Charts/Chart1/AreaChartsWithLine";
import BarCharts from "./Charts/Chart2/Chart1";
import LineCharts from "./Charts/Chart3/LineCharts";
import LineCharts4 from "./Charts/Chart4/LineCharts4";
import RadarCharts from "./Charts/Chart5/RadarCharts";
import BarChartsHorizontal from "./Charts/Chart6/BarChartsHorizontal";

const Temperature = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.climate[1].temperature;
  // const [width, setWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const newWidth = window.innerWidth;
  //     setWidth(newWidth);
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

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
      colors: ["#1678e7ff", "#55c079ff"],
      id: "air-temperature",
      types: ["data", "metadata"],
      selectedIndices: [1, 0],
      chartID: info[0].chartID,
    },
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#e94d74ff", "#1678e7ff"],
      id: "air-temperature",
      types: ["data", "metadata"],
      selectedIndices: [2],
      chartID: info[1].chartID,
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#55c079ff", "#1678e7ff", "#f7a72fff", "#4c534eff"],
      id: "air-temperature",
      types: ["data", "metadata"],
      selectedIndices: [1],
      chartID: info[2].chartID,
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#e94d74ff", "#1678e7ff"],
      id: "air-temperature",
      types: ["data", "metadata"],
      selectedIndices: [3, 4],
      chartID: info[3].chartID,
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#e94d74ff", "#1678e7ff"],
      id: "air-temperature",
      types: ["data", "metadata"],
      selectedIndices: [3, 4],
      chartID: info[4].chartID,
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#e94d74ff"],
      id: "air-temperature",
      types: ["data", "metadata"],
      selectedIndices: [2],
      chartID: info[5].chartID,
    },
  ];

  return (
    <div className="section-container supply-and-losses">
      <div
        className="background-container"
        style={{ backgroundImage: `url(${backgroundImg})` }}>
        <div className="overlay"></div>
        <h1>{language === "en" ? "Air Temperature" : "ჰაერის ტემპერატურა"}</h1>
        <h2>
          {language === "en"
            ? "Annual and seasonal temperature trends compared to historical baselines"
            : "წლიური და სეზონური ტემპერატურის ტენდენციები ისტორიულ საბაზისო მაჩვენებლებთან შედარებით"}
        </h2>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <AreaChartsWithLine chartInfo={ChartInfo[0]} />
          <BarCharts chartInfo={ChartInfo[1]} />
          <LineCharts chartInfo={ChartInfo[2]} />
          <LineCharts4 chartInfo={ChartInfo[3]} />
          <RadarCharts chartInfo={ChartInfo[4]} />
          <BarChartsHorizontal chartInfo={ChartInfo[5]} />
        </div>
      </div>
    </div>
  );
};

export default Temperature;
