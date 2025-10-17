import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const ScatterCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [metaDataResult, dataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[1], language),
          commonData(chartInfo.id, chartInfo.types[0], language),
        ]);

        const fullSectorNames =
          metaDataResult?.data?.metadata?.variables[0]?.valueTexts || [];
        const dataKeys = dataResult?.data?.categories || [];

        const selected = chartInfo.selectedIndices
          .map((index) => {
            if (fullSectorNames[index] && dataKeys[index]) {
              return { name: fullSectorNames[index], key: dataKeys[index] };
            }
            return null;
          })
          .filter(Boolean);

        setSelectedTexts(selected);

        const rawData = dataResult.data.data || [];

        const processedData = rawData
          .map((item) => {
            const xValue = item[selected[0]?.key];
            const yValue = item[selected[1]?.key];

            return {
              year: String(item.year),
              xValue:
                xValue !== null && xValue !== undefined ? Number(xValue) : null,
              yValue:
                yValue !== null && yValue !== undefined ? Number(yValue) : null,
            };
          })
          .filter(
            (item) =>
              item.xValue !== null &&
              item.yValue !== null &&
              !isNaN(item.xValue) &&
              !isNaN(item.yValue)
          );

        setChartData(processedData);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo]);

  const CustomLegend = () => {
    return (
      <ul className="recharts-default-legend">
        <li className="recharts-legend-item legend-item-0">
          <span
            className="recharts-legend-item-icon"
            style={{
              backgroundColor: "#1f77b4", // Blue color
              flexShrink: 0,
              width: 12,
              height: 12,
              display: "inline-block",
              marginRight: 8,
            }}></span>
          <span className="recharts-legend-item-text">
            {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
          </span>
        </li>
      </ul>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {data.year} {language === "ge" ? "წელი" : "Year"}
          </p>
          <p
            className="text"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              alignItems: "center",
            }}>
            <span>
              <span
                style={{
                  backgroundColor: "#1f77b4", // Blue color
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {selectedTexts[0]?.name}:
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.xValue?.toFixed(1)}
            </span>
          </p>
          <p
            className="text"
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "10px",
              alignItems: "center",
            }}>
            <span>
              <span
                style={{
                  backgroundColor: "#1f77b4", // Blue color
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {selectedTexts[1]?.name}:
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {data.yValue?.toFixed(1)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
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
                : "Loading data..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
          <div className="left">
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

  if (chartData.length === 0) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll"></div>
            <div className="rr">
              <h1>
                {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
              </h1>
              <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
            </div>
          </div>
        </div>
        <div className="empty-state">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header">
        <div className="right">
          <div className="ll"></div>
          <div className="rr">
            <h1>
              {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            </h1>
            <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <Download
            data={chartData}
            filename={chartInfo[`title_${language}`]}
            unit={chartInfo[`unit_${language}`]}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <ScatterChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            type="number"
            dataKey="xValue"
            name={selectedTexts[0]?.name}
            tick={{ fontSize: 12 }}
            tickLine={false}
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
          />
          <YAxis
            type="number"
            dataKey="yValue"
            name={selectedTexts[1]?.name}
            tick={{ fontSize: 12 }}
            domain={["dataMin - 0.5", "dataMax + 0.5"]}
          />
          <ZAxis range={[64]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          <Scatter
            name={language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            data={chartData}
            fill="#1f77b4" // Changed to blue
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterCharts;
