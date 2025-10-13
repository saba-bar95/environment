import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';

const BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.27:3000/api/datasets';
const DATASET_SLUG = 'air-temperature';
const METADATA_URL = `${BASE}/${DATASET_SLUG}/metadata`;
const DATA_URL = `${BASE}/${DATASET_SLUG}/data`;

// Target zero-based category indexes from your dataset
const TARGET_INDEXES = [1, 6, 13, 19]; // These might need adjustment if your data source changes

// --- CHANGED: Updated series labels and colors to match your target design ---
const SERIES_STYLES = [
    { stroke: '#16a34a', labelKa: 'საქართველო', labelEn: 'Georgia' },
    { stroke: '#2563eb', labelKa: 'თბილისი', labelEn: 'Tbilisi' },
    { stroke: '#ea580c', labelKa: 'გურია', labelEn: 'Guria' },
    { stroke: '#6b7280', labelKa: 'რაჭა-ლეჩხუმი', labelEn: 'Racha-Lechkhumi' }
];

// --- CHANGED: Updated the Georgian chart title ---
const I18N = {
    ka: {
        title: 'ქვეყნის, თბილისის და საქართველოს ყველააზე ცივი და თბილი რეგიონების ტემპერატურული ტენდენციები',
        yAxis: 'მნიშვნელობა',
        loading: 'იტვირთება...',
        noData: 'მონაცემები არაა',
        fetchErr: 'ქსელური შეცდომა',
        keyErr: 'საჭირო ინდექსების კლავიშები ვერ მოიძებნა',
        rowErr: 'ვერ ვპოულობ ვალიდურ რიგებს'
    },
    en: {
        title: 'Temperature trends for Georgia, Tbilisi, and coldest/warmest regions (1990–2022)',
        yAxis: 'Value',
        loading: 'Loading...',
        noData: 'No data',
        fetchErr: 'Network error',
        keyErr: 'Required index keys missing',
        rowErr: 'No valid rows'
    }
};

// This helper function isn't strictly needed if metadata is reliable, but it's a good fallback.
function deriveOrderedKeys(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const first = rows.find(r => r && typeof r === 'object');
    if (!first) return [];
    return Object.keys(first).filter(k => k !== 'year');
}

const TemperatureMultiIndexLineChart = ({ language = 'ka', height = 420, debug = false }) => {
    const t = I18N[language] || I18N.ka;
    const [rows, setRows] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
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
                if (!metaRes.ok || !dataRes.ok) throw new Error(t.fetchErr);

                const meta = await metaRes.json();
                const dataJson = await dataRes.json();
                const raw = dataJson?.data?.data || [];

                let categories = Array.isArray(meta?.data?.categories)
                    ? meta.data.categories.filter(k => k !== 'year')
                    : [];

                if (categories.length < Math.max(...TARGET_INDEXES) + 1) {
                    const derived = deriveOrderedKeys(raw);
                    const merged = [...categories];
                    derived.forEach(k => { if (!merged.includes(k)) merged.push(k); });
                    categories = merged;
                }

                const keys = TARGET_INDEXES.map(i => categories[i]).filter(Boolean);

                if (keys.length === 0) throw new Error(t.keyErr);
                setSelectedKeys(keys);

                const processed = raw
                    .filter(r => r && r.year != null && r.year >= 1990 && r.year <= 2022)
                    .map(r => {
                        const base = { year: Number(r.year) };
                        keys.forEach(k => {
                            const v = r[k];
                            base[k] = (v === '' || v == null) ? null : Number(v);
                        });
                        return base;
                    })
                    .filter(r => !Number.isNaN(r.year))
                    .sort((a, b) => a.year - b.year);

                if (processed.length === 0) throw new Error(t.rowErr);
                const anyVal = processed.some(r => keys.some(k => r[k] != null && !Number.isNaN(r[k])));
                if (!anyVal) throw new Error(t.rowErr);

                if (debug) {
                    console.debug('[MultiIndexChart] categories=', categories, 'picked=', keys, 'sample=', processed[0]);
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
    }, [language, t, debug]);

    // --- CHANGED: Create a custom ticks array for the X-axis ---
    const customYearTicks = [1990, 2000, 2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022];
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
                        <LineChart
                            data={rows}
                            margin={{ top: 8, right: 20, left: 10, bottom: 5 }}
                        >
                            <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="3 3" />
                            {/* --- CHANGED: Updated XAxis props for better tick display --- */}
                            <XAxis
                                dataKey="year"
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                ticks={customYearTicks} // Use the custom ticks
                                padding={{ left: 20, right: 20 }}
                            />
                            {/* --- CHANGED: Ensured YAxis domain starts at 4 --- */}
                            <YAxis
                                domain={[4, 14]} // Starts the Y-axis at 4
                                tick={{ fill: '#6B7280', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            >
                                <Label
                                    value={t.yAxis}
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: '#6B7280', fontSize: 12 }}
                                />
                            </YAxis>
                            <Tooltip
                                formatter={(v) => (v == null || Number.isNaN(v) ? '—' : v)}
                                cursor={{ stroke: 'rgba(0,0,0,0.25)', strokeDasharray: '4 4' }}
                            />
                            {/* --- CHANGED: Updated Legend style --- */}
                            <Legend verticalAlign="top" height={34} wrapperStyle={{ fontSize: 12 }} iconType="square" />
                            {selectedKeys.map((k, idx) => {
                                const style = SERIES_STYLES[idx];
                                if (!style) return null;
                                const name = language === 'ka' ? style.labelKa : style.labelEn;
                                return (
                                    <Line
                                        key={k}
                                        type="monotone"
                                        dataKey={k}
                                        name={name}
                                        stroke={style.stroke}
                                        strokeWidth={2}
                                        // --- CHANGED: Removed dots for a solid line ---
                                        dot={false}
                                        activeDot={false}
                                        connectNulls
                                        isAnimationActive={false}
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TemperatureMultiIndexLineChart;
