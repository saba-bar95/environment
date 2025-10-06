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
import commonData from "../../../../../../fetchFunctions/commonData";
import Download from "../Download/Download";

const Chart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [mobileData, setMobileData] = useState(null);
  const [stationaryData, setStationaryData] = useState(null);
  const [mobileSubstances, setMobileSubstances] = useState([]);
  const [stationarySources, setStationarySources] = useState([]);
  const [selectedMobileSubstance, setSelectedMobileSubstance] = useState(null);
  const [selectedStationarySource, setSelectedStationarySource] =
    useState(null);
  const [activeLines, setActiveLines] = useState(["mobile", "stationary"]);

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      unit_ge: "ათასი ტონა",
      unit_en: "Thousand Tonnes",
      colors: ["#63b8e9ff", "#e75816ff"],
      svg: Svg(),
      mobileId: "felled-timber-volume",
      stationaryId: "illegal-logging",
      types: ["data", "metadata"],
    }),
    [chartInfo]
  );

  // Fetch mobile data (felled-timber-volume)
  useEffect(() => {
    const getMobileData = async () => {
      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(info.mobileId, info.types[0], language),
          commonData(info.mobileId, info.types[1], language),
        ]);

        const substanceList =
          metaDataResult.data.metadata.variables[0].valueTexts
            .map((name, id) => ({ name, id }))
            .filter((_, i) => [0, 1, 2, 7].includes(i));

        console.log(substanceList);

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
      }
    };

    getMobileData();
  }, [info.mobileId, language, info.types]);

  // Fetch stationary data (stationary-source-pollution)
  useEffect(() => {
    const getStationaryData = async () => {
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
      }
    };

    getStationaryData();
  }, [info.stationaryId, language, info.types]);

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
    ].sort((a, b) => a - b);

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

  const CustomLegend = ({ payload }) => (
    <ul className="recharts-default-legend">
      {payload.map((entry, index) => (
        <li
          key={`legend-item-${index}`}
          className={`recharts-legend-item legend-item-${index} ${
            activeLines.includes(entry.dataKey) ? "active" : "inactive"
          }`}
          onClick={() => toggleLine(entry.dataKey)}
        >
          <span
            className="recharts-legend-item-icon"
            style={{ backgroundColor: entry.color }}
          ></span>
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
            {label} {language === "en" ? "Year" : "წელი"}{" "}
          </p>
          {payload.map(({ name, value, stroke }, index) => (
            <p key={`item-${index}`} className="text">
              <span
                style={{ backgroundColor: stroke }}
                className="before-span"
              ></span>
              {name} :
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
    <div className="chart-wrapper" id={chartInfo.id}>
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
            isChart1={true}
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
            onClick={() => handleMobileSelection(s.name)}
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Stationary Sources - Hidden selector, auto-selected based on mobile selection */}

      <ResponsiveContainer width="100%" height={460}></ResponsiveContainer>
    </div>
  );
};

export default Chart1;
