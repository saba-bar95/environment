import { useEffect, useState } from "react";
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
import YearDropdown from "../../../../../YearDropdown/YearDropdown";

const RadarChartComponent = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleBars, setVisibleBars] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [monthNames, setMonthNames] = useState([]); // Store month names from metadata
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Handle responsive screen size
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallScreen = screenWidth < 1200;
  const chartHeight = isSmallScreen ? 400 : 460;
  const outerRadius = isSmallScreen ? "70%" : "75%";
  const tickFontSize = isSmallScreen ? 12 : 13;
  const legendMarginTop = isSmallScreen ? 8 : 10;

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

        // Use region names directly, no `key` property
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
            acc[text.name] = true; // all bars visible initially
            return acc;
          }, {})
        );

        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        // Get month names from metadata (excluding the last one which is "Human Fatalities")
        const monthData =
          metaDataResult?.data?.metadata?.variables[2]?.valueTexts || [];
        const actualMonthNames = monthData.slice(0, 12); // First 12 are actual months
        setMonthNames(actualMonthNames);

        const availableYears = yearData.map((item) => item.year);
        setYears(availableYears);

        // Set the latest year as the default
        if (availableYears.length > 0 && !year) {
          const latestYear = Math.max(...availableYears).toString();
          setYear(+latestYear);
        }

        const rawData = dataResult?.data?.data || [];

        // If no specific year is selected, show yearly totals (current behavior)
        if (!year) {
          const processedData = yearData
            .map(({ year: yearStr, id: yearId }) => {
              const dataItem = rawData.find((item) => {
                return Number(item.year) === yearId;
              });

              if (!dataItem) return null;
              const dataPoint = { year: yearStr };
              selected.forEach((text) => {
                let total = 0;
                for (let month = 0; month <= 12; month++) {
                  const key = `${text.id} - ${month}`;
                  total += Number(dataItem[key] || 0);
                }
                dataPoint[text.name] = total;
              });
              return dataPoint;
            })
            .filter(Boolean);

          setChartData(processedData);
        }
        // If a year is selected, show monthly data for that year
        else {
          const selectedYearId = yearData.find(
            (item) => item.year === year.toString()
          )?.id;

          if (selectedYearId !== undefined) {
            const dataItem = rawData.find(
              (item) => Number(item.year) === selectedYearId
            );

            if (dataItem) {
              const processedData = actualMonthNames
                .slice(0, 12)
                .map((monthName, monthIndex) => {
                  const dataPoint = { month: monthName };
                  selected.forEach((text) => {
                    const key = `${text.id} - ${monthIndex}`;
                    dataPoint[text.name] = Number(dataItem[key] || 0);
                  });
                  return dataPoint;
                });

              setChartData(processedData);
            } else {
              setChartData([]);
            }
          } else {
            setChartData([]);
          }
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo, year]); // Add year to dependencies

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
        style={{ marginTop: `${legendMarginTop}px` }}>
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
          <p className="tooltip-label">{label}</p>
          {payload.map(({ value, stroke, name }) => {
            const text = selectedTexts.find((t) => t.name === name);
            return (
              <p
                key={`item-${name}`}
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

  // Determine if we're showing months or years
  const isMonthView =
    chartData.length > 0 &&
    Object.prototype.hasOwnProperty.call(chartData[0], "month");
  const dataKey = isMonthView ? "month" : "year";

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header">
        <div className="right">
          <div className="ll"></div>
          <div className="rr">
            <h1>
              {language === "ge" ? chartInfo.title_ge : chartInfo.title_en}
            </h1>
          </div>
        </div>
        <div className="left">
          <YearDropdown
            years={years}
            year={year}
            setYear={setYear}
            showAllOption={true} // Add option to show all years
          />
          <Download
            data={chartData}
            filename={`${chartInfo[`title_${language}`]}`}
            year={year}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <RadarChart
          data={chartData}
          outerRadius={outerRadius}
          margin={{ top: 0, right: 0, left: 0, bottom: -10 }}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey={dataKey}
            tick={{ fontSize: tickFontSize }}
            // Custom tick rendering for better month display
            tickFormatter={(value, index) => {
              if (isMonthView) {
                // Use the actual month names from metadata
                return monthNames[index] || value;
              }
              return value;
            }}
          />
          <PolarRadiusAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          {selectedTexts.map((text, index) =>
            visibleBars[text.name] ? (
              <Radar
                key={`radar-${text.name}`}
                name={text.name}
                dataKey={text.name}
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

export default RadarChartComponent;
