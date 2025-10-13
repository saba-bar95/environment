import React, { useState, useEffect } from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const DATA_URL = 'http://192.168.1.27:3000/api/datasets/geological-phenomena/data';
const META_URL = 'http://192.168.1.27:3000/api/datasets/geological-phenomena/metadata';

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForScatterChart(apiData, apiMetadata) {
    // Create a map to get the actual year from the metadata's text values
    const yearMap = Object.fromEntries(
        apiMetadata.data.metadata.variables
            .find(v => v.code === "Year")
            .valueTexts.map((year, i) => [i, parseInt(year, 10)])
    );

    const chartData = apiData.data.data.map((item) => {
        // The API's `item.year` is a numeric year, but we should use the metadata for mapping
        // to be safe. We find the index corresponding to the year.
        const yearIndex = item.year - 1995; // Assuming the API year starts at 1995 for index 0
        const year = yearMap[yearIndex];

        return {
            year: year,
            settlements: item["5"] || 0, // X-axis value
            buildings: item["6"] || 0,   // Y-axis value
            // Sum of casualties from landslides (1) and mudflows (3)
            casualties: (item["1"] || 0) + (item["3"] || 0), // Z-axis (bubble size) and tooltip
        };
    });

    return chartData;
}

// --- CUSTOM TOOLTIP COMPONENT ---
// This formats the tooltip to match your design exactly.
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                padding: '10px 15px',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>წელი: {data.year}</p>
                <p style={{ margin: '5px 0 0 0' }}>დასახლება: {data.settlements}</p>
                <p style={{ margin: '5px 0 0 0' }}>შენობა: {data.buildings}</p>
                <p style={{ margin: '5px 0 0 0' }}>გარდაცვლილი: {data.casualties}</p>
            </div>
        );
    }
    return null;
};

// --- THE SCATTER CHART COMPONENT ---
const GeologicalRiskScatterChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data to display.</div>;
    }

    // Find max values for dynamic axis domains
    const maxSettlements = Math.max(...data.map(d => d.settlements));
    const maxBuildings = Math.max(...data.map(d => d.buildings));

    return (
        <ResponsiveContainer width="100%" height={500}>
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <CartesianGrid />
                <XAxis
                    type="number"
                    dataKey="settlements"
                    name="დასახლებული პუნქტების რაოდენობა"
                    unit=""
                    domain={[0, Math.ceil(maxSettlements / 200) * 200]} // Round up axis to nearest 200
                />
                <YAxis
                    type="number"
                    dataKey="buildings"
                    name="შენობა-ნაგებობების რაოდენობა"
                    unit=""
                    domain={[0, Math.ceil(maxBuildings / 1000) * 1000]} // Round up axis to nearest 1000
                />
                {/* ZAxis controls the bubble size. dataKey points to 'casualties'. */}
                <ZAxis type="number" dataKey="casualties" range={[100, 1000]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="Years" data={data} fill="#8884d8" fillOpacity={0.6} />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

// --- MAIN CONTAINER COMPONENT ---
const ScatterChartContainer = () => {
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
                if (!dataResponse.ok || !metaResponse.ok) {
                    throw new Error('API data fetch failed');
                }
                const apiData = await dataResponse.json();
                const apiMetadata = await metaResponse.json();

                const transformedData = transformDataForScatterChart(apiData, apiMetadata);
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
                შედარება ინფრასტრუქტურასა და დასახლებულ პუნქტებზე (1995-2023)
            </h3>
            <GeologicalRiskScatterChart data={chartData} />
        </div>
    );
};

export default ScatterChartContainer;
