import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// --- DATA TRANSFORMATION FUNCTION ---
// This function prepares the data for the multi-line chart.
function transformDataForMultiLineChart(apiData) {
    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        georgia: item["GEO - ANNUAL"] || null,
        tbilisi: item["TBILISI - ANNUAL"] || null,
        samegrelo: item["SAMEGRELO - ANNUAL"] || null,
        kvemo_kartli: item["KVEMO_KARTLI - ANNUAL"] || null,
    }));

    // Filter for the years shown in the screenshot (1990 onwards)
    return chartData.filter(d => parseInt(d.year, 10) >= 1990);
}


// --- THE MULTI-LINE CHART COMPONENT ---
const MultiLocationChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    // Configuration for each line, matching the screenshot's legend
    const lines = [
        { key: 'georgia', name: 'საქართველო', color: '#3b82f6' }, // Blue
        { key: 'tbilisi', name: 'თბილისი', color: '#f97316' }, // Orange
        { key: 'samegrelo', name: 'სამეგრელო-ზემო სვანეთი', color: '#8b5cf6' }, // Purple
        { key: 'kvemo_kartli', name: 'ქვემო ქართლი', color: '#ef4444' } // Red
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[500, 2000]} ticks={[500, 1000, 1500, 2000]} unit=" mm" />
                <Tooltip />
                <Legend />
                {lines.map(line => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const MultiLineChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForMultiLineChart(apiData);
                setChartData(transformedData);
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem' }}>
                4. წლიური ნალექები ქვეყნის, თბილისის, საქართველოს ყველაზე უხვ და მწირ ნალექიანი რეგიონების მიხედვით
            </h1>
            <h2 style={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'normal', color: '#555', marginBottom: '30px' }}>
                წლიური ნალექები (მმ)
            </h2>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <MultiLocationChart data={chartData} />
            )}
        </div>
    );
};

export default MultiLineChartPage;
