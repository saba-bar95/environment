import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForEnergyChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        stationary: item["COMBUSTION_STATIONARY"] || 0,
        mobile: item["COMBUSTION_MOBILE"] || 0,
        fugitive: item["FUGITIVE"] || 0,
    }));

    return chartData;
}


// --- THE STACKED BAR CHART COMPONENT ---
const EnergySectorChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    // Configuration for each bar segment
    const bars = [
        { key: 'stationary', name: 'სტაციონარული წვა', color: '#ef4444' }, // Red
        { key: 'mobile', name: 'მობილური წვა', color: '#f97316' },     // Orange
        { key: 'fugitive', name: 'ფუგიტიური გაფრქვევები', color: '#6b7280' },  // Grey
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 12]} ticks={[0, 2.0, 4.0, 6.0, 8.0, 10.0, 12.0]} label={{ value: 'ემისიები (მგტ)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value.toFixed(1)} მგტ`} />
                <Legend />
                {bars.map(bar => (
                    <Bar
                        key={bar.key}
                        dataKey={bar.key}
                        name={bar.name}
                        stackId="a" // This ensures the bars stack
                        fill={bar.color}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const EnergyChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForEnergyChart(apiData);
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
                ენერგეტიკის სექტორის გაფრქვევების განაწილება (მგტ)
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <EnergySectorChart data={chartData} />
            )}
        </div>
    );
};

export default EnergyChartPage;
