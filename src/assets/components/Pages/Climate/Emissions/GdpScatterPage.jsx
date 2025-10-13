import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForGdpScatter(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year,
        gdp: item["GDP_PPP"] || 0,                 // X-axis value (Index 20)
        total_emissions: item["AGGREGATED_EMISSIONS"] || 0, // Y-axis value (Index 4)
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
                <p style={{ margin: '5px 0 0 0' }}>{`GDP: ${data.gdp.toFixed(1)} bln Int. $`}</p>
                <p style={{ margin: '5px 0 0 0' }}>{`Total Emissions: ${data.total_emissions.toFixed(1)} Mt`}</p>
            </div>
        );
    }
    return null;
};

// --- THE SCATTER PLOT COMPONENT ---
const GdpScatterPlot = ({ data }) => {
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
                    dataKey="gdp"
                    name="GDP"
                    domain={['dataMin - 2', 'dataMax + 2']}
                >
                    <Label value="მშპ (მლრდ. საერთ. $)" offset={-25} position="insideBottom" />
                </XAxis>
                <YAxis
                    type="number"
                    dataKey="total_emissions"
                    name="Total Emissions"
                    domain={['dataMin - 2', 'dataMax + 2']}
                >
                    <Label value="მთლიანი გაფრქვევები (მგტ)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="Yearly Data" data={data} fill="#3b82f6" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const GdpScatterPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForGdpScatter(apiData);
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
                მშპ vs. მთლიანი გაფრქვევები
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <GdpScatterPlot data={chartData} />
            )}
        </div>
    );
};

export default GdpScatterPage;
