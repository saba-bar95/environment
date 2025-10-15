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

const LineChartsWithTwoApiCalls = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [secondSelectedTexts, setSecondSelectedTexts] = useState([]);
  const [visibleLines, setVisibleLines] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch data and metadata for both calls concurrently
        const [
          dataResult,
          metaDataResult,
          secondDataResult,
          secondMetaDataResult,
        ] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
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

        // Process metadata for first call
        const valueTexts =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (region, i) => ({ name: region, id: i, source: "first" })
          ) || [];
        const selected = chartInfo.selectedIndices
          .map((index) => valueTexts[index])
          .filter(Boolean);
        setSelectedTexts(selected);

        // Process metadata for second call, prefixing names to ensure uniqueness
        const secondValueTexts =
          secondMetaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (region, i) => ({
              name: region, // Modify name to distinguish
              id: i,
              source: "second",
            })
          ) || [];
        const secondSelected = chartInfo.secontCall.selectedIndices
          .map((index) => secondValueTexts[index])
          .filter(Boolean);
        setSecondSelectedTexts(secondSelected);

        // Initialize all lines as visible
        const allSelected = [...selected, ...secondSelected];
        setVisibleLines(
          allSelected.reduce((acc, text) => {
            acc[text.name] = true;
            return acc;
          }, {})
        );

        // Process year data
        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult.data.data || [];
        const secondRawData = secondDataResult.data.data || [];

        // Process data for the chart
        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            const secondDataItem = secondRawData.find(
              (item) => item.year === Number(year)
            );
            if (!dataItem && !secondDataItem) return null;
            const dataPoint = { year };
            selected.forEach((text) => {
              if (dataItem) {
                dataPoint[text.name] = dataItem[String(text.id)];
              }
            });
            secondSelected.forEach((text) => {
              if (secondDataItem) {
                dataPoint[text.name] = secondDataItem[String(text.id)];
              }
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
    const allSelected = [...selectedTexts, ...secondSelectedTexts];

    return (
      <ul className="recharts-default-legend">
        {allSelected.map((text, index) => (
          <li
            key={`legend-item-${text.name}-${text.source}`}
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
          {payload.map(({ value, stroke, dataKey }, index) => {
            const text = [...selectedTexts, ...secondSelectedTexts].find(
              (t) => t.name === dataKey
            );
            return (
              <p
                key={`item-${dataKey}-${text?.source || index}`} // Unique key using source or index
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
                  {value?.toFixed(2)}
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
          <XAxis dataKey="year" tick={{ fontSize: 15 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {[...selectedTexts, ...secondSelectedTexts].map((text, index) =>
            visibleLines[text.name] ? (
              <Line
                key={`line-${text.name}-${text.source}`} // Unique key using source
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

export default LineChartsWithTwoApiCalls;
