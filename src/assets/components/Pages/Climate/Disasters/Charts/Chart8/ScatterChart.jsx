import { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";

const ScatterChart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [xKey, setXKey] = useState("");
  const [yKey, setYKey] = useState("");
  const [zKey, setZKey] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Optional: add error state

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true); // Set loading to true when starting fetch
      setError(null); // Reset error state

      try {
        // Fetch data and metadata concurrently
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        // Process metadata: map region names to objects with name and id
        const valueTexts =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        // Select specific regions based on chartInfo.selectedIndices
        const selected = chartInfo.selectedIndices
          .map((index) => valueTexts[index])
          .filter(Boolean);

        if (selected.length !== 4) {
          throw new Error("Expected exactly four selected indices.");
        }

        // Assume selected[0] is Y (index 5), selected[1] is X (index 6)
        // selected[2] and selected[3] for Z sum (indices 2 and 4)
        const yText = selected[0];
        const xText = selected[1];
        const zText1 = selected[2];
        const zText2 = selected[3];

        // Set keys for axes and tooltip
        const xName = xText.name;
        const yName = yText.name;
        const zName =
          language === "ge" ? "სულ გარდაცვლილი" : "Total Casualties";
        setXKey(xName);
        setYKey(yName);
        setZKey(zName);

        // Process year data
        const yearData =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult.data.data || [];

        // Process data for the chart
        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year === Number(year));
            if (!dataItem) return null;
            const yVal = parseFloat(dataItem[String(yText.id)]) || 0;
            const xVal = parseFloat(dataItem[String(xText.id)]) || 0;
            const z1 = parseFloat(dataItem[String(zText1.id)]) || 0;
            const z2 = parseFloat(dataItem[String(zText2.id)]) || 0;
            const z = z1 + z2;
            return { year, [xName]: xVal, [yName]: yVal, [zName]: z };
          })
          .filter(Boolean);

        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false); // Set loading to false when done
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

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const dataPoint = payload[0].payload;
    const fillColor = chartInfo.colors[0];

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label" style={{ textDecoration: "underline" }}>
            {language === "ge" ? "წელი: " : "Year: "}
            {dataPoint.year}
          </p>
          <p
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
                  backgroundColor: "#1678e7ff",
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {xKey} :
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {dataPoint[xKey]?.toFixed(0)}
            </span>
          </p>
          <p
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
                  backgroundColor: fillColor,
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {yKey} :
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {dataPoint[yKey]?.toFixed(0)}
            </span>
          </p>
          <p
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
                  backgroundColor: "#f7a72fff",
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {zKey} :
            </span>
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {dataPoint[zKey]?.toFixed(0)}
            </span>
          </p>
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
        <ScatterChart margin={{ top: 20, right: 20, left: 30, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            type="number"
            dataKey={xKey}
            name={xKey}
            tick={{ fontSize: 12, fill: "#666" }}
            tickLine={true}
            axisLine={true}
            stroke="#ccc"
            label={{
              value: xKey,
              position: "insideBottom",
              offset: 0,
              fontSize: 11,
              dy: 20,
              fontFamily: "FiraGO",
            }}
          />
          <YAxis
            type="number"
            dataKey={yKey}
            name={yKey}
            tick={{ fontSize: 12, fill: "#666" }}
            tickLine={true}
            axisLine={true}
            stroke="#ccc"
            label={{
              value: yKey,
              angle: -90,
              position: "inside",
              fontSize: 11,
              fontFamily: "FiraGO",
              dx: -20,
              // dy: 50,
            }}
          />
          <ZAxis dataKey={zKey} range={[30, 1000]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={chartData}
            fill={chartInfo.colors[0]}
            name="Vulnerable Objects"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterChart1;
