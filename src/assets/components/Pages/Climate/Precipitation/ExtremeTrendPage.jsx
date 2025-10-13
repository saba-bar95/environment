import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// --- DATA TRANSFORMATION FUNCTION ---
// This function prepares data and identifies extreme years to be annotated.
function transformDataForTrendChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        precipitation: item["GEO - ANNUAL"] || null,
    }));

    // Dynamically find a few extreme years to annotate
    // Sort by precipitation to find the highest and lowest values
    const sortedByPrecipitation = [...chartData].filter(d => d.precipitation !== null).sort((a, b) => a.precipitation - b.precipitation);

    const extremeYears = new Set();
    // Take the 2 driest and 3 wettest years as an example
    if (sortedByPrecipitation.length >= 5) {
        extremeYears.add(sortedByPrecipitation[0].year);
        extremeYears.add(sortedByPrecipitation[1].year);
        extremeYears.add(sortedByPrecipitation[sortedByPrecipitation.length - 1].year);
        extremeYears.add(sortedByPrecipitation[sortedByPrecipitation.length - 2].year);
        extremeYears.add(sortedByPrecipitation[sortedByPrecipitation.length - 3].year);
    }

    // Add an annotation 'type' to the extreme years
    return chartData.map(item => {
        if (extremeYears.has(item.year)) {
            // A simple check: if value is above a threshold, it's 'wet', otherwise 'dry'
            // A more robust solution might use local maxima/minima detection
            return { ...item, type: item.precipitation > 1100 ? 'wet' : 'dry' };
        }
        return item;
    });
}


// --- CUSTOM DOT FOR ANNOTATIONS ---
const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;

    if (payload.type === 'wet') {
        return (
            <g>
                <circle cx={cx} cy={cy} r={6} fill="#22c55e" />
                <text x={cx} y={cy - 20} textAnchor="middle" fill="#fff" style={{ background: '#22c55e', padding: '2px 6px', borderRadius: '4px' }}>
                    ნოტიო
                </text>
            </g>
        );
    }

    if (payload.type === 'dry') {
        return (
            <g>
                <circle cx={cx} cy={cy} r={6} fill="#ef4444" />
                <text x={cx} y={cy + 30} textAnchor="middle" fill="#fff" style={{ background: '#ef4444', padding: '2px 6px', borderRadius: '4px' }}>
                    მშრალი
                </text>
            </g>
        );
    }

    return null;
};


// --- THE AREA CHART COMPONENT ---
const ExtremeTrendChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={data}
                margin={{ top: 40, right: 30, left: 0, bottom: 20 }}
            >
                <defs>
                    <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[800, 1400]} ticks={[800, 1000, 1100, 1200, 1300, 1400]} />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="precipitation"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#chartFill)"
                    // Use the custom dot renderer
                    dot={<CustomizedDot />}
                    activeDot={{ r: 6 }}
                    connectNulls
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const ExtremeTrendPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForTrendChart(apiData);
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
                9. ექსტრემალური მაჩვენებლების ტენდენცია საქართველოში
            </h1>
            <h2 style={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'normal', color: '#555', marginBottom: '30px' }}>
                ყველაზე ნოტიო და მშრალი წლები
            </h2>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <ExtremeTrendChart data={chartData} />
            )}
        </div>
    );
};

export default ExtremeTrendPage;
