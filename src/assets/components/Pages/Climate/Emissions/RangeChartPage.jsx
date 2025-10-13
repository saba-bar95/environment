import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForRangeChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => {
        const totalEmissions = item["AGGREGATED_EMISSIONS"] || 0;
        const netEmissions = item["AGGREGATED_INCL_LULUCF"] || 0;

        return {
            year: item.year.toString(),
            // Recharts uses an array [min, max] for the dataKey to draw a range
            emission_range: [netEmissions, totalEmissions],
        };
    });

    return chartData;
}


// --- THE RANGE AREA CHART COMPONENT ---
const EmissionsRangeChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    // Custom tooltip to show both values clearly
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const range = payload[0].value;
            return (
                <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{`Year: ${label}`}</p>
                    <p style={{ margin: '5px 0 0 0', color: '#ef4444' }}>
                        {`Total Emissions: ${range[1].toFixed(1)} მგტ`}
                    </p>
                    <p style={{ margin: '5px 0 0 0', color: '#ef4444' }}>
                        {`Net Emissions: ${range[0].toFixed(1)} მგტ`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 20]} ticks={[0, 5.0, 10.0, 15.0, 20.0]} unit=" მგტ" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="emission_range"
                    name="ჯამური/წმინდა გადაფრქვევები"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                    strokeWidth={2}
                    connectNulls
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const RangeChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForRangeChart(apiData);
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
                ჯამური vs. წმინდა გადაფრქვევები (CO₂ ეკვ.)
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <EmissionsRangeChart data={chartData} />
            )}
        </div>
    );
};

export default RangeChartPage;
