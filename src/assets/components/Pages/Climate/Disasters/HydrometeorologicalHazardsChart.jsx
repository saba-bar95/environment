import React, { useEffect, useMemo, useState } from "react";

// --- Styles (Unchanged) ---
const STYLES = {
    container: { fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji",sans-serif', color: "#1f2937", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 16 },
    title: { margin: "4px 0 12px", fontSize: 18, fontWeight: 600 },
    subtitle: { margin: "0 0 16px", fontSize: 14, color: "#6b7280" },
    gridWrapper: { overflow: "auto", borderRadius: 8, border: "1px solid #e5e7eb" },
    grid: (cols, colW) => ({ display: "grid", gridTemplateColumns: `180px repeat(${cols}, ${colW}px)`, alignItems: "stretch" }),
    rowHeader: { background: "#fff", borderRight: "1px solid #e5e7eb", fontSize: 11, padding: "8px 10px", whiteSpace: "nowrap", position: "sticky", left: 0, zIndex: 1 },
    cell: (bg) => ({ background: bg, borderBottom: "1px solid #f3f4f6", borderRight: "1px solid #f3f4f6", minHeight: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 500, color: "#374151" }),
    colFooterRow: (cols, colW) => ({ display: "grid", gridTemplateColumns: `180px repeat(${cols}, ${colW}px)`, alignItems: "stretch" }),
    colFooter: { textAlign: "center", fontSize: 11, fontWeight: 600, background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "6px 0" },
    legendRow: { display: "flex", gap: 16, alignItems: "center", justifyContent: "center", marginBottom: 24, flexWrap: "wrap", fontSize: 11, color: "#374151" },
    swatch: (bg) => ({ display: "inline-block", width: 18, height: 12, borderRadius: 3, border: "1px solid #e5e7eb", background: bg, marginRight: 6, verticalAlign: "middle" }),
    stateBox: { padding: 14, border: "1px dashed #e5e7eb", borderRadius: 8, background: "#fafafa", fontSize: 13, color: "#6b7280", textAlign: "center" },
};

// --- Helper Functions (Modernized & Unchanged) ---

/** Determines cell color based on value. */
function bucketColor(v) {
    if (v === 0) return "#e7eef7"; // Light blue for zero
    if (v <= 10) return "#ffe08a"; // Yellow for low values
    if (v <= 20) return "#f7a85b"; // Orange for medium values
    return "#ef6b6b"; // Red for high values
}

/** Fetches from a list of URLs, returning the first successful one. Now supports AbortSignal. */
async function fetchWithFallbacks(urls, signal) {
    for (const url of urls) {
        try {
            const res = await fetch(url, { signal });
            if (res.ok) return res.json();
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Fetch aborted.');
                throw err; // Re-throw abort errors to stop execution
            }
            // Otherwise, ignore the error and try the next URL
        }
    }
    throw new Error(`Unable to fetch data from any provided sources.`);
}

/** Finds a specific variable (e.g., Year, Month) from the metadata array. */
function findVariable(vars = [], candidates = []) {
    const norm = (s) => (s || "").toString().toLowerCase();
    for (const v of vars) {
        const hay = `${norm(v.code)} ${norm(v.text)}`;
        if (candidates.some((c) => hay.includes(norm(c)))) return v;
    }
    return vars[0] || null;
}

/** Sums all hazard types for a given month, excluding "casualty" data. */
function sumAcrossHazards(record, hazardCount, monthIndex, monthLabels = []) {
    if (!record) return 0;
    const monthLabel = (monthLabels[monthIndex] || "").toString().toLowerCase();
    // Exclude the special "human casualties" metric from the monthly sum
    if (monthLabel.includes("casual") || monthLabel.includes("მსხვერპ")) return 0;

    let total = 0;
    for (let h = 0; h < hazardCount; h++) {
        const key = `${h} - ${monthIndex}`;
        const val = Number(record[key] ?? 0);
        if (Number.isFinite(val)) total += val;
    }
    return total;
}

