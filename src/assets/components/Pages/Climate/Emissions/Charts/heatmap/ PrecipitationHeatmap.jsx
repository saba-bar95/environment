import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Download from "./Download/Download";

// Minimal styles to render the grid while keeping your global chart-wrapper styles
const STYLES = {
  gridWrapper: { overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8 },
  grid: (cols) => ({
    display: "grid",
    gridTemplateColumns: `100px repeat(${cols}, 1fr)`,
    alignItems: "stretch",
  }),
  rowHeader: {
    background: "#f9fafb",
    borderRight: "1px solid #e5e7eb",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 10px",
    position: "sticky",
    left: 0,
    zIndex: 1,
  },
  cell: (bg) => ({
    background: bg,
    borderBottom: "1px solid #f3f4f6",
    borderRight: "1px solid #f3f4f6",
    minHeight: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 500,
    color: "#1f2937",
  }),
  colHeaderRow: (cols) => ({
    display: "grid",
    gridTemplateColumns: `100px repeat(${cols}, 1fr)`,
    alignItems: "stretch",
  }),
  colHeader: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: 600,
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    padding: "6px 0",
  },
  legendRow: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
    fontSize: 11,
    color: "#374151",
  },
  swatch: (bg) => ({
    display: "inline-block",
    width: 14,
    height: 14,
    borderRadius: 3,
    background: bg,
    marginRight: 6,
    verticalAlign: "middle",
  }),
};

// Color buckets for cell values
function bucketColor(v) {
  if (v === null) return "#f9fafb"; // empty
  if (v < 950) return "#fecdd3"; // dry
  if (v <= 1100) return "#dbeafe"; // average
  return "#93c5fd"; // wet
}

const PrecipitationHeatmap = ({ chartInfo, dataUrl }) => {
  const { language } = useParams();

  const [loading, setLoading] = useState(true); 
  const [err, setErr] = useState("");
  const [rawData, setRawData] = useState(null);

  const dataset = chartInfo?.dataset || "atmospheric-precipitation";
  const baseUrl = chartInfo?.apiBase || "http://192.168.1.27:3000";
  const url = dataUrl || `${baseUrl}/api/datasets/${dataset}/data`;
  const valueKey = chartInfo?.valueKey || "hydro-meteorological-hazards";

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setRawData(data);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e?.message || "Failed to load dataset.");
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [url]);

  // Build decade rows and 10 columns (0..9)
  const { decades, matrix } = useMemo(() => {
    const records = rawData?.data?.data || [];
    if (!records.length) return { decades: [], matrix: [] };

    const yearValueMap = new Map(records.map((r) => [r.year, r[valueKey]]));
    const years = Array.from(yearValueMap.keys());
    if (!years.length) return { decades: [], matrix: [] };

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const startDecade = Math.floor(minYear / 10) * 10;
    const endDecade = Math.floor(maxYear / 10) * 10;

    const decadeLabels = [];
    const matrixData = [];

    for (let decade = startDecade; decade <= endDecade; decade += 10) {
      decadeLabels.push(`${decade}-იანები`);
      const row = [];
      for (let i = 0; i < 10; i++) {
        const currentYear = decade + i;
        row.push(yearValueMap.has(currentYear) ? yearValueMap.get(currentYear) : null);
      }
      matrixData.push(row);
    }

    return { decades: decadeLabels, matrix: matrixData };
  }, [rawData, valueKey]);

  // Prepare flat data for Download
  const downloadData = useMemo(() => {
    const records = rawData?.data?.data || [];
    return records.map((r) => ({
      year: r.year,
      value: r[valueKey] ?? null,
    }));
  }, [rawData, valueKey]);

  const columnHeaders = useMemo(() => Array.from({ length: 10 }, (_, i) => i), []);
  const titleText = language === "ge" ? chartInfo?.title_ge || "" : chartInfo?.title_en || "";
  const unitText = language === "ge" ? chartInfo?.unit_ge || "" : chartInfo?.unit_en || "";

  if (loading) return <div>Loading...</div>;
  if (err) return <div>Error: {err}</div>;

  return (
    <div className="chart-wrapper" id={chartInfo?.chartID} style={chartInfo?.wrapperStyles}>
      <div className="header">
        <div className="right">
          <div className="ll"></div>
          <div className="rr">
            <h1>{titleText}</h1>
            <p>{unitText}</p>
          </div>
        </div>
        <div className="left">
          <Download data={downloadData} filename={chartInfo?.[`title_${language}`] || titleText} />
        </div>
      </div>

      {/* Heatmap body */}
      <div style={STYLES.gridWrapper}>
        {/* Column headers: 0..9 */}
        <div style={STYLES.colHeaderRow(columnHeaders.length)}>
          <div /> {/* spacer for row header column */}
          {columnHeaders.map((h) => (
            <div key={`header-${h}`} style={STYLES.colHeader}>
              {h}
            </div>
          ))}
        </div>

        {/* Grid body */}
        <div style={STYLES.grid(columnHeaders.length)}>
          {decades.map((decadeLabel, r) => (
            <React.Fragment key={`row-${r}`}>
              <div style={STYLES.rowHeader}>{decadeLabel}</div>
              {matrix[r].map((value, c) => (
                <div key={`cell-${r}-${c}`} style={STYLES.cell(bucketColor(value))}>
                  {value !== null ? Math.round(value) : "-"}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={STYLES.legendRow} aria-label="Legend">
        <span>
          <i style={STYLES.swatch("#fecdd3")} /> მშრალი (&lt;950მმ)
        </span>
        <span>
          <i style={STYLES.swatch("#dbeafe")} /> საშუალო
        </span>
        <span>
          <i style={STYLES.swatch("#93c5fd")} /> ნოტიო (&gt;1100მმ)
        </span>
      </div>
    </div>
  );
};

export default PrecipitationHeatmap;
