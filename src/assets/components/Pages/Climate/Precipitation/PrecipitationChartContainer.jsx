import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// --- DATA TRANSFORMATION FUNCTION ---
// This function is now correct for the new API data structure.
function transformDataForPrecipitationChart(apiData) {
    let historicalAverage = null;

    if (apiData.data.data && apiData.data.data.length > 0) {
        historicalAverage = apiData.data.data[0]["TBILISI - HISTORICAL_AVG"];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        precipitation: item["TBILISI - ANNUAL"] || null,
    }));

    const filteredChartData = chartData.filter(d => parseInt(d.year, 10) >= 1990);

    return { chartData: filteredChartData, historicalAverage };
}


// --- THE AREA CHART COMPONENT ---
// Styled to match the clean design from your latest screenshot.
const TbilisiPrecipitationChart = ({ data, historicalAverage }) => {
    if (!data || data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '40px' }}>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={{ top: 20, right: 50, left: 20, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" angle={-30} textAnchor="end" height={50} />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip />

                {historicalAverage && (
                    <ReferenceLine y={historicalAverage} stroke="#e11d48" strokeWidth={2}>
                        <Label
                            value="1961-1990 საშ."
                            position="right"
                            fill="#fff"
                            style={{
                                background: '#e11d48',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px'
                            }}
                        />
                    </ReferenceLine>
                )}

                <Area
                    type="monotone"
                    dataKey="precipitation"
                    name="ნალექი (მმ)"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#colorFill)"
                    connectNulls
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
// This is now a simple container for the title and the chart.
const PrecipitationPage = () => {
    const [chartData, setChartData] = useState(null);
    const [historicalAverage, setHistoricalAverage] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const { chartData, historicalAverage } = transformDataForPrecipitationChart(apiData);
                setChartData(chartData);
                setHistoricalAverage(historicalAverage);
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
            <h1 style={{ fontSize: '1.5rem', textAlign: 'center' }}>1. წლიური ნალექების ტენდენცია</h1>
            <h2 style={{ fontSize: '1.1rem', textAlign: 'center', fontWeight: 'normal', color: '#555', marginBottom: '30px' }}>
                საქართველოში
            </h2>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <TbilisiPrecipitationChart data={chartData} historicalAverage={historicalAverage} />
            )}
        </div>
    );
};

export default PrecipitationPage;
