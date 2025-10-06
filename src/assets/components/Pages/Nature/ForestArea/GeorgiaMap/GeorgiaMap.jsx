import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_georgiaHigh from "@amcharts/amcharts5-geodata/georgiaLow";

const GeorgiaMap = () => {
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

    // Region values with opacity and highlight settings
    const data = [
      { id: "GE-TB", value: 8500, opacity: 0.6, name: "თბილისი" }, // Tbilisi
      { id: "GE-AB", value: 4200, opacity: 0.6, name: "აფხაზეთი" }, // Abkhazia
      { id: "GE-AJ", value: 3800, opacity: 0.6, name: "აჭარა" }, // Adjara
      { id: "GE-KA", value: 12400, opacity: 0.6, name: "კახეთი" }, // Kakheti
      { id: "GE-IM", value: 9600, opacity: 0.6, name: "იმერეთი" }, // Imereti
      { id: "GE-RK", value: 15200, opacity: 1.0, name: "რაჭა-ლეჩხუმი და ქვემო სვანეთი", highlighted: true }, // Racha-Lechkhumi - highlighted
      { id: "GE-GU", value: 5100, opacity: 0.6, name: "გურია" }, // Guria
      { id: "GE-SZ", value: 7300, opacity: 0.6, name: "სამცხე-ჯავახეთი" }, // Samtskhe-Javakheti
    ];
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
      if (dataContext?.highlighted) {
        return am5.color(0x084e99); // Darker blue for highlighted region
      }
      return am5.color(0x6ba3d6); // Light blue for other regions
    });

    polygonSeries.mapPolygons.template.adapters.add("fillOpacity", (opacity, target) => {
      const dataContext = target.dataItem?.dataContext;
      return dataContext?.opacity || 0.6;
    });

    // Show value label on each region
    polygonSeries.mapPolygons.template.adapters.add(
      "labelText",
      (text, target) => {
        const value = target.dataItem?.dataContext?.value;
        return value != null ? String(value) : "";
      }
    );

    // Custom tooltip functionality
    polygonSeries.events.on("datavalidated", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        polygon.events.on("pointerover", (event) => {
          const data = event.target.dataItem?.dataContext;
          const name = data?.name || "Unknown";
          const value = data?.value ?? 0;
          
          // Show custom tooltip
          const tooltip = document.getElementById("custom-tooltip");
          if (tooltip) {
            tooltip.style.display = "block";
            const titleElement = tooltip.querySelector(".tooltip-title");
            const valueElement = tooltip.querySelector(".tooltip-value");
            if (titleElement) titleElement.textContent = name;
            if (valueElement) valueElement.textContent = `${value.toLocaleString()} მ³`;
          }
        });

        polygon.events.on("pointerout", () => {
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
  }, []);

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
      
      {/* Custom Tooltip */}
      <div 
        id="custom-tooltip"
        style={{
          position: "absolute",
          left: "400px",
          top: "80px",
          background: "#2D3748",
          borderRadius: "12px",
          padding: "16px 20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          display: "block",
          zIndex: 1000,
          minWidth: "280px",
        }}
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <div 
            className="tooltip-title"
            style={{
              fontFamily: "'FiraGO', Arial, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              color: "#FFFFFF",
              lineHeight: "1.4",
              marginBottom: "4px",
            }}
          >
            რაჭა-ლეჩხუმი და ქვემო სვანეთი
          </div>
          <div 
            className="tooltip-value"
            style={{
              fontFamily: "'FiraGO', Arial, sans-serif",
              fontSize: "24px",
              fontWeight: 600,
              color: "#48BB78",
              lineHeight: "1.2",
            }}
          >
            15 200 მ³
          </div>
        </div>
        
        {/* Tooltip Arrow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "-8px",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "8px solid transparent",
          borderBottom: "8px solid transparent",
          borderRight: "8px solid #2D3748",
        }}></div>
      </div>
    </div>
  );
};

export default GeorgiaMap;