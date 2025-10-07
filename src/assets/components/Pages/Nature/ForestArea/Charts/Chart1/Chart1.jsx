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
import YearDropdown from "../../../../../YearDropdown/YearDropdown";
import Download from "../Download/Download";
import GeorgiaMap from "../../GeorgiaMap/GeorgiaMap";

const Chart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [forestData, setForestData] = useState(null);
  const [substanceList, setSubstanceList] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [activeLines, setActiveLines] = useState(["forestData"]);

  const [year, setYear] = useState(2023);
  const [years, setYears] = useState([]);

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      unit_ge: "კუბური მეტრი / ჰექტარი",
      unit_en: "Cubic meter / Hectare",
      colors: ["#63b8e9ff", "#e75816ff", "#28a745", "#ff6b35"],
      svg: Svg(),
      apiIds: [
        "felled-timber-volume",
        "illegal-logging",
        "forest-planting-recovery",
      ],
      types: ["data", "metadata"],
      substanceTitles: [
        "ტყის ჭრით მიღებული ხე-ტყის მოცულობა",
        "ტყის უკანონო ჭრა",
        "ტყის თესვა და დარგვა",
        "ტყის ბუნებრივი განახლებისთვის ხელშეწყობა",
      ],
    }),
    [chartInfo]
  );

  // Fetch forest data from multiple APIs
  useEffect(() => {
    const getForestData = async () => {
      // Create substance list - include all 4 forest data types
      const substanceHeaders = [
        { name: info.substanceTitles[0], id: 0, apiIndex: 0 }, // Felled timber
        { name: info.substanceTitles[1], id: 1, apiIndex: 1 }, // Illegal logging
        { name: info.substanceTitles[2], id: 2, apiIndex: 2 }, // Forest planting
        { name: info.substanceTitles[3], id: 3, apiIndex: 2 }, // Forest recovery
      ];

      // Always set substance headers first so UI elements appear
      setSubstanceList(substanceHeaders);
      setSelectedSubstance(substanceHeaders[0]?.name || null);

      // Fetch data from all 3 APIs with individual error handling
      const allData = [];

      for (let i = 0; i < info.apiIds.length; i++) {
        const apiId = info.apiIds[i];
        
        try {
          const [dataResult, metaDataResult] = await Promise.all([
            commonData(apiId, info.types[0], language),
            commonData(apiId, info.types[1], language),
          ]);

          // Check if we got valid data
          if (!dataResult?.data?.data) {
            console.warn(`Invalid data structure for ${apiId}`);
            continue;
          }

          // Handle different API structures
          let yearList = [];
          if (apiId === "forest-planting-recovery") {
            // For forest-planting-recovery, years are directly in the data objects
            yearList = dataResult.data.data.map(item => ({ year: item.year.toString(), id: item.year }));
          } else {
            // For other APIs, use metadata structure
            if (!metaDataResult?.data?.metadata) {
              console.warn(`Invalid metadata structure for ${apiId}`);
              continue;
            }
            yearList = metaDataResult.data.metadata.variables[1].valueTexts.map(
              (year, id) => ({ year, id })
            );
          }

          dataResult.data.data.forEach((yearObj) => {
            const yearId = parseInt(yearObj.year);
            const yearName = yearList.find((y) => y.id === yearId)?.year || yearId;

            if (apiId === "forest-planting-recovery") {
              // Handle forest-planting-recovery API structure
              // Process planting data (even categories: 0,2,4,6,8,10,12,14,16,18,20,22,24)
              const plantingCategories = [0,2,4,6,8,10,12,14,16,18,20,22,24];
              const recoveryCategories = [1,3,5,7,9,11,13,15,17,19,21,23,25];
              
              // Sum up all planting values for this year
              let plantingTotal = 0;
              let recoveryTotal = 0;
              
              plantingCategories.forEach(cat => {
                plantingTotal += parseFloat(yearObj[cat.toString()]) || 0;
              });
              
              recoveryCategories.forEach(cat => {
                recoveryTotal += parseFloat(yearObj[cat.toString()]) || 0;
              });
              
              // Add planting data
              allData.push({
                substance: substanceHeaders[2].name, // ტყის თესვა და დარგვა
                year: parseInt(yearName),
                value: plantingTotal,
                id: 2,
              });
              
              // Add recovery data
              allData.push({
                substance: substanceHeaders[3].name, // ტყის ბუნებრივი განახლებისთვის ხელშეწყობა
                year: parseInt(yearName),
                value: recoveryTotal,
                id: 3,
              });
            } else {
              // Handle regular API structure for felled-timber and illegal-logging
              Object.keys(yearObj).forEach((key) => {
                if (key === "year") return;

                const value = parseFloat(yearObj[key]) || 0;

                // Map data to substance headers based on API
                if (i === 0) {
                  // felled-timber-volume - ტყის ჭრით მიღებული ხე-ტყის მოცულობა
                  allData.push({
                    substance: substanceHeaders[0].name,
                    year: parseInt(yearName),
                    value: value,
                    id: 0,
                  });
                } else if (i === 1) {
                  // illegal-logging
                  allData.push({
                    substance: substanceHeaders[1].name,
                    year: parseInt(yearName),
                    value: value,
                    id: 1,
                  });
                }
              });
            }
          });
        } catch (error) {
          console.error(`Error fetching data for ${apiId}:`, error);
          // Continue with other APIs even if one fails
        }
      }
      
      setForestData(allData);
      
      // Extract unique years from the data for YearDropdown
      const uniqueYears = [...new Set(allData.map(item => item.year))]
        .sort((a, b) => b - a); // Sort descending (newest first)
      setYears(uniqueYears);
    };

    getForestData();
  }, [info.apiIds, language, info.types, info.substanceTitles]);

  // Combined and filtered data for chart
  const chartData = useMemo(() => {
    if (!forestData || !selectedSubstance) return [];

    const filtered = forestData.filter(
      (d) => d.substance === selectedSubstance
    );

    const years = [...new Set(filtered.map((d) => d.year))].sort(
      (a, b) => a - b
    );

    const merged = years.map((year) => ({
      year,
      forestData: filtered.find((d) => d.year === year)?.value || 0,
    }));

    return merged;
  }, [forestData, selectedSubstance]);

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

  // Handle substance selection
  const handleSubstanceSelection = (substanceName) => {
    setSelectedSubstance(substanceName);
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
          <YearDropdown years={years} year={year} setYear={setYear} />
          <Download
            data={chartData}
            unit={info[`unit_${language}`]}
            filename={info[`title_${language}`]}
            isChart1={true}
            source={selectedSubstance}
          />
        </div>
      </div>

      {/* Forest Data Selector */}
      <div className="city-list">
        {substanceList.map((s) => (
          <span
            key={`forest-${s.id}`}
            className={`city-item ${
              selectedSubstance === s.name ? "active" : ""
            }`}
            onClick={() => handleSubstanceSelection(s.name)}
          >
            {s.name}
          </span>
        ))}
      </div>

      {/* Georgia Map */}
      <div
        className="map-container"
        style={{
          marginTop: "40px",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <GeorgiaMap selectedYear={year} selectedSubstance={selectedSubstance} />
      </div>
    </div>
  );
};

export default Chart1;