// --- The Main Component ---
export default function HydroHazardsHeatmap({
                                                // Your URLs are now the defaults
                                                metadataUrl = "http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/metadata",
                                                dataUrl = "http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/data",
                                                localMetadata = "/metadata.json", // Fallback for development
                                                localData = "/data.json", // Fallback for development
                                                title = "ჰიდრომეტეოროლოგიური მოვლენების ყოველთვიური რუკა",
                                                subtitle = "შემთხვევების რაოდენობა",
                                                columnWidth = 140,
                                            }) {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [rawMeta, setRawMeta] = useState(null);
    const [rawData, setRawData] = useState(null);

    // ✅ Modernized useEffect with AbortController for safe data fetching
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const metaCandidates = [metadataUrl, localMetadata];
        const dataCandidates = [dataUrl, localData];

        (async () => {
            try {
                const [m, d] = await Promise.all([
                    fetchWithFallbacks(metaCandidates, signal),
                    fetchWithFallbacks(dataCandidates, signal),
                ]);
                setRawMeta(m);
                setRawData(d);
                setErr("");
            } catch (e) {
                if (e.name !== 'AbortError') {
                    setErr(e?.message || "Failed to load dataset.");
                }
            } finally {
                setLoading(false);
            }
        })();

        // Cleanup function: abort fetch if component unmounts
        return () => {
            controller.abort();
        };
    }, [dataUrl, metadataUrl, localData, localMetadata]);

    // ✅ Data processing logic (unchanged, as it was already correct)
    const { years, months, matrix } = useMemo(() => {
        if (!rawMeta || !rawData) return { years: [], months: [], matrix: [] };

        const metaVars = rawMeta?.data?.metadata?.variables || [];
        const yearVar = findVariable(metaVars, ["year", "წელი"]);
        const hazardVar = findVariable(metaVars, ["hazard", "ჰიდრომეტეოროლოგიური"]);
        const monthVar = findVariable(metaVars, ["month", "თვე"]);

        const years = yearVar?.valueTexts || [];
        const hazards = hazardVar?.valueTexts || [];
        const months = monthVar?.valueTexts || [];

        const records = rawData?.data?.data || [];

        // Create a Map for quick year-based lookups
        const yearRecMap = new Map(records.map(r => [String(r?.year), r]));

        const hazardCount = hazards.length;
        const mat = months.map((_, mIdx) =>
            years.map((_, yIdx) => {
                const rec = yearRecMap.get(String(yIdx)) || null;
                return sumAcrossHazards(rec, hazardCount, mIdx, months);
            })
        );

        return { years, months, matrix: mat };
    }, [rawMeta, rawData]);

    const hasData = years.length > 0 && months.length > 0 && matrix.length > 0;

    // --- Conditional Rendering States ---
    if (loading) return (
        <div style={STYLES.container}><div style={STYLES.stateBox}>Loading data… ⏳</div></div>
    );

    if (err) return (
        <div style={STYLES.container}>
            <div style={{ ...STYLES.stateBox, background: '#fff2f2', borderColor: '#ffb3b3' }}>
                <div style={{ fontWeight: 600, marginBottom: 4, color: '#c72e2e' }}>Error 😞</div>
                <div>{err}</div>
            </div>
        </div>
    );

    if (!hasData) return (
        <div style={STYLES.container}><div style={STYLES.stateBox}>No data available.</div></div>
    );

    // --- Main Render Output ---
    return (
        <div style={STYLES.container}>
            <div style={STYLES.title}>{title}</div>
            <div style={STYLES.subtitle}>{subtitle}</div>

            <div style={STYLES.legendRow} aria-label="Legend">
                <span><i style={STYLES.swatch("#e7eef7")} /> 0</span>
                <span><i style={STYLES.swatch("#ffe08a")} /> 1–10</span>
                <span><i style={STYLES.swatch("#f7a85b")} /> 11–20</span>
                <span><i style={STYLES.swatch("#ef6b6b")} /> 21+</span>
            </div>

            <div style={STYLES.gridWrapper}>
                <div style={STYLES.grid(years.length, columnWidth)}>
                    {/* Rows: Months and their data cells */}
                    {months.map((mLabel, r) => (
                        <React.Fragment key={`row-${r}`}>
                            <div style={STYLES.rowHeader}>{mLabel}</div>
                            {matrix[r].map((v, c) => (
                                <div key={`cell-${r}-${c}`} style={STYLES.cell(bucketColor(v))}>
                                    {v}
                                </div>
                            ))}
                        </React.Fragment>
                    ))}
                </div>

                {/* Footer: Year labels */}
                <div style={STYLES.colFooterRow(years.length, columnWidth)}>
                    <div /> {/* Empty cell for alignment */}
                    {years.map((y, i) => (
                        <div key={`footer-${i}`} style={STYLES.colFooter}>{y}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}