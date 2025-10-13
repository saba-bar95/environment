import React, { useEffect, useState } from 'react';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BASE = import.meta.env.VITE_API_BASE || 'http://192.168.1.27:3000/api/datasets';
const DATASET_SLUG = 'air-temperature';
const METADATA_URL = `${BASE}/${DATASET_SLUG}/metadata`;
const DATA_URL = `${BASE}/${DATASET_SLUG}/data`;

const TARGET_INDEXES = [12, 13, 14, 15, 16];

const FACTOR_LABELS = {
    ka: {
        'GURIA - Annual average temperature (°C)': 'წლიური საშ.',
        'GURIA - Annual deviation from average temperature (°C)': 'გადახრა',
        'GURIA - Maximum monthly average temperature (°C)': 'მაქს. თვიური საშ.',
        'GURIA - Minimum monthly average temperature (°C)': 'მინ. თვიური საშ.',
        'GURIA - Average temperature for 1961-1990 (°C)': '1961-90 საშ.'
    },
    en: {
        'GURIA - Annual average temperature (°C)': 'Annual Avg.',
        'GURIA - Annual deviation from average temperature (°C)': 'Deviation',
        'GURIA - Maximum monthly average temperature (°C)': 'Max Monthly Avg.',
        'GURIA - Minimum monthly average temperature (°C)': 'Min Monthly Avg.',
        'GURIA - Average temperature for 1961-1990 (°C)': '1961-90 Avg.'
    }
};

const I18N = {
    en: {
        title: 'Guria Profile ({yearB} vs {yearA} Comparison)',
        loading: 'Loading...',
        noData: 'No data',
        error: 'Network error',
        legendA: '{yearA} (for comparison)',
        legendB: '{yearB}'
    },
    ka: {
        title: 'გურიის პროფილი ({yearB} წ. {yearA}-სთან შედარებით)',
        loading: 'იტვირთება...',
        noData: 'მონაცემები არაა',
        error: 'ქსელური შეცდომა',
        legendA: '{yearA} (შედარებისთვის)',
        legendB: '{yearB}'
    }
};

function deriveKeys(rows) {
    if (!Array.isArray(rows) || !rows.length) return [];
    const first = rows.find(r => r && typeof r === 'object');
    if (!first) return [];
    return Object.keys(first).filter(k => k !== 'year');
}

const TemperatureRadarComparisonChart = ({ language = 'ka', height = 420, debug = false }) => {
    const t = I18N[language] || I18N.ka;
    const labels = FACTOR_LABELS[language] || FACTOR_LABELS.ka;
    const [dataRows, setDataRows] = useState([]);
    const [status, setStatus] = useState({ loading: true, error: null });

    // --- DYNAMIC STATE: These will be determined from the data ---
    const [comparisonYears, setComparisonYears] = useState({ yearA: null, yearB: null });
    const [maxDomain, setMaxDomain] = useState(25); // Default, will be calculated

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

                // --- DYNAMIC YEAR DETECTION ---
                const allYears = raw.map(r => Number(r.year)).filter(y => !isNaN(y) && y >= 1990);
                const yearA = Math.min(...allYears);
                const yearB = Math.max(...allYears);
                setComparisonYears({ yearA, yearB });

                let categories = Array.isArray(meta?.data?.categories)
                    ? meta.data.categories.filter(k => k !== 'year')
                    : [];

                if (categories.length < Math.max(...TARGET_INDEXES) + 1) {
                    const derived = deriveKeys(raw);
                    const merged = [...categories];
                    derived.forEach(k => { if (!merged.includes(k)) merged.push(k); });
                    categories = merged;
                }

                const keys = TARGET_INDEXES.map(i => categories[i]).filter(Boolean);
                if (!keys.length) throw new Error('No category keys');

                const yearAObj = raw.find(r => Number(r?.year) === yearA) || {};
                const yearBObj = raw.find(r => Number(r?.year) === yearB) || {};

                const rows = keys.map(k => {
                    const vA = yearAObj[k];
                    const vB = yearBObj[k];
                    return {
                        factor: labels[k] || k,
                        yearAValue: (vA === '' || vA == null) ? null : Number(vA),
                        yearBValue: (vB === '' || vB == null) ? null : Number(vB)
                    };
                });

                // --- DYNAMIC DOMAIN CALCULATION ---
                let maxValue = 0;
                rows.forEach(r => {
                    if (r.yearAValue > maxValue) maxValue = r.yearAValue;
                    if (r.yearBValue > maxValue) maxValue = r.yearBValue;
                });
                const dynamicDomainMax = Math.ceil(maxValue / 5) * 5;
                setMaxDomain(dynamicDomainMax > 0 ? dynamicDomainMax : 25);


                const anyValue = rows.some(r => r.yearAValue != null || r.yearBValue != null);
                if (!anyValue) throw new Error(t.noData);

                setDataRows(rows);
                setStatus({ loading: false, error: null });
            } catch (e) {
                if (!abort.signal.aborted) {
                    setStatus({ loading: false, error: e.message || 'Error' });
                }
            }
        })();
        return () => abort.abort();
    }, [language, t.error, t.noData, debug, labels]);

    const hasData = dataRows.length > 0;
    const finalTitle = t.title.replace('{yearA}', comparisonYears.yearA).replace('{yearB}', comparisonYears.yearB);
    const legendA = t.legendA.replace('{yearA}', comparisonYears.yearA);
    const legendB = t.legendB.replace('{yearB}', comparisonYears.yearB);

    return (
        <div className="temperature-chart-card">
            <div className="temperature-chart-header">
                <h3 className="temperature-chart-title">{hasData ? finalTitle : t.title.replace('{yearA}', '...').replace('{yearB}', '...')}</h3>
            </div>

            {status.loading && <div className="temperature-chart-state">{t.loading}</div>}
            {status.error && <div className="temperature-chart-error">Error: {status.error}</div>}
            {!status.loading && !status.error && !hasData && (
                <div className="temperature-chart-state">{t.noData}</div>
            )}

            {hasData && (
                <div className="temperature-chart-canvas" style={{ height }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                            data={dataRows}
                            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                        >
                            <PolarGrid stroke="rgba(0,0,0,0.1)" />
                            <PolarAngleAxis
                                dataKey="factor"
                                tick={{ fill: '#374151', fontSize: 12 }}
                            />
                            {/* --- DYNAMIC DOMAIN in use --- */}
                            <PolarRadiusAxis
                                angle={90}
                                domain={[0, maxDomain]}
                                tick={{ fill: '#6b7280', fontSize: 11 }}
                                tickCount={6}
                            />
                            <Tooltip
                                formatter={(v, keyLabel) => [v, keyLabel === 'yearAValue' ? legendA : legendB]}
                                contentStyle={{ fontSize: 12, borderRadius: 4 }}
                            />
                            <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12, paddingBottom: '10px' }} />
                            <Radar
                                name={legendB}
                                dataKey="yearBValue"
                                stroke="#ea580c"
                                fill="#ea580c"
                                fillOpacity={0.3}
                                strokeWidth={2}
                            />
                            <Radar
                                name={legendA}
                                dataKey="yearAValue"
                                stroke="#6b7280"
                                fill="#6b7280"
                                fillOpacity={0.6}
                                strokeWidth={2}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default TemperatureRadarComparisonChart;

