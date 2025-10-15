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
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "./Download/Download";
import YearDropdown from "../../../../../YearDropdown/YearDropdown";

const BarChartComponent = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [visibleBars, setVisibleBars] = useState({});
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [yearDataState, setYearDataState] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const availableYears = yearData.map((item) => +item.year);
        setYears(availableYears);

        if (availableYears.length > 0 && year === null) {
          const latestYear = Math.max(...availableYears).toString();
          setYear(+latestYear);
        }

        const raw = dataResult?.data?.data || [];
        setRawData(raw);
        setYearDataState(yearData);
      } catch (error) {
        console.log("Error fetching data:", error);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [language, chartInfo, year]); // Removed 'year' dep

  // Always process as single-year view (transform to [{name: category, value: total}])
  useEffect(() => {
    if (
      !rawData.length ||
      !yearDataState.length ||
      !selectedTexts.length ||
      year === null
    ) {
      setChartData([]);
      return;
    }

    // Find the selected year's raw data
    const selectedYearId = yearDataState.find(
      (item) => +item.year === year
    )?.id;
    if (selectedYearId === undefined) {
      setChartData([]);
      return;
    }

    const dataItem = rawData.find(
      (item) => Number(item.year) === selectedYearId
    );
    if (!dataItem) {
      setChartData([]);
      return;
    }

    // Compute totals per category
    const categoryTotals = {};
    selectedTexts.forEach((text) => {
      let total = 0;
      for (let month = 0; month <= 12; month++) {
        const key = `${text.id} - ${month}`;
        total += Number(dataItem[key] || 0);
      }
      categoryTotals[text.name] = total;
    });

    // Filter to visible categories and transform
    const visibleCategories = selectedTexts.filter((t) => visibleBars[t.name]);
    const transformed = visibleCategories.map((t) => ({
      name: t.name,
      value: categoryTotals[t.name],
    }));

    setChartData(transformed);
  }, [rawData, yearDataState, selectedTexts, year, visibleBars]);

  const toggleBar = (dataKey) => {
    setVisibleBars((prev) => {
      const visibleCount = Object.values(prev).filter(Boolean).length;
      if (prev[dataKey] && visibleCount === 1) return prev;
      return {
        ...prev,
        [dataKey]: !prev[dataKey],
      };
    });
  };

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

  // Always single-year view now
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const entry = payload[0];
    const name = label; // category name
    const value = entry.value;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {name} {language === "ge" ? "კატეგორია" : "Category"}
          </p>
          <p className="text">
            <span
              style={{
                backgroundColor: chartInfo.colors[0],
                flexShrink: 0,
                width: 12,
                height: 12,
                display: "inline-block",
                marginRight: 8,
              }}
              className="before-span"></span>
            {name}:
            <span style={{ fontWeight: 900, marginLeft: "5px" }}>
              {value?.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const CustomLegend = () => (
    <ul
      className="recharts-default-legend"
      style={{
        flexWrap: "wrap",
        gap: "15px",
        justifyContent: "start",
        marginRight: "-50px",
        marginTop: "20px",
      }}>
      {selectedTexts.map((text, index) => (
        <li
          key={`legend-item-${text.name}`}
          className={`recharts-legend-item legend-item-${index} ${
            visibleBars[text.name] ? "active" : "inactive"
          }`}
          onClick={() => toggleBar(text.name)}
          style={{
            cursor: "pointer",
            opacity: visibleBars[text.name] ? 1 : 0.5,
          }}>
          <span
            className="recharts-legend-item-icon"
            style={{
              backgroundColor: chartInfo.colors[0],
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
          </div>
        </div>
        <div className="left">
          <YearDropdown
            years={years}
            year={year}
            setYear={setYear}
            showAllOption={false} // No "all" option needed
          />
          <Download
            data={chartData}
            filename={`${chartInfo[`title_${language}`]}_${year}`}
            year={year}
          />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={460}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis dataKey="name" tick={false} tickLine={false} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ marginTop: -20 }}
          />
          <Bar dataKey="value" fill={chartInfo.colors[0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
