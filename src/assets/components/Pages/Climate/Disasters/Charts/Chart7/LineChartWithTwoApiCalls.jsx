import { useEffect, useState } from "react";
import {
  LineChart,
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

const LineChartWithTwoApiCalls = ({ chartInfo }) => {
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
        // Fetch geological data (first dataset)
        const [geoDataResult, geoMetaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        // Fetch natural disaster data (second dataset) - only if secontCall exists
        let disasterData = null;
        let disasterProcessedData = [];

        if (chartInfo.secontCall) {
          const [disasterDataResult, disasterMetaDataResult] =
            await Promise.all([
              commonData(
                chartInfo.secontCall.id,
                chartInfo.secontCall.types[0],
                language
              ),
              commonData(
                chartInfo.secontCall.id,
                chartInfo.secontCall.types[1],
                language
              ),
            ]);

          // Process natural disaster metadata
          const disasterValueTexts =
            disasterMetaDataResult?.data?.metadata?.variables[0].valueTexts.map(
              (region, i) => ({ name: region, id: i })
            ) || [];

          const disasterYearData =
            disasterMetaDataResult?.data?.metadata?.variables[1].valueTexts.map(
              (year, i) => ({ year: year, id: i })
            ) || [];

          // Get raw disaster data
          const disasterRawData = disasterDataResult?.data?.data || [];

          // Process natural disaster data (excluding December - month 12)
          // BEST & SAFEST WAY: Use the metadata order directly
          disasterProcessedData = disasterYearData
            .map(({ year, id: yearIndex }) => {
              if (Number(year) < 2013) return null;

              const yearEntry = disasterRawData[yearIndex]; // ← Direct index access!

              if (!yearEntry) return null;

              let total = 0;

              disasterValueTexts.forEach((disaster) => {
                for (let month = 0; month < 12; month++) {
                  // Jan–Nov only
                  const key = `${disaster.id} - ${month}`;
                  total += Number(yearEntry[key] || 0);
                }
              });

              return { year, total };
            })
            .filter(Boolean);

          disasterData = {
            processedData: disasterProcessedData,
            yearData: disasterYearData,
          };
        }
        console.log("DisasterData", disasterData);

        // Define names based on language
        const geoName =
          language === "ge" ? "გეოლოგიური მოვლენები" : "Geological events";
        const disasterName =
          language === "ge"
            ? "ჰიდრომეტეოროლოგიური მოვლენები"
            : "Hydrometeorological events";

        // Set selected texts
        if (disasterData && disasterData.processedData.length > 0) {
          // Both datasets available
          setSelectedTexts([
            { name: geoName, id: "geological" },
            { name: disasterName, id: "disasters" },
          ]);
          setVisibleLines({ [geoName]: true, [disasterName]: true });
        } else {
          // Only geological data
          setSelectedTexts([{ name: geoName, id: "geological" }]);
          setVisibleLines({ [geoName]: true });
        }

        // Process geological year data
        const geoYearData =
          geoMetaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const geoRawData = geoDataResult?.data?.data || [];
        const selectedIndices = chartInfo.selectedIndices || [];

        // Process geological data
        const geoProcessedData = geoYearData
          .map(({ year }) => {
            if (Number(year) < 2013) return null;
            const dataItem = geoRawData.find(
              (item) => item.year === Number(year)
            );
            if (!dataItem) return null;

            const sum = selectedIndices.reduce((total, index) => {
              const value = parseFloat(dataItem[String(index)]) || 0;
              return total + value;
            }, 0);

            return { year, [geoName]: sum };
          })
          .filter(Boolean);

        // Combine both datasets by year
        let combinedData;

        if (disasterData && disasterData.processedData.length > 0) {
          const allYears = [
            ...new Set([
              ...geoProcessedData.map((d) => d.year),
              ...disasterData.processedData.map((d) => d.year),
            ]),
          ].sort((a, b) => Number(a) - Number(b));

          combinedData = allYears.map((year) => {
            const geoData = geoProcessedData.find((d) => d.year === year) || {
              year,
              [geoName]: 0,
            };
            const disasterDataPoint = disasterData.processedData.find(
              (d) => d.year === year
            ) || { year, total: 0 };

            return {
              year,
              [geoName]: geoData[geoName],
              [disasterName]: disasterDataPoint.total,
            };
          });
        } else {
          // Only geological data
          combinedData = geoProcessedData;
        }

        // Update chart data
        setChartData(combinedData);
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

  // Custom Legend Component (unchanged)
  const CustomLegend = () => {
    const visibleLineCount = Object.values(visibleLines).filter(Boolean).length;

    return (
      <ul className="recharts-default-legend">
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

  // Custom Tooltip Component (unchanged)
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
    <div
      className="chart-wrapper"
      id={chartInfo.chartID}
      style={chartInfo?.wrapperStyles}>
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
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 13 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {selectedTexts.map((text, index) =>
            visibleLines[text.name] ? (
              <Line
                key={`line-${text.name}`}
                type="monotone"
                dataKey={text.name}
                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                name={text.name}
                strokeWidth={3}
                dot={{
                  r: 3,
                  fill: chartInfo.colors[index % chartInfo.colors.length],
                }}
              />
            ) : null
          )}
          <Brush
            dataKey="year"
            height={20}
            stroke="#8884d8"
            travellerWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartWithTwoApiCalls;
