import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION (Corrected) ---
// This function now returns the raw values, as Recharts' "stackOffset='expand'" handles the percentage calculation.
function transformDataForPercentageChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => {
        return {
            year: item.year.toString(),
            energy: item["ENERGY"] || 0,
            industrial: item["INDUSTRIAL"] || 0,
            agriculture: item["AGRICULTURE"] || 0,
            waste: item["WASTE"] || 0,
        };
    });

    return chartData;
}


// --- THE 100% STACKED AREA CHART COMPONENT (Corrected) ---
const EmissionsPercentageChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    const areas = [
        { key: 'energy', name: 'ენერგეტიკა', color: '#ef4444' },
        { key: 'agriculture', name: 'სოფლის მეურნეობა', color: '#f97316' },
        { key: 'industrial', name: 'სამრეწველო პროცესები', color: '#eab308' },
        { key: 'waste', name: 'ნარჩენები', color: '#22c55e' },
    ];

    // Correctly formats the Y-axis ticks for a 0-1 scale.
    const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={data}
                stackOffset="expand" // This turns it into a 100% stacked chart
                margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={toPercent} />
                {/* Correctly formats the tooltip value for a 0-1 scale */}
                <Tooltip formatter={(value, name) => [`${(value * 100).toFixed(1)}%`, name]}/>
                <Legend />
                {areas.map(area => (
                    <Area
                        key={area.key}
                        type="monotone"
                        dataKey={area.key}
                        stackId="1"
                        name={area.name}
                        stroke={area.color}
                        fill={area.color}
                        fillOpacity={0.7}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const PercentageChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForPercentageChart(apiData);
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
                სექტორების წილი მთლიან გაფრქვევებში (%)
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <EmissionsPercentageChart data={chartData} />
            )}
        </div>
    );
};

export default PercentageChartPage;

