// File: src/assets/components/Pages/Climate/Temperature/TemperatureAnomalyBarChart.jsx
import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from 'recharts';

const BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.27:3000/api/datasets';
const DATASET_SLUG = 'air-temperature';
const METADATA_URL = `${BASE}/${DATASET_SLUG}/metadata`;
const DATA_URL = `${BASE}/${DATASET_SLUG}/data`;

const COLORS = {
    blue: '#2563eb',
    redBase: { h: 4, s: 80 }, // HSL base for red scale
    grid: 'rgba(0,0,0,.08)',
    text: '#6B7280'
};

const I18N = {
    ka: {
        title: 'ჰაერის ტემპერატურის ანომალია (1961–1990 = 0)',
        yAxis: 'ანომალია (°C)',
        loading: 'იტვირთება...',
        noData: 'მონაცემები არაა',
        fetchErr: 'ქსელური შეცდომა',
        keyErr: 'ვერ ვპოულობ ინდექს 2-ს',
        rowErr: 'ვერ ვპოულობ რიგებს'
    },
    en: {
        title: 'Air Temperature Anomaly (1961–1990 = 0)',
        yAxis: 'Anomaly (°C)',
        loading: 'Loading...',
        noData: 'No data',
        fetchErr: 'Network error',
        keyErr: 'Index 2 key missing',
        rowErr: 'No rows'
    }
};

// Derive ordered non-year keys from first usable row
function deriveKeys(rows) {
    if (!Array.isArray(rows)) return [];
    const first = rows.find(r => r && typeof r === 'object');
    if (!first) return [];
    return Object.keys(first).filter(k => k !== 'year');
}

// Compute a light red fill varying by value magnitude
function redScale(val, min, max) {
    if (val == null || Number.isNaN(val)) return '#fecaca'; // fallback pale
    const span = (max - min) || 1;
    const norm = Math.min(1, Math.max(0, (val - min) / span));
    // Lightness from 88% (small) down to 50% (large)
    const lightness = 88 - norm * 38;
    return `hsl(${COLORS.redBase.h} ${COLORS.redBase.s}% ${lightness}%)`;
}

const TemperatureAnomalyBarChart = ({ language = 'ka', height = 420, debug = false }) => {
    const t = I18N[language] || I18N.ka;
    const [rows, setRows] = useState([]);
    const [keyIdx2, setKeyIdx2] = useState(null);
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

                // Prefer metadata categories
                let categories = Array.isArray(meta?.data?.categories)
                    ? meta.data.categories.filter(k => k !== 'year')
                    : [];

                if (categories.length < 3) {
                    const derived = deriveKeys(raw);
                    categories = [...new Set([...categories, ...derived])];
                }

                if (categories.length < 3) throw new Error(t.keyErr);
                const valueKey = categories[2]; // index 2 (third key)
                setKeyIdx2(valueKey);

                // Filter years 1990–2022
                const filtered = raw
                    .filter(r => r && r.year != null && r.year >= 1990 && r.year <= 2022)
                    .map(r => ({
                        year: Number(r.year),
                        value: r[valueKey] === '' || r[valueKey] == null ? null : Number(r[valueKey])
                    }))
                    .filter(r => !Number.isNaN(r.year))
                    .sort((a, b) => a.year - b.year);

                if (filtered.length === 0) throw new Error(t.rowErr);
                const anyVal = filtered.some(r => r.value != null && !Number.isNaN(r.value));
                if (!anyVal) throw new Error(t.rowErr);

                if (debug) {
                    // eslint-disable-next-line no-console
                    console.debug('[TemperatureAnomalyBarChart] key(2)=', valueKey, 'sample=', filtered[0]);
                }

                setRows(filtered);
                setStatus({ loading: false, error: null });
            } catch (e) {
                if (!abort.signal.aborted) {
                    setStatus({ loading: false, error: e.message || 'Error' });
                }
            }
        })();
        return () => abort.abort();
    }, [language, t]);

    const hasData = rows.length > 0;
    const values = rows.map(r => r.value).filter(v => v != null && !Number.isNaN(v));
    const min = Math.min(-0.5, ...values);
    const max = Math.max(2.5, ...values);

    return (
        <div className="temperature-chart-card">
            <div className="temperature-chart-header">
                <h3 className="temperature-chart-title">{t.title}</h3>
            </div>

            {status.loading && <div className="temperature-chart-state">{t.loading}</div>}
            {status.error && <div className="temperature-chart-error">Error: {status.error}</div>}

            {hasData && (
                <div className="temperature-chart-canvas" style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={rows}
                            margin={{ top: 10, right: 12, left: 4, bottom: 24 }}
                        >
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: COLORS.text, fontSize: 11 }}
                                interval={0}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                domain={[-0.5, 2.5]}
                                tick={{ fill: COLORS.text, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={44}
                            >
                                <Label
                                    value={t.yAxis}
                                    angle={-90}
                                    position="insideLeft"
                                    style={{ textAnchor: 'middle', fill: COLORS.text, fontSize: 12 }}
                                />
                            </YAxis>
                            <Tooltip
                                formatter={(v) => (v == null || Number.isNaN(v) ? '—' : v)}
                                cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                            />
                            <Bar
                                dataKey="value"
                                name={keyIdx2 || 'Value'}
                                radius={[2, 2, 0, 0]}
                                barSize={14}
                                isAnimationActive={false}
                                fill="#fca5a5"
                            >
                                {rows.map((entry, i) => {
                                    const isBlue = entry.year === 2012;
                                    const fill = isBlue
                                        ? COLORS.blue
                                        : redScale(entry.value, min, max);
                                    return (
                                        <rect
                                            key={`bar-${entry.year}`}
                                            x={0} // placeholder, Recharts will inject real positions (ignored)
                                            y={0}
                                            width={0}
                                            height={0}
                                            data-index={i}
                                            fill={fill}
                                        />
                                    );
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!status.loading && !status.error && !hasData && (
                <div className="temperature-chart-state">{t.noData}</div>
            )}
        </div>
    );
};

export default TemperatureAnomalyBarChart;
