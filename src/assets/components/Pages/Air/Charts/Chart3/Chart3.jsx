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
  const [mobileData, setMobileData] = useState(null);
  const [stationaryData, setStationaryData] = useState(null);
  const [mobileSubstances, setMobileSubstances] = useState([]);
  const [stationarySources, setStationarySources] = useState([]);
  const [selectedMobileSubstance, setSelectedMobileSubstance] = useState(null);
  const [selectedStationarySource, setSelectedStationarySource] =
    useState(null);
  const [activeLines, setActiveLines] = useState(["mobile", "stationary"]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

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
    }),
    [chartInfo]
  );

  // Fetch mobile data (transport-emissions)
  useEffect(() => {
    const fetchMobileData = async () => {
      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(info.mobileId, info.types[0], language),
          commonData(info.mobileId, info.types[1], language),
        ]);

        const substanceList =
          metaDataResult.data.metadata.variables[0].valueTexts
            .map((name, id) => ({ name, id }))
            .filter((_, i) => [0, 1, 2, 7].includes(i));

        const yearList =
          metaDataResult.data.metadata.variables[1].valueTexts.map(
            (year, id) => ({ year, id })
          );

        const transformed = [];

        dataResult.data.data.forEach((yearObj) => {
          const yearId = parseInt(yearObj.year);
          const yearName =
            yearList.find((y) => y.id === yearId)?.year || yearId;

          Object.keys(yearObj).forEach((key) => {
            if (key === "year") return;

            const substanceId = parseInt(key);
            if (isNaN(substanceId) || ![0, 1, 2, 7].includes(substanceId))
              return;

            const substanceName =
              substanceList.find((s) => s.id === substanceId)?.name ||
              `Substance ${substanceId}`;

            transformed.push({
              substance: substanceName,
              year: parseInt(yearName),
              value: parseFloat(yearObj[key]) || 0,
              type: "mobile",
            });
          });
        });

        setMobileSubstances(substanceList);
        setSelectedMobileSubstance(substanceList[0]?.name || null);
        setMobileData(transformed);
      } catch (error) {
        console.log("Error fetching mobile data:", error);
        setError("Failed to load mobile data. Please try again.");
      }
    };

    fetchMobileData();
  }, [info.mobileId, language, info.types]);

  // Fetch stationary data (stationary-source-pollution)
  useEffect(() => {
    const fetchStationaryData = async () => {
      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(info.stationaryId, info.types[0], language),
          commonData(info.stationaryId, info.types[1], language),
        ]);

        const sourceListUnordered =
          metaDataResult.data.metadata.variables[0].valueTexts
            .map((name, id) => ({ name, id }))
            .filter((s) => [4, 5, 6, 3].includes(s.id));

        // Reorder sourceList to ensure id: 3 is last
        const desiredOrder = [4, 5, 6, 3];
        const sourceList = desiredOrder
          .map((id) => sourceListUnordered.find((s) => s.id === id))
          .filter((item) => item !== undefined);

        const yearList =
          metaDataResult.data.metadata.variables[1].valueTexts.map(
            (year, id) => ({ year, id })
          );

        const transformed = [];

        dataResult.data.data.forEach((yearObj) => {
          const yearId = parseInt(yearObj.year);
          const yearName =
            yearList.find((y) => y.id === yearId)?.year || yearId;

          Object.keys(yearObj).forEach((key) => {
            if (key === "year") return;

            const sourceId = parseInt(key);
            if (isNaN(sourceId) || ![4, 5, 6, 3].includes(sourceId)) return;

            const sourceName =
              sourceList.find((s) => s.id === sourceId)?.name ||
              `Source ${sourceId}`;

            transformed.push({
              source: sourceName,
              year: parseInt(yearName),
              value: parseFloat(yearObj[key]) || 0,
              type: "stationary",
            });
          });
        });

        setStationarySources(sourceList);
        setSelectedStationarySource(sourceList[0]?.name || null);
        setStationaryData(transformed);
      } catch (error) {
        console.log("Error fetching stationary data:", error);
        setError("Failed to load stationary data. Please try again.");
      }
    };

    fetchStationaryData();
  }, [info.stationaryId, language, info.types]);

  // Handle loading state management
  useEffect(() => {
    if (mobileData !== null && stationaryData !== null) {
      setIsLoading(false);
    }
  }, [mobileData, stationaryData]);

  // Initialize activeLines when data is loaded
  useEffect(() => {
    if (mobileData && stationaryData) {
      setActiveLines(["mobile", "stationary"]);
    }
  }, [mobileData, stationaryData]);

  // Combined and filtered data for chart
  const chartData = useMemo(() => {
    if (
      !mobileData ||
      !stationaryData ||
      !selectedMobileSubstance ||
      !selectedStationarySource
    )
      return [];

    const mobileFiltered = mobileData
      .filter(
        (d) => d.substance === selectedMobileSubstance && d.type === "mobile"
      )
      .map((d) => ({ ...d, key: "mobile" }));

    const stationaryFiltered = stationaryData
      .filter(
        (d) => d.source === selectedStationarySource && d.type === "stationary"
      )
      .map((d) => ({ ...d, key: "stationary", substance: d.source }));

    const years = [
      ...new Set([
        ...mobileFiltered.map((d) => d.year),
        ...stationaryFiltered.map((d) => d.year),
      ]),
    ]
      .filter((year) => year >= 2010 && year <= 2022)
      .sort((a, b) => a - b);

    const merged = years.map((year) => ({
      year,
      mobile: mobileFiltered.find((d) => d.year === year)?.value || 0,
      stationary: stationaryFiltered.find((d) => d.year === year)?.value || 0,
    }));

    return merged;
  }, [
    mobileData,
    stationaryData,
    selectedMobileSubstance,
    selectedStationarySource,
  ]);

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

  // Show empty state if no data or no substances/sources
  if (
    !mobileData ||
    mobileData.length === 0 ||
    !stationaryData ||
    stationaryData.length === 0 ||
    mobileSubstances.length === 0 ||
    stationarySources.length === 0 ||
    chartData.length === 0
  ) {
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
              {language === "ge"
                ? "მონაცემები არ მოიძებნა"
                : "No data to download"}
            </div>
          </div>
        </div>
        <div className="city-list">
          {mobileSubstances.map((s) => (
            <span
              key={`mobile-${s.id}`}
              className={`city-item ${
                selectedMobileSubstance === s.name ? "active" : ""
              }`}
              onClick={() => handleMobileSelection(s.name)}>
              {s.name}
            </span>
          ))}
        </div>
        <div className="empty-state">
          <p>
            {language === "ge" ? "მონაცემები არ მოიძებნა" : "No data available"}
          </p>
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

  // Handle mobile substance selection and auto-select corresponding stationary source
  const handleMobileSelection = (substanceName) => {
    setSelectedMobileSubstance(substanceName);
    const selectedMobileIndex = mobileSubstances.find(
      (s) => s.name === substanceName
    )?.id;
    const indexMapping = { 0: 4, 1: 5, 2: 6, 7: 3 };
    const stationaryIndex = indexMapping[selectedMobileIndex];
    const stationaryName = stationarySources.find(
      (s) => s.id === stationaryIndex
    )?.name;
    setSelectedStationarySource(stationaryName || null);
  };

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
            data={chartData}
            unit={info[`unit_${language}`]}
            filename={info[`title_${language}`]}
            isChart3={true}
            source={selectedStationarySource}
          />
        </div>
      </div>

      {/* Mobile Sources Selector */}
      <div className="city-list">
        {mobileSubstances.map((s) => (
          <span
            key={`mobile-${s.id}`}
            className={`city-item ${
              selectedMobileSubstance === s.name ? "active" : ""
            }`}
            onClick={() => handleMobileSelection(s.name)}>
            {s.name}
          </span>
        ))}
      </div>

      {/* Stationary Sources - Hidden selector, auto-selected based on mobile selection */}

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
