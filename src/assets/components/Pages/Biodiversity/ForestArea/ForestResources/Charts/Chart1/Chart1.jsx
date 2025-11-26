import { useEffect, useState, useMemo } from "react";
import Svg from "./Svg";
import { useParams } from "react-router-dom";
import commonData from "../../../../../../../fetchFunctions/commonData";
import YearDropdown from "../../../../../../YearDropdown/YearDropdown";
import Download from "../Download/Download";
import GeorgiaMap from "../../GeorgiaMap/GeorgiaMap";
import "../../../../../../../../assets/styles/SpinnerAndError.scss";

const Chart1 = ({ chartInfo }) => {
  const { language } = useParams();
  const [forestData, setForestData] = useState(null);
  const [substanceList, setSubstanceList] = useState([]);
  const [selectedSubstance, setSelectedSubstance] = useState(null);
  const [year, setYear] = useState(2024);
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      substanceTitles_ge: [
        "ტყის ჭრით მიღებული ხე-ტყის მოცულობა",
        "ტყის უკანონო ჭრა",
        "ტყის თესვა და დარგვა",
        "ტყის ბუნებრივი განახლებისთვის ხელშეწყობა",
      ],
      substanceTitles_en: [
        "Felled Timber Volume",
        "Illegal Logging",
        "Forest Planting",
        "Forest Recovery Support",
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

        // Create substance list - include all 4 forest data types
        const substanceTitles =
          language === "en" ? info.substanceTitles_en : info.substanceTitles_ge;
        const substanceHeaders = [
          { name: substanceTitles[0], id: 0, apiIndex: 0 }, // Felled timber
          { name: substanceTitles[1], id: 1, apiIndex: 1 }, // Illegal logging
          { name: substanceTitles[2], id: 2, apiIndex: 2 }, // Forest planting
          { name: substanceTitles[3], id: 3, apiIndex: 2 }, // Forest recovery
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
              yearList = dataResult.data.data.map((item) => ({
                year: item.year.toString(),
                id: item.year,
              }));
            } else {
              // For other APIs, use metadata structure
              if (!metaDataResult?.data?.metadata) {
                console.warn(`Invalid metadata structure for ${apiId}`);
                continue;
              }
              yearList =
                metaDataResult.data.metadata.variables[1].valueTexts.map(
                  (year, id) => ({ year, id })
                );
            }

            dataResult.data.data.forEach((yearObj) => {
              const yearId = parseInt(yearObj.year);
              const yearName =
                yearList.find((y) => y.id === yearId)?.year || yearId;

              if (apiId === "forest-planting-recovery") {
                // Handle forest-planting-recovery API structure
                // Process planting data (even categories: 0,2,4,6,8,10,12,14,16,18,20,22,24)
                const plantingCategories = [
                  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24,
                ];
                const recoveryCategories = [
                  1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25,
                ];

                // Sum up all planting values for this year
                let plantingTotal = 0;
                let recoveryTotal = 0;

                plantingCategories.forEach((cat) => {
                  plantingTotal += parseFloat(yearObj[cat.toString()]) || 0;
                });

                recoveryCategories.forEach((cat) => {
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

      // Get API ID for the selected substance
      const substanceToApiId = {
        "ტყის ჭრით მიღებული ხე-ტყის მოცულობა": "felled-timber-volume",
        "ტყის უკანონო ჭრა": "illegal-logging",
        "ტყის თესვა და დარგვა": "forest-planting-recovery",
        "ტყის ბუნებრივი განახლებისთვის ხელშეწყობა": "forest-planting-recovery",
        "Felled Timber Volume": "felled-timber-volume",
        "Illegal Logging": "illegal-logging",
        "Forest Planting": "forest-planting-recovery",
        "Forest Recovery Support": "forest-planting-recovery",
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

              // Regional mapping logic (same as in GeorgiaMap)
              if (apiId === "forest-planting-recovery") {
                const regionIdMapping = {
                  "GE-TB": { planting: 2, recovery: 3 },
                  "GE-AJ": { planting: 4, recovery: 5 },
                  "GE-GU": { planting: 6, recovery: 7 },
                  "GE-IM": { planting: 8, recovery: 9 },
                  "GE-KA": { planting: 10, recovery: 11 },
                  "GE-MM": { planting: 12, recovery: 13 },
                  "GE-RL": { planting: 14, recovery: 15 },
                  "GE-SZ": { planting: 16, recovery: 17 },
                  "GE-SJ": { planting: 18, recovery: 19 },
                  "GE-KK": { planting: 20, recovery: 21 },
                  "GE-SK": { planting: 22, recovery: 23 },
                };

                const mappingKey = regionIdMapping[region.id];
                if (mappingKey) {
                  let categoryKey;
                  if (
                    selectedSubstance === "ტყის თესვა და დარგვა" ||
                    selectedSubstance === "Forest Planting"
                  ) {
                    categoryKey = mappingKey.planting;
                  } else if (
                    selectedSubstance ===
                      "ტყის ბუნებრივი განახლებისთვის ხელშეწყობა" ||
                    selectedSubstance === "Forest Recovery Support"
                  ) {
                    categoryKey = mappingKey.recovery;
                  }

                  if (categoryKey >= 0) {
                    value = parseFloat(yearData[categoryKey.toString()]) || 0;
                  }
                }
              } else {
                // Regular APIs (felled-timber-volume, illegal-logging)
                const regionIdMapping = {
                  "GE-TB": 1,
                  "GE-AJ": 2,
                  "GE-SZ": 3,
                  "GE-GU": 4,
                  "GE-IM": 5,
                  "GE-RL": 6,
                  "GE-SK": 7,
                  "GE-MM": 8,
                  "GE-KA": 9,
                  "GE-KK": 10,
                  "GE-SJ": 11,
                };

                const apiRegionId = regionIdMapping[region.id];
                if (apiRegionId >= 0) {
                  value = parseFloat(yearData[apiRegionId.toString()]) || 0;
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

  // Handle substance selection
  const handleSubstanceSelection = (substanceName) => {
    setSelectedSubstance(substanceName);
  };

  // Show loading state
  if (isLoading) {
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
