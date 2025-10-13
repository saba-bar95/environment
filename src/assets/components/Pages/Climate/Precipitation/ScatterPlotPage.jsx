import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// --- DATA TRANSFORMATION FUNCTION ---
// This function prepares the data for the scatter plot.
function transformDataForScatterPlot(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year,
        annual_precipitation: item["GEO - ANNUAL"] || 0,      // X-axis
        max_monthly_precipitation: item["GEO - MAX_MONTHLY"] || 0, // Y-axis
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
                <p style={{ margin: '5px 0 0 0' }}>{`Annual: ${data.annual_precipitation} mm`}</p>
                <p style={{ margin: '5px 0 0 0' }}>{`Max Monthly: ${data.max_monthly_precipitation} mm`}</p>
            </div>
        );
    }
    return null;
};

// --- THE SCATTER PLOT COMPONENT ---
const PrecipitationScatterPlot = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid />
                <XAxis
                    type="number"
                    dataKey="annual_precipitation"
                    name="Annual Precipitation"
                    unit=" mm"
                    domain={['dataMin - 50', 'dataMax + 50']}
                />
                <YAxis
                    type="number"
                    dataKey="max_monthly_precipitation"
                    name="Max Monthly Precipitation"
                    unit=" mm"
                    domain={[0, 'dataMax + 20']}
                />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="Yearly Data" data={data} fill="#8884d8" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const ScatterPlotPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForScatterPlot(apiData);
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
                წლიური vs. თვიური მაქსიმალური ნალექები
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <PrecipitationScatterPlot data={chartData} />
            )}
        </div>
    );
};

export default ScatterPlotPage;
