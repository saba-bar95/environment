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
import Svg from "./Svg";

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
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        const valueTexts =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        // Only include the indices you want to display separately
        // For your case, only include index 0 and 2, and create sum for 1+3
        const baseSelectedIndices = chartInfo.selectedIndices.filter(
          (index) => index !== 1 && index !== 3
        );

        const baseSelected = baseSelectedIndices
          .map((index) => valueTexts[index])
          .filter(Boolean);

        // Create the sum entry for indices 1 and 3
        const sumEntry = {
          name: language === "en" ? "Total casualties" : "სულ გარდაცვლილი",
          id: -1, // Special ID for sum
          isSum: true,
          indices: [1, 3], // The indices to sum
        };

        const selected = [...baseSelected, sumEntry];
        setSelectedTexts(selected);

        // Initialize all areas as visible
        setVisibleLines(
          selected.reduce((acc, text) => {
            acc[text.name] = true;
            return acc;
          }, {})
        );

        const yearData =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult.data.data || [];

        // Process data for the chart including the sum
        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;

            const dataPoint = { year };

            // Add individual data points (only for non-sum indices)
            baseSelected.forEach((text) => {
              dataPoint[text.name] = dataItem[String(text.id)];
            });

            // Add sum data point for indices 1 and 3
            const index1Data = dataItem[String(1)];
            const index3Data = dataItem[String(3)];
            dataPoint[sumEntry.name] = (index1Data || 0) + (index3Data || 0);

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
          {payload.map(({ value, stroke, dataKey }) => {
            const text = selectedTexts.find((t) => t.name === dataKey);
            const displayName = text?.isSum
              ? `${text.name}`
              : text?.name || dataKey;

            return (
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
                  {displayName} :
                </span>
                <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                  {value}
                </span>
              </p>
            );
          })}
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
              <Svg />
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
          <XAxis dataKey="year" tick={{ fontSize: 13 }} tickLine={false} />

          {/* Left Y-axis for Area charts */}
          <YAxis
            yAxisId="left"
            domain={[0, 1600]}
            tick={{ fontSize: 12 }}
            stroke="#666"
            orientation="left"
            width={60}
          />

          {/* Right Y-axis for Line chart */}
          <YAxis
            yAxisId="right"
            domain={[0, 50]}
            tick={{ fontSize: 12 }}
            stroke="#e94d74" // Match the line color
            orientation="right"
            width={60}
            // You can adjust domain or ticks if needed for better scaling
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
              text.isSum ? (
                // Render Line for sum data with right Y-axis
                <Line
                  key={`line-${text.name}`}
                  type="monotone"
                  dataKey={text.name}
                  yAxisId="right"
                  stroke={chartInfo.colors[index % chartInfo.colors.length]}
                  strokeWidth={3}
                  dot={{
                    fill: chartInfo.colors[index % chartInfo.colors.length],
                    strokeWidth: 2,
                    r: 4,
                  }}
                  name={text.name}
                  activeDot={{
                    r: 6,
                    fill: chartInfo.colors[index % chartInfo.colors.length],
                    strokeWidth: 2,
                  }}
                />
              ) : (
                // Render Area for individual data with left Y-axis
                <Area
                  key={`area-${text.name}`}
                  type="monotone"
                  dataKey={text.name}
                  yAxisId="left"
                  stackId="1"
                  fill={chartInfo.colors[index % chartInfo.colors.length]}
                  stroke={chartInfo.colors[index % chartInfo.colors.length]}
                  name={text.name}
                  strokeWidth={2}
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
