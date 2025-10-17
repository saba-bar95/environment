import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const BarCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [barName, setBarName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and process data
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch data (keys are always in English)
        const dataResult = await commonData(
          chartInfo.id,
          chartInfo.types[0],
          "en"
        );
        // Fetch metadata for English (for keys)
        const englishMetaResult = await commonData(
          chartInfo.id,
          chartInfo.types[1],
          "en"
        );
        // Fetch metadata for current language (for display names)
        const localizedMetaResult = await commonData(
          chartInfo.id,
          chartInfo.types[1],
          language
        );

        const englishValueTexts =
          englishMetaResult?.data?.metadata?.variables[2].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        const localizedValueTexts =
          localizedMetaResult?.data?.metadata?.variables[2].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        const selected = chartInfo.selectedIndices
          .map((index) => {
            const englishText = englishValueTexts[index];
            const localizedText = localizedValueTexts[index];
            if (!englishText || !localizedText) return null;
            return {
              name: localizedText.name, // Use for display and dataKey
              keyName: englishText.name, // Use for rawData lookup
              id: englishText.id,
            };
          })
          .filter(Boolean);

        if (selected.length !== 1) {
          throw new Error("Expected exactly one selected index.");
        }

        setBarName(selected[0].name);

        const yearData =
          localizedMetaResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult?.data?.data || [];

        // Process data for the chart
        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;

            const text = selected[0];
            // Use English keyName with "GEO - " prefix
            const fullKey = `GEO - ${text.keyName}`;
            const value = parseFloat(dataItem[fullKey]) || 0;

            return {
              year,
              [text.name]: value,
            };
          })
          .filter(Boolean);

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

  // Custom Legend Component
  const CustomLegend = () => {
    return (
      <ul className="recharts-default-legend">
        <li className="recharts-legend-item" style={{ cursor: "pointer" }}>
          <span
            className="recharts-legend-item-icon"
            style={{
              backgroundColor: chartInfo.colors[0],
              flexShrink: 0,
              width: 12,
              height: 12,
              display: "inline-block",
              marginRight: 8,
            }}></span>
          <span className="recharts-legend-item-text">{barName}</span>
        </li>
      </ul>
    );
  };

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {label} {language === "en" ? "Year" : "წელი"}
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
                  backgroundColor: payload[0].fill,
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {barName} :
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {payload[0].value.toFixed(1)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  // Show empty state if no data
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
          <div className="left">
            <div className="download-placeholder">
              {language === "ge"
                ? "მონაცემები არ მოიძებნა"
                : "No data to download"}
            </div>
          </div>
        </div>
        <div className="empty-state">
          <p>
            {language === "ge" ? "მონაცემები არ მოიძებნა" : "No data available"}
          </p>
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
            <h1
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
              }}>
              {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            </h1>
            <p>{language === "ge" ? chartInfo.unit_ge : chartInfo.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <Download
            data={chartData}
            filename={chartInfo[`title_${language}`]}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart
          data={chartData}
          margin={{ top: 0, right: 70, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 13 }} tickLine={false} />
          <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          <Bar
            dataKey={barName}
            fill={chartInfo.colors[0]}
            stroke={chartInfo.colors[0]}
            name={barName}
          />
          <Brush
            dataKey="year"
            height={20}
            stroke="#8884d8"
            travellerWidth={5}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarCharts;
