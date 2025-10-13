import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Label
} from 'recharts';

// API Configuration
const BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.27:3000/api/datasets';
const DATASET_SLUG = 'air-temperature';
const DATA_URL = `${BASE}/${DATASET_SLUG}/data`;
const METADATA_URL = `${BASE}/${DATASET_SLUG}/metadata`;

// This is the index for "GEO - Annual deviation from average temperature (°C)"
const TARGET_INDEX = 2;
const BAR_COLOR = '#cb5a5a'; // Red color from your target screenshot

// --- I18N for titles and labels ---
const I18N = {
    ka: {
        title: 'ყველაზე ცხელი წლები 1990 წლიდან დღემდე: ტოპ 7 ტემპერატურული გადახრის მიხედვით',
        xAxisLabel: 'ტემპერატურული გადახრა (°C)',
        loading: 'იტვირთება...',
        noData: 'მონაცემები არ არის',
        error: 'ქსელური შეცდომა'
    },
    en: {
        title: 'Hottest Years Since 1990: Top 7 by Temperature Deviation',
        xAxisLabel: 'Temperature Deviation (°C)',
        loading: 'Loading...',
        noData: 'No data available',
        error: 'Network error'
    }
};

// --- Helper function to find data keys as a fallback ---
function deriveKeys(rows) {
    if (!Array.isArray(rows) || !rows.length) return [];
    const first = rows.find(r => r && typeof r === 'object');
    if (!first) return [];
    return Object.keys(first).filter(k => k !== 'year');
}

// --- Logic to compute the top N warmest years ---
function computeTopN(raw, key, topN) {
    return raw
        .filter(r => r && r.year != null && r[key] != null && r[key] !== '' && r.year >= 1990 && r.year <= 2022)
        .map(r => ({ year: Number(r.year), value: Number(r[key]) }))
        .filter(r => !Number.isNaN(r.value))
        .sort((a, b) => b.value - a.value) // Sort descending by value
        .slice(0, topN);
}

const TemperatureTopYearsBarChart = ({ language = 'ka', height = 400, topN = 7, debug = false }) => {
    const t = I18N[language] || I18N.ka;
    const [rows, setRows] = useState([]);
    const [status, setStatus] = useState({ loading: true, error: null });

    useEffect(() => {
        const abort = new AbortController();
        (async () => {
            try {
                setStatus({ loading: true, error: null });

                const [metaRes, dataRes] = await Promise.all([
                    fetch(METADATA_URL, { signal: abort.signal }),
                    fetch(DATA_URL, { signal: abort.signal })
                ]);
                if (!metaRes.ok || !dataRes.ok) throw new Error(t.error);

                const meta = await metaRes.json();
                const dataJson = await dataRes.json();
                const raw = dataJson?.data?.data || [];

                let categories = Array.isArray(meta?.data?.categories)
                    ? meta.data.categories.filter(k => k !== 'year')
                    : [];

                if (categories.length <= TARGET_INDEX) {
                    const derived = deriveKeys(raw);
                    const merged = [...categories];
                    derived.forEach(k => { if (!merged.includes(k)) merged.push(k); });
                    categories = merged;
                }

                if (categories.length <= TARGET_INDEX) throw new Error('Target data key is missing');
                const key = categories[TARGET_INDEX];

                // Compute the top N years. Recharts displays this with the highest value at the bottom.
                const topRows = computeTopN(raw, key, topN);

                if (!topRows.length) throw new Error(t.noData);

                if (debug) {
                    console.debug('[TopYearsBarChart]', { key, rows: topRows });
                }

                setRows(topRows);
                setStatus({ loading: false, error: null });
            } catch (e) {
                if (!abort.signal.aborted) {
                    setStatus({ loading: false, error: e.message || 'Error' });
                }
            }
        })();
        return () => abort.abort();
    }, [language, t.error, t.noData, topN, debug]);

    const hasData = rows.length > 0;

    return (
        <div className="temperature-chart-card">
            <div className="temperature-chart-header">
                <h3 className="temperature-chart-title">{t.title}</h3>
            </div>

            {status.loading && <div className="temperature-chart-state">{t.loading}</div>}
            {status.error && <div className="temperature-chart-error">Error: {status.error}</div>}
            {!status.loading && !status.error && !hasData && (
                <div className="temperature-chart-state">{t.noData}</div>
            )}

            {hasData && (
                <div className="temperature-chart-canvas" style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={rows}
                            layout="vertical" // This makes the bar chart horizontal
                            margin={{ top: 5, right: 30, left: 10, bottom: 20 }}
                        >
                            <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, 2.5]} tick={{ fill: '#6B7280', fontSize: 12 }}>
                                <Label value={t.xAxisLabel} offset={-15} position="insideBottom" fill="#6B7280" fontSize={12} />
                            </XAxis>
                            <YAxis
                                type="category"
                                dataKey="year" // Display years on the Y-axis
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                formatter={(value) => [`${value.toFixed(2)} °C`, 'Deviation']}
                                contentStyle={{ fontSize: 12, borderRadius: 4 }}
                            />
                            <Bar dataKey="value" fill={BAR_COLOR} barSize={30} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TemperatureTopYearsBarChart;

