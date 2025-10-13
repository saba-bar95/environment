import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';
const META_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/metadata';

// Map indexes to data keys and display names
const SECTOR_CONFIG = {
    7: { key: 'ENERGY', name: 'ენერგეტიკა', color: '#ef4444' },
    11: { key: 'INDUSTRIAL', name: 'სამრეწველო პროცესები', color: '#f97316' },
    12: { key: 'AGRICULTURE', name: 'სოფლის მეურნეობა', color: '#eab308' },
    14: { key: 'WASTE', name: 'ნარჩენები', color: '#22c55e' }
};

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForSectorChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    // Find the data for the latest year available
    const latestYearData = apiData.data.data.reduce((latest, current) =>
        current.year > latest.year ? current : latest
    );

    const chartData = Object.keys(SECTOR_CONFIG).map(index => {
        const config = SECTOR_CONFIG[index];
        return {
            name: config.name,
            value: latestYearData[config.key] || 0,
            color: config.color,
        };
    });

    return { data: chartData, year: latestYearData.year };
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


// --- THE INTERACTIVE DONUT CHART COMPONENT ---
const SectorDonutChart = ({ initialData, year }) => {
    const [activeSectors, setActiveSectors] = useState(() => initialData.map(d => d.name));

    // Filter data based on which sectors are active
    const filteredData = useMemo(() =>
            initialData.filter(d => activeSectors.includes(d.name)),
        [initialData, activeSectors]
    );

    // Recalculate total based on visible sectors
    const dynamicTotal = useMemo(() =>
            filteredData.reduce((sum, entry) => sum + entry.value, 0),
        [filteredData]
    );

    // Handle legend click to toggle sector visibility
    const handleLegendClick = (e) => {
        const { dataKey } = e;
        const newActiveSectors = activeSectors.includes(dataKey)
            ? activeSectors.filter(name => name !== dataKey)
            : [...activeSectors, dataKey];
        setActiveSectors(newActiveSectors);
    };

    if (!initialData || initialData.length === 0) {
        return <div>No data to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={filteredData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={3}
                >
                    {filteredData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)} მგტ`} />
                <Legend onClick={handleLegendClick} />

                {/* Custom labels for the center, dynamically updated */}
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fontSize="18" fill="#6b7280">
                    სულ (მგტ)
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fontSize="24" fontWeight="bold" fill="#111827">
                    {dynamicTotal.toFixed(1)}
                </text>
            </PieChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const SectorDonutPage = () => {
    const [chartData, setChartData] = useState(null);
    const [year, setYear] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const { data, year } = transformDataForSectorChart(apiData);
                setChartData(data);
                setYear(year);
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
                სექტორული განაწილება ({year})
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <SectorDonutChart initialData={chartData} year={year} />
            )}
        </div>
    );
};

export default SectorDonutPage;
