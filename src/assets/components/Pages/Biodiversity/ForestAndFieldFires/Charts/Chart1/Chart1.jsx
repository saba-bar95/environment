import { useEffect, useState, useMemo } from "react";
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../fetchFunctions/commonData";
import YearDropdown from "../../../../../YearDropdown/YearDropdown";
import Download from "../Download/Download";
import GeorgiaMap from "../../GeorgiaMap/GeorgiaMap";
import "../../../../../../../assets/styles/SpinnerAndError.scss";

const Chart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [forestData, setForestData] = useState(null);
  const [substanceList, setSubstanceList] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [year, setYear] = useState(2024);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const info = useMemo(
    () => ({
      title_ge: chartInfo.title_ge,
      title_en: chartInfo.title_en,
      unit_ge: "ერთეული / ჰექტარი",
      unit_en: "Units / Hectares",
      colors: ["#63b8e9ff", "#e75816ff"],
      svg: Svg(),
      apiIds: ["forest-fires"],
      types: ["data", "metadata"],
      substanceTitles_ge: [
        "ხანძრის შემთხვევათა რაოდენობა, ერთეული",
        "ხანძრის მოცული ფართობი, ჰექტარი",
      ],
      substanceTitles_en: [
        "Number of Fire Incidents, Units",
        "Fire Covered Area, Hectares",
      ],
    }),
    [chartInfo]
  );

  // Fetch forest data from multiple APIs
  useEffect(() => {
    const getForestData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Create substance list - include forest fire data types
        const substanceTitles =
          language === "en" ? info.substanceTitles_en : info.substanceTitles_ge;
        const substanceHeaders = [
          { name: substanceTitles[0], id: 0, apiIndex: 0 }, // Fire incidents
          { name: substanceTitles[1], id: 1, apiIndex: 0 }, // Fire area
        ];

        // Always set substance headers first so UI elements appear
        setSubstanceList(substanceHeaders);
        setSelectedSubstance(substanceHeaders[0]?.name || null);

        // Fetch data from forest-fires API
        const allData = [];
        const apiId = "forest-fires";

        try {
          const [dataResult, metaDataResult] = await Promise.all([
            commonData(apiId, info.types[0], language),
            commonData(apiId, info.types[1], language),
          ]);

          // Check if we got valid data
          if (!dataResult?.data?.data) {
            console.warn(`Invalid data structure for ${apiId}`);
          } else if (!metaDataResult?.data?.metadata) {
            console.warn(`Invalid metadata structure for ${apiId}`);
          } else {
            // Get year list from metadata
            const yearList =
              metaDataResult.data.metadata.variables[1].valueTexts.map(
                (year, id) => ({ year, id })
              );

            // Process forest-fires data structure
            dataResult.data.data.forEach((yearObj) => {
              const yearId = parseInt(yearObj.year);
              const yearName =
                yearList.find((y) => y.id === yearId)?.year || yearId;

              // Calculate totals for fire incidents (category 0) and fire area (category 1)
              let fireIncidents = 0;
              let fireArea = 0;

              // Sum up all regions for each category
              Object.keys(yearObj).forEach((key) => {
                if (key === "year") return;

                const [, categoryId] = key.split(" - ");
                const value = parseFloat(yearObj[key]) || 0;

                if (categoryId === "0") {
                  // Fire incidents (ხანძრის შემთხვევათა რაოდენობა)
                  fireIncidents += value;
                } else if (categoryId === "1") {
                  // Fire area (ხანძრის მოცული ფართობი)
                  fireArea += value;
                }
              });

              // Add fire incidents data
              allData.push({
                substance: substanceHeaders[0].name,
                year: parseInt(yearName),
                value: fireIncidents,
                id: 0,
              });

              // Add fire area data
              allData.push({
                substance: substanceHeaders[1].name,
                year: parseInt(yearName),
                value: fireArea,
                id: 1,
              });
            });
          }
        } catch (error) {
          console.error(`Error fetching data for ${apiId}:`, error);
        }

        setForestData(allData);

        // Extract unique years from the data for YearDropdown
        const uniqueYears = [...new Set(allData.map((item) => item.year))].sort(
          (a, b) => a - b
        ); // Sort ascending (YearDropdown will reverse to show newest first)
        setYears(uniqueYears);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching forest data:", error);
        setError(
          language === "ge"
            ? "მონაცემების ჩატვირთვისას მოხდა შეცდომა"
            : "Error loading data"
        );
        setIsLoading(false);
      }
    };

    getForestData();
  }, [
    info.apiIds,
    language,
    info.types,
    info.substanceTitles_ge,
    info.substanceTitles_en,
  ]);

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

  // Prepare comprehensive map data for download
  const [mapDataForDownload, setMapDataForDownload] = useState([]);

  // Fetch comprehensive regional data for download
  useEffect(() => {
    if (!selectedSubstance) return;

    const fetchMapData = async () => {
      const regionMapping = [
        { id: "GE-TB", name_ge: "თბილისი", name_en: "Tbilisi" },
        { id: "GE-AJ", name_ge: "აჭარა", name_en: "Adjara" },
        { id: "GE-KA", name_ge: "კახეთი", name_en: "Kakheti" },
        { id: "GE-IM", name_ge: "იმერეთი", name_en: "Imereti" },
        {
          id: "GE-RL",
          name_ge: "რაჭა-ლეჩხუმი და ქვემო სვანეთი",
          name_en: "Racha-Lechkhumi and Kvemo Svaneti",
        },
        { id: "GE-GU", name_ge: "გურია", name_en: "Guria" },
        {
          id: "GE-SJ",
          name_ge: "სამცხე-ჯავახეთი",
          name_en: "Samtskhe-Javakheti",
        },
        {
          id: "GE-MM",
          name_ge: "მცხეთა-მთიანეთი",
          name_en: "Mtskheta-Mtianeti",
        },
        { id: "GE-KK", name_ge: "ქვემო ქართლი", name_en: "Kvemo Kartli" },
        { id: "GE-SK", name_ge: "შიდა ქართლი", name_en: "Shida Kartli" },
        {
          id: "GE-SZ",
          name_ge: "სამეგრელო-ზემო სვანეთი",
          name_en: "Samegrelo-Zemo Svaneti",
        },
      ];

      // Get API ID for the selected substance - all use forest-fires
      const substanceToApiId = {
        "ხანძრის შემთხვევათა რაოდენობა, ერთეული": "forest-fires",
        "ხანძრის მოცული ფართობი, ჰექტარი": "forest-fires",
        "Number of Fire Incidents, Units": "forest-fires",
        "Fire Covered Area, Hectares": "forest-fires",
      };

      const apiId = substanceToApiId[selectedSubstance];
      if (!apiId) return;

      try {
        const [dataResult] = await Promise.all([
          commonData(apiId, "data", language),
        ]);

        const comprehensiveData = [];

        // Process data for each year and region
        if (dataResult?.data?.data) {
          const dataArray = dataResult.data.data;

          dataArray.forEach((yearData) => {
            const yearValue = yearData.year;

            regionMapping.forEach((region) => {
              let value = 0;

              // Forest-fires API regional mapping logic
              const regionIdMapping = {
                "GE-TB": { incidents: "1 - 0", area: "1 - 1" }, // Tbilisi
                "GE-AB": { incidents: "-2", area: "-2" }, // Abkhazia (no data)
                "GE-AJ": { incidents: "2 - 0", area: "2 - 1" }, // Adjara
                "GE-SZ": { incidents: "12 - 0", area: "12 - 1" }, // Samegrelo-Zemo Svaneti
                "GE-GU": { incidents: "3 - 0", area: "3 - 1" }, // Guria
                "GE-IM": { incidents: "4 - 0", area: "4 - 1" }, // Imereti
                "GE-RL": { incidents: "7 - 0", area: "7 - 1" }, // Racha-Lechkhumi
                "GE-SK": { incidents: "10 - 0", area: "10 - 1" }, // Shida Kartli
                "GE-MM": { incidents: "6 - 0", area: "6 - 1" }, // Mtskheta-Mtianeti
                "GE-KA": { incidents: "5 - 0", area: "5 - 1" }, // Kakheti
                "GE-KK": { incidents: "11 - 0", area: "11 - 1" }, // Kvemo Kartli
                "GE-SJ": { incidents: "9 - 0", area: "9 - 1" }, // Samtskhe-Javakheti
              };

              const mappingKey = regionIdMapping[region.id];
              if (mappingKey && mappingKey.incidents !== "-2") {
                let dataKey;
                if (
                  selectedSubstance ===
                    "ხანძრის შემთხვევათა რაოდენობა, ერთეული" ||
                  selectedSubstance === "Number of Fire Incidents, Units"
                ) {
                  dataKey = mappingKey.incidents;
                } else if (
                  selectedSubstance === "ხანძრის მოცული ფართობი, ჰექტარი" ||
                  selectedSubstance === "Fire Covered Area, Hectares"
                ) {
                  dataKey = mappingKey.area;
                }

                if (dataKey && yearData[dataKey] !== undefined) {
                  value = parseFloat(yearData[dataKey]) || 0;
                }
              }

              comprehensiveData.push({
                region: language === "en" ? region.name_en : region.name_ge,
                year: yearValue,
                value: value,
                substance: selectedSubstance,
                unit: language === "ge" ? info.unit_ge : info.unit_en,
              });
            });
          });
        }

        setMapDataForDownload(comprehensiveData);
      } catch (error) {
        console.error("Error fetching map data for download:", error);
      }
    };

    fetchMapData();
  }, [selectedSubstance, language, info.unit_ge, info.unit_en]);

  // Track window width for responsive styling
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle substance selection
  const handleSubstanceSelection = (substanceName) => {
    setSelectedSubstance(substanceName);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="chart-wrapper"
        id={chartInfo.id}
        style={{ minWidth: "1000px" }}>
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
      <div
        className="chart-wrapper"
        id={chartInfo.id}
        style={{ minWidth: "1000px" }}>
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

  return (
    <div
      className="chart-wrapper"
      id={chartInfo.chartID}
      style={windowWidth > 1024 ? { minWidth: "1000px" } : {}}>
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
            mapData={mapDataForDownload}
            unit={info[`unit_${language}`]}
            filename={info[`title_${language}`]}
            isChart1={true}
            isMapData={true}
            source={selectedSubstance}
            year={year}
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
            onClick={() => handleSubstanceSelection(s.name)}>
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
        }}>
        <GeorgiaMap selectedYear={year} selectedSubstance={selectedSubstance} />
      </div>
    </div>
  );
};

export default Chart1;
