import { useEffect, useState, useMemo } from "react";
import { Treemap, Tooltip, ResponsiveContainer } from "recharts";
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import Download from "../Download/Download";
import riversAndLakes from "../../../../../../fetchFunctions/riversAndLakes";
import Info from "../../../../../Info/Info";

const Chart2 = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      colors: [
        "#1f77b4", // Blue
        "#ff7f0e", // Orange
        "#2ca02c", // Green
        "#d62728", // Red
        "#9467bd", // Purple
        "#8c564b", // Brown
        "#e377c2", // Pink
        "#7f7f7f", // Gray
        "#bcbd22", // Olive
        "#17becf", // Cyan
        "#aec7e8", // Light Blue
        "#ffbb78", // Light Orange
        "#98df8a", // Light Green
        "#ff9896", // Light Red
        "#c5b0d5", // Light Purple
        "#c49c94", // Light Brown
        "#f7b6d2", // Light Pink
      ],
      svg: Svg(),
      id: "lakes",
    }),
    [chartInfo]
  );

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true); // Set loading to true when starting fetch
      setError(null); // Reset error state

      try {
        const response = await riversAndLakes(info.id, language);

        // Check if response has data
        if (!response?.data?.lakes || response.data.lakes.length === 0) {
          throw new Error("No lake data available");
        }

        // Sort data by area in descending order and clean mainUse
        const sortedData = response.data.lakes
          ?.slice()
          .sort((a, b) => (b.area || 0) - (a.area || 0))
          .map((lake) => ({
            ...lake,
            mainUse: lake.mainUse ? lake.mainUse.replace(/\r$/, "") : "N/A",
            area: typeof lake.area === "number" ? lake.area : 0, // Ensure valid number
          }));

        setChartData({ data: { lakes: sortedData } });
      } catch (error) {
        console.log("Error fetching lake data:", error);
        setError("Failed to load lake data. Please try again.");
      } finally {
        setIsLoading(false); // Set loading to false when done
      }
    };

    getData();
  }, [info, language]);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.chartID}
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
            <Info text={false} />
            <div className="download-placeholder">
              <span className="loading-spinner"></span>
              <span>{language === "ge" ? "ჩატვირთვა..." : "Loading..."}</span>
            </div>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>
              {language === "ge"
                ? "მონაცემების ჩატვირთვა..."
                : "Loading lake data..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.chartID}
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
            <Info text={false} />
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}>
              {language === "ge" ? "ხელახლა ცდა" : "Retry"}
            </button>
          </div>
        </div>
        <div className="error-container">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => window.location.reload()}>
              {language === "ge" ? "ხელახლა ჩატვირთვა" : "Reload Chart"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!chartData?.data?.lakes || chartData.data.lakes.length === 0) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.chartID}
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
            <Info text={false} />
            <div className="download-placeholder">
              {language === "ge"
                ? "მონაცემები არ მოიძებნა"
                : "No data to download"}
            </div>
          </div>
        </div>
        <div className="empty-state">
          <p>
            {language === "ge"
              ? "მონაცემები არ მოიძებნა"
              : "No lake data available"}
          </p>
        </div>
      </div>
    );
  }

  // Custom Tooltip Component for lakes
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    // Helper function to format numbers safely
    const formatNumber = (value) =>
      typeof value === "number" ? value.toFixed(1) : value || "N/A";

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p
            className="tooltip-label"
            style={{
              textAlign: "center",
              width: "100%",
              fontWeight: "900",
              textDecoration: "underline",
            }}>
            {data.name}
          </p>
          <p className="text">
            {language === "en" ? "Area" : "ფართობი"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {formatNumber(data.area)} {language === "en" ? "km²" : "კმ²"}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Volume" : "მოცულობა"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {formatNumber(data.volume)}{" "}
              {language === "en" ? "mln m³" : "მლნ მ³"}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Average Depth" : "საშუალო სიღრმე"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {formatNumber(data.avgDepth)} {language === "en" ? "m" : "მ"}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Maximum Depth" : "მაქსიმალური სიღრმე"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {formatNumber(data.maxDepth)} {language === "en" ? "m" : "მ"}
            </span>
          </p>
          <p className="text">
            {language === "en" ? "Location" : "მდებარეობა"} :
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.location || "N/A"}
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

  // Custom content for Treemap rectangles with labels
  const CustomizedContent = (props) => {
    const { depth, x, y, width, height, name, index } = props;

    const fillColor = info.colors[index % info.colors.length];

    // Truncate long names to prevent overflow
    const truncatedName = name.length > 20 ? `${name.slice(0, 17)}...` : name;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: fillColor,
            stroke: "#fff",
            strokeWidth: 2 / (depth + 1e-10),
            strokeOpacity: 1 / (depth + 1e-10),
          }}
        />
        {width > 40 && height > 15 && (
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            fill="#fff"
            fontSize={13}
            dominantBaseline="middle">
            <tspan x={x + width / 2} dy="-0.5em">
              {truncatedName}
            </tspan>
            <tspan x={x + width / 2} dy="1em"></tspan>
          </text>
        )}
      </g>
    );
  };

  const sortedData = chartData?.data?.lakes || [];

  return (
    <div
      className="chart-wrapper"
      id={chartInfo.chartID}
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
          <Info text={false} />
          <Download
            data={sortedData}
            filename={info[`title_${language}`]}
            isChart2={true}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <Treemap
          data={sortedData}
          dataKey="area"
          isAnimationActive={false} // Disable animations to prevent flickering
          content={<CustomizedContent />}>
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart2;
