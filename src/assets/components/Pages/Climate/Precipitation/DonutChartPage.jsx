import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data';
const META_URL = 'http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/metadata';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForDonutChart(apiData, apiMetadata) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const firstYearData = apiData.data.data[0];
    const locations = apiMetadata.data.metadata.variables.find(v => v.code === 'Locations').valueTexts;

    const chartData = [
        { name: locations[0], value: firstYearData["GEO - HISTORICAL_AVG"] || 0 },
        { name: locations[1], value: firstYearData["TBILISI - HISTORICAL_AVG"] || 0 },
        { name: locations[2], value: firstYearData["SAMEGRELO - HISTORICAL_AVG"] || 0 },
        { name: locations[3], value: firstYearData["KVEMO_KARTLI - HISTORICAL_AVG"] || 0 }
    ];

    const legendMap = {
        'საქართველო': 'საქართველო',
        'რეგიონი მაქსიმალური საშუალო ნალექით 1961-1990 წლებში: სამეგრელო და ზემო სვანეთი': 'სამეგრელო-ზემო სვანეთი',
        'რეგიონი მინიმალური საშუალო ნალექით 1961-1990 წლებში: ქვემო ქართლი': 'ქვემო ქართლი',
        'თბილისი': 'თბილისი'
    };

    return chartData.map(item => ({...item, name: legendMap[item.name] || item.name}));
}

// --- CUSTOM LABEL FOR PERCENTAGES ---
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontWeight="bold">
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};


// --- THE DONUT CHART COMPONENT (Corrected) ---
const HistoricalAverageDonutChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    const COLORS = ['#2DD4BF', '#A78BFA', '#F472B6', '#F97316'];
    // Correctly calculate the average of the values, not the sum.
    const averageValue = data.reduce((sum, entry) => sum + entry.value, 0) / (data.length || 1);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={90}
                    outerRadius={130}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={3}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} mm`} />
                <Legend />

                {/* Custom labels for the center of the donut */}
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fontSize="18" fill="#6b7280">
                    საშუალო
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="#111827">
                    {Math.round(averageValue)}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const DonutChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataResponse, metaResponse] = await Promise.all([
                    fetch(DATA_URL),
                    fetch(META_URL)
                ]);
                if (!dataResponse.ok || !metaResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();
                const apiMetadata = await metaResponse.json();

                const transformedData = transformDataForDonutChart(apiData, apiMetadata);
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
                5. ისტორიული საშუალო ნალექიანობა რეგიონების მიხედვით (1961-1990)
            </h1>
            <h2 style={{ fontSize: '1rem', textAlign: 'center', fontWeight: 'normal', color: '#555', marginBottom: '30px' }}>
                (ისტორიული ნალექი, მმ/წელი)
            </h2>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <HistoricalAverageDonutChart data={chartData} />
            )}
        </div>
    );
};

export default DonutChartPage;

