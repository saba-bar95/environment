import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';
const BASE_YEAR = 2000;

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForIndexChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    // Step 1: Find the baseline values from the base year (2000)
    const baseYearData = apiData.data.data.find(item => item.year === BASE_YEAR);
    if (!baseYearData) {
        console.error(`Base year ${BASE_YEAR} not found in data.`);
        return [];
    }

    const baseEmissions = baseYearData["AGGREGATED_EMISSIONS"];
    const baseGdp = baseYearData["GDP_PPP"];
    const basePopulation = baseYearData["POPULATION"];

    // Step 2: Calculate the indexed value for each year relative to the base year
    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        emissions_index: (item["AGGREGATED_EMISSIONS"] / baseEmissions) * 100,
        gdp_index: (item["GDP_PPP"] / baseGdp) * 100,
        population_index: (item["POPULATION"] / basePopulation) * 100,
    }));

    return chartData;
}


// --- THE MULTI-LINE CHART COMPONENT ---
const IndexedTrendsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    // Configuration for each line
    const lines = [
        { key: 'emissions_index', name: 'მთლიანი გაფრქვევები', color: '#ef4444' }, // Red
        { key: 'gdp_index', name: 'მშპ (მუპ)', color: '#2dd4bf' },        // Teal
        { key: 'population_index', name: 'მოსახლეობა', color: '#6b7280' },     // Grey
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis
                    domain={[50, 300]}
                    ticks={[50, 100, 150, 200, 250, 300]}
                    label={{ value: 'ინდექსი', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value, name) => [`${value.toFixed(1)}`, name]} />
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


// --- MAIN PAGE COMPONENT ---
const IndexChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForIndexChart(apiData);
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
                ზრდის ტენდენციები (2000=100)
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <IndexedTrendsChart data={chartData} />
            )}
        </div>
    );
};

export default IndexChartPage;
