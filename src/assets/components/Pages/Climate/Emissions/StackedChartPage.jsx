import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/greenhouse-gas-emissions/data';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForStackedChart(apiData) {
    if (!apiData.data.data || apiData.data.data.length === 0) {
        return [];
    }

    const chartData = apiData.data.data.map(item => ({
        year: item.year.toString(),
        energy: item["ENERGY"] || 0,
        industrial: item["INDUSTRIAL"] || 0,
        agriculture: item["AGRICULTURE"] || 0,
        waste: item["WASTE"] || 0,
    }));

    return chartData;
}


// --- THE STACKED AREA CHART COMPONENT ---
const EmissionsStackedChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    const areas = [
        { key: 'energy', name: 'ენერგეტიკა', color: '#ef4444' },
        { key: 'agriculture', name: 'სოფლის მეურნეობა', color: '#f97316' },
        { key: 'industrial', name: 'სამრეწველო პროცესები', color: '#eab308' },
        { key: 'waste', name: 'ნარჩენები', color: '#22c55e' },
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 20]} ticks={[0, 5.0, 10.0, 15.0, 20.0]} label={{ value: 'ემისიები (მგ CO₂ ეკვ.)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                {areas.map(area => (
                    <Area
                        key={area.key}
                        type="monotone"
                        dataKey={area.key}
                        stackId="1" // This ensures the areas stack on top of each other
                        name={area.name}
                        stroke={area.color}
                        fill={area.color}
                        fillOpacity={0.7}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
};


// --- MAIN PAGE COMPONENT ---
const StackedChartPage = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await fetch(DATA_URL);
                if (!dataResponse.ok) throw new Error('API data fetch failed');
                const apiData = await dataResponse.json();

                const transformedData = transformDataForStackedChart(apiData);
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
                სექტორული გაფრქვევები დროის მიხედვით (მგ CO₂ ეკვ.)
            </h1>

            {isLoading && <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data... ⏳</div>}
            {error && <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error} 😟</div>}

            {chartData && (
                <EmissionsStackedChart data={chartData} />
            )}
        </div>
    );
};

export default StackedChartPage;
