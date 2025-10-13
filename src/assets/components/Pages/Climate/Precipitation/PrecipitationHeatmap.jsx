import React, { useEffect, useMemo, useState } from "react";

// --- Styles (Adapted for the new design) ---
const STYLES = {
    container: { fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji",sans-serif', color: "#1f2937", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 },
    title: { margin: "4px 0 12px", fontSize: 18, fontWeight: 600, textAlign: 'center' },
    subtitle: { margin: "0 0 16px", fontSize: 14, color: "#6b7280", textAlign: 'center' },
    gridWrapper: { overflow: "auto", border: "1px solid #e5e7eb", borderRadius: 8 },
    grid: (cols) => ({ display: "grid", gridTemplateColumns: `100px repeat(${cols}, 1fr)`, alignItems: "stretch" }),
    rowHeader: { background: "#f9fafb", borderRight: "1px solid #e5e7eb", fontSize: 12, fontWeight: 600, padding: "8px 10px", position: "sticky", left: 0, zIndex: 1 },
    cell: (bg) => ({ background: bg, borderBottom: "1px solid #f3f4f6", borderRight: "1px solid #f3f4f6", minHeight: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: "#1f2937" }),
    colHeaderRow: (cols) => ({ display: "grid", gridTemplateColumns: `100px repeat(${cols}, 1fr)`, alignItems: "stretch" }),
    colHeader: { textAlign: "center", fontSize: 11, fontWeight: 600, background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "6px 0" },
    legendRow: { display: "flex", gap: 16, alignItems: "center", justifyContent: "center", marginTop: 24, flexWrap: "wrap", fontSize: 11, color: "#374151" },
    swatch: (bg) => ({ display: "inline-block", width: 14, height: 14, borderRadius: 3, background: bg, marginRight: 6, verticalAlign: "middle" }),
    stateBox: { padding: 14, border: "1px dashed #e5e7eb", borderRadius: 8, background: "#fafafa", fontSize: 13, color: "#6b7280", textAlign: "center" },
};

// --- Helper Functions (Updated for new logic) ---

/** Determines cell color based on precipitation value. */
function bucketColor(v) {
    if (v === null) return "#f9fafb"; // Grey for empty cells
    if (v < 950) return "#fecdd3";   // Pink for Dry
    if (v <= 1100) return "#dbeafe"; // Light Blue for Average
    return "#93c5fd";   // Darker Blue for Wet
}

// --- The Main Component ---
const PrecipitationHeatmap = ({
                                  dataUrl = "http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data",
                                  title = "11. წლიური ნალექების თერმული რუკა (საქართველო)",
                                  subtitle = "თითოეული უჯრა წარმოადგენს წელს",
                              }) => {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [rawData, setRawData] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const res = await fetch(dataUrl, { signal: controller.signal });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setRawData(data);
            } catch (e) {
                if (e.name !== 'AbortError') setErr(e?.message || "Failed to load dataset.");
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [dataUrl]);

    const { decades, matrix } = useMemo(() => {
        if (!rawData?.data?.data) return { decades: [], matrix: [] };

        const records = rawData.data.data;
        if (records.length === 0) return { decades: [], matrix: [] };

        const yearValueMap = new Map(records.map(r => [r.year, r['GEO - ANNUAL']]));

        const years = Array.from(yearValueMap.keys());
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
    }, [rawData]);

    const hasData = decades.length > 0 && matrix.length > 0;
    const columnHeaders = Array.from({ length: 10 }, (_, i) => i);

    if (loading) return <div style={STYLES.container}><div style={STYLES.stateBox}>Loading data… ⏳</div></div>;
    if (err) return <div style={STYLES.container}><div style={STYLES.stateBox}><div style={{fontWeight: 600}}>Error</div>{err}</div></div>;
    if (!hasData) return <div style={STYLES.container}><div style={STYLES.stateBox}>No data available.</div></div>;

    return (
        <div style={STYLES.container}>
            <div style={STYLES.title}>{title}</div>
            <div style={STYLES.subtitle}>{subtitle}</div>

            <div style={STYLES.gridWrapper}>
                {/* Column Headers: 0 to 9 */}
                <div style={STYLES.colHeaderRow(columnHeaders.length)}>
                    <div /> {/* Empty cell for alignment */}
                    {columnHeaders.map(header => (
                        <div key={`header-${header}`} style={STYLES.colHeader}>{header}</div>
                    ))}
                </div>

                {/* Grid Body */}
                <div style={STYLES.grid(columnHeaders.length)}>
                    {decades.map((decadeLabel, r) => (
                        <React.Fragment key={`row-${r}`}>
                            <div style={STYLES.rowHeader}>{decadeLabel}</div>
                            {matrix[r].map((value, c) => (
                                <div key={`cell-${r}-${c}`} style={STYLES.cell(bucketColor(value))}>
                                    {value !== null ? Math.round(value) : '-'}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div style={STYLES.legendRow} aria-label="Legend">
                <span><i style={STYLES.swatch("#fecdd3")} /> მშრალი (&lt;950მმ)</span>
                <span><i style={STYLES.swatch("#dbeafe")} /> საშუალო</span>
                <span><i style={STYLES.swatch("#93c5fd")} /> ნოტიო (&gt;1100მმ)</span>
            </div>
        </div>
    );
};

export default PrecipitationHeatmap;

