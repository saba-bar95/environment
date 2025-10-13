import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/geological-phenomena/data';
const META_URL = 'http://192.168.1.27:3000/api/datasets/geological-phenomena/metadata';

// --- DYNAMIC PERIOD GENERATION ---
// This function creates decade-based groupings from the available years.
function generatePeriods(years) {
    const periods = {};
    const colors = ['#4F86C6', '#4FD1C5', '#8B5CF6', '#F97316', '#EF4444']; // Blue, Teal, Purple, Orange, Red

    if (!years || years.length === 0) return {};

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    const startDecade = Math.floor(minYear / 10) * 10;
    const endDecade = Math.floor(maxYear / 10) * 10;

    let colorIndex = 0;
    for (let decade = startDecade; decade <= endDecade; decade += 10) {
        const periodName = `${decade}-იანები`;
        const start = Math.max(minYear, decade);
        const end = Math.min(maxYear, decade + 9);

        if (years.some(y => y >= start && y <= end)) {
            periods[periodName] = {
                start: start,
                end: end,
                color: colors[colorIndex % colors.length]
            };
            colorIndex++;
        }
    }
    return periods;
}

// --- DATA TRANSFORMATION FUNCTION ---
// Now accepts the dynamically generated periods.
function transformDataForDonutChart(apiData, periods) {
    const periodTotals = {};
    Object.keys(periods).forEach(name => {
        periodTotals[name] = 0;
    });

    apiData.data.data.forEach(item => {
        const year = item.year;
        const totalEvents = (item["0"] || 0) + (item["2"] || 0);

        for (const periodName in periods) {
            const period = periods[periodName];
            if (year >= period.start && year <= period.end) {
                periodTotals[periodName] += totalEvents;
                break;
            }
        }
    });

    const chartData = Object.keys(periodTotals).map(name => ({
        name: name,
        value: periodTotals[name],
    }));

    return chartData;
}

// --- CUSTOM LABEL FOR PERCENTAGES ---
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

// --- THE DONUT CHART COMPONENT ---
// Now receives periods to get the correct colors.
const GeologicalDonutChart = ({ data, periods }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    const colors = data.map(entry => periods[entry.name]?.color || '#8884d8');

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={80}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()} (სულ)`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

// --- MAIN CONTAINER COMPONENT ---
const DonutChartContainer = () => {
    const [chartData, setChartData] = useState(null);
    const [periods, setPeriods] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataResponse, metaResponse] = await Promise.all([
                    fetch(DATA_URL),
                    fetch(META_URL)
                ]);
                if (!dataResponse.ok || !metaResponse.ok) {
                    throw new Error('API data fetch failed');
                }
                const apiData = await dataResponse.json();
                const apiMetadata = await metaResponse.json();

                // 1. Generate periods dynamically from the metadata years
                const years = apiMetadata.data.metadata.variables
                    .find(v => v.code === 'Year')
                    .valueTexts.map(y => parseInt(y, 10));
                const dynamicPeriods = generatePeriods(years);
                setPeriods(dynamicPeriods);

                // 2. Transform data using the dynamic periods
                const transformedData = transformDataForDonutChart(apiData, dynamicPeriods);
                setChartData(transformedData);

            } catch (e) {
                setError(e.message);
                console.error("Failed to process data:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading chart data... ⏳</div>;
    if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>Error: {error} 😟</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h3 style={{ textAlign: 'center' }}>
                გეოლოგიური კატასტროფების განაწილების პროფილი (ჯამური შემთხვევები)
            </h3>
            <GeologicalDonutChart data={chartData} periods={periods} />
        </div>
    );
};

export default DonutChartContainer;

