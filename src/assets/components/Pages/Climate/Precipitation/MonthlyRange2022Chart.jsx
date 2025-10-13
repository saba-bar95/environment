import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const META_URL = "http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/metadata";
const DATA_URL = "http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data";
const TARGET_YEAR = 2022; // what you asked for

// split "PREFIX - METRIC"
const splitCategory = (s) => {
    const i = s.indexOf(" - ");
    return i === -1 ? [s, ""] : [s.slice(0, i), s.slice(i + 3)];
};

const niceLabelFromPrefix = (p) =>
    p.replace(/_/g, " ").toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());

// Build chart rows dynamically (no hardcoded locations or metrics)
function buildRangeData(metaJson, dataJson, preferredYear = TARGET_YEAR) {
    const rows = dataJson?.data?.data || [];
    const categories = dataJson?.data?.categories || [];
    if (!rows.length || !categories.length) return { year: null, data: [] };

    // location prefixes in order of appearance
    const seen = new Set();
    const prefixes = [];
    for (const c of categories) {
        const [prefix] = splitCategory(c);
        if (!seen.has(prefix)) { seen.add(prefix); prefixes.push(prefix); }
    }

    // human-readable labels from metadata (Locations.valueTexts)
    const locVar = metaJson?.data?.metadata?.variables?.find(v => v.code === "Locations");
    const valueTexts = Array.isArray(locVar?.valueTexts) ? locVar.valueTexts : [];
    const labelByPrefix = {};
    prefixes.forEach((p, i) => { labelByPrefix[p] = valueTexts[i] || niceLabelFromPrefix(p); });

    // metric suffix names (found dynamically)
    const suffixes = new Set(categories.map(c => splitCategory(c)[1]));
    const MIN = [...suffixes].find(s => s.toUpperCase().includes("MIN_MONTHLY")) || "MIN_MONTHLY";
    const MAX = [...suffixes].find(s => s.toUpperCase().includes("MAX_MONTHLY")) || "MAX_MONTHLY";

    // pick the requested year; if not present, fall back to the latest row
    const row =
        rows.find(r => r.year === preferredYear) ||
        rows.reduce((a, b) => (a?.year > b?.year ? a : b), rows[0]);

    if (!row) return { year: null, data: [] };

    const data = prefixes.map(prefix => {
        const min = row[`${prefix} - ${MIN}`];
        const max = row[`${prefix} - ${MAX}`];
        const range = (typeof min === "number" && typeof max === "number") ? (max - min) : null;
        return {
            location: labelByPrefix[prefix],
            range,
            min,
            max,
        };
    });

    return { year: row.year, data };
}

const MonthlyRange2022Chart = () => {
    const [year, setYear] = useState(null);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const [m, d] = await Promise.all([fetch(META_URL), fetch(DATA_URL)]);
                if (!m.ok || !d.ok) throw new Error("ვერ მოხერხდა მონაცემების წამოღება");
                const [metaJson, dataJson] = await Promise.all([m.json(), d.json()]);
                const { year, data } = buildRangeData(metaJson, dataJson, TARGET_YEAR);
                setYear(year);
                setRows(data);
            } catch (e) {
                setErr(e?.message || String(e));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div style={{ textAlign: "center", padding: 40 }}>იტვირთება… ⏳</div>;
    if (err) return <div style={{ textAlign: "center", padding: 40, color: "red" }}>შეცდომა: {err}</div>;
    if (!rows?.length) return <div style={{ textAlign: "center", padding: 40 }}>მონაცემები ვერ მოიძებნა.</div>;

    return (
        <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc" }}>
            <h2 style={{ textAlign: "center", margin: "0 0 4px" }}>
                7. თვიური ნალექების დიაპაზონი რეგიონების მიხედვით ({year})
            </h2>
            <div style={{ textAlign: "center", color: "#64748b", marginBottom: 8 }}>
                მინ/მაქს თვიური ნალექი (მმ)
            </div>

            <ResponsiveContainer width="100%" height={420}>
                <BarChart
                    data={rows}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                    barCategoryGap={18}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 'dataMax + 10']} />
                    <YAxis type="category" dataKey="location" width={220} />
                    <Tooltip
                        formatter={(val, key, { payload }) => {
                            if (key === "range") {
                                const { min, max } = payload;
                                return [`${val} მმ (მინ: ${min} • მაქს: ${max})`, "დიაპაზონი"];
                            }
                            return [`${val} მმ`, key];
                        }}
                    />
                    <Legend />
                    <Bar dataKey="range" name="დიაპაზონი (მმ)" fill="#eab308" radius={[6, 6, 6, 6]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyRange2022Chart;
