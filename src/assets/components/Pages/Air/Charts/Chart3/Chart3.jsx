import { useEffect, useState, useMemo } from "react";
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
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import commonData from "../../../../../fetchFunctions/commonData";
import Download from "../Download/Download";

const Chart3 = ({ chartInfo }) => {
  const { language } = useParams();
  const [chartData, setChartData] = useState([]);
  const [activeLines, setActiveLines] = useState(["mobile", "stationary"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [selectedPollutant, setSelectedPollutant] = useState(null); // New state for selected pollutant

  const mobileLabel =
    language === "ge" ? "მობილური წყაროები" : "Mobile Sources";
  const stationaryLabel =
    language === "ge" ? "სტაციონარული წყაროები" : "Stationary Sources";

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
      colors: ["#63b8e9ff", "#e75816ff"],
      svg: Svg(),
      mobileId: "transport-emissions",
      stationaryId: "stationary-source-pollution",
      types: ["data", "metadata"],
      apiID: "atmospheric-emissions",
    }),
    [chartInfo]
  );

  // Function to normalize pollutant names to match rawData keys
  const normalizePollutantKey = (pollutantName) => {
    const nameMap = {
      "Sulphur dioxide (SO2)": "SULPHUR",
      "გოგირდის დიოქსიდი (SO2)": "SULPHUR",
      "Nitrogen oxides (NOX)": "NITROGEN",
      "აზოტის ოქსიდები (NOX)": "NITROGEN",
      "Non-methane volatile organic compounds (NMVOC)": "nmvoc",
      "არამეთანური აქროლადი ორგანული ნაერთები (NMVOC)": "nmvoc",
      "Ammonia (NH3)": "AMMONIA",
      "ამიაკი (NH3)": "AMMONIA",
      "Carbon monCoxide (CO)": "CARBON",
      "ნახშირბადის მონოოქსიდი (CO)": "CARBON",
      "Total suspended particulates (TSP)": "tsp",
      "მტვრის ნაწილაკები (TSP)": "tsp",
      "Patriculate matters (PM10)": "pm10",
      "მყარი ნაწილაკები (PM10)": "pm10",
      "Patriculate matters (PM2.5)": "pm2.5",
      "მყარი ნაწილაკები (PM2.5)": "pm2.5",
    };
    return nameMap[pollutantName] || pollutantName;
  };

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(info.apiID, info.types[0], language),
          commonData(info.apiID, info.types[1], language),
        ]);

        const valueTexts =
          metaDataResult?.data?.metadata?.variables[0].valueTexts.map(
            (region, i) => ({ name: region, id: i })
          ) || [];

        setSelectedTexts(valueTexts);
        setSelectedPollutant(valueTexts[0]?.name); // Default to first pollutant

        const yearData =
          metaDataResult?.data?.metadata?.variables[1].valueTexts.map(
            (year, i) => ({ year: year, id: i })
          ) || [];

        const rawData = dataResult?.data?.data || [];

        // Process data for the chart
        const processedData = yearData
          .map(({ year }) => {
            const dataItem = rawData.find((item) => item.year == year);
            if (!dataItem) return null;
            return { year, ...dataItem }; // Include all data for flexibility
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
  }, [language, info]);

  // Handle pollutant selection
  const handlePollutantSelection = (pollutantName) => {
    setSelectedPollutant(pollutantName);
  };

  // Toggle line visibility
  const toggleLine = (dataKey) => {
    setActiveLines((prev) => {
      if (prev.length === 1 && prev.includes(dataKey)) {
        return prev; // Prevent hiding the last visible line
      }
      return prev.includes(dataKey)
        ? prev.filter((line) => line !== dataKey)
        : [...prev, dataKey];
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="chart-wrapper" id={chartInfo.chartID}>
        <div className="header">
          <div className="right">
            <div className="ll">
              <Svg />
            </div>
            <div className="rr">
              <h1>{language === "ge" ? info.title_ge : info.title_en}</h1>
              <p>{language === "ge" ? info.unit_ge : info.unit_en}</p>
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
            <div className="ll">
              <Svg />
            </div>
            <div className="rr">
              <h1>{language === "ge" ? info.title_ge : info.title_en}</h1>
              <p>{language === "ge" ? info.unit_ge : info.unit_en}</p>
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

  const CustomLegend = ({ payload }) => (
    <ul className="recharts-default-legend">
      {payload.map((entry, index) => (
        <li
          key={`legend-item-${index}`}
          className={`recharts-legend-item legend-item-${index} ${
            activeLines.includes(entry.dataKey) ? "active" : "inactive"
          }`}
          onClick={() => toggleLine(entry.dataKey)}
          style={{
            cursor: "pointer",
            opacity: activeLines.includes(entry.dataKey) ? 1 : 0.5,
          }}>
          <span
            className="recharts-legend-item-icon"
            style={{
              backgroundColor: entry.color,
              flexShrink: 0,
              width: 12,
              height: 12,
              display: "inline-block",
              marginRight: 8,
            }}></span>
          <span className="recharts-legend-item-text">{entry.value}</span>
        </li>
      ))}
    </ul>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="custom-tooltip">
        <div className="tooltip-container">
          <p className="tooltip-label">
            {label} {language === "en" ? "Year" : "წელი"}
          </p>
          {payload.map(({ name, value, stroke }, index) => (
            <p key={`item-${index}`} className="text">
              <span
                style={{
                  backgroundColor: stroke,
                  flexShrink: 0,
                  width: 12,
                  height: 12,
                  display: "inline-block",
                  marginRight: 8,
                }}
                className="before-span"></span>
              {name}:
              <span style={{ fontWeight: 900, marginLeft: "5px" }}>
                {value.toFixed(1)}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  };

  // Prepare data for the selected pollutant
  const pollutantKey = selectedPollutant
    ? normalizePollutantKey(selectedPollutant)
    : null;
  const chartDisplayData = chartData.map((item) => ({
    year: item.year,
    mobile: item[`${pollutantKey} - MOBILE`],
    stationary: item[`${pollutantKey} - STATIONARY`],
  }));

  return (
    <div className="chart-wrapper" id={chartInfo.chartID}>
      <div className="header">
        <div className="right">
          <div className="ll">
            <Svg />
          </div>
          <div className="rr">
            <h1>{language === "ge" ? info.title_ge : info.title_en}</h1>
            <p>{language === "ge" ? info.unit_ge : info.unit_en}</p>
          </div>
        </div>
        <div className="left">
          <Download
            data={chartDisplayData}
            unit={info[`unit_${language}`]}
            filename={`${info[`title_${language}`]}_${selectedPollutant}`}
            isChart3={true}
          />
        </div>
      </div>

      {/* Pollutant Selector */}
      <div className="city-list">
        {selectedTexts.map((s) => (
          <span
            key={`pollutant-${s.id}`}
            className={`city-item ${
              selectedPollutant === s.name ? "active" : ""
            }`}
            onClick={() => handlePollutantSelection(s.name)}>
            {s.name}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={460}>
        <LineChart data={chartDisplayData}>
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
          <Line
            type="monotone"
            dataKey="mobile"
            stroke={info.colors[0]}
            name={mobileLabel}
            strokeWidth={3}
            dot={{ r: 3, fill: info.colors[0] }}
            hide={!activeLines.includes("mobile")}
          />
          <Line
            type="monotone"
            dataKey="stationary"
            stroke={info.colors[1]}
            name={stationaryLabel}
            strokeWidth={3}
            dot={{ r: 3, fill: info.colors[1] }}
            hide={!activeLines.includes("stationary")}
          />
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

export default Chart3;
