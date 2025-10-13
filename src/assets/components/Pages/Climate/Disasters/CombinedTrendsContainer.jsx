import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- CONFIGURATION ---
const START_YEAR = 2013;
const END_YEAR = 2023;

// API Endpoints
const GEO_DATA_URL = 'http://192.168.1.27:3000/api/datasets/geological-phenomena/data';
const GEO_META_URL = 'http://192.168.1.27:3000/api/datasets/geological-phenomena/metadata';
const HYDRO_DATA_URL = 'http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/data';
const HYDRO_META_URL = 'http://192.168.1.27:3000/api/datasets/hydro-meteorological-hazards/metadata';

// --- DATA TRANSFORMATION FUNCTIONS ---

// Processes the Geological data (Landslides + Mudflows)
function transformGeologicalData(apiData, apiMetadata) {
    const yearMap = Object.fromEntries(
        apiMetadata.data.metadata.variables
            .find(v => v.code === "Year")
            .valueTexts.map((year, i) => [i, parseInt(year, 10)])
    );

    const yearlyTotals = {};

    apiData.data.data.forEach(item => {
        const yearText = apiMetadata.data.metadata.variables.find(v => v.code === "Year").valueTexts[item.year - 1995]
        const year = parseInt(yearText, 10);

        const total = (item["0"] || 0) + (item["2"] || 0);
        yearlyTotals[year] = total;
    });

    return yearlyTotals;
}

// Processes the Hydro-meteorological data (sum of all 6 event types)
function transformHydroData(apiData, apiMetadata) {
    const yearMap = Object.fromEntries(
        apiMetadata.data.metadata.variables
            .find(v => v.code === "Year")
            .valueTexts.map((year, i) => [apiMetadata.data.metadata.variables.find(v => v.code === "Year").values[i], parseInt(year, 10)])
    );

    const yearlyTotals = {};

    apiData.data.data.forEach(yearData => {
        const year = yearMap[yearData.year];
        let annualTotal = 0;

        for (let hazardIndex = 0; hazardIndex < 6; hazardIndex++) {
            // Correctly loops through the 12 months, excluding the 13th "Human Casualties" item.
            for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
                const key = `${hazardIndex} - ${monthIndex}`;
                if (typeof yearData[key] === 'number') {
                    annualTotal += yearData[key];
                }
            }
        }
        yearlyTotals[year] = annualTotal;
    });

    return yearlyTotals;
}

// Merges the two datasets into a single array for the chart
function mergeChartData(geoTotals, hydroTotals) {
    const mergedData = [];
    for (let year = START_YEAR; year <= END_YEAR; year++) {
        mergedData.push({
            year: year.toString(),
            geological_total: geoTotals[year] || null,
            hydro_total: hydroTotals[year] || null,
        });
    }
    return mergedData;
}


// --- THE LINE CHART COMPONENT ---
const CombinedTrendsChart = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis ticks={[0, 500, 1000, 1500, 2000]} domain={[0, 2000]} />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="geological_total"
                    name="გეოლოგიური მოვლენები"
                    stroke="#f97316"
                    strokeWidth={2}
                    connectNulls
                />
                <Line
                    type="monotone"
                    dataKey="hydro_total"
                    name="ჰიდრომეტეოროლოგიური მოვლენები"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    );
};


// --- MAIN CONTAINER COMPONENT ---
const CombinedTrendsContainer = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const responses = await Promise.all([
                    fetch(GEO_DATA_URL),
                    fetch(GEO_META_URL),
                    fetch(HYDRO_DATA_URL),
                    fetch(HYDRO_META_URL)
                ]);

                for (const response of responses) {
                    if (!response.ok) throw new Error('A network response was not ok.');
                }

                const [geoApiData, geoApiMeta, hydroApiData, hydroApiMeta] = await Promise.all(
                    responses.map(res => res.json())
                );

                const geoTotals = transformGeologicalData(geoApiData, geoApiMeta);
                const hydroTotals = transformHydroData(hydroApiData, hydroApiMeta);

                const mergedData = mergeChartData(geoTotals, hydroTotals);
                setChartData(mergedData);

            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch or process data:", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (isLoading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading chart data... ⏳</div>;
    if (error) return <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>Error: {error} 😟</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h3 style={{ textAlign: 'center' }}>
                გეოლოგიური და ჰიდრომეტეოროლოგიური მოვლენების ტენდენციები (2013-2023)
            </h3>
            <CombinedTrendsChart data={chartData} />
        </div>
    );
};

export default CombinedTrendsContainer;

