import { useLayoutEffect, useState, useMemo, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_georgiaHigh from "@amcharts/amcharts5-geodata/georgiaLow";
import commonData from "../../../../../fetchFunctions/commonData";
import "./GeorgiaMap.scss";

const GeorgiaMap = ({ selectedYear = 2023, selectedSubstance = null }) => {
  const { language } = useParams();
  const selectedRegion = null; // Click functionality disabled - no region selection
  const [hoveredRegion, setHoveredRegion] = useState(null); // Only for hover tracking
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [apiData, setApiData] = useState(null);

  // Refs to store amCharts objects and prevent unnecessary re-renders
  const rootRef = useRef(null);
  const chartRef = useRef(null);
  const polygonSeriesRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Static region mapping with names in both languages
  const regionMapping = useMemo(
    () => [
      { id: "GE-TB", name_ge: "თბილისი", name_en: "Tbilisi" },
      { id: "GE-AB", name_ge: "აფხაზეთი", name_en: "Abkhazia" },
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
      { id: "GE-MM", name_ge: "მცხეთა-მთიანეთი", name_en: "Mtskheta-Mtianeti" },
      { id: "GE-KK", name_ge: "ქვემო ქართლი", name_en: "Kvemo Kartli" },
      { id: "GE-SK", name_ge: "შიდა ქართლი", name_en: "Shida Kartli" },
      {
        id: "GE-SZ",
        name_ge: "სამეგრელო-ზემო სვანეთი",
        name_en: "Samegrelo-Zemo Svaneti",
      },
    ],
    []
  );

  // Map substance names to API IDs
  const substanceToApiId = useMemo(() => {
    if (language === "en") {
      return {
        "Number of Fire Incidents, Units": "forest-fires",
        "Fire Covered Area, Hectares": "forest-fires",
      };
    } else {
      return {
        "ხანძრის შემთხვევათა რაოდენობა, ერთეული": "forest-fires",
        "ხანძრის მოცული ფართობი, ჰექტარი": "forest-fires",
      };
    }
  }, [language]);

  // Fetch API data based on selected substance
  useEffect(() => {
    const getApiData = async () => {
      if (!selectedSubstance) {
        try {
          const [dataResult, metaDataResult] = await Promise.all([
            commonData("forest-fires", "data", language),
            commonData("forest-fires", "metadata", language),
          ]);
          setApiData({ data: dataResult, metadata: metaDataResult });
        } catch (error) {
          console.error("Error fetching default timber data:", error);
        }
        return;
      }

      const apiId = substanceToApiId[selectedSubstance];
      if (!apiId) {
        console.warn(
          `No API mapping found for substance: ${selectedSubstance}`
        );
        return;
      }

      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData(apiId, "data", language),
          commonData(apiId, "metadata", language),
        ]);
        setApiData({ data: dataResult, metadata: metaDataResult });
      } catch (error) {
        console.error(`Error fetching data for ${apiId}:`, error);
      }
    };

    getApiData();
  }, [language, selectedSubstance, substanceToApiId, selectedYear]);

  // Process regions data with API values (unchanged)
  const regions = useMemo(() => {
    if (!apiData) {
      return regionMapping.map((region) => ({
        ...region,
        value: 0,
        name: language === "en" ? region.name_en : region.name_ge,
      }));
    }

    try {
      let yearData = null;
      const dataArray = apiData.data.data.data;

      if (dataArray && Array.isArray(dataArray)) {
        const yearObj = dataArray.find((item) => {
          return parseInt(item.year) === selectedYear;
        });

        if (yearObj) {
          yearData = yearObj;
        } else {
          const mostRecentObj = dataArray[dataArray.length - 1];
          if (mostRecentObj) {
            yearData = mostRecentObj;
          }
        }
      } else {
        console.error("Data array not found or not an array:", dataArray);
      }

      // Forest fires API has special structure with region-category combinations
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

      return regionMapping.map((region) => {
        let value = 0;
        if (yearData) {
          const apiRegionId = regionIdMapping[region.id];
          if (apiRegionId && typeof apiRegionId === "object") {
            let fireKey;

            // Determine which data to show based on selected substance
            if (
              selectedSubstance === "ხანძრის შემთხვევათა რაოდენობა, ერთეული" ||
              selectedSubstance === "Number of Fire Incidents, Units"
            ) {
              fireKey = apiRegionId.incidents;
            } else if (
              selectedSubstance === "ხანძრის მოცული ფართობი, ჰექტარი" ||
              selectedSubstance === "Fire Covered Area, Hectares"
            ) {
              fireKey = apiRegionId.area;
            }

            if (
              fireKey &&
              fireKey !== "-2" &&
              yearData[fireKey] !== undefined
            ) {
              value = parseFloat(yearData[fireKey]) || 0;
            }
          }
        }
        return {
          ...region,
          value,
          name: language === "en" ? region.name_en : region.name_ge,
        };
      });
    } catch (error) {
      console.error("Error processing API data:", error);
      return regionMapping.map((region) => ({
        ...region,
        value: 0,
        name: language === "en" ? region.name_en : region.name_ge,
      }));
    }
  }, [apiData, selectedYear, regionMapping, selectedSubstance, language]);

  // Get current hovered region data for dynamic tooltip
  const currentRegionData = useMemo(() => {
    return hoveredRegion
      ? regions.find((region) => region.id === hoveredRegion)
      : null;
  }, [regions, hoveredRegion]);

  // Initialize map only once, update data and states separately
  useLayoutEffect(() => {
    // Cleanup previous instance
    if (rootRef.current) {
      rootRef.current.dispose();
    }

    const root = am5.Root.new("georgia-map-container");
    rootRef.current = root;

    // Remove logo (ensure you have proper licensing)
    if (root._logo) {
      root._logo.dispose();
    }

    // Set root container size - responsive
    root.container.setAll({
      width: am5.percent(100),
      height: am5.percent(100),
      layout: root.verticalLayout,
    });

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "none",
        panY: "none",
        wheelX: "none",
        wheelY: "none",
        width: am5.percent(100),
        height: am5.percent(100),
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
      })
    );
    chartRef.current = chart;

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_georgiaHigh.default,
        valueField: "value",
        calculateAggregates: true,
      })
    );
    polygonSeriesRef.current = polygonSeries;

    // Set initial data
    const initialData = regions.map((region) => ({
      ...region,
      isSelected: region.id === selectedRegion,
      isHovered: region.id === hoveredRegion,
    }));
    polygonSeries.data.setAll(initialData);

    // Define base appearance
    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "",
      interactive: true, // Keep hover effects but click is disabled
      fill: am5.color(0x6ba3d6),
      stroke: am5.color(0xffffff),
      strokeWidth: 0.5,
      strokeOpacity: 0.8,
    });

    // Create hover, focus, and selected states using amCharts built-in states
    // Remove the state variable declarations and apply directly
    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: am5.color(0x084e99), // Darker blue on hover
      fillOpacity: 1.0,
      strokeWidth: 2,
    });

    polygonSeries.mapPolygons.template.states.create("selected", {
      fill: am5.color(0x084e99), // Darker blue for selected
      fillOpacity: 1.0,
      strokeWidth: 3,
      stroke: am5.color(0xffffff),
    });

    polygonSeries.mapPolygons.template.states.create("default", {
      fill: am5.color(0x6ba3d6),
      fillOpacity: 0.6,
      strokeWidth: 1,
    });

    // Show value label on each region
    polygonSeries.mapPolygons.template.adapters.add(
      "labelText",
      (text, target) => {
        const value = target.dataItem?.dataContext?.value;
        return value != null ? String(value) : "";
      }
    );

    // Setup interactions - only once
    polygonSeries.mapPolygons.template.events.on("pointerover", (event) => {
      const data = event.target.dataItem?.dataContext;
      const regionId = data?.id;

      if (regionId && regionId !== selectedRegion) {
        setHoveredRegion(regionId);

        // Update tooltip position
        if (event.point) {
          setTooltipPosition({ x: event.point.x + 20, y: event.point.y - 50 });
        }
      }
    });

    polygonSeries.mapPolygons.template.events.on("pointerout", () => {
      setHoveredRegion(null);
    });

    // Click functionality disabled to prevent regions staying highlighted
    // polygonSeries.mapPolygons.template.events.on("click", (event) => {
    //   const data = event.target.dataItem?.dataContext;
    //   const regionId = data?.id;

    //   if (regionId) {
    //     // Toggle selection
    //     setSelectedRegion((prev) => (prev === regionId ? null : regionId));
    //     setHoveredRegion(null); // Clear hover when clicking
    //   }
    // });

    // Global mouse move for tooltip tracking
    polygonSeries.onPrivate("globalpointermove", (event) => {
      if (event.point && hoveredRegion) {
        setTooltipPosition({ x: event.point.x + 20, y: event.point.y - 50 });
      }
    });

    isInitializedRef.current = true;

    return () => {
      if (root) {
        root.dispose();
        rootRef.current = null;
        chartRef.current = null;
        polygonSeriesRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [regions, hoveredRegion, selectedRegion]); // Only recreate map when regions data changes

  // Separate effect to update data and selection states without recreating the map
  useLayoutEffect(() => {
    if (!isInitializedRef.current || !polygonSeriesRef.current) return;

    const currentData = regions.map((region) => ({
      ...region,
      isSelected: region.id === selectedRegion,
      isHovered: region.id === hoveredRegion,
    }));

    // Update data without recreating series
    polygonSeriesRef.current.data.setAll(currentData);

    // Update states for visual feedback
    polygonSeriesRef.current.mapPolygons.each((polygon) => {
      const dataContext = polygon.dataItem?.dataContext;
      const regionId = dataContext?.id;

      if (regionId) {
        if (regionId === selectedRegion) {
          // Apply selected state
          polygon.states.apply("selected");
        } else if (regionId === hoveredRegion) {
          // Apply hover state
          polygon.states.apply("hover");
        } else {
          // Apply normal state
          polygon.states.apply("default");
        }
      }
    });
  }, [selectedRegion, hoveredRegion, regions, polygonSeriesRef]); // Update states separately

  // Debounce tooltip position updates to prevent excessive re-renders
  useEffect(() => {
    if (!hoveredRegion) {
      setTooltipPosition({ x: 0, y: 0 });
      return;
    }
  }, [hoveredRegion]);

  // Handle window resize for responsive map
  useEffect(() => {
    const handleResize = () => {
      if (rootRef.current) {
        // Trigger amCharts resize
        rootRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="georgia-map-wrapper"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "1104px",
        height: "0",
        paddingBottom: "42.4%", // Aspect ratio: 468/1104 = 0.424
        background: "#ECF5FF",
        borderRadius: "16px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <div
        id="georgia-map-container"
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        }}
      ></div>

      {/* Dynamic Tooltip - only shows when hovering over a region */}
      {currentRegionData && hoveredRegion && (
        <div
          className="custom-tooltip"
          style={{
            position: "absolute",
            left: `${Math.min(tooltipPosition.x, window.innerWidth - 320)}px`,
            top: `${Math.max(tooltipPosition.y, 10)}px`,
            background: "#2D3748",
            borderRadius: window.innerWidth <= 480 ? "8px" : "12px",
            padding: window.innerWidth <= 480 ? "12px 16px" : "16px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "block",
            zIndex: 1000,
            minWidth:
              window.innerWidth <= 480
                ? "200px"
                : window.innerWidth <= 768
                ? "240px"
                : "280px",
            maxWidth: window.innerWidth <= 480 ? "250px" : "320px",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontFamily: "'FiraGO', Arial, sans-serif",
                fontSize: window.innerWidth <= 480 ? "12px" : "14px",
                fontWeight: 400,
                color: "#FFFFFF",
                lineHeight: "1.4",
                marginBottom: "4px",
              }}
            >
              {currentRegionData.name}
            </div>
            <div
              style={{
                fontFamily: "'FiraGO', Arial, sans-serif",
                fontSize:
                  window.innerWidth <= 480
                    ? "18px"
                    : window.innerWidth <= 768
                    ? "20px"
                    : "24px",
                fontWeight: 600,
                color: "#48BB78",
                lineHeight: "1.2",
              }}
            >
              {currentRegionData.id === "GE-AB" && currentRegionData.value === 0
                ? "-"
                : (() => {
                    // Determine unit based on selected substance
                    if (
                      selectedSubstance ===
                        "ხანძრის შემთხვევათა რაოდენობა, ერთეული" ||
                      selectedSubstance === "Number of Fire Incidents, Units"
                    ) {
                      // Fire incidents - show units/cases
                      return `${currentRegionData.value.toLocaleString()} ${
                        language === "en" ? "cases" : "შემთხვევა"
                      }`;
                    } else {
                      // Fire area - show hectares
                      return `${currentRegionData.value.toLocaleString()} ${
                        language === "en" ? "ha" : "ჰა"
                      }`;
                    }
                  })()}
            </div>
          </div>

          {/* Tooltip Arrow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "-8px",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
              borderRight: "8px solid #2D3748",
            }}
          ></div>
        </div>
      )}

      {/* Unused hover tooltip - can be removed */}
      <div
        id="custom-tooltip"
        style={{
          display: "none",
        }}
      />
    </div>
  );
};

export default GeorgiaMap;
