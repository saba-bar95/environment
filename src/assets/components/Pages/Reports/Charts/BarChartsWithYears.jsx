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
} from "recharts";
import { useParams } from "react-router-dom";
import commonData from "../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import YearDropdown from "../../../YearDropdown/YearDropdown";

const BarChartsWithYears = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleBars, setVisibleBars] = useState({});
  const [year, setYear] = useState(null); // Initialize as null
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch and process data
  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(chartInfo.id, chartInfo.types[0], language, year),
          commonData(chartInfo.id, chartInfo.types[1], language),
        ]);

        const valueTexts = chartInfo.isPieChart
          ? (dataResult?.data?.data || []).map((item, i) => ({
              name: item.name,
              id: i,
            }))
          : metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
              (region, i) => ({ name: region, id: i })
            ) || [];

        const selected = chartInfo.isPieChart
          ? valueTexts
          : chartInfo.selectedIndices
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

        const availableYears = yearData.map((item) => item.year);
        setYears(availableYears);

        // Set the latest year as the default
        if (availableYears.length > 0) {
          const latestYear = Math.max(...availableYears).toString();
          setYear(+latestYear);
        }

        const processedData = chartInfo.isPieChart
          ? dataResult?.data?.data || []
          : yearData
              .map(({ year }) => {
                const dataItem = dataResult?.data?.data.find(
                  (item) => item.year == year
                );
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
  }, [language, chartInfo, year]);

  // Transform data for BarChart
  useEffect(() => {
    if (chartInfo.isPieChart) {
      const filteredData = chartData.filter(
        (item) => item.year === String(year)
      );
      if (filteredData.length > 0) {
        // Pivot data so each name becomes a dataKey
        const transformedData = [
          {
            name: year, // Use year as the x-axis label
            ...selectedTexts
              .filter((text) => visibleBars[text.name])
              .reduce((acc, text) => {
                acc[text.name] =
                  filteredData.find((item) => item.name === text.name)?.value ||
                  0;
                return acc;
              }, {}),
          },
        ];
        setBarData(transformedData);
      } else {
        setBarData([]);
      }
    } else {
      const selectedYearData = chartData.find(
        (item) => item.year === String(year)
      );
      if (selectedYearData) {
        const transformedData = [
          {
            name: year, // Use year as the x-axis label
            ...selectedTexts
              .filter((text) => visibleBars[text.name])
              .reduce((acc, text) => {
                acc[text.name] = selectedYearData[text.name] || 0;
                return acc;
              }, {}),
          },
        ];
        setBarData(transformedData);
      } else {
        setBarData([]);
      }
    }
  }, [chartData, year, visibleBars, selectedTexts, chartInfo.isPieChart]);

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

  // Show empty state if no data
  if (!barData || barData.length === 0) {
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

  // Custom Legend Component
  const CustomLegend = () => {
    const visibleBarCount = Object.values(visibleBars).filter(Boolean).length;

    return (
      <ul
        className="recharts-default-legend"
        style={{ flexDirection: "column", gap: "3px" }}>
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

  const CustomTooltip = ({ active, payload, year, language }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {year} {language === "en" ? "Year" : "წელი"}
          </p>
          {payload.map(({ value, fill, dataKey }) => (
            <p
              key={`item-${dataKey}`}
              className="text"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}>
              <span style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    backgroundColor: fill,
                    flexShrink: 0,
                    width: 12,
                    height: 12,
                    display: "inline-block",
                    marginRight: 8,
                  }}
                  className="before-span"></span>
                {dataKey} :
              </span>
              <span style={{ fontWeight: 900 }}>{value?.toFixed(1)}</span>
            </p>
          ))}
        </div>
      </div>
    );
  };

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
          <YearDropdown years={years} year={year} setYear={setYear} />
          <Download
            year={year}
            data={barData}
            filename={`${chartInfo[`title_${language}`]} (${year})`}
            unit={chartInfo[`unit_${language}`]}
            bcwy={true}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <BarChart data={barData} stackOffset="sign">
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ marginBottom: -20 }}
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
          {selectedTexts
            .filter((text) => visibleBars[text.name])
            .map((text, index) => (
              <Bar
                key={`bar-${text.name}`}
                dataKey={text.name}
                fill={chartInfo.colors[index % chartInfo.colors.length]}
                stroke={chartInfo.colors[index % chartInfo.colors.length]}
                name={text.name}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartsWithYears;
