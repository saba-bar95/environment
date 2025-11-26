import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const PieChartWithYears = ({ chartInfo }) => {
  const { language } = useParams();
  const [pieData, setPieData] = useState([]); // Full data
  const [displayPieData, setDisplayPieData] = useState([]); // Filtered for display
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleSegments, setVisibleSegments] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [colorMap, setColorMap] = useState({});

  // Track window width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    setWindowWidth(window.innerWidth);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter displayPieData based on visibleSegments
  useEffect(() => {
    const filteredData = pieData.filter((item) => visibleSegments[item.name]);
    setDisplayPieData(filteredData);
  }, [pieData, visibleSegments]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        // Variables[1] = Regions (we select some), Variables[0] = Years
        const valueTexts =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        const selected = chartInfo.selectedIndices
          .map((index) => valueTexts[index])
          .filter(Boolean);

        const yearData =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (year, i) => ({ year, id: i })
          ) || [];

        const rawData = dataResult?.data?.data || [];

        // Extract all available years as numbers
        const availableYears = yearData
          .map((item) => Number(item.year))
          .filter((y) => !isNaN(y))
          .sort((a, b) => a - b);

        if (availableYears.length === 0) {
          setPieData([]);
          setIsLoading(false);
          return;
        }

        const maxYear = Math.max(...availableYears);

        // Helper to create decade label
        const getLabel = (start, end) =>
          language === "ge" ? `${start}-${end} წლები` : `${start}-${end}`;

        // Build dynamic decades (only if data exists in that range)
        const decades = [];

        if (availableYears.some((y) => y >= 1990 && y <= 1999))
          decades.push({ start: 1990, end: 1999, label: getLabel(1990, 1999) });

        if (availableYears.some((y) => y >= 2000 && y <= 2009))
          decades.push({ start: 2000, end: 2009, label: getLabel(2000, 2009) });

        if (availableYears.some((y) => y >= 2010 && y <= 2019))
          decades.push({ start: 2010, end: 2019, label: getLabel(2010, 2019) });

        if (availableYears.some((y) => y >= 2020))
          decades.push({
            start: 2020,
            end: maxYear,
            label: getLabel(2020, maxYear),
          });

        // Process data for each decade
        const processedData = decades
          .map(({ start, end, label }) => {
            let sum = 0;

            yearData.forEach(({ year: y, id: yearIndex }) => {
              const yearNum = Number(y);
              if (yearNum >= start && yearNum <= end) {
                const dataItem = rawData[yearIndex]; // Direct index access → correct & fast
                if (dataItem) {
                  selected.forEach((text) => {
                    sum += Number(dataItem[String(text.id)] || 0);
                  });
                }
              }
            });

            return { name: label, value: sum };
          })
          .filter((d) => d.value > 0); // Remove empty decades

        setPieData(processedData);
        setSelectedTexts(processedData.map((d) => ({ name: d.name })));

        // Color mapping
        const newColorMap = processedData.reduce((acc, item, i) => {
          acc[item.name] = chartInfo.colors[i % chartInfo.colors.length];
          return acc;
        }, {});
        setColorMap(newColorMap);

        // Visibility
        setVisibleSegments(
          processedData.reduce((acc, item) => {
            acc[item.name] = true;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error("Error loading pie chart data:", err);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo]);

  // Loading state
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

  // Error state
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

  // Custom Legend
  const CustomLegend = () => {
    const visibleLineCount =
      Object.values(visibleSegments).filter(Boolean).length;

    return (
      <ul className="recharts-default-legend" id="pie-chart-legend">
        {selectedTexts.map((text, index) => {
          const num = pieData.find((d) => d.name === text.name)?.value || 0; // Full value
          const value = num
            .toLocaleString("fr-FR", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 1,
            })
            .replace(",", ".");

          return (
            <li
              key={`legend-item-${text.name}`}
              className={`recharts-legend-item legend-item-${index}`}
              onClick={() => {
                if (visibleSegments[text.name] && visibleLineCount === 1)
                  return;
                setVisibleSegments((prev) => ({
                  ...prev,
                  [text.name]: !prev[text.name],
                }));
              }}
              style={{
                cursor: "pointer",
                opacity: visibleSegments[text.name] ? 1 : 0.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: windowWidth < 380 ? "100%" : "auto",
                }}>
                <span
                  className="recharts-legend-item-icon"
                  style={{
                    backgroundColor: colorMap[text.name] || "#000",
                    flexShrink: 0,
                    width: 7,
                    height: 16,
                    display: "inline-block",
                    marginRight: 8,
                    borderRadius: 25,
                  }}></span>
                <span
                  className="recharts-legend-item-text"
                  style={{ width: windowWidth < 380 ? "max-content" : "auto" }}>
                  {text.name}
                </span>
                {windowWidth < 380 && (
                  <span
                    style={{
                      fontWeight: 900,
                      fontFamily: "FiraGORegular",
                      fontSize: "12px",
                    }}>
                    {value}
                  </span>
                )}
              </div>
              {windowWidth > 380 && (
                <span
                  style={{
                    fontWeight: 900,
                    fontFamily: "FiraGORegular",
                    fontSize: "14px",
                  }}>
                  {value}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const total = displayPieData.reduce((sum, item) => sum + item.value, 0); // Sum of visible

    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "black",
          padding: "10px",
          borderRadius: "5px",
        }}>
        <div className="tooltip-container">
          {payload.map(({ payload: { name, value, fill } }, index) => (
            <p key={`item-${index}`} className="text">
              <span
                className="before-span"
                style={{
                  backgroundColor: fill,
                  flexShrink: 0,
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                  borderRadius: "2px",
                }}></span>
              {name} :
              <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                {total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"}%
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  // Empty state
  if (displayPieData.length === 0) {
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

  const renderCustomLabel = ({ x, y, value, index, cx, cy }) => {
    const color = colorMap[displayPieData[index]?.name] || "#000";
    const RADIAN = Math.PI / 180;
    const radius = 15;
    const angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
    const adjustedAngle = angle < -90 ? angle + 360 : angle;
    const xOffset = x + Math.cos(adjustedAngle * RADIAN) * radius;
    const yOffset = y + Math.sin(adjustedAngle * RADIAN) * radius;
    const textRotation =
      adjustedAngle > 90 && adjustedAngle < 270
        ? adjustedAngle + 180
        : adjustedAngle;

    const formattedValue = value.toLocaleString("fr-FR").replace(",", ".");

    return (
      <text
        x={xOffset}
        y={yOffset}
        fill={color}
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(${textRotation}, ${xOffset}, ${yOffset})`}
        style={{
          fontFamily: "FiraGOMedium",
          fontSize: "12px",
          fontWeight: "bold",
        }}>
        {formattedValue}
      </text>
    );
  };

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header" style={{ marginBottom: 0 }}>
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
            data={pieData} // Download full data
            filename={chartInfo[`title_${language}`]}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={550}>
        <PieChart>
          <Pie
            data={displayPieData}
            dataKey="value"
            nameKey="name"
            innerRadius={windowWidth < 380 ? 40 : 55}
            outerRadius={windowWidth < 380 ? 90 : 120}
            paddingAngle={5}
            label={renderCustomLabel}>
            {displayPieData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={colorMap[entry.name] || "#000"}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartWithYears;
