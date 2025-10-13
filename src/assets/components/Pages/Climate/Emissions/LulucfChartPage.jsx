import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForLulucfChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        lulucf: item["LULUCF"] || 0,
    }));

    return chartData;
}


// --- THE BAR CHART COMPONENT ---
const LulucfBarChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                    domain={['dataMin - 1', 0]} // Set domain to handle negative values
                    ticks={[-5.0, -4.0, -3.0, -2.0, -1.0, 0.0]}
                    label={{ value: 'ემისიები (მგტ)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value) => `${value.toFixed(1)} მგტ`} />
                <Bar
                    dataKey="lulucf"
                    name="LULUCF-ის წმინდა ემისიები"
                    fill="#22c55e" // Green color
                />
            </BarChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const LulucfChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForLulucfChart(apiData);
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
                LULUCF-ის წმინდა ემისიების დინამიკა
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <LulucfBarChart data={chartData} />
            )}
        </div>
    );
};

export default LulucfChartPage;
