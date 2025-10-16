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
  LabelList,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const StackedBarChartsWithPercents = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleBars, setVisibleBars] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
  }, [width]);

  // Fetch and process data
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
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        const selected = chartInfo.selectedIndices
          .map((index) => valueTexts[index])
          .filter(Boolean);

        setSelectedTexts(selected);

        setVisibleBars(
          selected.reduce((acc, text) => {
            acc[text.name] = true;
            return acc;
          }, {})
        );

        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult?.data?.data || [];

        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year == year);
            if (!dataItem) return null;

            const dataPoint = { year };
            selected.forEach((text) => {
              dataPoint[text.name] = dataItem[String(text.id)] || 0;
            });

            // Calculate total for the year
            const total = selected.reduce((sum, text) => {
              const v = dataPoint[text.name];
              return sum + (typeof v === "number" ? Math.abs(v) : 0);
            }, 0);

            // Add percentage fields for each selected text
            selected.forEach((text) => {
              const rawValue = dataPoint[text.name];
              dataPoint[`${text.name}_percent`] =
                total > 0 ? (Math.abs(rawValue) / total) * 100 : 0;
            });

            return dataPoint;
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
    const visibleBarCount = Object.values(visibleBars).filter(Boolean).length;

    return (
      <ul
        className="recharts-default-legend"
        style={width < 1200 ? chartInfo?.legendStyles : {}}>
        {selectedTexts.map((text, index) => (
          <li
            key={`legend-item-${text.name}`}
            className={`recharts-legend-item legend-item-${index}`}
            onClick={() => {
              if (visibleBars[text.name] && visibleBarCount === 1) {
                return;
              }
              setVisibleBars((prev) => ({
                ...prev,
                [text.name]: !prev[text.name],
              }));
            }}
            style={{
              cursor: "pointer",
              opacity: visibleBars[text.name] ? 1 : 0.5,
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
                  {text?.name} :
                </span>
                <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                  {value?.toFixed(1)}
                </span>
              </p>
            );
          })}
        </div>
      </div>
    );
  };

  // Custom Label for Percentage
  // Custom Label for Percentage
  const CustomLabel = ({ x, y, width, height, value, index, dataKey }) => {
    if (!chartData[index] || value == null) return null;

    // Get the individual bar segment's value
    const rawValue = chartData[index][dataKey];

    // Compute the sum of all visible bars in this year (index)
    const total = selectedTexts.reduce((sum, text) => {
      if (!visibleBars[text.name]) return sum;
      const v = chartData[index][text.name];
      return sum + (typeof v === "number" ? Math.abs(v) : 0);
    }, 0);

    // Prevent division by zero
    const percentage = total > 0 ? (Math.abs(rawValue) / total) * 100 : 0;

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight="bold">
        {percentage >= 1 ? `${percentage.toFixed(1)}%` : ""}
      </text>
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
    <div
      className="chart-wrapper"
      id={chartInfo.chartID}
      style={width > 1200 ? chartInfo.wrapperStyles : {}}>
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
            sbcwp={true}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <BarChart data={chartData} stackOffset="sign">
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
          {selectedTexts.map((text, index) =>
            visibleBars[text.name] ? (
              <Bar
                key={`bar-${text.name}`}
                dataKey={text.name}
                stackId="a"
                fill={chartInfo.colors[index % chartInfo.colors.length]}
                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                name={text.name}>
                <LabelList
                  content={(props) => (
                    <CustomLabel {...props} dataKey={text.name} />
                  )}
                />
              </Bar>
            ) : null
          )}
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

export default StackedBarChartsWithPercents;
