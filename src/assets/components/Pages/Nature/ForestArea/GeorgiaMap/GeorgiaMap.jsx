import { useLayoutEffect, useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_georgiaHigh from "@amcharts/amcharts5-geodata/georgiaLow";
import commonData from "../../../../../fetchFunctions/commonData";

const GeorgiaMap = ({ selectedYear = 2023 }) => {
  const { language } = useParams();
  const [highlightedRegion, setHighlightedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [apiData, setApiData] = useState(null);

  // Static region mapping with names
  const regionMapping = useMemo(
    () => [
      { id: "GE-TB", name: "თბილისი" },
      { id: "GE-AB", name: "აფხაზეთი" },
      { id: "GE-AJ", name: "აჭარა" },
      { id: "GE-KA", name: "კახეთი" },
      { id: "GE-IM", name: "იმერეთი" },
      { id: "GE-RL", name: "რაჭა-ლეჩხუმი და ქვემო სვანეთი" },
      { id: "GE-GU", name: "გურია" },
      { id: "GE-SJ", name: "სამცხე-ჯავახეთი" },
      { id: "GE-MM", name: "მცხეთა-მთიანეთი" },
      { id: "GE-KK", name: "ქვემო ქართლი" },
      { id: "GE-SK", name: "შიდა ქართლი" },
      { id: "GE-SZ", name: "სამეგრელო-ზემო სვანეთი" },
    ],
    []
  );

  // Fetch felled timber data from API
  useEffect(() => {
    const getFelledTimberData = async () => {
      try {
        const [dataResult, metaDataResult] = await Promise.all([
          commonData("felled-timber-volume", "data", language),
          commonData("felled-timber-volume", "metadata", language),
        ]);

        setApiData({ data: dataResult, metadata: metaDataResult });
      } catch (error) {
        console.error("Error fetching felled timber data:", error);
      }
    };

    getFelledTimberData();
  }, [language]);

  // Process regions data with API values
  const regions = useMemo(() => {
    if (!apiData) {
      // Return regions with default values while loading
      return regionMapping.map((region) => ({ ...region, value: 0 }));
    }

    try {
      const yearList =
        apiData.metadata.data.metadata.variables[1].valueTexts.map(
          (year, id) => ({ year, id })
        );

      // The actual data is in apiData.data.data.data (apiData.data is the response, apiData.data.data is the actual data array)
      let yearData = null;
      const dataArray = apiData.data.data.data; // Correct path to the data array

      if (dataArray && Array.isArray(dataArray)) {
        // Find the year object that matches selectedYear
        const yearObj = dataArray.find((item) => {
          const yearName = yearList.find(
            (y) => y.id === parseInt(item.year)
          )?.year;
          return parseInt(yearName) === selectedYear;
        });

        if (yearObj) {
          yearData = yearObj;
        } else {
          // Use the most recent available year as fallback
          const mostRecentObj = dataArray[dataArray.length - 1];
          if (mostRecentObj) {
            yearData = mostRecentObj;
          }
        }
      } else {
        console.error("Data array not found or not an array:", dataArray);
      }

      // Create a mapping of our region IDs to API region IDs
      // Based on the API categoryMapping structure you provided
      const regionIdMapping = {
        "GE-TB": 1, // თბილისი -> Tbilisi (index 1)
        "GE-AB": 0, // აფხაზეთი -> This seems to map to Georgia total, let's check logs
        "GE-AJ": 2, // აჭარა -> Adjara A/R (index 2)
        "GE-SZ": 3, // სამეგრელო-ზემო სვანეთი -> Samegrelo-Zemo Svaneti (index 3)
        "GE-GU": 4, // გურია -> Guria (index 4)
        "GE-IM": 5, // იმერეთი -> Imereti (index 5)
        "GE-RL": 6, // რაჭა-ლეჩხუმი და ქვემო სვანეთი -> Racha-Lechkhumi and Kvemo Svaneti (index 6)
        "GE-SK": 7, // შიდა ქართლი -> Shida Kartli (index 7)
        "GE-MM": 8, // მცხეთა-მთიანეთი -> Mtskheta-Mtianeti (index 8)
        "GE-KA": 9, // კახეთი -> Kakheti (index 9)
        "GE-KK": 10, // ქვემო ქართლი -> Kvemo Kartli (index 10)
        "GE-SJ": 11, // სამცხე-ჯავახეთი -> Samtskhe-Javakheti (index 11)
      };

      return regionMapping.map((region) => {
        let value = 0;
        if (yearData) {
          const apiRegionId = regionIdMapping[region.id];
          if (apiRegionId !== undefined) {
            // The yearData object has keys like "0", "1", "2", etc. representing region IDs
            const stringKey = apiRegionId.toString();
            const numberKey = apiRegionId;

            if (yearData[stringKey] !== undefined) {
              value = parseFloat(yearData[stringKey]) || 0;
            } else if (yearData[numberKey] !== undefined) {
              value = parseFloat(yearData[numberKey]) || 0;
            }
          }
        }
        return { ...region, value };
      });
    } catch (error) {
      console.error("Error processing API data:", error);
      return regionMapping.map((region) => ({ ...region, value: 0 }));
    }
  }, [apiData, selectedYear, regionMapping]);

  // Get current hovered region data for dynamic tooltip
  const currentRegionData = useMemo(() => {
    return hoveredRegion
      ? regions.find((region) => region.id === hoveredRegion)
      : null;
  }, [regions, hoveredRegion]);

  useLayoutEffect(() => {
    const root = am5.Root.new("georgia-map-container");

    // Set root container size to match design specifications
    root.container.setAll({
      width: 1104,
      height: 468,
      layout: root.verticalLayout,
    });

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "none", // disable horizontal panning
        panY: "none", // disable vertical panning
        wheelX: "none", // disable horizontal wheel interaction
        wheelY: "none", // disable vertical zooming on wheel
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_georgiaHigh.default,
        valueField: "value",
        calculateAggregates: true,
      })
    );

    // Region values with dynamic highlighting
    const data = regions.map((region) => ({
      ...region,
      highlighted: region.id === highlightedRegion,
      opacity: region.id === highlightedRegion ? 1.0 : 0.6,
    }));

    polygonSeries.data.setAll(data);

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "", // We'll handle tooltips manually
      interactive: true,
      fill: am5.color(0x6ba3d6), // Lighter blue base color
      stroke: am5.color(0xffffff),
      strokeWidth: 0.5,
      strokeOpacity: 0.8,
    });

    // Apply different colors and opacity based on data
    polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
      const dataContext = target.dataItem?.dataContext;
      if (dataContext?.id === highlightedRegion) {
        return am5.color(0x084e99); // Darker blue for highlighted region - using exact hex
      }
      return am5.color(0x6ba3d6); // Light blue for other regions
    });

    polygonSeries.mapPolygons.template.adapters.add(
      "fillOpacity",
      (opacity, target) => {
        const dataContext = target.dataItem?.dataContext;
        if (dataContext?.id === highlightedRegion) {
          return 1.0; // Full opacity for highlighted region
        }
        return 0.6; // Reduced opacity for other regions
      }
    );

    // Show value label on each region
    polygonSeries.mapPolygons.template.adapters.add(
      "labelText",
      (text, target) => {
        const value = target.dataItem?.dataContext?.value;
        return value != null ? String(value) : "";
      }
    );

    // Custom tooltip and interaction functionality
    polygonSeries.events.on("datavalidated", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        polygon.events.on("pointerover", (event) => {
          const data = event.target.dataItem?.dataContext;
          const regionId = data?.id;

          // Update highlighted region on hover
          setHighlightedRegion(regionId);
          setHoveredRegion(regionId);

          // Get mouse position relative to the map container
          if (event.point) {
            const x = event.point.x;
            const y = event.point.y;
            setTooltipPosition({ x: x + 20, y: y - 50 }); // Offset tooltip from cursor
          }

          // Force refresh the map styling
          polygonSeries.mapPolygons.each((mapPolygon) => {
            const polygonData = mapPolygon.dataItem?.dataContext;
            if (polygonData?.id === regionId) {
              mapPolygon.set("fill", am5.color(0x084e99));
              mapPolygon.set("fillOpacity", 1.0);
            } else {
              mapPolygon.set("fill", am5.color(0x6ba3d6));
              mapPolygon.set("fillOpacity", 0.6);
            }
          });


        });

        // Track mouse movement for tooltip positioning
        polygon.events.on("pointermove", (event) => {
          if (event.point && hoveredRegion) {
            const x = event.point.x;
            const y = event.point.y;
            setTooltipPosition({ x: x + 20, y: y - 50 });
          }
        });

        polygon.events.on("pointerout", () => {
          // Clear hovered region state
          setHoveredRegion(null);

          // Tooltip will be hidden automatically when currentRegionData becomes null
        });
      });
    });

    return () => root.dispose();
  }, [highlightedRegion, regions, hoveredRegion, tooltipPosition]);

  return (
    <div
      className="georgia-map-wrapper"
      style={{
        position: "relative",
        width: "1104px",
        height: "468px",
        background: "#ECF5FF",
        borderRadius: "16px",
        margin: "0 auto",
        overflow: "hidden",
      }}
    >
      <div
        id="georgia-map-container"
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      ></div>

      {/* Dynamic Tooltip - only shows when hovering over a region */}
      {currentRegionData && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            background: "#2D3748",
            borderRadius: "12px",
            padding: "16px 20px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "block",
            zIndex: 1000,
            minWidth: "280px",
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
                fontSize: "14px",
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
                fontSize: "24px",
                fontWeight: 600,
                color: "#48BB78",
                lineHeight: "1.2",
              }}
            >
              {currentRegionData.value.toLocaleString()} მ³
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

      {/* Hover Tooltip (hidden by default) */}
      <div
        id="custom-tooltip"
        style={{
          position: "absolute",
          background: "#2D3748",
          borderRadius: "8px",
          padding: "12px 16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          display: "none",
          zIndex: 1001,
          pointerEvents: "none",
          minWidth: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            className="tooltip-title"
            style={{
              fontFamily: "'FiraGO', Arial, sans-serif",
              fontSize: "12px",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: "1.3",
            }}
          ></div>
          <div
            className="tooltip-value"
            style={{
              fontFamily: "'FiraGO', Arial, sans-serif",
              fontSize: "16px",
              fontWeight: 600,
              color: "#48BB78",
              lineHeight: "1.2",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GeorgiaMap;
