import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.27:3000/api/datasets';
const DATASET_SLUG = 'air-temperature';
const METADATA_URL = `${BASE}/${DATASET_SLUG}/metadata`;
const DATA_URL = `${BASE}/${DATASET_SLUG}/data`;

// Zero-based target indexes for min/max monthly average temps
const TARGET_INDEXES = [8, 9];

// --- ADDED: I18N constant for proper labels and titles ---
const I18N = {
    ka: {
        title: 'ექსტრემალური ცვლილებები: თბილისის ყველაზე ცხელი და ცივი თვეების საშუალო ტემპერატურა',
        lineMax: 'მაქს. თვიური საშ. (°C)',
        lineMin: 'მინ. თვიური საშ. (°C)',
        loading: 'იტვირთება...',
        noData: 'მონაცემები არაა',
        error: 'ქსელური შეცდომა'
    },
    en: {
        title: 'Extreme Changes: Avg. Temp. of Hottest & Coldest Months in Tbilisi',
        lineMax: 'Max. Monthly Avg. (°C)',
        lineMin: 'Min. Monthly Avg. (°C)',
        loading: 'Loading...',
        noData: 'No data',
        error: 'Network error'
    }
};

function deriveKeys(rows) {
    if (!Array.isArray(rows) || !rows.length) return [];
    const first = rows.find(r => r && typeof r === 'object');
    if (!first) return [];
    return Object.keys(first).filter(k => k !== 'year');
}

const TemperatureMinimalTechChart = ({ language = 'ka', height = 380, debug = false }) => {
    const t = I18N[language] || I18N.ka;
    const [rows, setRows] = useState([]);
    const [seriesKeys, setSeriesKeys] = useState([]);
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

                if (categories.length < Math.max(...TARGET_INDEXES) + 1) {
                    const derived = deriveKeys(raw);
                    const merged = [...categories];
                    derived.forEach(k => { if (!merged.includes(k)) merged.push(k); });
                    categories = merged;
                }

                const picked = TARGET_INDEXES.map(i => categories[i]).filter(Boolean);
                if (!picked.length) throw new Error('Index keys missing');
                setSeriesKeys(picked);

                const processed = raw
                    .filter(r => r && r.year != null && r.year >= 1990 && r.year <= 2022)
                    .map(r => {
                        const base = { year: Number(r.year) };
                        picked.forEach(k => {
                            const v = r[k];
                            base[k] = (v === '' || v == null) ? null : Number(v);
                        });
                        return base;
                    })
                    .filter(r => !Number.isNaN(r.year))
                    .sort((a, b) => a.year - b.year);

                if (!processed.length) throw new Error('No rows');
                const anyVal = processed.some(r => picked.some(k => r[k] != null && !Number.isNaN(r[k])));
                if (!anyVal) throw new Error('No values');

                if (debug) {
                    console.debug('[MinimalTechChart] keys=', picked, 'sample=', processed[0]);
                }

                setRows(processed);
                setStatus({ loading: false, error: null });
            } catch (e) {
                if (!abort.signal.aborted) {
                    setStatus({ loading: false, error: e.message || 'Error' });
                }
            }
        })();
        return () => abort.abort();
    }, [language, debug, t.error]);

    const hasData = rows.length > 0;
    // --- ADDED: Custom ticks array to prevent overlapping years ---
    const customYearTicks = [1990, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022];

    return (
        // --- CHANGED: Removed the ".minimal-tech-chart" class to use standard styles ---
        <div className="temperature-chart-card">
            {/* --- CHANGED: Replaced the old header with a standard one --- */}
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
                        <LineChart
                            data={rows}
                            margin={{ top: 8, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" />
                            {/* --- CHANGED: X-Axis now uses custom ticks to look clean --- */}
                            <XAxis
                                dataKey="year"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                ticks={customYearTicks}
                                padding={{ left: 20, right: 20 }}
                            />
                            {/* --- CHANGED: Y-Axis has a fixed domain for better display --- */}
                            <YAxis
                                domain={[-10, 30]}
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                                allowDecimals={false}
                            />
                            <Tooltip
                                cursor={{ stroke: 'rgba(0,0,0,0.25)', strokeDasharray: '4 4' }}
                                formatter={(v) => (v == null || Number.isNaN(v) ? '—' : `${v.toFixed(1)}°C`)}
                                contentStyle={{ fontSize: 12, borderRadius: 4 }}
                            />
                            {/* --- ADDED: A proper legend at the top --- */}
                            <Legend
                                verticalAlign="top"
                                wrapperStyle={{ fontSize: 12, paddingBottom: '10px' }}
                                iconType="rect"
                            />
                            {seriesKeys[0] && (
                                <Line
                                    type="monotone"
                                    dataKey={seriesKeys[0]}
                                    name={t.lineMax} // Uses the new I18N label
                                    stroke="#dc2626" // Red color for max temp
                                    strokeWidth={2}
                                    dot={{ r: 3.5, strokeWidth: 1, fill: '#fff' }}
                                    activeDot={{ r: 6 }}
                                    connectNulls
                                    isAnimationActive={false}
                                />
                            )}
                            {seriesKeys[1] && (
                                <Line
                                    type="monotone"
                                    dataKey={seriesKeys[1]}
                                    name={t.lineMin} // Uses the new I18N label
                                    stroke="#2563eb" // Blue color for min temp
                                    strokeWidth={2}
                                    dot={{ r: 3.5, strokeWidth: 1, fill: '#fff' }}
                                    activeDot={{ r: 6 }}
                                    connectNulls
                                    isAnimationActive={false}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TemperatureMinimalTechChart;
