import { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import * as am5geodata_georgiaHigh from "@amcharts/amcharts5-geodata/georgiaLow";

const GeorgiaMap = () => {
  console.log(am5geodata_georgiaHigh.default);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    // Set root container size
    root.container.setAll({
      width: 600,
      height: 400,
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

    // Region values
    const data = [
      { id: "GE-TB", value: 75 }, // Tbilisi
      { id: "GE-AB", value: 40 }, // Abkhazia
      { id: "GE-AJ", value: 30 }, // Adjara
      { id: "GE-KA", value: 55 }, // Kakheti
      { id: "GE-IM", value: 60 }, // Imereti
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
      id="chartdiv"
      style={{
        width: "600px",
        height: "400px",
        overflow: "hidden",
      }}></div>
  );
};

export default GeorgiaMap;