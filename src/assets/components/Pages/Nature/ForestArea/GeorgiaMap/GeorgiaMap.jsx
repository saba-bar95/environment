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

    // Region values with opacity settings
    const data = [
      { id: "GE-TB", value: 75, opacity: 0.45 }, // Tbilisi
      { id: "GE-AB", value: 40, opacity: 0.45 }, // Abkhazia
      { id: "GE-AJ", value: 30, opacity: 0.45 }, // Adjara
      { id: "GE-KA", value: 55, opacity: 1.0 }, // Kakheti - full opacity
      { id: "GE-IM", value: 60, opacity: 0.45 }, // Imereti
      { id: "GE-RK", value: 45, opacity: 0.45 }, // Racha-Lechkhumi
      { id: "GE-GU", value: 50, opacity: 0.45 }, // Guria
      { id: "GE-SZ", value: 35, opacity: 0.45 }, // Samtskhe-Zemo
    ];
    polygonSeries.data.setAll(data);

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value}",
      interactive: true,
      fill: am5.color(0x084e99),
      stroke: am5.color(0xffffff),
      strokeWidth: 1,
      strokeOpacity: 1,
    });

    // Apply different opacity based on data
    polygonSeries.mapPolygons.template.adapters.add("fillOpacity", (opacity, target) => {
      const dataContext = target.dataItem?.dataContext;
      return dataContext?.opacity || 0.45;
    });

    // Show value label on each region
    polygonSeries.mapPolygons.template.adapters.add(
      "labelText",
      (text, target) => {
        const value = target.dataItem?.dataContext?.value;
        return value != null ? String(value) : "";
      }
    );

    polygonSeries.events.on("datavalidated", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        polygon.events.on("pointerover", (event) => {
          const data = event.target.dataItem?.dataContext;
          const name = data?.name || "Unknown";
          const value = data?.value ?? "No value";
          console.log(`Hovered: ${name} — Value: ${value}`);
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
      
      {/* Region Label Overlay */}
      <div 
        className="region-label"
        style={{
          position: "absolute",
          width: "344px",
          height: "72px",
          left: "350px",
          top: "105px",
          background: "#111729",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{
          fontFamily: "'FiraGO', Arial, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "17px",
          color: "#FFFFFF",
          textAlign: "center",
        }}>
          რაჭა-ლეჩხუმი და ქვემო სვანეთი
        </span>
      </div>
    </div>
  );
};

export default GeorgiaMap;