import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import YearDropdown from "../../../../YearDropdown/YearDropdown";

const VerticalBarCharts = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleBars, setVisibleBars] = useState({});
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colorMap, setColorMap] = useState({});
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

        const newColorMap = selected.reduce((acc, text, index) => {
          acc[text.name] = chartInfo.colors[index % chartInfo.colors.length];
          return acc;
        }, {});
        setColorMap(newColorMap);

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

        const availableYears = yearData.map((item) => item.year);
        setYears(availableYears);

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

  // Transform chartData for the selected year into barData, sorted descending by value
  useEffect(() => {
    const selectedYearData = chartData.find(
      (item) => item.year === String(year)
    );
    if (selectedYearData) {
      let transformedData = selectedTexts
        .filter((text) => visibleBars[text.name])
        .map((text) => ({
          name: text.name,
          value: selectedYearData[text.name] || 0,
          color: colorMap[text.name],
        }));
      // Sort descending by value
      transformedData.sort((a, b) => b.value - a.value);
      setBarData(transformedData);
    } else {
      setBarData([]);
    }
  }, [chartData, year, visibleBars, selectedTexts, colorMap]);

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

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const color = payload[0].payload.color;
    const name = payload[0].payload.name;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          {payload.map(({ value, dataKey }) => {
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
                      backgroundColor: color,
                      width: 12,
                      height: 12,
                      display: "inline-block",
                      marginRight: 8,
                    }}
                    className="before-span"></span>
                  {name}:
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

  // Empty state
  if (barData.length === 0) {
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
      style={width > 1200 ? chartInfo?.wrapperStyles : {}}>
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
          <YearDropdown years={years} year={year} setYear={setYear} />
          <Download
            data={barData}
            filename={`${chartInfo[`title_${language}`]} (${year})`}
            unit={chartInfo[`unit_${language}`]}
            isVertical={true}
            year={year}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <BarChart
          data={barData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 13 }}
            tickLine={false}
            axisLine={false}
            width={150}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="value" barSize={15}>
            {barData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerticalBarCharts;
