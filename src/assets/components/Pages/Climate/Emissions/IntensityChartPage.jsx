import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForIntensityChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        per_capita: item["AGGREGATED_PER_CAPITA"] || null,
        per_gdp: item["AGGREGATED_PER_GDP"] || null,
    }));

    return chartData;
}


// --- THE DUAL-AXIS LINE CHART COMPONENT ---
const EmissionsIntensityChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />

                {/* Left Y-Axis for Per Capita data */}
                <YAxis yAxisId="left" domain={[1.0, 4.0]} ticks={[1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0]}>
                    <Label value="ტ / სულზე" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                </YAxis>

                {/* Right Y-Axis for Per GDP data */}
                <YAxis yAxisId="right" orientation="right" domain={[0.1, 0.3]} ticks={[0.2, 0.3]}>
                    <Label value="ტ / 1000 საერთ. $" angle={-90} position="insideRight" style={{ textAnchor: 'middle' }} />
                </YAxis>

                <Tooltip />
                <Legend />

                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="per_capita"
                    name="ერთ სულ მოსახლეზე (ტ/სულზე)"
                    stroke="#3b82f6" // Blue
                    strokeWidth={3}
                    dot={false}
                    connectNulls
                />
                <Line
                    yAxisId="right"
                    type="step"
                    dataKey="per_gdp"
                    name="მშპ-ზე (ტ/1000 საერთ. $)"
                    stroke="#2dd4bf" // Teal
                    strokeWidth={3}
                    dot={false}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const IntensityChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForIntensityChart(apiData);
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
                გაფრქვევების ინტენსივობის ტენდენციები
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <EmissionsIntensityChart data={chartData} />
            )}
        </div>
    );
};

export default IntensityChartPage;
