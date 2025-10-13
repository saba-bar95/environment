import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForHfcChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year,
        hfcs: item["HFCs"] || 0,
    }));

    return chartData;
}

// --- CUSTOM TOOLTIP COMPONENT ---
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{`Year: ${data.year}`}</p>
                <p style={{ margin: '5px 0 0 0' }}>{`HFCs: ${data.hfcs.toFixed(1)} kt`}</p>
            </div>
        );
    }
    return null;
};

// --- THE SCATTER PLOT COMPONENT ---
const HfcScatterPlot = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
            >
                <CartesianGrid />
                <XAxis
                    type="number"
                    dataKey="year"
                    name="Year"
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tickFormatter={(tick) => tick.toString()}
                    angle={-45}
                    textAnchor="end"
                />
                <YAxis
                    type="number"
                    dataKey="hfcs"
                    name="HFCs"
                    unit=" kt"
                    domain={[0, 200]}
                    ticks={[0, 50.0, 100.0, 150.0, 200.0]}
                >
                    <Label value="კილოტონა (კტ)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="HFC Emissions" data={data} fill="#8B5CF6" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const HfcScatterPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForHfcChart(apiData);
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
                HFC-ების (ფტორირებული აირების) ზრდა
            </h1>
            <h2 style={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'normal', color: '#555', marginBottom: '30px' }}>
                HFC-ები იზომება კილოტონებში (კტ)
            </h2>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <HfcScatterPlot data={chartData} />
            )}
        </div>
    );
};

export default HfcScatterPage;
