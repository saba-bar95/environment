import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  Line,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const AreaChartsWithLine = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleLines, setVisibleLines] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        // Map to objects with displayName (localized) and keyName (English)
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

        setSelectedTexts(selected);

        // Initialize all as visible (using name for visibility key)
        setVisibleLines(
          selected.reduce((acc, text) => {
            acc[text.name] = true;
            return acc;
          }, {})
        );

        const yearData =
          localizedMetaResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult.data.data || [];

        // Process data for the chart
        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;

            const dataPoint = { year };

            selected.forEach((text) => {
              // Use English keyName with "GEO - " prefix
              const fullKey = `GEO - ${text.keyName}`;
              dataPoint[text.name] = parseFloat(dataItem[fullKey]) || 0; // Key in dataPoint is localized name
            });

            return dataPoint;
          })
          .filter(Boolean);

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    const visibleLineCount = Object.values(visibleLines).filter(Boolean).length;

    return (
      <ul className="recharts-default-legend" style={chartInfo?.legendStyles}>
        {selectedTexts.map((text, index) => (
          <li
            key={`legend-item-${text.name}`}
            className={`recharts-legend-item legend-item-${index}`}
            onClick={() => {
              if (visibleLines[text.name] && visibleLineCount === 1) return;
              setVisibleLines((prev) => ({
                ...prev,
                [text.name]: !prev[text.name],
              }));
            }}
            style={{
              cursor: "pointer",
              opacity: visibleLines[text.name] ? 1 : 0.5,
            }}>
            <span
              className="recharts-legend-item-icon"
              style={{
                backgroundColor:
                  chartInfo.colors[index % chartInfo.colors.length],
                flexShrink: 0,
                width: 12,
                height: 12,
                display: "inline-block",
                marginRight: 8,
              }}></span>
            <span className="recharts-legend-item-text">{text.name}</span>
          </li>
        ))}
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
          {payload.map(({ value, stroke, dataKey }) => (
            <p
              key={`item-${dataKey}`}
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
                    backgroundColor: stroke,
                    width: 12,
                    height: 12,
                    display: "inline-block",
                    marginRight: 8,
                  }}
                  className="before-span"></span>
                {dataKey} :
              </span>
              <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                {value.toFixed(1)}
              </span>
            </p>
          ))}
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
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} tickLine={false} />

          {/* Left Y-axis for Area chart */}
          <YAxis
            yAxisId="left"
            domain={[0, "auto"]}
            tick={{ fontSize: 12 }}
            stroke="#666"
            orientation="left"
            width={60}
          />

          {/* Right Y-axis for Line chart */}
          <YAxis
            yAxisId="right"
            domain={[0, 20]}
            tick={{ fontSize: 12 }}
            stroke={chartInfo.colors[1]}
            orientation="right"
            width={60}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {selectedTexts.map((text, index) =>
            visibleLines[text.name] ? (
              index === 0 ? (
                // Render Area for first selected (index 1 in chartInfo) with left Y-axis
                <Area
                  key={`area-${text.name}`}
                  type="monotone"
                  dataKey={text.name}
                  yAxisId="left"
                  fill={chartInfo.colors[0]}
                  stroke={chartInfo.colors[0]}
                  name={text.name}
                  strokeWidth={3}
                  fillOpacity={0.2} // 👈 Add this line
                />
              ) : (
                // Render Line for second selected (index 0 in chartInfo) with right Y-axis
                <Line
                  key={`line-${text.name}`}
                  type="monotone"
                  dataKey={text.name}
                  yAxisId="right"
                  stroke={chartInfo.colors[1]}
                  strokeWidth={1}
                  dot={{
                    fill: chartInfo.colors[1],
                    strokeWidth: 3,
                    r: 2,
                  }}
                  name={text.name}
                  activeDot={{
                    r: 6,
                    fill: chartInfo.colors[1],
                    strokeWidth: 2,
                  }}
                />
              )
            ) : null
          )}
          <Brush
            dataKey="year"
            height={20}
            stroke="#8884d8"
            travellerWidth={5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartsWithLine;
