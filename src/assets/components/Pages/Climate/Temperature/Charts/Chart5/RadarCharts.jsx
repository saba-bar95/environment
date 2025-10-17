import { useEffect, useState, useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const RadarCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [visibleRadars, setVisibleRadars] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Metric config: English keys and localized display names
  const metrics = useMemo(
    () =>
      language === "ge"
        ? [
            {
              key: "GURIA - Average temperature for 1961-1990 (°C)",
              name: "1961-1990 წლების საშუალო ტემპერატურა (°C)",
            },
            {
              key: "GURIA - Annual average temperature (°C)",
              name: "წლიური საშუალო ტემპერატურა (°C)",
            },
            {
              key: "GURIA - Annual deviation from average temperature (°C)",
              name: "წლიური გადახრა საშუალო ტემპერატურისგან (°C)",
            },
            {
              key: "GURIA - Maximum monthly average temperature (°C)",
              name: "მაქსიმალური თვიური საშუალო ტემპერატურა (°C)",
            },
            {
              key: "GURIA - Minimum monthly average temperature (°C)",
              name: "მინიმალური თვიური საშუალო ტემპერატურა (°C)",
            },
          ]
        : [
            {
              key: "GURIA - Average temperature for 1961-1990 (°C)",
              name: "Average Temperature for 1961-1990 (°C)",
            },
            {
              key: "GURIA - Annual average temperature (°C)",
              name: "Annual Average Temperature (°C)",
            },
            {
              key: "GURIA - Annual deviation from average temperature (°C)",
              name: "Annual Deviation from Average Temperature (°C)",
            },
            {
              key: "GURIA - Maximum monthly average temperature (°C)",
              name: "Maximum Monthly Average Temperature (°C)",
            },
            {
              key: "GURIA - Minimum monthly average temperature (°C)",
              name: "Minimum Monthly Average Temperature (°C)",
            },
          ],
    [language]
  );

  // Years to compare
  const years = useMemo(
    () =>
      language === "ge"
        ? [
            { key: "1990", name: "1990 წელი" },
            { key: "2022", name: "2022 წელი" },
          ]
        : [
            { key: "1990", name: "1990" },
            { key: "2022", name: "2022" },
          ],
    [language]
  );

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

        // Initialize all years as visible
        setVisibleRadars(
          years.reduce((acc, year) => {
            acc[year.name] = true;
            return acc;
          }, {})
        );

        const rawData = dataResult.data.data || [];

        // Filter data for 1990 and 2022
        const filteredData = rawData.filter(
          (item) => item.year === 1990 || item.year === 2022
        );

        // Process data for the radar chart
        const processedData = metrics.map((metric) => {
          const dataPoint = { metric: metric.name };

          years.forEach((year) => {
            const dataItem = filteredData.find(
              (item) => item.year === Number(year.key)
            );
            if (dataItem) {
              dataPoint[year.name] = parseFloat(dataItem[metric.key]) || 0;
            } else {
              dataPoint[year.name] = 0;
            }
          });

          return dataPoint;
        });

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo, metrics, years]);

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

  // Custom Legend Component with Toggling
  const CustomLegend = () => {
    const visibleRadarCount =
      Object.values(visibleRadars).filter(Boolean).length;

    return (
      <ul className="recharts-default-legend" style={chartInfo?.legendStyles}>
        {years.map((year, index) => (
          <li
            key={`legend-item-${year.name}`}
            className={`recharts-legend-item legend-item-${index}`}
            onClick={() => {
              if (visibleRadars[year.name] && visibleRadarCount === 1) return; // Prevent hiding the last visible radar
              setVisibleRadars((prev) => ({
                ...prev,
                [year.name]: !prev[year.name],
              }));
            }}
            style={{
              cursor: "pointer",
              opacity: visibleRadars[year.name] ? 1 : 0.5,
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
            <span className="recharts-legend-item-text">{year.name}</span>
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
          <p className="tooltip-label">{label}</p>
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
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="metric"
            tick={(props) => {
              const { payload, x, y, textAnchor, fontSize } = props;
              const label = payload.value;
              const maxLength = 12; // Adjust this length as needed
              const truncatedLabel =
                label.length > maxLength
                  ? `${label.slice(0, maxLength)}...`
                  : label;
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fontSize={fontSize || 14}
                  fill="#666">
                  {truncatedLabel}
                </text>
              );
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 25]}
            tick={{ fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {years.map((year, index) =>
            visibleRadars[year.name] ? (
              <Radar
                key={`radar-${year.name}`}
                name={year.name}
                dataKey={year.name}
                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                fill={chartInfo.colors[index % chartInfo.colors.length]}
                fillOpacity={0.6}
              />
            ) : null
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarCharts;
