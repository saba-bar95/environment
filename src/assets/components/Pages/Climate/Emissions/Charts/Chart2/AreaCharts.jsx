import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  Line,
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

const AreaCharts = ({ chartInfo }) => {
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
        // Fetch metadata (for names) and data (for values)
        const [metaDataResult, dataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[1], language), // metadata URL
          commonData(chartInfo.id, chartInfo.types[0], language), // data URL
        ]);

        // --- MODIFICATION START ---

        // Get the full names of the sectors from the metadata
        const fullSectorNames =
          metaDataResult?.data?.metadata?.variables[0]?.valueTexts || [];
        // Get the short keys used in the data objects (e.g., "CO2", "AGGREGATED_EMISSIONS")
        const dataKeys = dataResult?.data?.categories || [];

        // Select the desired data series based on the indices from the parent component
        const selected = chartInfo.selectedIndices
          .map((index) => {
            if (fullSectorNames[index] && dataKeys[index]) {
              return {
                name: fullSectorNames[index], // Full name for the legend
                key: dataKeys[index], // Short key for data access
              };
            }
            return null;
          })
          .filter(Boolean);

        setSelectedTexts(selected);

        // Initialize all areas as visible
        setVisibleLines(
          selected.reduce((acc, text) => {
            acc[text.name] = true;
            return acc;
          }, {})
        );

        const rawData = dataResult.data.data || [];

        // Process data for the chart
        const processedData = rawData.map((item) => {
          const dataPoint = { year: String(item.year) };
          selected.forEach((text) => {
            // Use the full name as the key for the chart, but get the value with the short key
            dataPoint[text.name] = item[text.key];
          });
          return dataPoint;
        });

        // --- MODIFICATION END ---

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

  const numVisible = useMemo(
    () => Object.values(visibleLines).filter(Boolean).length,
    [visibleLines]
  );

  const visibleSeries = useMemo(
    () => selectedTexts.filter(({ name }) => visibleLines[name]),
    [selectedTexts, visibleLines]
  );

  // --- The rest of the component (rendering logic) remains the same ---

  // Custom Legend Component
  const CustomLegend = () => {
    const visibleLineCount = Object.values(visibleLines).filter(Boolean).length;

    return (
      <ul className="recharts-default-legend" style={chartInfo?.styles}>
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
  const CustomTooltip = ({ active, label }) => {
    if (!active || !chartData.length) return null;

    const point = chartData.find((p) => p.year === String(label));
    if (!point) return null;

    const visiblePayload = selectedTexts
      .filter((t) => visibleLines[t.name])
      .map((t, index) => ({
        value: point[t.name],
        fill: chartInfo.colors[index % chartInfo.colors.length],
        dataKey: t.name,
      }));

    if (!visiblePayload.length) return null;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {label} {language === "en" ? "Year" : "წელი"}
          </p>
          {visiblePayload.map(({ value, fill, dataKey }) => (
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
                    backgroundColor: fill,
                    width: 12,
                    height: 12,
                    display: "inline-block",
                    marginRight: 8,
                  }}
                  className="before-span"></span>
                {dataKey} :
              </span>
              <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                {value?.toFixed(1)}
              </span>
            </p>
          ))}
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
    /* ... Your Full Empty State JSX ... */
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
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 15 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {visibleSeries.map((text, visibleIndex) => {
            const index = selectedTexts.findIndex((t) => t.name === text.name);
            const color = chartInfo.colors[index % chartInfo.colors.length];
            if (numVisible === 1 || numVisible > 2) {
              return (
                <Area
                  key={`area-${text.name}`}
                  type="monotone"
                  dataKey={text.name}
                  stackId="1"
                  fill={color}
                  stroke={color}
                  name={text.name}
                  strokeWidth={2}
                />
              );
            } else if (numVisible === 2) {
              if (visibleIndex === 0) {
                return (
                  <Area
                    key={`area-${text.name}`}
                    type="monotone"
                    dataKey={text.name}
                    fill={color}
                    stroke={color}
                    name={text.name}
                    strokeWidth={2}
                  />
                );
              } else {
                return (
                  <Line
                    key={`line-${text.name}`}
                    type="monotone"
                    dataKey={text.name}
                    stroke={color}
                    name={text.name}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              }
            }
            return null;
          })}
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

export default AreaCharts;
