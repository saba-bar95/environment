import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// --- CONFIGURATION ---
// Corrected the IP address from 199. to 192.
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';

// --- DATA TRANSFORMATION FUNCTION ---
// This function now prepares data only for the Georgia chart.
function transformDataForDeviationCharts(apiData) {
    const chartData = apiData.data.data.map(item => {
        // We multiply by 100 to convert the deviation ratio (e.g., 0.93) to a percentage deviation (-7%).
        // The historical average is 1.0, so (0.93 - 1) * 100 = -7.
        const geoDeviation = item["GEO - DEVIATION"] ? (item["GEO - DEVIATION"] - 1) * 100 : null;

        return {
            year: item.year.toString(),
            georgia_deviation: geoDeviation,
        };
    });

    // Filter for the years shown in the screenshot
    return chartData.filter(d => parseInt(d.year, 10) >= 1990);
}


// --- REUSABLE BAR CHART COMPONENT ---
// This component can render a deviation chart for any data key.
const DeviationBarChart = ({ data, dataKey, title }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    // Format Y-axis ticks to show the '%' symbol
    const formatYAxis = (tick) => `${tick}%`;

    return (
        <div style={{ marginBottom: '40px' }}>
            <h3 style={{ textAlign: 'center', fontWeight: 'normal' }}>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={formatYAxis} domain={['auto', 'auto']} />
                    <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    <Bar dataKey={dataKey}>
                        {data.map((entry, index) => (
                            // This is the logic for conditional coloring
                            <Cell key={`cell-${index}`} fill={entry[dataKey] >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const DeviationChartsPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForDeviationCharts(apiData);
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
            <h1 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '40px' }}>
                2. გადახრა 1961-1990 წლების საშუალოდან
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {/* Display only the single chart for Georgia */}
            {chartData && (
                <DeviationBarChart
                    data={chartData}
                    dataKey="georgia_deviation"
                    title="გადახრა საშუალოდან (%) - საქართველო"
                />
            )}
        </div>
    );
};

export default DeviationChartsPage;

