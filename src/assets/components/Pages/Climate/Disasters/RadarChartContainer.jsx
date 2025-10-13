// src/assets/components/Pages/Climate/Disasters/RadarChartContainer.jsx
import { useState, useEffect } from "react";
import {
    Radar,
    RadarChart,
    PolarGrid,
    Legend,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

// --- CONFIGURATION ---
const HAZARD_CONFIG = {
    0: { name: "წყალდიდობა-წყალმოვარდნა, დატბორვა", legend: "საშ. წყალდიდობა", color: "#3b82f6" },
    2: { name: "სეტყვა", legend: "საშ. სეტყვა", color: "#22c55e" },
    5: { name: "ზვავი", legend: "საშ. ზვავი", color: "#a8a29e" },
};
const HAZARD_INDEXES_TO_USE = [0, 2, 5];
const START_YEAR = 2016;
const END_YEAR = 2023;

// Endpoints
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.27:3000/api/datasets";
const DATASET = "hydro-meteorological-hazards";
const DATA_URL = `${API_BASE}/${DATASET}/data`;
const METADATA_URL = `${API_BASE}/${DATASET}/metadata`;

// --- DATA TRANSFORMATION FUNCTION ---
function transformDataForRadarChart(apiData, apiMetadata) {
    const yearMeta = apiMetadata.data.metadata.variables.find((v) => v.code === "Year");
    const monthMeta = apiMetadata.data.metadata.variables.find((v) => v.code === "Month");
    const yearMap = Object.fromEntries(
        yearMeta.values.map((val, i) => [val, parseInt(yearMeta.valueTexts[i], 10)])
    );

    const monthlyTotals = {};
    const hazardNames = [];

    monthMeta.valueTexts.slice(0, 12).forEach((monthName) => {
        monthlyTotals[monthName] = {};
        HAZARD_INDEXES_TO_USE.forEach((index) => {
            const hazardName = HAZARD_CONFIG[index].name;
            monthlyTotals[monthName][hazardName] = 0;
            if (!hazardNames.includes(hazardName)) hazardNames.push(hazardName);
        });
    });

    const filteredYearsData = apiData.data.data.filter((d) => {
        const year = yearMap[d.year];
        return year >= START_YEAR && year <= END_YEAR;
    });

    filteredYearsData.forEach((yearData) => {
        for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
            const monthName = monthMeta.valueTexts[monthIndex];
            HAZARD_INDEXES_TO_USE.forEach((hazardIndex) => {
                const key = `${hazardIndex} - ${monthIndex}`;
                const hazardName = HAZARD_CONFIG[hazardIndex].name;
                if (typeof yearData[key] === "number") {
                    monthlyTotals[monthName][hazardName] += yearData[key];
                }
            });
        }
    });

    const numberOfYears = filteredYearsData.length || 1;
    const chartData = Object.keys(monthlyTotals).map((monthName) => {
        const monthAverages = { month: monthName };
        hazardNames.forEach((hazardName) => {
            monthAverages[hazardName] = parseFloat(
                (monthlyTotals[monthName][hazardName] / numberOfYears).toFixed(2)
            );
        });
        return monthAverages;
    });

    return { chartData, hazardNames };
}

// --- THE RADAR CHART COMPONENT ---
const MonthlyAverageRadarChart = ({ data, hazardNames }) => {
    if (!data || data.length === 0) {
        return <div className="chart-status">No data available to render chart.</div>;
    }

    const maxValue = Math.max(...data.flatMap((d) => hazardNames.map((name) => d[name])));
    const domainMax = Math.ceil(maxValue / 5) * 5 || 5;

    return (
        <ResponsiveContainer width="100%" height={500}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="month" />
                <PolarRadiusAxis angle={30} domain={[0, domainMax]} tickCount={4} />
                <Tooltip />
                {hazardNames.map((hazardName) => {
                    const config = Object.values(HAZARD_CONFIG).find((c) => c.name === hazardName);
                    if (!config) return null;
                    return (
                        <Radar
                            key={config.name}
                            name={config.legend}
                            dataKey={config.name}
                            stroke={config.color}
                            fill={config.color}
                            fillOpacity={0.3}
                        />
                    );
                })}
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );
};

// --- MAIN CONTAINER COMPONENT ---
const RadarChartContainer = () => {
    const [chartData, setChartData] = useState(null);
    const [hazardNames, setHazardNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                const [dataResponse, metadataResponse] = await Promise.all([
                    fetch(DATA_URL, { signal: controller.signal }),
                    fetch(METADATA_URL, { signal: controller.signal }),
                ]);
                if (!dataResponse.ok || !metadataResponse.ok) {
                    throw new Error("API data fetch failed");
                }
                const apiData = await dataResponse.json();
                const apiMetadata = await metadataResponse.json();

                const { chartData: rows, hazardNames: hazards } = transformDataForRadarChart(
                    apiData,
                    apiMetadata
                );
                setChartData(rows);
                setHazardNames(hazards);
            } catch (e) {
                if (e.name !== "AbortError") {
                    setError(e.message || "Unknown error");
                    // eslint-disable-next-line no-console
                    console.error("Failed to process data:", e);
                }
            } finally {
                setIsLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, []);

    if (isLoading) {
        return (
            <div className="chart-wrapper">
                <div className="chart-status">Loading chart data... ⏳</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="chart-wrapper">
                <div className="chart-error">Error: {error} 😟</div>
            </div>
        );
    }

    return (
        <div className="chart-wrapper">
            <h3 className="chart-title" style={{ textAlign: "center", marginBottom: 6 }}>
                სეზონური სტიქიური მოვლენების პროფილი
                <br />\(ყოველთვიური საშუალო, 2016-2023\)
            </h3>
            <MonthlyAverageRadarChart data={chartData} hazardNames={hazardNames} />
        </div>
    );
};

export default RadarChartContainer;
