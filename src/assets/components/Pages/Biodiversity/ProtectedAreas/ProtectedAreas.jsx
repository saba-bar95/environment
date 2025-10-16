import { useParams, useLocation } from "react-router-dom";
import backgroundImg from "./Background/background.jpg";
import GeoMapContainer from "./GeoMapContainer";
import Charts from "../../../../../Charts";
import { useEffect } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import LineChart1 from "./Charts/LineCharts";
import VerticalBarCharts from "./Charts/VerticalBarCharts";
import { useState } from "react";

const ProtectedAreas = () => {
  const { language } = useParams();
  const location = useLocation();
  const info = Charts.biodiversity[0].protectedAreas;
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
    {},
    {
      title_ge: info[1].title_ge,
      title_en: info[1].title_en,
      colors: ["#552a08ff", "#4c534eff", "#f7a72fff"],
      id: "protected-areas-mammals",
      types: ["data", "metadata"],
      selectedIndices: [0, 4, 6],
      chartID: info[1].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[2].title_ge,
      title_en: info[2].title_en,
      colors: ["#1bee62ff", "#e94d74ff", "#692fc5ff"],
      id: "protected-areas-mammals",
      types: ["data", "metadata"],
      selectedIndices: [8, 9, 10],
      chartID: info[2].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[3].title_ge,
      title_en: info[3].title_en,
      colors: ["#f7a72fff"],
      id: "protected-areas-mammals",
      types: ["data", "metadata"],
      selectedIndices: [3],
      chartID: info[3].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[4].title_ge,
      title_en: info[4].title_en,
      colors: ["#6CD68C"],
      id: "protected-areas-mammals",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      chartID: info[4].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[5].title_ge,
      title_en: info[5].title_en,
      colors: ["#552a08ff", "#4c534eff", "#f7a72fff"],
      id: "protected-areas-birds",
      types: ["data", "metadata"],
      selectedIndices: [3, 12, 6],
      chartID: info[5].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[6].title_ge,
      title_en: info[6].title_en,
      colors: ["#1bee62ff", "#e94d74ff", "#692fc5ff"],
      id: "protected-areas-birds",
      types: ["data", "metadata"],
      selectedIndices: [1, 9, 10],
      chartID: info[6].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
    },
    {
      title_ge: info[7].title_ge,
      title_en: info[7].title_en,
      colors: ["#692fc5ff"],
      id: "protected-areas-birds",
      types: ["data", "metadata"],
      selectedIndices: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
      chartID: info[7].chartID,
      unit_ge: "რაოდენობა",
      unit_en: "Quantity",
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
        }}>
        <div className="overlay"></div>
        <h1>
          {language === "en"
            ? "Protected Areas of Georgia"
            : "საქართველოს დაცული ტერიტორიები"}
        </h1>
        <h2>
          {language === "en"
            ? "Discover Georgia's growing network of national parks, reserves, and protected landscapes"
            : "აღმოაჩინეთ საქართველოს ეროვნული პარკების, ნაკრძალებისა და დაცული ლანდშაფტების მზარდი ქსელი"}
        </h2>
      </div>
      <Header />
      <div className="charts-section">
        <GeoMapContainer chartInfo={info[0]} />
        <div className="chart-container">
          <div
            className="header-container1"
            style={{
              borderBottom: "2px solid green",
              width: "100%",
              paddingBottom: "10px",
              ...(width >= 1200 && { gridColumn: "1/3" }), // Conditionally apply gridColumn
            }}>
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
              {language === "en"
                ? "Protected Mammal Species"
                : "დაცული ძუძუმწოვრების სახეობები"}
            </h1>
          </div>
          <LineChart1 chartInfo={ChartInfo[1]} />
          <LineChart1 chartInfo={ChartInfo[2]} />
          <LineChart1 chartInfo={ChartInfo[3]} />
          <VerticalBarCharts chartInfo={ChartInfo[4]} />
          <div
            className="header-container1"
            style={{
              borderBottom: "2px solid green",
              width: "100%",
              paddingBottom: "10px",
              ...(width >= 1200 && { gridColumn: "1/3" }), // Conditionally apply gridColumn
            }}>
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
              {language === "en"
                ? "Protected Birds Species"
                : "დაცული ფრინველების სახეობები"}
            </h1>
          </div>
          <LineChart1 chartInfo={ChartInfo[5]} />
          <LineChart1 chartInfo={ChartInfo[6]} />
          <VerticalBarCharts chartInfo={ChartInfo[7]} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedAreas;
