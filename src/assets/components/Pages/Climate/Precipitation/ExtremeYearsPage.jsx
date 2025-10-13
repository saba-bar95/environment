import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const META_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/metadata';
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// Helper: split "PREFIX - METRIC"
const splitCategory = (s) => {
    const i = s.indexOf(' - ');
    return i === -1 ? [s, ''] : [s.slice(0, i), s.slice(i + 3)];
};

// Fallback nice label
const niceLabelFromPrefix = (p) =>
    p.replace(/_/g, ' ')
        .toLowerCase()
        .replace(/(^|\s)\S/g, (c) => c.toUpperCase());

function transformForChart(metaJson, dataJson) {
    const rows = dataJson?.data?.data || [];
    const categories = dataJson?.data?.categories || [];
    if (!rows.length || !categories.length) {
        return { chartData: [], driestYear: null, wettestYear: null };
    }

    // 1) derive unique location prefixes from categories
    const seen = new Set();
    const prefixes = [];
    for (const c of categories) {
        const [prefix] = splitCategory(c);
        if (!seen.has(prefix)) {
            seen.add(prefix);
            prefixes.push(prefix);
        }
    }

    // 2) labels from metadata (Locations.valueTexts), fallback if missing
    const locVar = metaJson?.data?.metadata?.variables?.find(v => v.code === 'Locations');
    const valueTexts = Array.isArray(locVar?.valueTexts) ? locVar.valueTexts : [];
    const prefixToLabel = {};
    prefixes.forEach((p, i) => { prefixToLabel[p] = valueTexts[i] || niceLabelFromPrefix(p); });

    // 3) find the proper suffix names dynamically
    const suffixes = new Set(categories.map(c => splitCategory(c)[1]));
    const ANNUAL = [...suffixes].find(s => s.toUpperCase() === 'ANNUAL') ||
        [...suffixes].find(s => s.toUpperCase().includes('ANNUAL')) || 'ANNUAL';

    // 4) choose the country prefix (label contains "საქართველო") or fallback to first
    const countryPrefix =
        prefixes.find(p => (prefixToLabel[p] || '').includes('საქართველო')) || prefixes[0];

    // 5) driest/wettest by country's ANNUAL (actual year numbers)
    let driest = { year: null, value: Infinity };
    let wettest = { year: null, value: -Infinity };
    for (const r of rows) {
        const v = r[`${countryPrefix} - ${ANNUAL}`];
        if (typeof v === 'number') {
            if (v < driest.value) driest = { year: r.year, value: v };
            if (v > wettest.value) wettest = { year: r.year, value: v };
        }
    }
    const driestYear = driest.year ?? null;
    const wettestYear = wettest.year ?? null;
    if (driestYear == null || wettestYear == null) {
        return { chartData: [], driestYear: null, wettestYear: null };
    }

    // 6) rows for those years
    const driestRow = rows.find(r => r.year === driestYear);
    const wettestRow = rows.find(r => r.year === wettestYear);
    if (!driestRow || !wettestRow) {
        return { chartData: [], driestYear: null, wettestYear: null };
    }

    // 7) build chart rows: ANNUAL values for both years
    const chartData = prefixes.map(prefix => ({
        location: prefixToLabel[prefix],
        driest_annual: driestRow[`${prefix} - ${ANNUAL}`] ?? null,
        wettest_annual: wettestRow[`${prefix} - ${ANNUAL}`] ?? null,
    }));

    return { chartData, driestYear, wettestYear };
}

const ExtremeYearsBarChart = ({ data, driestYear, wettestYear }) => {
    if (!data?.length) return <div>მონაცემები ვერ მოიძებნა.</div>;
    return (
        <ResponsiveContainer width="100%" height={420}>
            <BarChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="location"
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                    height={70}
                />
                <YAxis />
                <Tooltip formatter={(v) => (v == null ? '—' : `${v} მმ`)} />
                <Legend />
                <Bar dataKey="driest_annual" name={`ყველაზე მშრალი წელი (${driestYear})`} fill="#ef4444" />
                <Bar dataKey="wettest_annual" name={`ყველაზე ნოტიო წელი (${wettestYear})`} fill="#22c55e" />
            </BarChart>
        </ResponsiveContainer>
    );
};

const ExtremeYearsPage = () => {
    const [chartData, setChartData] = useState(null);
    const [driestYear, setDriestYear] = useState(null);
    const [wettestYear, setWettestYear] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const [m, d] = await Promise.all([fetch(META_URL), fetch(DATA_URL)]);
                if (!m.ok || !d.ok) throw new Error('API data fetch failed');
                const [metaJson, dataJson] = await Promise.all([m.json(), d.json()]);

                const { chartData, driestYear, wettestYear } = transformForChart(metaJson, dataJson);
                setChartData(chartData);
                setDriestYear(driestYear);
                setWettestYear(wettestYear);
            } catch (e) {
                setError(e?.message || String(e));
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div style={{ padding: 20, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
            <div style={{ borderRadius: 16, background: '#f8fafc', padding: 16 }}>
                <h1 style={{ textAlign: 'center', fontSize: '1.25rem', margin: 0 }}>6. ექსტრემალური წლები</h1>
                <div style={{ textAlign: 'center', color: '#64748b', marginBottom: 12 }}>(მმ)</div>

                {isLoading && <div style={{ textAlign: 'center', padding: 40 }}>იტვირთება... ⏳</div>}
                {error && <div style={{ textAlign: 'center', padding: 40, color: 'red' }}>შეცდომა: {error}</div>}

                {chartData && (
                    <ExtremeYearsBarChart
                        data={chartData}
                        driestYear={driestYear}
                        wettestYear={wettestYear}
                    />
                )}
            </div>
        </div>
    );
};

export default ExtremeYearsPage;
