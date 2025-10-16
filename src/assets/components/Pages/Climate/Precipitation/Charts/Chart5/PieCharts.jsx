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
import YearDropdown from "../../../../../YearDropdown/YearDropdown";

const PieChartComponent = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleSegments, setVisibleSegments] = useState({});
  const [year, setYear] = useState(null); 
  const [years, setYears] = useState([]);
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

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        // Custom mapping for atmospheric-precipitation historical average data indices to region names
        const regionMapping = {
          0: language === "ge" ? "საქართველო" : "Georgia",
          5: language === "ge" ? "თბილისი" : "Tbilisi",
          10: language === "ge" ? "სამეგრელო-ზემო სვანეთი" : "Samegrelo-Zemo Svaneti", 
          15: language === "ge" ? "ქვემო ქართლი" : "Kvemo Kartli"
        };

        const selected = chartInfo.selectedIndices
          .map((index) => ({ 
            name: regionMapping[index] || `Region ${index}`, 
            id: index 
          }))
          .filter(Boolean);

        setSelectedTexts(selected);

        const newColorMap = selected.reduce((acc, text, index) => {
          acc[text.name] = chartInfo.colors[index % chartInfo.colors.length];
          return acc;
        }, {});
        setColorMap(newColorMap);

        setVisibleSegments(
          selected.reduce((acc, text) => {
            acc[text.name] = true;
            return acc;
          }, {})
        );

        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const availableYears = yearData.map((item) => item.year);
        setYears(availableYears);

        // Set the latest year as the default
        if (availableYears.length > 0) {
          const latestYear = Math.max(...availableYears).toString();
          setYear(+latestYear);
        }

        const rawData = dataResult.data.data || [];

        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;
            const dataPoint = { year };
            selected.forEach((text) => {
              dataPoint[text.name] = dataItem[String(text.id)];
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

  // Transform chartData for the selected year into pieData
  useEffect(() => {
    const selectedYearData = chartData.find(
      (item) => item.year === String(year)
    );
    if (selectedYearData) {
      const transformedData = selectedTexts
        .filter((text) => visibleSegments[text.name])
        .map((text) => ({
          name: text.name,
          value: selectedYearData[text.name] || 0,
        }));
      setPieData(transformedData);
    } else {
      setPieData([]);
    }
  }, [chartData, year, visibleSegments, selectedTexts]);

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
    const selectedYearData = chartData.find(
      (item) => item.year === String(year)
    );

    return (
      <ul className="recharts-default-legend" id="pie-chart-legend">
        {selectedTexts.map((text, index) => {
          const value = selectedYearData
            ? (selectedYearData[text.name] || 0).toFixed(1)
            : "0.0";

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

    const total = pieData.reduce((sum, item) => sum + item.value, 0);

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
  if (pieData.length === 0) {
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
    const color = colorMap[pieData[index]?.name] || "#000";
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
        {value.toLocaleString()}
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
          {/* <YearDropdown years={years} year={year} setYear={setYear} /> */}
          <Download
            data={pieData}
            filename={`${chartInfo[`title_${language}`]} (${year})`}
            unit={chartInfo[`unit_${language}`]}
            isPieChart={true}
            year={year}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={windowWidth < 380 ? 40 : 45}
            outerRadius={windowWidth < 380 ? 90 : 100}
            paddingAngle={5}
            label={renderCustomLabel}>
            {pieData.map((entry) => (
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

export default PieChartComponent;
