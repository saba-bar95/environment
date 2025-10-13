import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

function transformDataForGasChart(apiData) {
    const rows = apiData?.data?.data;
    if (!rows || rows.length === 0) return [];
    return rows.map(item => ({
        year: String(item.year),
        co2: item['CO2'] ?? null,
        n2o: item['N2O'] ?? null,
        ch4: item['CH4'] ?? null,
    }));
}

const GasEmissionsChart = ({ data }) => {
    if (!data || data.length === 0) return <div className="chart-status">No data to display.</div>;

    const lines = [
        { key: 'co2', name: 'CO₂ (მგტ)', color: '#2dd4bf' },
        { key: 'ch4', name: 'CH₄ (მგტ)', color: '#f97316' },
        { key: 'n2o', name: 'N₂O (მგტ)', color: '#3b82f6' },
    ];

    return (
        <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data} margin={{ top: 5, right: 18, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 'dataMax + 2']} />
                <Tooltip
                    formatter={(value, name) => [
                        value == null ? '—' : `${Number(value).toFixed(1)} მგტ`,
                        name
                    ]}
                />
                <Legend />
                {lines.map(line => (
                    <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={3}
                        dot={false}
                        connectNulls
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

const GasEmissionsCard = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(DATA_URL);
                if (!res.ok) throw new Error('API data fetch failed');
                const json = await res.json();
                const transformed = transformDataForGasChart(json);
                if (!cancelled) setChartData(transformed);
            } catch (e) {
                if (!cancelled) setError(e.message);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="chart-card">
            {isLoading && <div className="chart-status">Loading chart data... ⏳</div>}
            {error && <div className="chart-error">Error: {error} 😟</div>}
            {chartData && <GasEmissionsChart data={chartData} />}
        </div>
    );
};

export default GasEmissionsCard;
