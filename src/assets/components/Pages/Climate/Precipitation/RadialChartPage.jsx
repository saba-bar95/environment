import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// --- CONFIGURATION ---
const DATA_URL = "http://192.168.1.27:3000/api/datasets/atmospheric-precipitation/data";
const COLORS = ["#2DD4BF", "#A78BFA", "#F472B6", "#F97316"]; // teal, purple, pink, orange
const REMAINDER = "#F1F5F9";
const LOCATIONS = [
    { name: "საქართველო", key: "GEO" },
    { name: "სამეგრელო-ზემო სვანეთი", key: "SAMEGRELO" },
    { name: "ქვემო ქართლი", key: "KVEMO_KARTLI" },
    { name: "თბილისი", key: "TBILISI" },
];

// --- HELPERS ---
const formatPercent = (value) => (Math.round(value * 1000) / 10).toFixed(1);

function transformDataForRadialChart(apiData) {
    if (!apiData?.data?.data || apiData.data.data.length === 0) return null;
    const dataRows = apiData.data.data;
    const latestData = dataRows[dataRows.length - 1];

    return LOCATIONS.map((location) => {
        const annualKey = `${location.key} - ANNUAL`;
        const avgKey = `${location.key} - HISTORICAL_AVG`;
        const annualValue = parseFloat(latestData[annualKey]) || 0;
        const historicalAvg = parseFloat(latestData[avgKey]) || 1;
        const ratio = Math.max(0, Math.min(1, annualValue / historicalAvg));

        return {
            name: location.name,
            value: ratio,
            displayValue: formatPercent(ratio),
            segments: [
                { type: "value", value: ratio },
                { type: "remainder", value: 1 - ratio },
            ],
        };
    });
}

// --- COMPONENTS ---

// Custom legend component (MODIFIED)
function ChartLegend({ items, visibleLocations, onToggleVisibility, onMouseEnter, onMouseLeave }) {
    return (
        <div
            style={{
                display: "flex",
                gap: "28px",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: "16px",
            }}
        >
            {items.map((item, index) => {
                const isVisible = visibleLocations[item.name];
                return (
                    <div
                        key={item.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: "pointer",
                            opacity: isVisible ? 1 : 0.5,
                            transition: "opacity 0.2s ease-in-out",
                        }}
                        onClick={() => onToggleVisibility(item.name)}
                        onMouseEnter={() => isVisible && onMouseEnter(item)}
                        onMouseLeave={onMouseLeave}
                    >
                        <span
                            style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: COLORS[index % COLORS.length],
                            }}
                        />
                        <span style={{
                            fontSize: "14px",
                            color: "#334155",
                            fontFamily: "inherit",
                            textDecoration: isVisible ? "none" : "line-through",
                        }}>
                            {item.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// Main chart component (MODIFIED)
const RadialComparisonChart = ({ data, visibleLocations, onToggleVisibility }) => {
    const [activeData, setActiveData] = useState(null);

    // Thinner ring dimensions
    const RING_CONFIGS = [
        { outerRadius: "85%", innerRadius: "75%" },
        { outerRadius: "70%", innerRadius: "60%" },
        { outerRadius: "55%", innerRadius: "45%" },
        { outerRadius: "40%", innerRadius: "30%" },
    ];

    const georgiaData = data.find(d => d.name === "საქართველო");
    const displayData = activeData || georgiaData;
    const displayName = activeData ? activeData.name : "საშ. გადახრა";

    // Filter data to only render visible rings
    const visibleData = data.filter(item => visibleLocations[item.name]);

    return (
        <div>
            <div style={{ width: "100%", height: "420px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {visibleData.map((location) => {
                            // Find the original index to maintain color and ring position
                            const originalIndex = data.findIndex(d => d.name === location.name);
                            const ringConfig = RING_CONFIGS[originalIndex];

                            return (
                                <Pie
                                    key={`ring-${location.name}`}
                                    data={location.segments}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    startAngle={90}
                                    endAngle={-270}
                                    innerRadius={ringConfig.innerRadius}
                                    outerRadius={ringConfig.outerRadius}
                                    cornerRadius={5}
                                    paddingAngle={2}
                                    isAnimationActive={true}
                                    animationDuration={700}
                                    onMouseEnter={() => setActiveData(location)}
                                    onMouseLeave={() => setActiveData(null)}
                                    style={{ cursor: "pointer", transition: "opacity 0.2s ease-in-out" }}
                                    opacity={activeData && activeData.name !== location.name ? 0.4 : 1}
                                >
                                    <Cell fill={COLORS[originalIndex]} stroke={COLORS[originalIndex]} />
                                    <Cell fill={REMAINDER} stroke={REMAINDER} />
                                </Pie>
                            );
                        })}

                        {/* Center text */}
                        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "16px", fill: "#6B7280", fontFamily: "inherit", pointerEvents: "none" }}>
                            {displayName}
                        </text>
                        <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "24px", fill: "#111827", fontWeight: "700", fontFamily: "inherit", pointerEvents: "none" }}>
                            {displayData?.displayValue || "0.0"}%
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <ChartLegend
                items={data} // Pass original data to show all legend items
                visibleLocations={visibleLocations}
                onToggleVisibility={onToggleVisibility}
                onMouseEnter={setActiveData}
                onMouseLeave={() => setActiveData(null)}
            />
        </div>
    );
};

// Main page component (MODIFIED)
export default function PrecipitationComparisonPage() {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State to manage the visibility of each location's ring
    const [visibleLocations, setVisibleLocations] = useState({});

    useEffect(() => {
        let isCancelled = false;
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch(DATA_URL);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const apiData = await response.json();

                if (!isCancelled) {
                    const transformedData = transformDataForRadialChart(apiData);
                    setChartData(transformedData);
                    // Initialize all locations as visible
                    if (transformedData) {
                        const initialVisibility = transformedData.reduce((acc, item) => {
                            acc[item.name] = true;
                            return acc;
                        }, {});
                        setVisibleLocations(initialVisibility);
                    }
                }
            } catch (err) {
                if (!isCancelled) setError(err.message || "Failed to load data");
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        fetchData();
        return () => { isCancelled = true; };
    }, []);

    // Handler to toggle the visibility of a location
    const handleToggleVisibility = (locationName) => {
        setVisibleLocations(prev => ({
            ...prev,
            [locationName]: !prev[locationName],
        }));
    };

    return (
        <div style={{ padding: "20px", fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ margin: 0, fontSize: "16px", color: "#0f172a", fontWeight: "normal" }}>
                გრაფიკი 10:
            </h2>
            <h1 style={{ textAlign: "center", fontSize: "22px", marginTop: "12px", marginBottom: "6px", fontWeight: "600", color: "#111827" }}>
                10. 2022 წლის ნალექები ისტორიულ საშუალოსთან შედარებით
            </h1>
            <div style={{ textAlign: "center", color: "#6B7280", marginBottom: "16px", fontSize: "14px" }}>
                %
            </div>

            {isLoading && <div style={{ textAlign: "center", padding: "50px", color: "#6B7280" }}>მონაცემების ჩატვირთვა... ⏳</div>}
            {error && <div style={{ textAlign: "center", padding: "50px", color: "#DC2626" }}>შეცდომა: {error} 😟</div>}
            {chartData && (
                <RadialComparisonChart
                    data={chartData}
                    visibleLocations={visibleLocations}
                    onToggleVisibility={handleToggleVisibility}
                />
            )}
        </div>
    );
}