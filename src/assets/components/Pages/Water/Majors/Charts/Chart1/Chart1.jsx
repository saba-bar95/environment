import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import Download from "../Download/Download";
import riversAndLakes from "../../../../../../fetchFunctions/riversAndLakes";
import Info from "../../../../../Info/Info";

const Chart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState(null);

  const infoText = {
    ge: "დიაგრამაზე წარმოდგენილია საქართველოს უდიდესი მდინარეები მათი სიგრძის მიხედვით. გადაატარეთ მაუსი თითოეულ ზოლზე დეტალური ინფორმაციის სანახავად.",
    en: "The diagram shows the largest rivers in Georgia by their length. Hover over a bar to see detailed information.",
  };

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      colors: ["#1179f0ff"],
      svg: Svg(),
      id: "rivers",
    }),
    [chartInfo]
  );

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await riversAndLakes(info.id, language);
        // Sort data by length in descending order and clean mainUse
        const sortedData = response?.data?.rivers
          ?.slice()
          .sort((a, b) => b.length - a.length);

        setChartData({ data: { rivers: sortedData } });
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [info, language]);

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload; // Access the full data object for the hovered bar

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p
            className="tooltip-label"
            style={{
              textAlign: "center",
              width: "100%",
              fontWeight: "900",
              fontSize: "40 !important",
              textDecoration: "underline",
            }}>
            {label}
          </p>
          <p className="text">
            {language === "en" ? "Length" : "სიგრძე"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.length} {language === "en" ? "km" : "კმ"}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Location" : "მდებარეობა"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.location}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Basin Area" : "აუზის ფართობი"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.basinArea.toLocaleString()} km²
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Sea Basin" : "ზღვის აუზი"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.seaBasin}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Main Use" : "ძირითადი გამოყენება"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.mainUse}
            </span>
          </p>
        </div>
      </div>
    );
  };

  // Formatter for the label to show length rounded to 1 decimal place
  const renderCustomizedLabel = (value) => {
    return `${value} ${language === "en" ? "km" : "კმ"}`;
  };

  const sortedData = chartData?.data?.rivers || [];

  return (
    <div
      className="chart-wrapper"
      id={chartInfo.id}
      style={{ height: "700px", width: "100%", margin: "auto" }}>
      <div className="header">
        <div className="right">
          <div className="ll">
            <Svg />
          </div>
          <div className="rr">
            <h1 style={{ width: "100%" }}>
              {language === "ge" ? info.title_ge : info.title_en}
            </h1>
          </div>
        </div>
        <div className="left">
          <Info text={infoText} />
          <Download
            data={sortedData}
            filename={info[`title_${language}`]}
            isChart1={true}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={sortedData} layout="vertical" barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis type="number" tick={{ fontSize: 14 }} tickLine={false} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 13 }}
            tickLine={false}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="length"
            fill={info.colors[0]}
            name={language === "en" ? "Length" : "სიგრძე"}>
            <LabelList
              dataKey="length"
              position="right"
              formatter={renderCustomizedLabel}
              style={{ fontSize: 13, fill: "#333" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart1;
