// File: 'src/assets/components/Pages/Climate/Temperature/AnnualTemperatureChart.jsx'
import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';

const BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.27:3000/api/datasets';
const DATASET_SLUG = 'air-temperature';
const METADATA_URL = `${BASE}/${DATASET_SLUG}/metadata`;
const DATA_URL = `${BASE}/${DATASET_SLUG}/data`;

const COLORS = {
    primary: '#3b82f6',
    grid: 'rgba(0,0,0,.08)',
    text: '#6B7280',
    series0: '#16a34a'
};

const I18N = {
    en: {
        chartTitle: 'Annual Average Temperature',
        loading: 'Loading chart...',
        noData: 'No data available.',
        yAxis: 'Temperature (°C)',
        // CHANGED: Updated legend text
        line0: '1961-1990 Average',
        line1: 'Annual Avg. Temp. (°C)',
        source: 'Source: Ministry of Environmental Protection and Agriculture of Georgia',
        fetchErr: 'Network error',
        keyErr: 'Could not determine data keys (0,1)',
        rowErr: 'No valid data rows'
    },
    ka: {
        chartTitle: 'საქართველოს დათბობის ტენდენცია: საშუალო წლიური ტემპერატურა',
        loading: 'დიაგრამა იტვირთება...',
        noData: 'მონაცემები მიუწვდომელია.',
        yAxis: 'ტემპერატურა (°C)',
        // CHANGED: Updated legend text to match the target image
        line0: '1961-1990 წლების საშუალო',
        line1: 'საშუალო წლიური ტემპ. (°C)',
        source: 'წყარო: საქართველოს გარემოს დაცვისა და სოფლის მეურნეობის სამინისტრო',
        fetchErr: 'ქსელური შეცდომა',
        keyErr: 'ვერ განვსაზღვრე კლავიშები (0,1)',
        rowErr: 'რიგები ვერ მოიძებნა'
    }
};

// Collect potential series keys
function deriveSeriesKeys(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return [];
    const firstObj = rows.find(r => r && typeof r === 'object');
    if (!firstObj) return [];
    return Object.keys(firstObj).filter(k => k !== 'year');
}

const AnnualTemperatureChart = ({ language = 'ka', height = 400, debug = false }) => {
    const t = I18N[language] || I18N.ka;
    const [rows, setRows] = useState([]);
    const [seriesKeys, setSeriesKeys] = useState([]); // [key0, key1]
    const [status, setStatus] = useState({ loading: true, error: null });

    useEffect(() => {
        const abort = new AbortController();

        async function load() {
            try {
                setStatus({ loading: true, error: null });

                const [metaRes, dataRes] = await Promise.all([
                    fetch(METADATA_URL, { signal: abort.signal }),
                    fetch(DATA_URL, { signal: abort.signal })
                ]);
                if (!metaRes.ok || !dataRes.ok) throw new Error(t.fetchErr);

                const metadata = await metaRes.json();
                const dataJson = await dataRes.json();

                let catKeys = [];
                const rawCats = metadata?.data?.categories;
                if (Array.isArray(rawCats)) {
                    catKeys = rawCats.filter(k => k !== 'year');
                }

                const raw = dataJson?.data?.data || [];
                if (catKeys.length < 2) {
                    const derived = deriveSeriesKeys(raw);
                    const merged = [...new Set([...catKeys, ...derived])];
                    catKeys = merged;
                }

                if (catKeys.length === 0) throw new Error(t.keyErr);

                const selKeys = catKeys.slice(0, 2);
                setSeriesKeys(selKeys);

                const processed = raw
                    .filter(r => r && r.year != null)
                    .map(r => {
                        const base = { year: Number(r.year) };
                        selKeys.forEach(k => {
                            const v = r[k];
                            base[k] = (v === '' || v == null) ? null : Number(v);
                        });
                        return base;
                    })
                    .filter(r => !Number.isNaN(r.year))
                    .sort((a, b) => a.year - b.year);

                if (processed.length === 0) throw new Error(t.rowErr);

                const anyValue = processed.some(r => selKeys.some(k => r[k] != null && !Number.isNaN(r[k])));
                if (!anyValue) throw new Error(t.rowErr);

                if (debug) {
                    console.debug('[AnnualTemperatureChart] keys=', selKeys);
                    console.debug('[AnnualTemperatureChart] first row processed=', processed[0]);
                }

                setRows(processed);
                setStatus({ loading: false, error: null });
            } catch (e) {
                if (abort.signal.aborted) return;
                setStatus({ loading: false, error: e.message || 'Error' });
            }
        }

        load();
        return () => abort.abort();
    }, [language, t, debug]);

    const hasData = rows.length > 0;

    return (
        <div className="temperature-chart-card">
            <div className="temperature-chart-header">
                <h3 className="temperature-chart-title">{t.chartTitle}</h3>
            </div>

            {status.loading && <div className="temperature-chart-state">{t.loading}</div>}
            {status.error && <div className="temperature-chart-error">Error: {status.error}</div>}

            {hasData && (
                <div className="temperature-chart-canvas" style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={rows}
                            margin={{ top: 8, right: 16, left: 10, bottom: 26 }}
                        >
                            <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: COLORS.text, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                padding={{ left: 20, right: 20 }}
                            />
                            <YAxis
                                // CHANGED: Set the domain to start from 8 instead of 0
                                domain={[8, 'auto']}
                                tick={{ fill: COLORS.text, fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={40}
                            >
                                <Label
                                    value={t.yAxis}
                                    angle={-90}
                                    position="insideLeft"
                                    offset={0}
                                    style={{ textAnchor: 'middle', fill: COLORS.text, fontSize: 12 }}
                                />
                            </YAxis>
                            <Tooltip />
                            {/* CHANGED: Moved the legend to the top */}
                            <Legend verticalAlign="top" iconSize={20} wrapperStyle={{ fontSize: 12, paddingBottom: '10px' }} />

                            {seriesKeys[0] && (
                                <Line
                                    type="monotone"
                                    dataKey={seriesKeys[0]}
                                    name={t.line0}
                                    stroke={COLORS.series0}
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    // CHANGED: Removed the custom square dot
                                    dot={false}
                                    activeDot={false}
                                    isAnimationActive={false}
                                    connectNulls
                                />
                            )}

                            {seriesKeys[1] && (
                                <Line
                                    type="monotone"
                                    dataKey={seriesKeys[1]}
                                    name={t.line1}
                                    stroke={COLORS.primary}
                                    strokeWidth={2}
                                    // CHANGED: Enabled the default circular dots by removing `dot={false}`
                                    activeDot={{ r: 6 }}
                                    isAnimationActive={false}
                                    connectNulls
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!status.loading && !status.error && !hasData && (
                <div className="temperature-chart-state">{t.noData}</div>
            )}

            <div className="temperature-chart-footer">
                <p>{t.source}</p>
            </div>
        </div>
    );
};

export default AnnualTemperatureChart;