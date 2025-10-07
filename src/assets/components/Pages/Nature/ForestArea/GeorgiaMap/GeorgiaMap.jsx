import { useLayoutEffect, useState, useMemo } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_georgiaHigh from "@amcharts/amcharts5-geodata/georgiaLow";

const GeorgiaMap = () => {
  const [highlightedRegion, setHighlightedRegion] = useState(null); // No default highlighting
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Region data for easy access - memoized to prevent re-renders
  const regions = useMemo(
    () => [
      { id: "GE-TB", value: 8500, name: "თბილისი" },
      { id: "GE-AB", value: 4200, name: "აფხაზეთი" },
      { id: "GE-AJ", value: 3800, name: "აჭარა" },
      { id: "GE-KA", value: 12400, name: "კახეთი" },
      { id: "GE-IM", value: 9600, name: "იმერეთი" },
      { id: "GE-RL", value: 15200, name: "რაჭა-ლეჩხუმი და ქვემო სვანეთი" },
      { id: "GE-GU", value: 5100, name: "გურია" },
      { id: "GE-SJ", value: 7300, name: "სამცხე-ჯავახეთი" },
      { id: "GE-MM", value: 6800, name: "მცხეთა-მთიანეთი" },
      { id: "GE-KK", value: 5900, name: "ქვემო ქართლი" },
      { id: "GE-SK", value: 8200, name: "შიდა ქართლი" },
      { id: "GE-SZ", value: 11300, name: "სამეგრელო-ზემო სვანეთი" },
    ],
    []
  );

  // Get current hovered region data for dynamic tooltip
  const currentRegionData = useMemo(() => {
    return hoveredRegion ? regions.find((region) => region.id === hoveredRegion) : null;
  }, [regions, hoveredRegion]);

  console.log(am5geodata_georgiaHigh.default);

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
          const name = data?.name || "Unknown";
          const value = data?.value ?? 0;
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

          // Show custom tooltip
          const tooltip = document.getElementById("custom-tooltip");
          if (tooltip) {
            tooltip.style.display = "block";
            const titleElement = tooltip.querySelector(".tooltip-title");
            const valueElement = tooltip.querySelector(".tooltip-value");
            if (titleElement) titleElement.textContent = name;
            if (valueElement)
              valueElement.textContent = `${value.toLocaleString()} მ³`;
          }
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

          // Hide tooltip after a delay
          setTimeout(() => {
            const tooltip = document.getElementById("custom-tooltip");
            if (tooltip) {
              tooltip.style.display = "none";
            }
          }, 200);
        });
      });
    });

    return () => root.dispose();
  }, [highlightedRegion, regions, hoveredRegion]);

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
            pointerEvents: "none", // Prevent tooltip from interfering with mouse events
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
